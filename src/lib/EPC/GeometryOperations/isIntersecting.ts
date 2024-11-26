import Collection from "@arcgis/core/core/Collection";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Graphic from "@arcgis/core/Graphic";
import { GraphicCollection } from "../../../Utils/EPCMaps/FilterGraphicbyname/filterGraphicsbyName";
import Geometry from "@arcgis/core/geometry/Geometry";

/**
 * The function checks if a given circle geometry intersects with any other graphics in a collection.
 * @param {any} event - The event parameter is an object that represents the event that triggered the
 * function. It contains information about the event, such as the graphic that was drawn.
 * @param {any} allLayersGraphics - `allLayersGraphics` is an array of graphics from all layers in the
 * map. Each graphic represents a feature or object on the map.
 * @param geometryEngine - The `geometryEngine` is an object that provides various geometric
 * operations, such as checking for intersections between geometries. It is typically provided by a GIS
 * library or framework, such as the ArcGIS API for JavaScript.
 * @param {any} circleGeometry - The circleGeometry parameter represents the geometry of the circle
 * that is being checked for intersection with other graphics. It is an object that contains
 * information about the circle's shape, size, and location.
 * @returns a boolean value indicating whether the drawn circle intersects with any other graphics in
 * the `allLayersGraphics` array.
 */
export const isIntersecting = (event: any, allLayersGraphics: any, geometryEngine: geometryEngine, circleGeometry: any): boolean => {
    let newGraphic = event.graphic;
    let isIntersecting = false;
    for (const graphic of allLayersGraphics) {
        if (graphic !== newGraphic && geometryEngine.intersects(graphic.geometry, circleGeometry)) {
            isIntersecting = true;
            break;
        }
    }
    return isIntersecting;
};

//geometryEngine.intersects(graphic.geometry, incomingGraphic.geometry)

export const firstIntersectigGraphics = (incomingGraphic: Graphic, graphicCollection: GraphicCollection): null | Graphic => {
    let foundGraphic: __esri.Graphic | null = null;

    graphicCollection.forEach(graphic => {
        if (graphic.attributes && geometryEngine.intersects(graphic.geometry, incomingGraphic.geometry)) {
            foundGraphic = graphic;
            return;
        }
    });
    return foundGraphic;
};

export const areIntersectingGraphics = (incominggraphic: Graphic, eventGraphic: Graphic) => {
    if(geometryEngine.intersects(incominggraphic.geometry, eventGraphic.geometry)){
        return true
    }
    return false;
}
export const areIntersectingGeometry = (incominggraphic: Geometry, eventGraphic: Geometry) => {
    if(geometryEngine.intersects(incominggraphic, eventGraphic)){
        return true
    }
    return false;
}
export const isGeometryInsideOuterGeometry = (outerGeometry: Graphic, innerGeometry: Graphic) => {
    // Check if the inner geometry is inside the outer geometry
    return geometryEngine.contains(outerGeometry.geometry, innerGeometry.geometry);
};
