import globalLayers from "./GlobaLMap";
import { getCursorCoordinates } from "../../FooterCoordinates";
import { getGraphic } from "./getFucntion";
import { attachMarkerToCursor } from "./MapEvents/attachMarkerToCursor";

function msToTime(ms: number) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    return parseFloat(hours);
  }

export const pointerMove = async (e: __esri.ViewPointerMoveEvent) => {
    getCursorCoordinates(e)

    // for shadow widget event 
    // const mapPoint = globalLayers.view?.toMap({ x: e.x, y: e.y });
    // if(globalLayers.shadowCastWidget){
    //     if(globalLayers.shadowCastWidget.visible){
    //         // const shadowHrs = await globalLayers.shadowCastWidget?.viewModel.getDuration({ x: e.x, y: e.y });
    //         // const hrs = msToTime(shadowHrs);
    //         // console.log(res, hrs, mapPoint)
            
    //         // make the color chnage according the varibale intensity of the sun on th roof 
    //     }

    // }

    if(globalLayers.sketchButton.rightbuttonMarkerState === 'ongoing'){
        // remove location graphic 
        globalLayers.removeLocationGraphic();
        globalLayers.markerLocation = { x: e.x, y: e.y }
    }

    if (!globalLayers.solarpanelLayer) return;
    if (globalLayers.solarpanelLayer.graphics.length === 0) return;
   
    const mapPoint = globalLayers.view?.toMap({ x: e.x, y: e.y });
    if (globalLayers.featureAddState === 'active') {
        if (!mapPoint) return; // not mapPoint found for map coordinates

        // get a single graphic from the module graphics
        let justOneGraphicatRandom = ((globalLayers.solarpanelLayer.graphics as any).items[0] as __esri.Graphic).clone();
        let polygonGeometry = justOneGraphicatRandom.geometry as __esri.Polygon;
        const oldCentroid = polygonGeometry.centroid;

        const dx = mapPoint.longitude - oldCentroid.x;
        const dy = mapPoint.latitude - oldCentroid.y;

        for (const ring of polygonGeometry.rings) {
            for (const point of ring) {
                point[0] += dx;
                point[1] += dy;
            }
        }

        if(globalLayers.tempGraphic){
            globalLayers.solarpanelLayer.graphics.remove(globalLayers.tempGraphic);
        }

        // Create a new polygon graphic with the updated geometry
        globalLayers.tempGraphic = getGraphic(polygonGeometry, justOneGraphicatRandom.symbol, justOneGraphicatRandom.attributes)

        globalLayers.solarpanelLayer.graphics.add(globalLayers.tempGraphic);

        // for guiding guiding lines graphic 

        const polylineVertical = {
            type: "polyline",
            paths: [
                [mapPoint.longitude, mapPoint.latitude], //Longitude, latitude
                [mapPoint.longitude, mapPoint.latitude + 0.00005], //Longitude, latitude
                [mapPoint.longitude, mapPoint.latitude - 0.00005], //Longitude, latitude
            ]
        };

        const polylineHorizontal = {
            type: "polyline",
            paths: [
                [mapPoint.longitude, mapPoint.latitude], //Longitude, latitude
                [mapPoint.longitude + 0.00005, mapPoint.latitude], //Longitude, latitude
                [mapPoint.longitude- 0.00005, mapPoint.latitude ], //Longitude, latitude
            ]

        };

        const simpleLineSymbol = {
            type: "simple-line",
            color: [226, 119, 40], // Orange
            width: 1,
            style: "dot"
        };
        // remove the guiding lines if already attached
        if(globalLayers.guidinglines.verticalLine){
            globalLayers.solarpanelLayer.graphics.remove(globalLayers.guidinglines.verticalLine);
        }
        if(globalLayers.guidinglines.horizontalLine){
            globalLayers.solarpanelLayer.graphics.remove(globalLayers.guidinglines.horizontalLine);
        }

        // make these into graphic layer 
        globalLayers.guidinglines.verticalLine = getGraphic(polylineVertical, simpleLineSymbol, {})
        globalLayers.guidinglines.horizontalLine = getGraphic(polylineHorizontal, simpleLineSymbol, {})


        // add these graphci to the solarpanelLayer

        globalLayers.solarpanelLayer.graphics.add(globalLayers.guidinglines.verticalLine);
        globalLayers.solarpanelLayer.graphics.add(globalLayers.guidinglines.horizontalLine);

    }
    // to handle pointer move with selected graphic
    if(globalLayers.featureAddState === 'select' && globalLayers.isSelected){

        if(globalLayers.tempGraphic){
        
            if (!mapPoint) return; // not mapPoint found for map coordinates

            // get a single graphic from the module graphics
            let justOneGraphicatRandom = ((globalLayers.solarpanelLayer.graphics as any).items[0] as __esri.Graphic).clone();
            let polygonGeometry = justOneGraphicatRandom.geometry as __esri.Polygon;
            const oldCentroid = polygonGeometry.centroid;

            const dx = mapPoint.longitude - oldCentroid.x;
            const dy = mapPoint.latitude - oldCentroid.y;

            for (const ring of polygonGeometry.rings) {
                for (const point of ring) {
                    point[0] += dx;
                    point[1] += dy;
                }
            }

            if(globalLayers.tempGraphic){
                globalLayers.solarpanelLayer.graphics.remove(globalLayers.tempGraphic);
            }

            // Create a new polygon graphic with the updated geometry
            globalLayers.tempGraphic = getGraphic(polygonGeometry, justOneGraphicatRandom.symbol, justOneGraphicatRandom.attributes)

            globalLayers.solarpanelLayer.graphics.add(globalLayers.tempGraphic);

            // create guiding lines 
            const polylineVertical = {
                type: "polyline",
               paths: [
                    [mapPoint.longitude, mapPoint.latitude], //Longitude, latitude
                    [mapPoint.longitude, mapPoint.latitude + 0.00005], //Longitude, latitude
                    [mapPoint.longitude, mapPoint.latitude - 0.00005], //Longitude, latitude
                ]
    
            };
    
            const polylineHorizontal = {
                type: "polyline",
                paths: [
                    [mapPoint.longitude, mapPoint.latitude], //Longitude, latitude
                    [mapPoint.longitude + 0.00005, mapPoint.latitude], //Longitude, latitude
                    [mapPoint.longitude- 0.00005, mapPoint.latitude ], //Longitude, latitude
                ]
    
            };
    
            const simpleLineSymbol = {
                type: "simple-line",
                color: [226, 119, 40], // Orange
                width: 1,
                style: "dot"
            };
            // remove the guiding lines if already attached
            if(globalLayers.guidinglines.verticalLine){
                globalLayers.solarpanelLayer.graphics.remove(globalLayers.guidinglines.verticalLine);
            }
            if(globalLayers.guidinglines.horizontalLine){
                globalLayers.solarpanelLayer.graphics.remove(globalLayers.guidinglines.horizontalLine);
            }
    
            // make these into graphic layer 
            globalLayers.guidinglines.verticalLine = getGraphic(polylineVertical, simpleLineSymbol, {})
            globalLayers.guidinglines.horizontalLine = getGraphic(polylineHorizontal, simpleLineSymbol, {})
    
    
            // add these graphci to the solarpanelLayer
    
            globalLayers.solarpanelLayer.graphics.add(globalLayers.guidinglines.verticalLine);
            globalLayers.solarpanelLayer.graphics.add(globalLayers.guidinglines.horizontalLine);
        
        }

    }
}