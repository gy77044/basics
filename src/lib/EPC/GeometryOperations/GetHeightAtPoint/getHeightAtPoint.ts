import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";

/**
 * Interpolates the elevation at a given point based on the nearest vertices of the base polygon.
 * @param basePolygon The base polygon.
 * @param point The point at which to interpolate the elevation.
 * @returns The interpolated elevation at the given point.
 */
function interpolateElevationAtPoint(basePolygon: Polygon, point: Point): number {
    const rings = basePolygon.rings[0];
    if (rings.length < 3) {
        throw new Error("Polygon must have at least 3 points to interpolate elevation.");
    }

    // Find the three closest points in the base polygon
    let closestPoints = [rings[0], rings[1], rings[2]];
    let minDists = closestPoints.map(pt => Math.hypot(pt[0] - point.x, pt[1] - point.y));

    for (let i = 3; i < rings.length; i++) {
        const pt = rings[i];
        const dist = Math.hypot(pt[0] - point.x, pt[1] - point.y);
        const maxDistIndex = minDists.indexOf(Math.max(...minDists));
        if (dist < minDists[maxDistIndex]) {
            closestPoints[maxDistIndex] = pt;
            minDists[maxDistIndex] = dist;
        }
    }

    // Interpolate the elevation using barycentric coordinates
    const [p1, p2, p3] = closestPoints;
    const denom = ((p2[1] - p3[1]) * (p1[0] - p3[0]) + (p3[0] - p2[0]) * (p1[1] - p3[1]));
    const a = ((p2[1] - p3[1]) * (point.x - p3[0]) + (p3[0] - p2[0]) * (point.y - p3[1])) / denom;
    const b = ((p3[1] - p1[1]) * (point.x - p3[0]) + (p1[0] - p3[0]) * (point.y - p3[1])) / denom;
    const c = 1 - a - b;

    return a * p1[2] + b * p2[2] + c * p3[2];
}

/**
 * Updates the geometry of a small polygon to lay it on top of a base polygon with the correct slope.
 * @param baseGraphic The base graphic containing the polygon geometry.
 * @param smallGraphic The small graphic to be adjusted.
 * @returns The updated small graphic with the correct elevation.
 */
export function adjustRoofModules(baseGraphic: Graphic, smallGraphic: Graphic, height: number): Graphic {
    const basePolygon = baseGraphic.geometry as Polygon;
    const smallPolygon = smallGraphic.geometry as Polygon;
    if (!basePolygon || !smallPolygon) {
        throw new Error("Both graphics must contain polygon geometries.");
    }

    // Adjust the height of each vertex in the small polygon
    const adjustedRings = smallPolygon.rings.map(ring =>
        ring.map(vertex => {
            return [vertex[0], vertex[1], height];
        })
    );

    // Update the geometry of the small graphic
    smallGraphic.geometry = new Polygon({
        rings: adjustedRings,
        spatialReference: smallPolygon.spatialReference
    });

    return smallGraphic;
}
