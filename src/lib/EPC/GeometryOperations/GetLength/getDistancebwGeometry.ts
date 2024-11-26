import Geometry from "@arcgis/core/geometry/Geometry.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

export const getDistancebwGeometeries = (geometry1: Geometry, geometry2: Geometry) => {
    return geometryEngine.distance(geometry1, geometry2, 'meters')
}