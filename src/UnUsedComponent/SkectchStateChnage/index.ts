import globalLayers from "../../Utils/EPCMaps/Maps/GlobaLMap"
import { createPolylinewithCoordinates } from "../../lib/EPC/GeometryOperations/createPolyLinefromCoordinates"

export function sketchDrawState(event: __esri.SketchCreateEvent, lastAddedCoordinates: number[], currentCoordinates: number[], allLinesCoordinates: any[], geodesicUtils: __esri.geodesicUtils, Point: any, titleName: string, lastlineLength: any, lastLengthArray: any[]){

    if(event.tool === "circle"){
        sketchCircleEvent(event, lastAddedCoordinates, currentCoordinates, geodesicUtils, Point, titleName)
    }

    if(event.tool === "polygon"){
        sketchPolygonEvent(event, lastAddedCoordinates, currentCoordinates, allLinesCoordinates, geodesicUtils, Point, titleName, lastlineLength, lastLengthArray)
    }

    if (event.state === "complete") {
        if (lastlineLength && lastlineLength > 0) {
            lastLengthArray.push(lastlineLength)
        }
    }

    return { lastLengthArray }


}


const sketchCircleEvent= (event: __esri.SketchCreateEvent, lastAddedCoordinates: number[], currentCoordinates: number[],geodesicUtils: __esri.geodesicUtils, Point: any, titleName: string) => {
    if (event.state === "start" && event.toolEventInfo.type === "vertex-add" && event.tool === "circle") {
        // console.log(event)
        lastAddedCoordinates = (event.toolEventInfo as any).added[0]
    }
    // console.log(lastAddedCoordinates)

    if (event.state === "active" && event.tool === "circle") {

        if (lastAddedCoordinates.length === 0) {
        } else {
            if (event.toolEventInfo.type === "cursor-update") {
                currentCoordinates = event.toolEventInfo.coordinates
            }
            if (event.toolEventInfo.type === "vertex-add") {
                currentCoordinates = event.toolEventInfo.vertices[0].coordinates
            }
        }
       
        // console.log(lastAddedCoordinates)
        if (lastAddedCoordinates.length > 0) {
            createPolylinewithCoordinates(lastAddedCoordinates, currentCoordinates, titleName)
            // addCorrdinateswithGraphicLine(geodesicUtils, Point, lastAddedCoordinates, currentCoordinates, titleName)
        }
       
    } 
}


const sketchPolygonEvent = (event: __esri.SketchCreateEvent, lastAddedCoordinates: number[], currentCoordinates: number[], allLinesCoordinates: any[], geodesicUtils: __esri.geodesicUtils, Point: any, titleName: string, lastlineLength: any, lastLengthArray: any[]) => {
    if (event.state === "active" && event.tool === "polygon" && event.toolEventInfo.type === "cursor-update") {
        if (allLinesCoordinates.length > 0) {
            const lastAddedCoordinates = allLinesCoordinates[allLinesCoordinates.length - 1]
            const currentCoordinates = event.toolEventInfo.coordinates
            createPolylinewithCoordinates(lastAddedCoordinates, currentCoordinates, titleName)
        }
    }

    else if ((event.state === "start" || event.state === "active") && event.tool === "polygon" && event.toolEventInfo?.type === "vertex-add") {
        allLinesCoordinates.push((event.toolEventInfo as any).added[0])
        // console.log(lastlineLength)
        if (lastlineLength && lastlineLength > 0) {
            lastLengthArray.push(lastlineLength)
        }

        if (globalLayers.lineGraphic && globalLayers.textGraphic) {
            globalLayers.lineGraphicList.push(globalLayers.lineGraphic)
            globalLayers.textGraphicList.push(globalLayers.textGraphic)
            globalLayers.lineGraphic = null
            globalLayers.textGraphic = null
        }
    }
}