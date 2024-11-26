// 102100

import Geometry from "@arcgis/core/geometry/Geometry";
import * as projection from "@arcgis/core/geometry/projection.js";

import SpatialReference from "@arcgis/core/geometry/SpatialReference";

/**
 * It converts a geometry object from a different spatial
 * reference system to the Web Mercator spatial reference system.
 * @param {any} geometry - The `geometry` parameter is an object representing a geometric shape or
 * location. It could be a point, line, polygon, or any other type of geometry. The function
 * `convertGeometryToWebMercator` takes this geometry as input and converts it to the Web Mercator
 * spatial reference system (SR
 * @returns The function `convertGeometryToWebMercator` returns a Promise that resolves to the
 * converted geometry in Web Mercator projection.
 */
export async function convertGeometryToWebMercator(geometry: any): Promise<null|Geometry> {
    try {
        await projection.load()
        if (geometry.spatialReference.wkid === "4326") {
            return geometry;
        } else {
            const outSpatialReference = new SpatialReference({ wkid: 102100 });
            const convertedGeometry = projection.project(geometry, outSpatialReference);
            return convertedGeometry as Geometry;
        }
    } catch (error) {
        // Handle any errors that might occur during module loading or projection
        console.error("Error converting spatial system:", error);
        return null;
    }
}
