import * as geometryEngine from "@arcgis/core/geometry/geometryEngine"
import Polygon from "@arcgis/core/geometry/Polygon"
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel"
import { setCopyState, setInformationModal, setOpenDraw, toggleHeigthModal } from "../../../../ReduxTool/Slice/Map/MapReducer"
import { initialRoofDetails, setMaxPlantCapacity, setModuleInfo, setRoofDesignArea, setRoofDetails, setSearchedLocationLatLong, setSerachedLocation } from "../../../../ReduxTool/Slice/Partner/EPC"
import { AppDispatch, store } from "../../../../ReduxTool/store/store"
import { attributeElevation, attributeheight, defaultmoduleArea, defaultmoduleLength, defaultmodulePower, defaultmoduleWidth, isInvalidGeom, MAXUSEABLEAREA, MINUSEABLEAREA, originalGeometry, zIndex } from "../../../../Utils/Const"
import globalLayers from "../../../../Utils/EPCMaps/Maps/GlobaLMap"
import { buildingBase } from "../../SwitchingMapLayers/SwitchMap"
import { buildingSymbology, InfraSymbology, obsctructionSymbology, papapetSymbology, solarModuleSymbology, solarPanlesBlueSymbol, solarPanlesRedSymbol, treeSymbol, treeSymbology } from "../SketchSymbols/sketchSymbols"
import { areIntersectingGraphics, isGeometryInsideOuterGeometry, isIntersecting } from "../../GeometryOperations/isIntersecting"
import { setAccord } from "../../../../ReduxTool/Slice/Drawer/DrawerReducer"
import Geometry from "@arcgis/core/geometry/Geometry"
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import { CIMSymbol, ObjectSymbol3DLayer, PointSymbol3D, WebStyleSymbol } from "@arcgis/core/symbols"
import Graphic from "@arcgis/core/Graphic"
import Point from "@arcgis/core/geometry/Point"
import { fetchCompleteAddress, getStateFromCoordinates } from "../../../../Utils/EPCMaps/Maps/LazyloadMap"
import { getStateDiscom } from "../../../../ReduxTool/Slice/CommonReducers/CommonActions"
import { calculateNoofModulesinPlant } from "../Sketch"
import { plantCapacitybyUseableArea } from './../../../../Utils/Common/PlantCapacity/plantCapacitybyUseableArea';

const getRoofButton = (id: string) => {
    return document.getElementById(id) as HTMLInputElement
}

const webStyleSymbol = (height: number) => {
    return new WebStyleSymbol({
        name: "tree",
        styleName: "EsriLowPolyVegetationStyle"
      })
};



export const handleInvalidIntersection = (graphic : Graphic, dispatch: AppDispatch, message? : string) => {
    // Remove the invalid graphic from the map
    globalLayers.sketchLayers.graphics.remove(graphic);
    // Display a warning modal
    dispatch(
        setInformationModal({
            state: true,
            title: "Drawing Mode! Warning",
            content: message ? message : `Infra and Obstruction must be on the Building/Roof. Press ESC to cancel Drawing mode.`,
        })
    );

    // Restart the drawing tool based on the last active tool
    if (["walkaway", "Existing Solar Modules", "Inverter"].includes(globalLayers.lastactiveTool)) {
        globalLayers.sketchVM.create("polygon");
    } else if (["circle", "Chimney", "Helipad", "Nearby_Trees", "turbo_vent", 'AC_Earthing_Pit', 'DC_Earthing_Pit', 'waterstorage', 'lightningArrestor', ''

    ].includes(globalLayers.lastactiveTool)) {
        globalLayers.sketchVM.create("circle");
    } else {
        globalLayers.sketchVM.create("polygon");
    }
};

const handleRoofTool = (event: __esri.SketchViewModelCreateEvent, dispatch: AppDispatch) => {
    event.graphic.symbol = buildingSymbology;
    event.graphic.setAttribute('rings', (event.graphic.geometry as Polygon).rings);
    const zValue = (event.graphic.geometry as Polygon).rings[0][0][2];
    event.graphic.setAttribute(zIndex, zValue);
    event.graphic.setAttribute(attributeheight, zValue);
    event.graphic.setAttribute(attributeElevation, zValue);
    globalLayers.roofCounts += 1;
    globalLayers.lastDrawnRoofBoundry = event.graphic;
    dispatch(toggleHeigthModal('roof'));

}

// Option 1: 3D Symbol for the inverter
const cimPolygonSymbol = new CIMSymbol({
    data: {
      type: "CIMSymbolReference",  // Must be CIMSymbolReference
      symbol: {
        type: "CIMPolygonSymbol",  // This holds your CIMPolygonSymbol
        symbolLayers: [{
          type: "CIMHatchFill",
          enable: true,
          lineSymbol: {
            type: "CIMLineSymbol",
            symbolLayers: [{
              type: "CIMSolidStroke",
              enable: true,
              capStyle: "Butt",
              joinStyle: "Miter",
              miterLimit: 10,
              width: 1,
              color: [255, 61, 61, 255]  // Red color [R, G, B, A]
            }]
          },
          rotation: 45,  // Angle of hatch lines
          separation: 5   // Spacing between lines
        }]
      }
    }
});

function flattenGeometry(geometry: Polygon) {
    geometry.rings.forEach(ring => {
        ring.forEach(point => {
            point[2] = 0;  // Set the z-coordinate to 0 for each vertex
        });
    });
    geometry.hasZ = false;
    return geometry;
}

/**
 * The function `handledrawEvents` in TypeScript handles create and update events for a
 * SketchViewModel.
 * @param sketchViewModel - The `sketchViewModel` parameter is an instance of the
 * `__esri.SketchViewModel` class, which is used in the ArcGIS API for JavaScript to work with
 * sketching geometries on a map. In your code snippet, you are defining a function `handledrawEvents`
 * that
 */

let lastTool = ''
export const handledrawEvents = (sketchViewModel: SketchViewModel, dispatch: AppDispatch) => {

    sketchViewModel.on("create", (event) => {
        
        if (event.tool === "polygon" || event.tool === "polyline") {}
        if(event.state === 'start'){
            lastTool = ''
            if(globalLayers.lastactiveTool !== 'building'){
                globalLayers.sketchLayers.graphics.forEach(graphic => {
                    // check if the current graphic is on top of the building
                    if(graphic && event.graphic){
                        (event.graphic.geometry as Polygon).centroid.z = 0;
                        if(graphic.attributes && (graphic.getAttribute('name') as string).includes('building')){
                            if(areIntersectingGraphics(graphic, event.graphic) === false){
                                console.warn('Infra and Obsctrcution must be on the Building/Roof.')
                            }
                        }
                    }
                })
            }
        }
        if (event.state === "complete" && ["polygon", "polyline"].includes(event.graphic.geometry.type)) {
            globalLayers.lastdrawnGraphicUID = (event.graphic as any).uid
            globalLayers.previouslyDrawnPolygon = event.graphic
            // Set attributes to the graphic
            event.graphic.setAttribute('name', globalLayers.lastactiveTool + "_" + Math.random() * 100)
            event.graphic.setAttribute(attributeheight, 0);

            if (["Nearby_Trees", "Inverter"].includes(globalLayers.lastactiveTool)) {
                // Skip the inside building check for trees and inverter
                if (globalLayers.lastactiveTool === 'Nearby_Trees') {
                    // Set elevation if tree is being placed
                    event.graphic.setAttribute('elevation', 0);  // Or any default height for trees
                }
            } else {
                // Perform the inside building check for other tools
                globalLayers.sketchLayers.graphics.forEach((graphic) => {
                    if (graphic?.attributes && (graphic.getAttribute('name') || '').includes('building')) {
                        if (!isGeometryInsideOuterGeometry(graphic, event.graphic)) {
                            handleInvalidIntersection(event.graphic, dispatch);
                            return;
                        }
                    }
                });
            }

            // Set the elevation attribute if intersecting with the building
            globalLayers.sketchLayers?.graphics.forEach((graphic) => {
                if (graphic.getAttribute('name')?.includes(buildingBase) && geometryEngine.intersects(graphic.geometry, event.graphic.geometry)) {
                    const elevationValue = (event.graphic.geometry.type === 'polyline') ? (graphic.geometry as Polygon).centroid.z : graphic.getAttribute('buildingheight');
                    event.graphic.setAttribute('elevation', elevationValue);
                }
            });
           
            if (globalLayers.lastactiveTool === 'roof') {
                handleRoofTool(event, dispatch);
            }

            // Handle non-building tools
            // Handle non-building tools symbology
            if (globalLayers.lastactiveTool !== 'building') {
                const buildingGraphic = globalLayers.getGraphicbyItsName(buildingBase) as Graphic;
                // chekc if the geometry is wthin the building 
                if(geometryEngine.contains(buildingGraphic.geometry, event.graphic.geometry)){
                    if(event.graphic.attributes && (event.graphic.attributes.name as string).includes('panel')) return;
                    const currentPolygonArea = Math.round(geometryEngine.geodesicArea(event.graphic.geometry as Polygon, 'square-meters'));
                    event.graphic.setAttribute('useablearea', currentPolygonArea)
                    // let gb = globalLayers;
                     // Ensure that the difference geometry is valid before calculating the area
                    if (currentPolygonArea) {
                        let totalUseableRoofArea = globalLayers.totalUseableRoofArea;
                        totalUseableRoofArea = totalUseableRoofArea - currentPolygonArea;
                        buildingGraphic.setAttribute('useablearea', totalUseableRoofArea);
                        globalLayers.totalUseableRoofArea = totalUseableRoofArea;
                        dispatch(setRoofDesignArea({ useablearea: totalUseableRoofArea }));
                        const totalNumberofModules = calculateNoofModulesinPlant(globalLayers.totalUseableRoofArea, globalLayers.defaultmodulePower, globalLayers.roofType);
                        globalLayers.totalNumberofModules = totalNumberofModules;
                        if(globalLayers.totalNumberofModules > 0){
                            // dispatch(setModuleInfo({ totalModules: globalLayers.totalNumberofModules.toString() }));
                        }
                        const maxPlantCapacity = plantCapacitybyUseableArea(totalUseableRoofArea, globalLayers.defaultmodulePower)
                        dispatch(setMaxPlantCapacity(maxPlantCapacity.toString()))

                        // check if globalLayers.sanctionload is less then maxplantcapacity 
                        if(globalLayers.sanctionload > maxPlantCapacity){
                            console.warn('Sanctionload/DC Power load must be less than Max Plant Capacity, as curremt the max plant capacity is less the Sanctionload/DC Power')
                        }
                        
                    } else {
                        console.error('No difference geometry found.');
                    }
                }
                if (globalLayers.lastactiveTool === 'Parapet_Wall' || globalLayers.lastactiveTool === 'Parapet Wall') {
                    event.graphic.symbol = papapetSymbology;
                } else if (['walkaway', 'waterstorage', 'Inverter', 'lightningArrestor'].includes(globalLayers.lastactiveTool)) {
                    event.graphic.symbol = InfraSymbology;
                } else if (['Nearby_Trees', 'Nearby Trees'].includes(globalLayers.lastactiveTool)) {
                    event.graphic.symbol = treeSymbology;
                } else {
                    event.graphic.symbol = obsctructionSymbology;
                }
            }
            // Calculate roof area and set attributes for useable area
            // Handle building-specific logic
            if (globalLayers.lastactiveTool === 'building') {
                const totalarea = Math.round(geometryEngine.geodesicArea(event.graphic.geometry as Polygon, 'square-meters'));
                const useablearea = Math.round(totalarea * 0.7); // Assuming 70% for RCC roof
                event.graphic.setAttribute('totalarea', totalarea);
                event.graphic.setAttribute('useablearea', useablearea);
                globalLayers.totalUseableRoofArea = useablearea;
                globalLayers.totalroofArea = totalarea;

                if(useablearea < MINUSEABLEAREA){
                    dispatch(
                        setInformationModal({
                            state: true,
                            title: "Drawing Mode! Warning",
                            content: `Drawn Building area must be above ${MINUSEABLEAREA} sq. meter. Draw Again!`,
                        })
                    );
                    globalLayers.sketchLayers.graphics.remove(event.graphic);
                    setTimeout(() => {
                        globalLayers.sketchViewModel_Draw.create('polygon');
                    }, 500)
                    return;
                }
                if(useablearea > MAXUSEABLEAREA){
                    dispatch(
                        setInformationModal({
                            state: true,
                            title: "Drawing Mode! Warning",
                            content: `Drawn Building area must be below ${MAXUSEABLEAREA} sq. meter. Draw Again!`,
                        })
                    );
                    globalLayers.sketchLayers.graphics.remove(event.graphic);
                    setTimeout(() => {
                        globalLayers.sketchViewModel_Draw.create('polygon');
                    }, 500)
                    return;
                }

                // calcalate the number of modules 
                globalLayers.totalNumberofModules = calculateNoofModulesinPlant(globalLayers.totalUseableRoofArea, globalLayers.defaultmodulePower, globalLayers.roofType)
                dispatch(setRoofDesignArea({ totalarea, useablearea }));
                globalLayers.buildingdDrawn.push(event.graphic);
                const defualtModuleArea = defaultmoduleLength * defaultmoduleWidth;
                const TotalModules = Math.round(totalarea / defualtModuleArea);
                dispatch(setModuleInfo({ totalModules: globalLayers.totalNumberofModules.toString() }));
            }
            // Reset the drawing tool and focus on input field
            setTimeout(() => {
                if (globalLayers.lastactiveTool !== 'building') {
                    getRoofButton('infradetailInput')?.focus();
                } else {
                    const {latitude,longitude} = (event.graphic.geometry as Polygon).centroid;
                    getStateFromCoordinates(longitude,latitude).then(res=>{
                        dispatch(getStateDiscom(res));
                    });
                    fetchCompleteAddress(latitude,longitude,true)
                    .then((ele:any) => {
                        // const addressParts = [
                        //     ele?.city,
                        //     ele?.district,
                        //     ele?.state,
                        //     ele?.pincode,
                        //     ele?.countryAbbr
                        //   ].filter(Boolean); // Removes undefined or empty values
                        //   const formattedAddress = addressParts.join(', ');
                        dispatch(setSearchedLocationLatLong({lat:latitude,lng:longitude}));
                        dispatch(setSerachedLocation(ele))
                    })
                    if(!store.getState().EPCDetails.roofAnalysis.roofDetails.length){
                        dispatch(setRoofDetails([initialRoofDetails]));
                        dispatch(setAccord('Roof 1'));
                        dispatch(setInformationModal({state: false,title: "",content: ''}));
                    }
                    setTimeout(() => {
                        getRoofButton('projectname')?.focus();
                    }, 500);

                    globalLayers.graphicLayerLocationRemove()
                }
            }, 500);
            dispatch(setOpenDraw(true));
        }

    })

    sketchViewModel.on("update", async (event) => {
        if(!sketchViewModel.updateGraphics.length) return;
        if(event.state === 'start' && event.tool === 'reshape'){
            let dontMove = false;
            if(!globalLayers.isThereonlyRoof()){
                dontMove = true
            };
            if(globalLayers.solarpanelLayer && globalLayers.sketchLayers.graphics.length > 0){
                dontMove = true
            }
            for (const graphic of event.graphics) {
                const graphicName = (graphic.getAttribute('name') as string).toLowerCase();
                if(graphicName.includes('building') && dontMove){
                    // cancel the draw update for the roof if panel already there or Obs added
                    globalLayers.sketchViewModel_Draw.cancel()
                }
            }
        }
        // console.log(event.state, event.tool, event.toolEventInfo?.type)
        if (event.state === 'active' && event.tool === 'reshape') {
            if (!event.graphics.length) return;
           
            for (const graphic of event.graphics) {
                const graphicName = (graphic.getAttribute('name') as string).toLowerCase();
                const isBuilding = (globalLayers.getGraphicbyItsName(buildingBase) as Graphic).clone()
                   
                // Check only if graphic is a keepout only
                if(!graphicName.includes(buildingBase) && !graphicName.includes('panel')){
                    // move stop trigger 
                    if (event.toolEventInfo?.type === 'move-stop') {

                        const convertedPanelGeometry = await globalLayers.convertCoordinateSystem(
                            graphic.geometry as Polygon, 
                            isBuilding.geometry.spatialReference.wkid as any
                        );
                        if(convertedPanelGeometry){
                            // Use geometryEngine to check if the keepOut graphic is inside the isBuilding graphic
                            const isInsideBuilding = geometryEngine.contains(isBuilding.geometry, convertedPanelGeometry);
                            // console.log(isInsideBuilding, 'onTopBuilding')
                            // If the keepOut graphic is outside the building, remove it
                            if (!isInsideBuilding) {
                                // Remove the graphic if it's outside the building
                                globalLayers.sketchLayers.graphics.remove(graphic)
                            } else {
                                globalLayers.sketchLayers.graphics.add(graphic)
                            }
                        }

                    }

                }

                if(event.toolEventInfo.type === 'reshape-stop'){
                    // console.log('object',event.toolEventInfo.type, graphicName )
                    // building update only
                    if(!graphicName.includes('building') && !graphicName.includes('panel')){
                        // its the keepout we are reshaping
                        const totalarea = Math.round(geometryEngine.geodesicArea((graphic.geometry as Polygon), 'square-meters'))
                        const currentBuildingUseableArea = isBuilding.getAttribute('useablearea') as number;
                        const currentPolygonPrevArea  = graphic.getAttribute('useablearea') as number;
                        const newUseable = (currentBuildingUseableArea + currentPolygonPrevArea) - totalarea;
                        event.graphics[0].setAttribute('totalarea', newUseable)
                        isBuilding.setAttribute('useablearea', newUseable)
                        globalLayers.totalUseableRoofArea = newUseable;
                        dispatch(setRoofDesignArea({ useablearea: newUseable }));

                        const maxPlantCapacity = plantCapacitybyUseableArea(currentBuildingUseableArea, globalLayers.defaultmodulePower)
                        dispatch(setMaxPlantCapacity(maxPlantCapacity.toString()))
                        // console.log(graphic, 'graphickeepout')
                        // current useable area then use this area to update it 
                    }
                    if(graphicName && graphicName.includes('building')){
                        // calculate the roof area and 70% of roof area for rcc roof
                        const totalarea = Math.round(geometryEngine.geodesicArea((event.graphics[0].geometry as Polygon), 'square-meters'))
                        let useablearea = Math.round(totalarea * 0.7); // for RCC Roof 
                        event.graphics[0].setAttribute('totalarea', totalarea)
                        globalLayers.lastdrawnGraphicUID = (event.graphics[0] as any).uid
                        // get the usebale area if there are obstacles present inside the building
                        let area = globalLayers.calculateUsableArea(event.graphics[0], useablearea)
                        if (area) {
                            globalLayers.totalUseableRoofArea = area;
                            useablearea = area
                        }
                        globalLayers.totalUseableRoofArea = useablearea;
                        event.graphics[0].setAttribute('useablearea', useablearea)
                        globalLayers.totalroofArea = totalarea;
                        // module stc globalLayers.defaultmodulePower
                        // calculateNoofModulesinPlant()

                        if(useablearea < MINUSEABLEAREA){
                            dispatch(
                                setInformationModal({
                                    state: true,
                                    title: "Drawing Mode! Warning",
                                    content: `Drawn Building area must be above ${MINUSEABLEAREA} sq. meter. Draw Again!`,
                                })
                            );
                            globalLayers.sketchLayers.graphics.remove(event.graphics[0]);
                            setTimeout(() => {
                                // globalLayers.sketchViewModel_Draw.create('polygon');
                            }, 500)
                            return;
                        }
                        if(useablearea > MAXUSEABLEAREA){
                            dispatch(
                                setInformationModal({
                                    state: true,
                                    title: "Drawing Mode! Warning",
                                    content: `Drawn Building area must be below ${MAXUSEABLEAREA} sq. meter. Draw Again!`,
                                })
                            );
                            globalLayers.sketchLayers.graphics.remove(event.graphics[0]);
                            setTimeout(() => {
                                // globalLayers.sketchViewModel_Draw.create('polygon');
                            }, 500)
                            return;
                        }

                        let TotalModules = calculateNoofModulesinPlant(useablearea, globalLayers.defaultmodulePower, globalLayers.roofType)
                        globalLayers.totalNumberofModules = TotalModules;
                        dispatch(setRoofDesignArea({ useablearea: useablearea, totalarea: totalarea }));
                        dispatch(setModuleInfo({ totalModules: TotalModules.toString() }))
                        // maxplantcapacity for max plat capacity 
                        const maxPlantCapacity = plantCapacitybyUseableArea(useablearea, globalLayers.defaultmodulePower)
                        dispatch(setMaxPlantCapacity(maxPlantCapacity.toString()))
        
                    } 
                }

                // targetting the move stop event
                if (event.toolEventInfo.type === 'move-stop') {
                    // for solar panles update / transformation only 
                    if (graphicName.includes('panel')) handlingSolarModulePanleMove(graphic); 
                }


            }
        }



        if (event.state === 'active' && event.tool === 'move') {
            if (!event.graphics.length) return;
            for (const graphic of event.graphics) {
                const isPanel = (graphic.getAttribute('name') as string).toLowerCase().includes('panel');
                const isBuilding = (globalLayers.getGraphicbyItsName(buildingBase) as Graphic).clone();
                // Check only if the tool is 'move' and the graphic is a solar panel
                if (event.toolEventInfo.type === 'move' && isPanel) {
                    const convertedPanelGeometry = await globalLayers.convertCoordinateSystem(
                        graphic.geometry as Polygon, 
                        isBuilding.geometry.spatialReference.wkid as any
                    );
                    
                    if (!convertedPanelGeometry) return;
            
                    // Check if the panel is within the building boundary
                    if (!geometryEngine.contains(isBuilding.geometry, convertedPanelGeometry)) {
                        graphic.symbol = solarPanlesRedSymbol; // Out of bounds, set to red
                        globalLayers.isMovedGraphicIntersecting = true
                        graphic.setAttribute(isInvalidGeom, true)
                    } else {
                        let hasIntersection = false;
                        // Convert the Collection<Graphic> to an array
                        let solarPanelGraphics = globalLayers.solarpanelLayer?.graphics.toArray() || [];
                        const sketch = globalLayers.getNonBuildingGraphicsfromSketchLayer()
                        sketch.forEach(ele => solarPanelGraphics.push(ele));
                         //  get all the geometry from skecthlayer except the building  or moving geometry 
                        
                        // Check if the moving panel intersects with other existing solar panels or Obstacles Graphic in sketch layers
                        for (const solGraphic of solarPanelGraphics) {
                            if (graphic.getAttribute('name') !== solGraphic.getAttribute('name')) {
                                if (geometryEngine.intersects(solGraphic.geometry, graphic.geometry)) {
                                    hasIntersection = true;
                                    break; // If an intersection is found, exit the loop early
                                }
                            }
                        }

                          // Check if the moving panel intersects with other existing solar panels or Obstacles Graphic in sketch layers
                          for (const item of sketch) {
                            if (graphic.getAttribute('name') !== item.getAttribute('name')) {
                                if (geometryEngine.intersects(item.geometry, convertedPanelGeometry)) {
                                    hasIntersection = true;
                                    break; // If an intersection is found, exit the loop early
                                }
                            }
                        }

    
                        // Update the symbol based on intersection result
                        graphic.symbol = hasIntersection ? solarPanlesRedSymbol : solarPanlesBlueSymbol;
                        globalLayers.isMovedGraphicIntersecting = hasIntersection
                        if(hasIntersection){
                            graphic.setAttribute(isInvalidGeom, true)
                        } else {
                            graphic.setAttribute(isInvalidGeom, false)
                        }
                    }
                }
            
                // Handle the 'move-stop' event for solar panel updates
                if (event.toolEventInfo.type === 'move-stop' && isPanel) {
                    // Perform the final update after movement stops
                    handlingSolarModulePanleMove(graphic);
                }
            }
        }

    })


     sketchViewModel.watch("state", (newState: string) => {
        globalLayers.drawState = newState
        // console.log(globalLayers.drawState)
     })

}



/**
 * The function `updateInverterPosition` creates or updates the position of an inverter graphic on a
 * map based on a given map point.
 * @param mapPoint - The `mapPoint` parameter represents the location on the map where you want to
 * update the position of the inverter. It is an object of type `__esri.Point` which contains the
 * longitude and latitude coordinates of the point on the map.
 */
export const updateInverterPosition = (mapPoint: Point) => {
    // Define the inverter size (2x2 meters)
    const inverterWidth = 2;
    const inverterHeight = 2;

    let polygon = new Polygon({
        rings: [
            [
                [mapPoint.longitude - inverterWidth / 2, mapPoint.latitude - inverterHeight / 2],
                [mapPoint.longitude + inverterWidth / 2, mapPoint.latitude - inverterHeight / 2],
                [mapPoint.longitude + inverterWidth / 2, mapPoint.latitude + inverterHeight / 2],
                [mapPoint.longitude - inverterWidth / 2, mapPoint.latitude + inverterHeight / 2],
                [mapPoint.longitude - inverterWidth / 2, mapPoint.latitude - inverterHeight / 2]
            ]
        ],
        spatialReference: globalLayers.view!.spatialReference
    })

    if(!globalLayers.inverterGraphic){
        globalLayers.inverterGraphic = new Graphic({
            geometry: polygon,
            symbol: obsctructionSymbology
        });

        // globalLayers.sketchLayers.graphics.add(globalLayers.inverterGraphic)

    } else {
        // just update the location of the inverter 
    globalLayers.inverterGraphic.geometry = polygon;
    }


    // console.log(inverterGraphic, 'inverterGraphic')
}


const handlingSolarModulePanleMove = (movedgraphic: Graphic) => {
    const graphic = movedgraphic.clone(); // cloning the moving Graphic 
    // remove the moved graphic from the sketch layer 
    globalLayers.sketchLayers.graphics.remove(movedgraphic);
    // getting the attributes value if the graphic is valid and original Geometry Position
    const OriginalPositionGeometry =  graphic.getAttribute(originalGeometry) ? graphic.getAttribute(originalGeometry) : null;
    const isInvalid: boolean =  graphic.getAttribute(isInvalidGeom) ? graphic.getAttribute(isInvalidGeom) : false ;
    // if invalid graphic then revert the moving graphic to back to its original position before moving 
    if(isInvalid && OriginalPositionGeometry){
        graphic.geometry = OriginalPositionGeometry as Geometry
        graphic.symbol = solarPanlesBlueSymbol
        globalLayers.sketchViewModel_Draw.cancel()
    }
    if(globalLayers.solarpanelLayer){
        globalLayers.solarpanelLayer.graphics.add(graphic);
    }

    globalLayers.sketchViewModel_Draw.defaultUpdateOptions = {
        tool: 'reshape',
        enableScaling: true,
        enableRotation: true
    }
    graphic.setAttribute(isInvalidGeom, false)
    globalLayers.multipleSelectedGraphic = []
}