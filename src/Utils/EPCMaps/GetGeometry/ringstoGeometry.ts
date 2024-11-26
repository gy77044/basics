import Polygon from "@arcgis/core/geometry/Polygon"
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import Graphic from "@arcgis/core/Graphic";
import * as projection from "@arcgis/core/geometry/projection.js";

export const convertPolygonSpatial = (rings: Polygon, wkid: 102100 | 4326) => {

    const projectedPolygon = projection.project(rings, new SpatialReference({ wkid: wkid }));
    
}

