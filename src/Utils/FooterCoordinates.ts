import { updateInverterPosition } from "../lib/EPC/SketchDraw/SketchEvents/drawEvents";
import globalLayers from "./EPCMaps/Maps/GlobaLMap";

/**
 * The function `getCursorCoordinates` takes in a pointer move event and updates the latitude and
 * longitude coordinates based on the event's screen point.
 * @param event - The event parameter is of type __esri.ViewPointerMoveEvent. It represents the pointer
 * move event that is triggered when the user moves the cursor within the view.
 */
export const getCursorCoordinates = (event: __esri.ViewPointerMoveEvent) => {
    if (globalLayers.view) {
        var screenPoint = {
            x: event.x,
            y: event.y
        };
        var mapPoint = globalLayers.view?.toMap(screenPoint)
        if(globalLayers.lastactiveTool === 'Inverter'){
            // make the inverter attach to marker position and when clicked the inverter will be attached to that position
            // Attach the inverter to the cursor position on the map
            // Assuming you have a method to create or move the inverter
            if (mapPoint) {
                // updateInverterPosition(mapPoint);
            }
        }
        if (mapPoint) {
            globalLayers.latitude = mapPoint?.latitude;
            globalLayers.longitude = mapPoint?.longitude;
            if(globalLayers.footers.lat && globalLayers.footers.lng){
                globalLayers.footers.lat.innerText = mapPoint?.latitude?.toFixed(5)
                globalLayers.footers.lng.innerText = mapPoint?.longitude?.toFixed(5)
            }
        }
    }
};


