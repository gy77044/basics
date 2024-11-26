import Point from "@arcgis/core/geometry/Point";
import globalLayers from "../../../../Utils/EPCMaps/Maps/GlobaLMap";
import { getPointPairsFromRing } from "../getPointPairsFromRing";
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils.js";

/**
 * The function `getLengthfromPolygonLines` calculates the length of lines within a polygon geometry.
 * @param {any} newGraphic - The `newGraphic` parameter is an object that represents a graphic, which
 * typically contains a geometry (in this case, a polygon) and other properties associated with the
 * graphic.
 */
export const getLengthfromPolygonLines = async (newGraphic: any) => {
    const polygon = newGraphic.geometry;
    // esri/geometry/Point
    // const distanceInMeters = geometryEngine.distance(point1, point2);
    globalLayers.convertSpatialSystem(polygon).then((geom) => {
        let linesLength = [] as number[]
        if (geom) {
            let rings = geom.rings;
            const pairs = getPointPairsFromRing(rings[0]) as any[]

            pairs.forEach(ring => {
                // ring[0], ring[1]
                const point1 = {
                    latitude: ring[0][1],
                    longitude: ring[0][0],
                    type: "point"
                };

                const point2 = {
                    latitude: ring[1][1],
                    longitude: ring[1][0],
                    type: "point"
                };

                const join = geodesicUtils.geodesicDistance(
                    new Point({ x: point1.longitude, y: point1.latitude }),
                    new Point({ x: point2.longitude, y: point2.latitude }),
                    "meters"
                );

                linesLength.push(join.distance!)
            })
            return linesLength
        }
    })
}