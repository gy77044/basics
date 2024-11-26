import { attachMarker } from "../../../../lib/EPC/MarkersFunctions/attachMarker";
import globalLayers from "../GlobaLMap"

export const attachMarkerToCursor = (event: __esri.ViewPointerMoveEvent) => {
    if(globalLayers.sketchButton.rightbuttonMarkerState === 'ongoing'){
        // convert x and y to mappoint for the cursor to be attached with the graphic 
        const mapPoint = globalLayers.view?.toMap({ x: event.x, y: event.y });
        if(!mapPoint) return;

        // attach location marker 
       attachMarker(mapPoint);

    }
}