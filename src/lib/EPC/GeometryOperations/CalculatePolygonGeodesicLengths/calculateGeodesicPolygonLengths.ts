import Point from "@arcgis/core/geometry/Point";
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils.js";
import Graphic from "@arcgis/core/Graphic";
import globalLayers from "../../../../Utils/EPCMaps/Maps/GlobaLMap";
import Polygon from "@arcgis/core/geometry/Polygon";

export const calculateGeodesicLengths = async (polygonGraphic: Graphic): Promise<number[]> => {
    const polygon = polygonGraphic.geometry;
    const convertedGeometry = await globalLayers.convertSpatialSystem(polygon as Polygon);
    
    if (!convertedGeometry) return [];

    const rings = convertedGeometry.rings;
    const linesLength: number[] = [];

    // Iterate through each pair of points in the ring and calculate geodesic distance
    rings[0].forEach((currentPoint, index, ring) => {
        if (index < ring.length - 1) {
            const nextPoint = ring[index + 1];
            const point1 = new Point({ x: currentPoint[0], y: currentPoint[1] });
            const point2 = new Point({ x: nextPoint[0], y: nextPoint[1] });

            const distance = geodesicUtils.geodesicDistance(point1, point2, "meters").distance;
            if (distance !== undefined) {
                linesLength.push(distance);
            }
        }
    });

    return linesLength;
};