import Point from "@arcgis/core/geometry/Point";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";
import Graphic from "@arcgis/core/Graphic";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import globalLayers from "../../../Utils/EPCMaps/Maps/GlobaLMap";
import { LocationMarker } from "../../../Utils/Const";
import { LocationMarkerWhiteSymbol } from "../../../Utils/EPCMaps/Markers/MarkerSymbols";

export const attachMarker = (Point: Point) => {
    // console.log(globalLayers.graphicLayerLocation?.graphics.length, 'len')
    // console.log(Point, 'Point')
    console.log('attachMarker')
    let pointGraphic = null as Graphic | null;
    let reInit = true;
    globalLayers.graphicLayerLocation?.graphics.forEach(graphic => {
try{
        if (graphic.attributes && graphic.getAttribute('name') === LocationMarker) {
            // globalLayers.graphicLayerLocation?.graphics.remove(graphic);
            graphic.geometry = Point
            pointGraphic = graphic
            reInit = false

            
        }
        if (graphic.attributes && graphic.getAttribute('title') === LocationMarker) {
            // globalLayers.graphicLayerLocation?.graphics.remove(graphic);
            graphic.geometry = Point
            pointGraphic = graphic
            reInit = false
        }
             
    }
    catch(e){

    }
    })
    if(pointGraphic && !reInit){
        // omit add event for chnage position
        if(globalLayers.view?.zoom! < 18){
            globalLayers.view?.goTo({
                center: [(pointGraphic.geometry as Point)?.longitude, (pointGraphic.geometry as Point)?.latitude],
                zoom: globalLayers.view?.zoom
            })
        }
        

        // console.log(globalLayers.graphicLayerLocation?.graphics.emit('change', { added: [pointGraphic], moved: [pointGraphic], removed: [] }))
    }
    if(!reInit) return;
    pointGraphic = new Graphic({
        geometry: Point,
        symbol: LocationMarkerWhiteSymbol as any,
        attributes: {
            title: LocationMarker
        }
    });
    
    globalLayers.LocationMarkerPointGraphic = pointGraphic;
    globalLayers.graphicLayerLocation?.graphics.addMany([pointGraphic]);
   
    if (globalLayers.sketchViewModel === null) {
        globalLayers.sketchViewModel = new SketchViewModel({
            view: globalLayers.view!,
            layer: globalLayers.graphicLayerLocation!,
            updateOnGraphicClick: true,
            // multipleSelectionEnabled: true,
            defaultUpdateOptions: {
                toggleToolOnClick: true,
                tool: "reshape",
            }
        });
    }

    
}