import Point from "@arcgis/core/geometry/Point";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";


/**
 * The function creates start and end points for a geometry using latitude and longitude coordinates.
 * @param {number} startLat - The start latitude of the geometry.
 * @param {number} startLng - The startLng parameter represents the longitude coordinate of the
 * starting point. It is a number value.
 * @param {number} endLat - The `endLat` parameter represents the latitude of the end point of the
 * geometry.
 * @param {number} endLng - The `endLng` parameter represents the longitude coordinate of the end
 * point.
 * @returns an object with two properties: startPoint and endPoint.
 */
export const createStartEndPointGeometry = async (startLat: number, startLng: number, endLat: number, endLng: number) => {
  
    const startPoint = new Point({
        x: startLng,
        y: startLat,
        // spatialReference: webMercatorUtils.spatialReference  // previously added line for spatial refernece
    })

    const endPoint = new Point({
        x: endLng,
        y: endLat,
        // spatialReference: webMercatorUtils.spatialReference  // previously added line for spatial refernece
    });

    return { startPoint, endPoint }
}