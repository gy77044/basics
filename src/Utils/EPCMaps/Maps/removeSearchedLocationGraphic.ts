import { LocationMarker } from "../../Const";
import globalLayers from "./GlobaLMap";

export const removeSearchedGraphic = () => {
    globalLayers.graphicLayerLocation?.graphics.forEach((ele: any) => {
        if(ele?.title === LocationMarker){
          globalLayers.graphicLayerLocation?.graphics.remove(ele);
        }
    })
}