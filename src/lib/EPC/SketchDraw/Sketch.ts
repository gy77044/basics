import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Measurement from "@arcgis/core/widgets/Measurement.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import { Polygon } from "esri/geometry";
import { addNewRow, setIsBuildingDrawn } from "../../../ReduxTool/Slice/Map/MapReducer";
import { removeInfraDesignData, setMaxPlantCapacity, setRoofDesignArea, setRoofDetails } from "../../../ReduxTool/Slice/Partner/EPC/EpcReducer";
import { AppDispatch } from "../../../ReduxTool/store/store";
import globalLayers from "../../../Utils/EPCMaps/Maps/GlobaLMap";
import { addMarkerToMap, loadMultipleModules } from "../../../Utils/EPCMaps/Maps/LazyloadMap";
import { getPointPairsFromRing } from "../GeometryOperations/getPointPairsFromRing";
import { buildingBase } from "../SwitchingMapLayers/SwitchMap";
import { bindButtontoSketchObject } from "./SketchbuttonBinding/bindButtontoSketch";
import { handledrawEvents, handleInvalidIntersection } from "./SketchEvents/drawEvents";
import { buildingSymbology, pipelineSymbology, treeSymbology } from "./SketchSymbols/sketchSymbols";
import { plantCapacitybyUseableArea } from "../../../Utils/Common/PlantCapacity/plantCapacitybyUseableArea";
import { roofLayerName, sketchGraphicTitle } from "../../../Utils/Const";

export async function addsketchView(dispatch: AppDispatch) {
    if (globalLayers.sketchLayers === null) {
        globalLayers.sketchLayers = new GraphicsLayer({
            title: sketchGraphicTitle,
            id: "sketch-layer"
        });
    }
    globalLayers.measurement = new Measurement({
        view: globalLayers.view!
    })
    globalLayers.sketchViewModel_Draw = new SketchViewModel({
        layer: globalLayers.sketchLayers!,
        view: globalLayers.view!,
        pointSymbol: treeSymbology,
        polylineSymbol: pipelineSymbology,
        polygonSymbol: buildingSymbology,
        snappingOptions: {
            enabled: true,
            featureSources: [
                {
                    layer: globalLayers.sketchLayers!
                }
            ]
        },
        // Show absolute direction value in tooltips
        valueOptions: {
            directionMode: "absolute"
        },
        tooltipOptions: {
            enabled: true
        },
        labelOptions: {
            enabled: true,
        },
        defaultUpdateOptions: {
            tool: "reshape",
            reshapeOptions: {
                edgeOperation: "offset"
            }
        }
    });
    await globalLayers.attachSketchWithViewModal(globalLayers.sketchViewModel_Draw);
    // await watchLocationMarkerChanges();
    handledrawEvents(globalLayers.sketchViewModel_Draw, dispatch);
    await bindButtontoSketchObject(dispatch);
    monitorSketchLayerChanges(globalLayers.sketchLayers, dispatch);
}
function monitorSketchLayerChanges(sketchLayer: GraphicsLayer, dispatch: AppDispatch) {
   
    sketchLayer.graphics.on('before-add', e => {  
        if(globalLayers.buildingdDrawn.length){
            if(e.item.attributes && e.item.attributes.name && (e.item.attributes.name as string).includes('build')){
                const name = globalLayers.buildingdDrawn[0].attributes.name as string
                if(!name.includes(roofLayerName)){
                    globalLayers.removeGraphicbyName(name)
                }
            }
        }
       
    })

    sketchLayer.graphics.on('change', e => {
        if(e.added.length && !e.removed.length){
            // check if drawn graphic is building
            const currentGraphic = e.added[0];
            // if  added graphic is building 
            // const graphicName = (currentGraphic.getAttribute('name') as string).toLowerCase();
            if(currentGraphic.attributes && currentGraphic.attributes.name && (currentGraphic.getAttribute('name') as string).includes(buildingBase)){
                dispatch(setIsBuildingDrawn(true))
                globalLayers.buildingdDrawn.push(currentGraphic)
                // if marker is enabled the remove it 
                globalLayers.removeLocationMarker();
                globalLayers.removeLocationGraphic();
            } else {
                const allGraphics  = globalLayers.sketchLayers.graphics.filter(ele => !(ele.attributes.name as string).includes('build'))
                allGraphics.forEach(ele => {
                    if(ele.attributes && ele.attributes.name){
                        if(!(ele.attributes.name as string).includes(buildingBase) && !(ele.attributes.name as string).includes('parapet') && (ele as any).uid !== (currentGraphic as any).uid){
                            // check of they intersects 
                            if(geometryEngine.intersects(currentGraphic.geometry, ele.geometry)){
                                handleInvalidIntersection(currentGraphic, dispatch, 'Infra and Obstruction should not be ontop of each other.');
                                return;
                            }
                        }
                    }
                });
            }
        }
        if(e.removed.length && !e.added.length){
            // check if removed graphic is building
            const currentGraphic = e.removed[0];
            if(currentGraphic.attributes && currentGraphic.attributes.name && (currentGraphic.getAttribute('name') as string).includes(buildingBase)){
                // console.log(currentGraphic, 'building')
                dispatch(setIsBuildingDrawn(false))
                globalLayers.resetSketchLayerGraphic()
                globalLayers.solarpanelLayer?.graphics.removeAll();
                globalLayers.multipleSolarPanelLayers = [];
                globalLayers.lastDrawnRoofBoundry = null;
                globalLayers.selectedGraphic = null;
                if(localStorage.getItem('userType') && localStorage.getItem('userType')?.toLowerCase() === 'partner'){
                    dispatch(setRoofDetails([]))
                }
                if(globalLayers.sketchButton.currentButtonClicked !== 'right'){
                    globalLayers.lastactiveTool = '';
                    addMarkerToMap(dispatch, globalLayers.userCurrentLocation.lat, globalLayers.userCurrentLocation.lng)
                }
            } else {
                // keepout is removed
                const graphicName = e.removed[0].getAttribute('name');
                if(graphicName){
                    dispatch(removeInfraDesignData(graphicName))
                    if(globalLayers.keepout.newRow !== 0){
                        dispatch(addNewRow(null))
                    }
                }

                // remove solar graphis if exists 
                if(globalLayers.solarpanelLayer && globalLayers.sketchLayers.graphics.length > 0){
                    globalLayers.removeSolarPanelLayer()
                }

                // add the area back to useable area if any keepout removed 
                const buildingGraphic = globalLayers.getGraphicbyItsName(buildingBase);

                // chekc if the geometry is wthin the building 
                if(!buildingGraphic) return;
                if(geometryEngine.contains(buildingGraphic.geometry, currentGraphic.geometry)){
                    if(graphicName && (graphicName as string).includes('panel')) return;
                    const currentGraphicArea = geometryEngine.geodesicArea(currentGraphic.geometry as Polygon, 'square-meters')
                    const totalUseableRoofArea = globalLayers.totalUseableRoofArea + Math.round(currentGraphicArea);
                    // calculate new number of module 
                    const totalNumberofModules = calculateNoofModulesinPlant(totalUseableRoofArea, globalLayers.defaultmodulePower, globalLayers.roofType)
                    globalLayers.totalUseableRoofArea = totalUseableRoofArea;
                    globalLayers.totalNumberofModules= totalNumberofModules;
                    dispatch(setRoofDesignArea({ useablearea: totalUseableRoofArea }));


                    const maxPlantCapacity = plantCapacitybyUseableArea(totalUseableRoofArea, globalLayers.defaultmodulePower)
                    dispatch(setMaxPlantCapacity(maxPlantCapacity.toString()))
                }
            }
        }
    })
}

export const calculateNoofModulesinPlant = (useableArea: number, wattagePerModule: number, roofType: string) => {
    // let pointFactor = roofType.toLowerCase().includes('rcc') ? 0.7 : 0.9
    let power = ((useableArea * 0.1) * 0.18 * wattagePerModule);
    const totalnoofmodules = (useableArea * 100 * 0.8) / 1000;
    // let denom = (defaultmoduleLength * defaultmoduleWidth) * 1000
    return Math.round(totalnoofmodules);
}
const getLengthfromPolygonLines = async (newGraphic: any) => {
    const [Point, geodesicUtils] = await loadMultipleModules(["esri/geometry/Point", "esri/geometry/support/geodesicUtils"])
    const polygon = newGraphic.geometry;
    // esri/geometry/Point
    // const distanceInMeters = geometryEngine.distance(point1, point2);
    globalLayers.convertSpatialSystem(polygon).then((geom) => {
        let linesLength = [] as number[]
        if (geom) {
            let rings = geom.rings;
            const pairs = getPointPairsFromRing(rings[0]) as any[]
            pairs.forEach(ring => {
                // ring[0], ring[1]
                const point1 = {
                    latitude: ring[0][1],
                    longitude: ring[0][0],
                    type: "point"
                };
                const point2 = {
                    latitude: ring[1][1],
                    longitude: ring[1][0],
                    type: "point"
                };
                const join = geodesicUtils.geodesicDistance(
                    new Point({ x: point1.longitude, y: point1.latitude }),
                    new Point({ x: point2.longitude, y: point2.latitude }),
                    "meters"
                );
                linesLength.push(join.distance!)
            })
            return linesLength
        }
    })
}