import globalLayers from "../../../../Utils/EPCMaps/Maps/GlobaLMap";
import { createPolylinewithCoordinates } from "../../GeometryOperations/createPolyLinefromCoordinates";

var allLinesCoordinates = [] as any[];
var lastAddedCoordinates = [] as number[];
var currentCoordinates = [] as number[];
var lastLengthArray = [] as any[];
var lastlineLength = 0 as any;

async function getVertexAddEvent(event: __esri.SketchCreateEvent, titleName: string) {
    // console.log(event.state, event.toolEventInfo.type)
    if (event.state === "start" && event.toolEventInfo.type === "vertex-add" && event.tool === "circle") {
        lastAddedCoordinates = (event.toolEventInfo as any).added[0]
    }

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

        if (lastAddedCoordinates.length > 0) {
            createPolylinewithCoordinates(lastAddedCoordinates, currentCoordinates, titleName)
        }

    }

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

    if (event.state === "complete") {
        if (lastlineLength && lastlineLength > 0) {
            lastLengthArray.push(lastlineLength)
        }
    }

    return { lastLengthArray }
}