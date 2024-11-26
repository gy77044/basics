import Polygon from "@arcgis/core/geometry/Polygon"
import globalLayers from "../../../Utils/EPCMaps/Maps/GlobaLMap"
import { buildingSymbology, buildingSymbologyHeight } from "../SketchDraw/SketchSymbols/sketchSymbols"

type viewType = '2D' | '3d'

export const switch_3d_2d = async (getView: viewType) => {
    if(getView === '3d'){
        globalLayers.sketchLayers.graphics.forEach(graphic => {
            let height = 0 // height of the object 
            let elevation = 0 // elevation form the ground 
            if(Object.keys(graphic.attributes).length){
                height = graphic.attributes?.height ?? 0
                elevation = graphic.attributes?.elevation ?? 0
            }

            // for solar panles switching 
            if((graphic.attributes?.name as string).includes('panel') || (graphic.attributes?.name as string).includes('panel')){
                
            }

            // for all the graphic except solar panels 
            (graphic.geometry as Polygon).rings = (graphic.geometry as Polygon).rings.map(points => {
                return points.map(point => {
                    return [point[0], point[1], elevation]
                })
            })

            // set the symbol accordinly the attribute name
            graphic.symbol = buildingSymbologyHeight(graphic.attributes.height);
            
        })
    }
}