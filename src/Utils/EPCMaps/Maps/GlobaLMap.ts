import Basemap from "@arcgis/core/Basemap.js";
import Geometry from "@arcgis/core/geometry/Geometry.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import * as geometryEngineAsync from "@arcgis/core/geometry/geometryEngineAsync.js";
import Point from "@arcgis/core/geometry/Point.js";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import * as projection from "@arcgis/core/geometry/projection.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import Graphic from "@arcgis/core/Graphic";
import BingMapsLayer from "@arcgis/core/layers/BingMapsLayer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer.js";
import Layer from "@arcgis/core/layers/Layer.js";
import WebTileLayer from "@arcgis/core/layers/WebTileLayer.js";
import WFSLayer from "@arcgis/core/layers/WFSLayer.js";
import Map from "@arcgis/core/Map.js";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer.js";
import { TextSymbol } from "@arcgis/core/symbols";
import MapView from "@arcgis/core/views/MapView.js";
import SceneView from "@arcgis/core/views/SceneView";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import Editor from "@arcgis/core/widgets/Editor.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import Measurement from "@arcgis/core/widgets/Measurement";
import Search from "@arcgis/core/widgets/Search.js";
import ShadowCast from "@arcgis/core/widgets/ShadowCast.js";
import Sketch from "@arcgis/core/widgets/Sketch";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import Slider from "@arcgis/core/widgets/Slider";
import { toast } from "react-toastify";
import { getRandomColorArray } from "../../../lib/EPC/GenerateColor/generateColor";
import { createParapetWall } from "../../../lib/EPC/SketchDraw/DrawShapes/createParapetWall";
import { buildingSymbology, InfraSymbology } from "../../../lib/EPC/SketchDraw/SketchSymbols/sketchSymbols";
import { convertGeometryToWebMercator } from "../../../lib/EPC/SpatialConversions/convertSpatialSystem";
import { buildingBase } from "../../../lib/EPC/SwitchingMapLayers/SwitchMap";
import { ProjectTy } from "../../../ReduxTool/Slice/Auth/types";
import { setMapActive, TCopyState } from "../../../ReduxTool/Slice/Map/MapReducer";
import { AppDispatch } from "../../../ReduxTool/store/store";
import { cornerlabel, elevationDirection, elevationIndex, IndexedGraphic, labelIndexType, LocationMarker, MapViewType, sketchGraphicTitle, SolarPanelsLayerName, TActiveToolType } from "../../Const";
import { pvHandleRoofTop } from "../GenerateRoof/GenrateRoof";
import { extrudeSymbol3D, getCorenrSymbolObject } from "../Markers/MarkerSymbols";
import { LayerProperties } from "./fetchRoofFromCoordinates";
import { loadMultipleModules } from "./LazyloadMap";

const googleMapsLayer = new WebTileLayer({
    urlTemplate: "http://mt1.google.com/vt/lyrs=y&x={col}&y={row}&z={level}",
    subDomains: ["0", "1", "2", "3"], // Google Maps subdomains
    title: "Google Maps"
  });

const globalLayers = {
    initialiseProps: async function (mapRef: React.MutableRefObject<HTMLDivElement | null>, lng: number, lat: number, dispatch: AppDispatch, mapType: MapViewType = '3D') {
        // const { GraphicsLayer, Map, MapView, BingMapsLayer, BasemapToggle } = await lazyLoadArcGisMapModules();
        this.sketchLayers = new GraphicsLayer({
            title: sketchGraphicTitle,
            elevationInfo: { mode: "absolute-height" },
            id: "sketch-layer"
        })

        // Create the Google Maps basemap using the WebTileLayer
        this.googleBasemap = new Basemap({
            baseLayers: [googleMapsLayer],
            title: "Google Maps",
            id: "google-basemap"
        });


        this.graphic3dLayers = new GraphicsLayer({
            title: "3d",
            id: '3d',
            elevationInfo: { mode: "absolute-height" },
        })

        this.graphicLayerLocation = new GraphicsLayer({
            id: LocationMarker,
            title: LocationMarker,

        })

        this.roofModuleGraphicLayer = new GraphicsLayer({
            title: 'Roof Modules',
            elevationInfo: { mode: "absolute-height" },
        })

        this.shadowLayer = new GraphicsLayer({
            title: 'Shadow Layer',
            id: 'Shadow Layer',
        })

        
        // this.map = new Map(bingmap)
        this.map = new Map({
            basemap: this.googleBasemap,
            // basemap: "satellite" as BasemapName,
            layers: [this.sketchLayers, this.graphicLayerLocation, this.shadowLayer],

        })

        //     let lat = 19.08489;
        //   let lng = 72.85669;
        let altitude = 707;
        if (lat === 19.08489 && lng === 72.85669) {
            altitude = 30000000
        }
        this.view = new SceneView({
            container: mapRef.current!,
            map: this.map,
            center: [lng, lat],
            camera: {
                position: [lng, lat, altitude] as any,
                tilt: 0
            },
            qualityProfile: "high",
            // environment: {
            //     lighting : {
            //         type: 'sun',
            //         directShadowsEnabled: true,
                    
            //     }
            // },
            highlightOptions: {
                shadowOpacity: 1,
                fillOpacity: 1
            }
        })

        this.sketchViewModel = new SketchViewModel({
            view: this.view!,
            layer: this.graphicLayerLocation!,
            updateOnGraphicClick: true,
            defaultUpdateOptions: {
                toggleToolOnClick: true,
                tool: "reshape",
                multipleSelectionEnabled: true,
            },
            valueOptions: {
                directionMode: "absolute"
            }
        })


        dispatch(setMapActive("esri"))
        

        this.graphicLayerLocation.graphics.on('change', e => {
            if(e.added.length && !e.removed.length){
                // means a location marker is attached to the map 
                
            }
        })

        const handleZoom = (event: any) => {
            const zoomLevel = this.view?.zoom;
            if(document.getElementById('zoomDiv')){
                (document.getElementById('zoomDiv') as HTMLElement).innerText = Math.floor(zoomLevel!).toString()
            }
            // console.log("Zooming...", zoomLevel);
        };
          
        this.view?.watch('zoom', handleZoom)

        this.wmsLayers.baseLayer = new GraphicsLayer({
            title: 'wmslayers'
        });

        // this.wmsLayers.baseLayer.graphics.add(this.wmsLayers.baseBuildingLayer);

        this.map?.layers.add(this.wmsLayers.baseLayer);

        // Initialize the BasemapToggle to switch between Google Maps and Esri's hybrid basemap
        this.basemapToggle = new BasemapToggle({
            view: this.view,
            nextBasemap: 'satellite' as BasemapName // Esri's hybrid basemap (satellite imagery with labels)
        });

       this.basemapToggle.watch('activeBasemap', this.newBasemapFn);


    //    this.view?.environment.lighting = {
    //         type: "sun",
    //         directShadowsEnabled: true 
    //   };

    },
    handleZoom: function(event: any){
        const zoomLevel = Math.floor(this.view?.zoom!);
        console.log("Zooming...", zoomLevel);
    },

    newBasemapFn: function(newBasemap: any){
        console.log('basemap changed')
    },
    // keepouts 
    keepout: {
        newRow: 0,

    },
    drawState : '' as string,
    timeZone: 'IST',
    keys: {
        keyC : false,
        ctrlPressed : false,
    },
    basemapToggle: {} as BasemapToggle, 
    googleBasemap: {} as Basemap,
    basemap: 'satellite' as BasemapName,
    defaultmodulePower : 0,
    // default parpet wall 
    parapetwall: 1,
    graphicUnion: null as null | Geometry, 
    signalController: null as AbortController | null,
    copyState: '' as TCopyState,
    load: 0,
    isDone: false,
    sanctionload: 0,
    totalroofArea: 0,
    totalUseableRoofArea: 0,
    plantcapacity: 0,
    userCurrentLocation: { lat: 0, lng: 0 },
    sanctionload2: 0,
    shadowLayer: null  as null | GraphicsLayer,
    heatMapLayer: null  as null | GraphicsLayer,    
    heatMapRender : {} as HeatmapRenderer,
    totalNumberofModules: 0,
    markerState: '' as 'move' | 'move-stop' | 'idle' | 'active' | 'complete',
    // dom x and y coordinates
    lastCursorPositionSelected: { x: 0, y: 0 },
    showRoofSelectionBtn: false,
    customButton: null as null | HTMLButtonElement,
    weatherStations: [] as Graphic[],
    currentSelectedProject: [] as ProjectTy[],
    lastDrawnRoofBoundry: null as Graphic | null,
    // for moving graphic 
    originMovingGraphic: null as Graphic | null,
    isMovedGraphicIntersecting: false,
    selectedPanelGraphic: null as Graphic | null,
    lastDrawnRoofBoundryGraphicTitle: null as string | null,
    weatherSelectionCircleGraphic: null as Graphic | null,
    currentZoomLevel: 3 as number,
    shiftPressed: false,
    // to hold tempGraphic while pointer is moving 
    tempGraphic: null as Graphic | null,
    guidinglines: { verticalLine: null as Graphic | null, horizontalLine: null as Graphic | null },
    // to hold all the added graphic 
    addedBlocks: [] as Graphic[],
    // to store records of line and points wrt titlenames
    graphicLinesObjects: {} as Record<string, IndexedGraphic>,
    // selection tools 
    selectionTool: '' as '' | 'rectangle-selection' | 'rectangle',
    // map layer and view 
    map: null as null | Map, // Store the map object
    view: null as null | SceneView, // Store the view object
    changeView: null as any,
    activemapView: "" as any,
    // roofs and solar panels
    roofCounts: 0,
    roofType: 'RCC Roof',
    roofPolygonLegs: [] as Graphic[],
    roofTiltAngleDegree: 0,
    // sketch and graphic layer tools
    indiLayers: null as null | __esri.GraphicsLayer, // Store the sketch graphics layer for table blocks
    solarpanelLayer: null as null | GraphicsLayer, // Store the sketch graphics layer for table blocks
    multipleSolarPanelLayers: [] as GraphicsLayer[], // Store the sketch graphics layer for table blocks
    // markers and polyline with length symbol
    lineGraphic: null as any,

    lineGraphicList: [] as any[],
    textGraphic: null as any,
    textGraphicList: [] as any[],

    // polygon counts and titles count
    polygonListCounts: [] as any[],
    polygonTitles: [] as string[],

    // panel generation variables for rooftop simulation
    mainPoly: null as any,
    geomPoly: [] as any[],
    elevationP: 0 as number,
    attribute: {} as any,
    altitude: 0 as number,
    latitude: 0 as number,
    longitude: 0 as number,
    height: 0 as number,
    currentSelectedGraphic: 0 as number,
    // azimuth: 15 as number
    // incline angle for building
    azimuth: 0 as number,  // incline angle for building
    tilt: 0 as number,  // tilt angle for panels

    // state to store total number of roof top oanels layed out on roofs as layers 
    roofTitlename: "RoofTop Module",
    roofTopModuleCount: [] as any[],
    panlesAngles: {
        tiltAngle: 0,
        azimuthAngle: 0
    },
    // draw and edit tools 
    activeView: "2D" as "2D" | '3D', // current active view type
    lastactiveTool: "" as TActiveToolType, // current active draw tool
    // current active draw tool
    // enable - disable shadow cast
    toggleshadowCast: false,
    lableIndexs: {} as labelIndexType,
    snapOptions: {
        snapEnabled: true,
        snapToVertex: true,
        snapToEdge: true,
        tolerance: 15 // Adjust the tolerance distance as needed (in pixels)
    }, // draw snap tools
    sketchButton: {
        polygon: null as null | HTMLElement,
        polygonEPC: null as null | HTMLElement,
        circle: null as null | HTMLElement,
        rectangle: null as null | HTMLElement,
        polyline: null as null | HTMLElement,
        delete: null as null | HTMLElement,
        select: null as null | HTMLElement,
        refresh: null as null | HTMLElement,
        measurement: null as null | HTMLElement,
        zoomIn: null as null | HTMLElement,
        zoomOut: null as null | HTMLElement,
        featureAdd: null as null | HTMLElement,
        drawRoof: null as null | HTMLElement,
        shadow: null as null | HTMLElement,
        scale: null as null | HTMLElement,
        currentButtonClicked: null as null | "left" | "right",
        rightbuttonMarkerState: '' as TCopyState
    }, // draw or edit buttons 
    markerLocation: { x: 0, y: 0 },
    // table mudule feature add or remove state
    featureAddState: null as null | 'active' | "delete" | 'select',
    isSelected: false as boolean,
    stopProjectSelection: false as boolean,
    // solar module symbol and boundry geometry
    polygonGeomforLayout: null as any,
    panles_2d: null as any,
    panles_3d: null as any,
    // circle type polygon 
    circleLineGraphic: null as any, // for inittial polyline or top to center polyline
    circleTextGraphicTop: null as any,
    leftLineCirclePolyGraphic: null as any,
    leftLineCirclePolyGraphicSymbol: null as any,
    circleTextGraphic: null as any,
    /// editor for sketch 
    editor: null as null | Editor,
    sketchLayers: {} as GraphicsLayer, // Store the sketch graphics layer
    graphic3dLayers: null as null | GraphicsLayer, // Store the sketch graphics layer
    measurement: null as null | Measurement,
    container: null as null | HTMLDivElement,
    searchWidgetInput: null as any,
    projectSearch: null as null | Search,
    LocationMarkerPointGraphic: null as null | Graphic,
    graphicLayerLocation: null as null | GraphicsLayer,
    inverterGraphic: null as null | Graphic,
    roofGroupLayer: null as null | GroupLayer,
    sketchViewModel_Draw: {} as SketchViewModel,
    buildingdDrawn: [] as Graphic[],
    isBuildingDrawn: false,
    // to hold all the roof modules that are generated
    roofModuleGraphicLayer: null as null | GraphicsLayer,
    shadowCastWidget: null as ShadowCast | null,
    groupLayer: {} as GroupLayer,
    // sketchview Modal
    sketchViewModel: null as SketchViewModel | null,
    // ViewModal for Sketch
    sketchVM: {} as Sketch,
    selectedGraphic: null as Graphic | null,
    lastdrawnGraphicUID: 0 as number,
    previouslyDrawnPolygon: null as Graphic | null,
    multipleSelectedGraphic: [] as Graphic[],
    // additional properties here
    selectedRoof: {
        properties: {} as LayerProperties,
        objectid: '' as string
    },
    // footer lat & lng
    footers: {
        lat: null as null | HTMLElement,
        lng: null as null | HTMLElement,
    },
    // feature layer/WFS layers 
    featureLayers: {
        buildingFeatureDhaka: null as FeatureLayer | null,
        layerlist: null as LayerList | null,
        wfsLayers: [] as WFSLayer[],
        groupLayer: {} as GroupLayer
    },

    layerListWidget: null as null | LayerList,

    wmsLayers: {

        layerNames : [
            // "pvlayers:roof",
            "pvlayers:existing_solar_modules",
            "pvlayers:water_tanks",
            "pvlayers:hvac_equipment",
            "pvlayers:mumty_structure",
            "pvlayers:parapet_wall",
            // "pvlayers:pipelines",
        ],

        baseLayer: null as GraphicsLayer | null,
        baseBuildingLayer: {} as Graphic,

        wms_roof_height: 0

    },

    rangeSlider: null as null | Slider, 
    defineActions: async function (event: any) {
        // The event object contains an item property.
        // is is a ListItem referencing the associated layer
        // and other properties. You can control the visibility of the
        // item, its title, and actions using this object.
        const { item } = event;
        await item.layer.when();
        if (item.title === sketchGraphicTitle || item.title === SolarPanelsLayerName) {
            // create list drop down type 
            const graphics = item.layer.graphics;
            // Create a dropdown menu for the graphics
            item.panel = {
                open: false, // Open by default
                icon: 'chevron-down',
                title: "Expand"
            };
            // Create a list of graphics as dropdown items
            const graphicsListHtml = graphics.map((graphic: Graphic) => `
                    <div  class="graphic-list-item pl-1 py-[7px] rounded-md hover:bg-[#f3f3f3] hover:text-primary-200 h-full w-full ${graphic.attributes.name}" id=${graphic.attributes.name} data-graphic-id=${graphic.attributes.name}">
                        ${(graphic.getAttribute('name') as string).includes('building') ? 'Building Roof' : (graphic.getAttribute('name') as string).slice(0, 10) || "Graphic"} 
                    </div>
                `).join("");

            // Set the custom HTML to the panel 
            item.panel.content = `
                    <div class="graphics-dropdown cursor-pointer">
                        <div class="graphics-list flex flex-col gap-[5px]  ">
                            ${graphicsListHtml}
                        </div>
                    </div>
                `;

        } else {
            item.hidden = true
        }


        setTimeout(() => {
            const graphicItems = document.querySelectorAll('.graphic-list-item');
            graphicItems.forEach((element: Element) => {
                element.addEventListener('click', () => {
                    const graphicName = element.getAttribute('data-graphic-id') as string;
                    // Handle case where graphicName is null
                    if (!graphicName) {
                        console.warn(`No graphic by name "${graphicName}" found.`);
                        return;
                    }
                    const graphic = this.selectGraphicbyName(graphicName)
                });
            });
        }, 500)



    },
    // check if there is any other graphic except roof building on map
    isThereonlyRoof: function(){
        let isonlyRoof = true;
        this.sketchLayers.graphics.forEach(ele => {
            if(ele.attributes && !(ele.getAttribute('name') as string).includes('build')){
                isonlyRoof = false
                return;
            }
        })
        return isonlyRoof
    },

    handleLayerListItems: async function(featureDiv: HTMLElement){
        
        // const [LayerList] = await loadEsriModules(["esri/widgets/LayerList"]);
        this.layerListWidget = new LayerList({
          listItemCreatedFunction: this.defineActions,
          catalogOptions: {
            selectionMode: "single",
            visibleElements: {
              filter: true,
            //   visibilityToggle: false
            },
          },
          view: this.view!,
          container: featureDiv,
        //   selectionEnabled: true,
          selectionMode: 'single',
          dragEnabled: true
        }) as LayerList;

        this.layerListWidget.visibilityAppearance = "checkbox";
        this.layerListWidget.visibleElements = {
            catalogLayerList: true,
            errors: true,
            filter: true,
            statusIndicators: true
        };

    },

    updateGraphicsDropdown: function(item: any) {
        const graphics = item.layer.graphics;

        item.panel = {
            content: 'custom', // Content type for nested items
            open: true // Open by default
        };
    
        // Prepare the custom HTML for the graphics list
        const graphicsListHtml = graphics.map((graphic: any) => `
            <div class="graphic-item" data-graphic-id="${graphic.id}">
                ${graphic.name || "Graphic"} 
            </div>
        `).join("");
    
        // Set the custom HTML to the panel
        item.panel.content = `
            <div class="graphics-dropdown">
                <div class="graphics-list">
                    ${graphicsListHtml}
                </div>
            </div>
        `;
    
        // Event listener for graphic item clicks (optional)
        // item.panel.content.querySelectorAll('.graphic-item').forEach((element: any) => {
        //     element.addEventListener('click', () => {
        //         console.log(`Graphic ID: ${element.dataset.graphicId}`);
        //         // Add any action you want to perform on graphic click
        //     });
        // });
    },

    

    getNonBuildingGraphicsfromSketchLayer: function(){
        let nonBuildingGraphics = [] as Graphic[];
        if (!this.sketchLayers) return nonBuildingGraphics;
    
        for (const graphic of this.sketchLayers.graphics.toArray()) {
            if (Object.keys(graphic.attributes).length > 0) {
                const graphicName = graphic.getAttribute('name') as string;
                if (!graphicName.includes(buildingBase) && !graphicName.includes('panel')) {
                    nonBuildingGraphics.push(graphic);
                }
            }
        }
    
        return nonBuildingGraphics;
    }
    ,

    enableGraphicEditing: function(enable: boolean){
        if(this.sketchViewModel_Draw){
            this.sketchViewModel_Draw.updateOnGraphicClick = enable
            this.stopProjectSelection = enable
        }
    }
,
    flytobuilding: function(){
        try{
        this.sketchLayers.graphics.forEach(graphic => {
            if(graphic.attributes && (graphic.getAttribute('name') as string).includes(buildingBase)){
                this.view?.goTo({
                    target: graphic.geometry,
                    zoom: 18, // Set the zoom level
                })
            }
        })
             
    }
    catch(e){

    }
    },
    activeLocationMarker: function(){   
        if(this.sketchViewModel?.activeTool === 'reshape') return;    

        // Cancel any ongoing sketch operations
        if (this.sketchViewModel?.state === 'active') {
            this.sketchViewModel.cancel();
        }

        // Ensure the graphicLayerLocation exists
        if (!this.graphicLayerLocation) return;

        // Loop through graphics and update if criteria are met
        this.graphicLayerLocation.graphics.forEach(ele => {
            if (ele.attributes) {
                const title = ele.getAttribute('title');
                const name = ele.getAttribute('name');
                if (title === LocationMarker || name === LocationMarker) {
                    // Use a try-catch to handle potential errors during update
                    try {
                        this.sketchViewModel?.update(ele);
                    } catch (error) {
                        console.error("Error updating graphic:", error);
                    }
                }
            }
        });
    },
    addCornerLabels: function() {
        // Get the building graphic by its name
        const graphic = this.getGraphicbyItsName(buildingBase);
        if (!graphic) return;
    
        // Get the polygon's rings (coordinates of the corners)
        const rings = (graphic.geometry as Polygon).rings[0];
    
        // Define label symbols
        const labelSymbols = ["A", "B", "C", "D"];
        const labelsLayer = new GraphicsLayer({
            title: 'labelsLayer',
            id: 'labelsLayer'
        });

        this.map?.add(labelsLayer)

    
        rings.forEach((point, index) => {
            if (index < labelSymbols.length) {
                const labelPoint = {
                    type: "point",
                    x: point[0],
                    y: point[1],
                    z: point[2] || 0,
                    spatialReference: { wkid: 102100 }
                };
    
                let label = labelSymbols[index];
                this.lableIndexs[label as keyof labelIndexType] = index
                const labelGraphic = new Graphic({
                    geometry: labelPoint as any,
                    symbol:  new TextSymbol(getCorenrSymbolObject(label, [255, 136, 27, 1], 15)),
                    attributes: {
                        isCornerLabel: true,
                        name: cornerlabel
                    }
                });
    
                // Add the label graphic to the labelsLayer
                labelsLayer.graphics.add(labelGraphic)
                // this.sketchLayers.graphics.add(labelGraphic);

            }
        });
    
        // Store the labelsLayer in the graphic's attributes for later removal
        graphic.setAttribute('labelsLayer', labelsLayer);
        graphic.setAttribute('labelsLayer', labelsLayer);
    },
    cancelDrawActiveTool: function(){
        if (this.sketchViewModel_Draw.activeTool) {
            this.sketchViewModel_Draw.cancel();
        }
    },
    removeSolarPanelLayer: function(){
        if(!this.map) return;
        this.map.allLayers.forEach((lyer) => {
            if (lyer.title && lyer.title.includes("Solar Panels")) {
              this.map?.allLayers.remove(lyer);
            }
        });

        if(globalLayers.solarpanelLayer !== null){
            this.solarpanelLayer?.graphics.forEach((ele) => {
                this.solarpanelLayer?.graphics.remove(ele);
            });
        }

        this.multipleSolarPanelLayers.map((layer) => {
            layer.graphics.removeAll();
            layer.graphics.forEach((ele) => {
              layer.graphics.remove(ele);
            });
        });
          
        if (this.solarpanelLayer?.graphics.length) {
            this.solarpanelLayer?.graphics.removeAll();
        }

    },
    removeShadowIrradianceMap: function(){
        if(this.shadowLayer?.graphics.length){
            this.view?.map.allLayers.forEach(layer => {
              if(layer.title === 'Heat Map'){
                globalLayers.view?.map.allLayers.remove(layer);
              }
            })
            this.shadowLayer.graphics.removeAll()
          }
    },
    calculateDistancebwPoints: function(startLatitude: number, startLongitude: number, endLatitude: number, endLongitude: number){
        const polyLine = new Polyline({
            paths: [[
                [startLongitude, startLatitude], // start point [longitude, latitude]
                [endLongitude, endLatitude] // end point [longitude, latitude]
            ]],
            spatialReference: { wkid: 102100 }
        });
        const distance = geometryEngine.geodesicLength(polyLine, "meters");
        return distance;

    },
    removeCornerLabels: function(PointstoElevate: number[], ElevationDirection?: string) {
        const graphic = this.getGraphicbyItsName(buildingBase)
        if(!graphic) return;
        if(PointstoElevate.length > 0){
            graphic.setAttribute(elevationIndex, PointstoElevate)
            graphic.setAttribute(elevationDirection, ElevationDirection)
        }
        const labelsLayer = graphic.attributes.labelsLayer;
    
        if (labelsLayer) {
            // Remove the labelsLayer from the map
            this.map?.remove(labelsLayer);
            this.map?.allLayers.forEach(lay => {
                if(lay.title === 'labelsLayer'){
                    this.map?.remove(lay);
                    if(!lay.destroyed){
                        lay.destroy()
                    }
                }
            })
            // Clear the reference from the graphic's attributes 
            graphic.setAttribute('labelsLayer', null);
        }

        this.map?.allLayers.forEach(lay => {
            if(lay.title === 'labelsLayer'){
                this.map?.remove(lay);
                if(!lay.destroyed){
                    lay.destroy()
                }
            }
        })
    },
    hideCornerLabels: function() {
        const graphic = this.getGraphicbyItsName(buildingBase)
        if(!graphic) return;

        const labelsLayer = graphic.attributes.labelsLayer;
    
        if (labelsLayer) {
            // Remove the labelsLayer from the map
            this.map?.remove(labelsLayer);
            this.map?.allLayers.forEach(lay => {
                if(lay.title === 'labelsLayer'){
                    this.map?.remove(lay);
                    if(!lay.destroyed){
                        lay.destroy()
                    }
                }
            })
            // Clear the reference from the graphic's attributes 
            graphic.setAttribute('labelsLayer', null);
        }

        this.map?.allLayers.forEach(lay => {
            if(lay.title === 'labelsLayer'){
                this.map?.remove(lay);
                if(!lay.destroyed){
                    lay.destroy()
                }
            }
        })
    },

    roofAzimuthAngle: function(angle: number){
        if (this.sketchLayers.graphics.length) {
            this.sketchLayers.graphics.forEach((graphic) => {
                if (graphic.attributes && (graphic.getAttribute('name') as string).includes(buildingBase)) {
                    // Retrieve the original geometry if available or store it initially
                    let originalGeometry = graphic.attributes.originalGeometry;
                    if (!originalGeometry) {
                        originalGeometry = graphic.geometry.clone();
                        graphic.setAttribute('originalGeometry', originalGeometry);
                    }
                    // Reset to the original geometry before applying a new rotation
                    graphic.geometry = originalGeometry.clone();
                    // Calculate the centroid of the geometry to use as the rotation center
                    const centroid = graphic.geometry.extent.center;
                    // Apply the new rotation around the centroid
                    graphic.geometry = geometryEngine.rotate(graphic.geometry, angle, centroid);
    
                    // Update the roof azimuth attribute with the new angle
                    graphic.setAttribute('roofazimuth', angle);
    
                    // If angle is zero, reset to the original geometry
                    if (angle === 0) {
                        graphic.geometry = originalGeometry;
                    }
                }
            });
        }
    },
    addRoofTiltAngle: function(angle: number){
        if(this.sketchLayers.graphics.length){
            this.sketchLayers.graphics.forEach((graphic) => {
                if(graphic.attributes && (graphic.getAttribute('name') as string).includes(buildingBase)){
                    graphic.setAttribute('rooftiltangle', angle)
                }
            })
        }
    },

    addHeightToBuilding: function(height: number){
        if(this.sketchLayers.graphics.length){
            this.sketchLayers.graphics.forEach((graphic) => {
                if(graphic.attributes && (graphic.getAttribute('name') as string).includes(buildingBase)){
                    graphic.setAttribute('height', height)
                }
            })
        }
    },

    calculateUsableArea: function(buildingGraphic: Graphic, area: number) {
        if (!this.sketchLayers || !this.sketchLayers.graphics) {
            console.error("Sketch layer or graphics not found.");
            return;
        }
    
        // Validate the incoming building graphic
        if (!buildingGraphic || !(buildingGraphic.attributes.name as string).includes('building')) {
            console.error("Invalid building graphic provided.");
            return;
        }
    
        const buildingGeometry = buildingGraphic.geometry;
        let usableArea = area;
    
        // Iterate through all graphics in the sketch layer
        if(!this.sketchLayers.graphics.length) return;
        
        this.sketchLayers.graphics.forEach((graphic) => {
            if (!(graphic.attributes.name as string).includes('building')) {
                const graphicGeometry = graphic.geometry as Polygon;
    
                // Check if the non-building graphic is within the building graphic
                if (geometryEngine.within(graphicGeometry, buildingGeometry)) {
                    try {
                        // Subtract the area of the non-building graphic from the building graphic
                        const differenceGeometry = geometryEngine.difference(buildingGeometry, graphicGeometry);
                        
                        if (differenceGeometry) {
                            const removedArea = geometryEngine.geodesicArea(graphicGeometry, "square-meters");
                            usableArea -= removedArea;
                        }
                    } catch (error) {
                        console.error("Error calculating difference for graphic:", error);
                    }
                }
            }
        });
        return usableArea;
    },
    

    getDefaultCoordinates: function(): { latitude: number; longitude: number } {
        return { latitude: 19.08489, longitude: 72.85669 };
    },

    zoomToGeometry: function (geometry: Geometry) {
        try {
            if (!geometry || !(geometry as any).centroid) {
                console.error("Invalid geometry or missing centroid property.");
                return;
            }

            const centroid = (geometry as any).centroid;
            if (!centroid.longitude || !centroid.latitude) {
                console.error("Centroid does not have valid longitude and latitude.");
                return;
            }

            globalLayers.view?.goTo({
                center: [centroid.longitude, centroid.latitude],
                zoom: 18
            })
                .catch(e => {
                    console.error('Error during goTo operation:', e);
                    toast.error(e.message)
                });

        }
        catch (e) {

        }
    },

    // to switch current view type 
    toggleMapView: async () => {
        // await switchView(globalLayers.activeView);
    },

    addSketchDraw: async () => {
        // await addsketchView()
    },

    attachSketchWithViewModal: async function (SketchViewModel: SketchViewModel) {
        if (Object.keys(this.sketchVM).length > 0) {
            this.sketchVM.destroy()
            this.sketchVM = {} as Sketch;
        }
        if (Object.keys(this.sketchVM).length === 0) {
            // this.sketchVM = new Sketch(skecthObject)
            this.sketchVM = new Sketch({
                view: this.view!,
                viewModel: SketchViewModel,
                layer: this.sketchLayers,
                visibleElements: {
                    createTools: {
                        rectangle: true,
                        circle: true,
                        polygon: true
                    }
                },
                creationMode: 'single'
            });
        }

    },
   
    spatialReference: async function (): Promise<SpatialReference> {
        const SpatialReference = await import("@arcgis/core/geometry/SpatialReference.js");
        return new SpatialReference.default({
            wkid: 4326
        })
    },
    // to create Graphic
    createGraphic: async function (geometry: Polygon, symbol: any, title: any, visible?: boolean): Promise<Graphic> {
        return new Graphic({
            geometry,
            symbol,
            visible,
            attributes: {
                title,
                name: title
            }
        })
    },
    // to create Polyline from given paths 
    createPolylineGeometry: async function (paths: number[][][], title: string) {
        const polyline = new Polyline({
            paths: paths,
            spatialReference: { wkid: 4326 } // Use the appropriate spatial reference
        });
        return polyline;
    },
    // remove selected  skect graphic
    deleteSelectedGraphics: function () {
        const selectedGraphics = this.sketchViewModel_Draw.updateGraphics;
        if (selectedGraphics.length > 0) {
            // Loop through the selected graphics and remove them from the GraphicsLayer
            selectedGraphics.forEach(selectedGraphic => {
                this.sketchLayers?.graphics.remove(selectedGraphic);
            });

            // Clear the selection after deleting
            this.sketchVM.cancel();
        } else {
            console.error("No feature selected. Please select a feature first.");
        }
    },
    setBaselayer: function (baseMap: string) {
        let newBasemap;

        // Handle Google Maps or other custom basemaps
        if (baseMap === 'google' || baseMap === 'Google') {
            // Create a new custom basemap using Google Maps
            newBasemap = this.googleBasemap;
        } else {
            // Handle Esri basemaps by their ID (e.g., 'streets', 'satellite', 'hybrid', etc.)
            newBasemap = Basemap.fromId(baseMap);
        }

        if (newBasemap && this.map) {
            // Update the map's basemap
            this.map.basemap = newBasemap;
            console.log(`Basemap successfully changed to '${baseMap}'`);
        } else {
            console.warn(`Basemap with ID '${baseMap}' not found.`);
        }
    },
    setBinglayer: function (bmap: string) {
        let bingmap1
        if (bmap === "esri") {
            bingmap1 = new Map({
                basemap: "satellite",
                ground: "world-elevation",
                layers: [this.graphicLayerLocation!],
            });
        } else if (bmap === "bing") {
            bingmap1 = new Map({
                basemap: {
                    baseLayers: [new BingMapsLayer({
                        style: "aerial", // Specify the Bing Maps style (options: "aerial", "road", "hybrid", "canvasDark", "canvasLight", "birdseye", "birdseyeAerial")
                        key: "AkTWG50yjCD1xIYtd_-gBFbrLdthMQwWHCN-KYZx89ecBiNwR-A1ZwCrnqxGrwmB"
                    })]
                }
            });
        }

        this.view = new MapView({
            container: globalLayers.container!,
            map: bingmap1,
            center: globalLayers.userCurrentLocation ? [globalLayers.userCurrentLocation.lng, globalLayers.userCurrentLocation.lat] : [72.85669, 19.08489],
            zoom: globalLayers.currentZoomLevel
        }) as any;
    },
    // Method to add a graphic to the map
    addGraphic: function (graphic: Graphic, title: string) {
        if (this.view && this.view.map) {
            const graphicsLayer = new GraphicsLayer({
                title: title
            });
            graphicsLayer.add(graphic);
            this.view.map.add(graphicsLayer);
        } else {
            console.warn("Couldn't find the view/map")
        }
    },
    // Method to add a graphic to the map
    addSketchGraphic: function (graphic: Graphic) {
        if (this.sketchLayers) {
            this.sketchLayers.graphics.add(graphic);
        } else {
            console.warn("Couldn't find the sketch layers")
        }
    },
    removeSketchGraphic: function (graphic: Graphic) {
        if (this.sketchLayers) {
            this.sketchLayers.graphics.remove(graphic);
        } else {
            console.warn("Couldn't find the sketch layers")
        }
    },
    resetSketchLayerGraphic: function () {
        if (this.sketchLayers) {
            this.sketchLayers.graphics.removeAll()
        } else {
            console.warn("Couldn't find the sketch layers")
        }
    },
    // Method to find a graphic by its title
    GetGraphicLayerbyTitle: function (title: string): Layer | null {
        if(!this.view) return null;
        let graphicsLayer: Layer | null = null;
        this.view.map.allLayers.forEach(ele => {
            if (ele.title === title) {
                graphicsLayer = ele
            }
        })
        return graphicsLayer;
    },
    RemoveLayer: function (title: string): boolean {
        let graphicsLayer: Layer | null = null;
        if (this.view && this.view.map) {
            this.view.map.allLayers.forEach(ele => {
                if (ele.title === title) {
                    graphicsLayer = ele
                    this.view?.map.remove(ele);
                    console.log(`${title} removed successfully !! `)
                }
            })
        }
        if (graphicsLayer) {
            console.warn(`${title} removed successfully`)
            return true
        }
        console.error(`${title}: could not find this layer`)
        return false
    },
    Removeaddress: function () {
        if (this.searchWidgetInput) {
            this.searchWidgetInput.clear()
        }
    },
    addNewFeatureLayer: function (title: string, layer: any) {
        if (this.map) {
            const layers = this.map?.layers as any
            let featureLyar = layers._items.filter((ele: Layer) => ele.title === title)
            if (!featureLyar.lenght) {
                this.map.add(layer)
            }
        }
    },
    addGroupLayer: function (title: string) {
        this.groupLayer = new GroupLayer({
            title: title
        });
    },
    toggleLocationPin: function () {
        if (this.map) {
            this.map.allLayers.forEach(lyer => {
                if (lyer?.title === "locationMarker") {
                    if (lyer.visible) {
                        lyer.visible = false
                    } else {
                        lyer.visible = true
                    }
                } else {
                    console.error("No Location Graphic Found")
                }
            })
        } else {
            console.error("No view attached to map")
        }
    },
    addHeighttoGraphic: async function (height: number, tilt: number, azimuth: number) {
        if (this.sketchVM.updateGraphics === undefined) {
            console.warn('No layer selected')
            return;
        }
        const currSelectGraphicList = (this.sketchVM.updateGraphics as any)._items as Graphic[]
        if (currSelectGraphicList.length === 0) return
        currSelectGraphicList.forEach(async (graphic: any) => {
            graphic.attributes = { ...graphic.attributes, height: height }
            const attributes = graphic.attributes;
            let geometry = graphic.geometry as Polygon
            if (geometry.type !== "polygon") return;
            const centerCoordinates = (geometry as any).centroid;
            geometry.hasZ = true
            const pointGeometry = new Point({
                latitude: centerCoordinates.latitude,
                longitude: centerCoordinates.longitude,
                z: globalLayers.altitude,
            });

            const graphicLayer = new GraphicsLayer({
                title: "3d",
                id: '3d'
            });

            const updatedGeometry = await convertGeometryToWebMercator(pointGeometry)
            if(!updatedGeometry) return;
            let centerLong = (updatedGeometry as Point).x; // longitude for point geometry in spatialreference wkid 102100
            let centerLat = (updatedGeometry as Point).y; // latitude for point geometry in spatialreference wkid 102100
            // adding height to all the rings in the geometry
            if (geometry.rings.length > 1) {
                for (let i = 0; i < geometry.rings.length; i++) {
                    for (let j = 0; j < geometry.rings[i].length; j++) {
                        let long = geometry.rings[i][j][0];
                        let lat = geometry.rings[i][j][1];
                        let heig = pointGeometry?.z;
                        if (centerLong > long) {
                            geometry.rings[i][j][2] = heig;
                            // return 'right';
                        } else if (centerLat < lat) {
                            geometry.rings[i][j][2] = heig;
                            // return 'left';
                        } else {
                            geometry.rings[i][j][2] = heig;
                            // return 'same';
                        }
                    }
                }
                const graphicNew = await this.createGraphic(geometry, extrudeSymbol3D(40, "red"), '', false)
                graphicLayer.add(graphicNew);
                globalLayers.view?.map.add(graphicLayer);
            }
            else {
                const ring: number[][] = geometry.rings[0]
                const updatedGeometry = this.updateGeomrtyRingswithTilt(graphic, ring, pointGeometry, centerLong, geometry, centerLat)
                const color = getRandomColorArray()
                const newGraphic = await this.createGraphic(updatedGeometry, extrudeSymbol3D(height, color), graphic?.title, false)
                if (globalLayers.graphic3dLayers) {
                    globalLayers.graphic3dLayers.graphics.forEach((layer: any) => {
                        // look for the existing same graphic layer and update it with the new graphic here
                        if (layer.title === newGraphic.attributes?.name) {
                            globalLayers.graphic3dLayers?.graphics.remove(layer);
                        }
                    })
                    newGraphic.attributes = attributes;
                    if (newGraphic.attributes && newGraphic.attributes.radius) {
                    }
                    globalLayers.graphic3dLayers?.add(newGraphic)
                }
                     
            }
        })
        return globalLayers.graphic3dLayers;
    },
    changeAzimuth: async function () {

        if (!this.lastDrawnRoofBoundryGraphicTitle) return;
        this.map?.remove(this.solarpanelLayer!);
        // let boundry = this.lastDrawnRoofBoundryGraphicTitle;
        await pvHandleRoofTop(this.lastDrawnRoofBoundry, this.elevationP, 'title', {} as any)
    },
    show3dView: function (SceneView: any) {
        this.sketchVM.complete()
        if (this.activeView === "2D") {
            return "Scene is already in 3d Mode."
        }
        if (!this.graphic3dLayers) {
            return "No 3D graphics found."
        }
        this.view = new SceneView({
            container: globalLayers.container!,
            map: globalLayers.map,
            center: [72.85669, 19.08489],
            zoom: 18,
        });


        this.addSketchDraw().then(() => {
            console.log('sketch-added')
        })

    },
    show2dView: function (MapView: any) {
        globalLayers.sketchVM.complete()
        if (this.activeView === "3D") {
            return "MapView is already in 2D Mode."
        }
        if (!this.sketchLayers) {
            return "No graphics found."
        }
        globalLayers.view = new MapView({
            container: globalLayers.container!,
            map: globalLayers.map,
            center: [72.85669, 19.08489],
            zoom: 18,
        });
        globalLayers.addSketchDraw().then(() => {
            console.log('sketch-added')
        })
    },
    switchGraphicsView: function (type: "sketch-layer" | '3d') {
        if (type === "3d") { }
        else { }
    },
    // create the duplicate graphics
    createDuplicate: function () {
        const toastId = 'copypolygon'
        let titles = [] as string[]
        this.sketchVM.updateGraphics.forEach((ele) => {
            if (titles.includes(ele.attributes.name)) return
            titles.push(ele.attributes.name)
        })
        if (this.sketchVM.updateGraphics.length > 0) {
            this.sketchLayers?.graphics.forEach(layer => {
                if(Object.keys(layer.attributes).length > 0) {
                    if (titles.includes((layer.attributes.name ).title)) {
                        let clonedGraphic = layer.clone();
                        (clonedGraphic as any).title = layer.attributes.name as string + "-" + "copy";
                        this.sketchLayers?.graphics.add(clonedGraphic)
                    }
                }
            })
            toast.success('Graphic Copied Successfully.', { toastId });
      } else {
            toast.warn('No graphic selected. Please select a graphic first.', { toastId })
        }
    },
    createDuplicateGraphic: function (title: string, filterLayerByName: Graphic[]) {
        const toastId = 'copied-polygon'
        // check if the props titlename graphic already exists 
        let alredayExistGraphic = this.sketchLayers?.graphics.filter((layer) => layer.attributes && layer.attributes.name === title)
        if (alredayExistGraphic && alredayExistGraphic.length > 0) return; // graphic alredy exists now either return from here or remove them then attach again 
        let newCopiedGraphics = [] as Graphic[]
        for (let i = 0; i < filterLayerByName.length; i++) {
            let originalGraphic = filterLayerByName[i];
            let copiedGraphic: any = originalGraphic.clone(); // Create a shallow copy
            copiedGraphic.title = title;
            newCopiedGraphics.push(copiedGraphic);
        }
        this.sketchLayers?.graphics.addMany(newCopiedGraphics);
        newCopiedGraphics.forEach((ele: any) => {
            if (!this.polygonListCounts.includes(ele.title)) {
                this.polygonListCounts.push(ele.title)
            }

        })
        toast.success('Graphic Copied Successfully.', { toastId });
    },
    createDuplicateSolarPanelGraphic: function (graphic: Graphic) {
        const toastId = 'copied-polygon'
        // check if the props titlename graphic already exists 
        globalLayers.solarpanelLayer?.add(graphic);
        toast.success('Graphic Copied Successfully.', { toastId });
    },
    // Flip the selected geometry / Graphic
    flipSelectedGraphic: async function () {
        const selectedGraphicLayer = this.selectedGraphic
        if (selectedGraphicLayer === null) {
            console.warn("No selected layer found.")
            return
        }
        const flipGeom = await geometryEngineAsync.flipHorizontal(selectedGraphicLayer.geometry);
        const flippedGeometryRotate = await geometryEngineAsync.rotate(flipGeom, 10)
        // const flippedGraphic = new Graphic({
        //     geometry: flippedGeometryRotate,
        //     symbol: selectedGraphicLayer.symbol,
        //     attributes: selectedGraphicLayer.attributes
        // });
        // this.sketchLayers?.remove(selectedGraphicLayer);
        // this.sketchLayers?.add(flippedGraphic)
        // this.selectedGraphic = flippedGraphic
        selectedGraphicLayer.geometry = flippedGeometryRotate;
        return selectedGraphicLayer
    },
    shadowCast: async function (toggle: "add" | "remove") {
        if (toggle === "add") {
            globalLayers.shadowCastWidget = new ShadowCast({
                view: this.view!,
                visibleElements: { tooltip: true }
            })
            globalLayers.toggleshadowCast = true
        } else {
            if (globalLayers.shadowCastWidget) {
                globalLayers.shadowCastWidget.visible = false;
                globalLayers.shadowCastWidget.visibleElements.tooltip = false;
            }
            globalLayers.toggleshadowCast = false
        }
    },
    add3DGraphicLayer: async function () {
        if (this.graphic3dLayers) {
            this.view?.map.add(this.graphic3dLayers)
        }
    },
    convertSpatialSystem: async function (geometry: Polygon) {
        try {
            const [projection, SpatialReference] = await loadMultipleModules(["esri/geometry/projection", "esri/geometry/SpatialReference"]);
            await projection.load();

            if (geometry.spatialReference.wkid === 4326) {
                return this.removeZfromRings(geometry);
            } else {
                const outSpatialReference = new SpatialReference({ wkid: 4326 });
                const convertedGeometry = projection.project(geometry, outSpatialReference);
                return this.removeZfromRings(convertedGeometry);
            }
        } catch (error) {
            // Handle any errors that might occur during module loading or projection
            console.error("Error converting spatial system:", error);
            return null;
        }
    },
    convertCoordinateSystem: async function (geometry: Polygon, outputwkid: 102100 | 4326 ) {
        try {
            if (geometry.spatialReference.wkid === outputwkid) {
                return geometry;
            } else {
                const outSpatialReference = new SpatialReference({ wkid: 102100 });
                const convertedGeometry = projection.project(geometry, outSpatialReference);
                return convertedGeometry as Geometry;
            }
        } catch (error) {
            // Handle any errors that might occur during module loading or projection
            console.error("Error converting spatial system:", error);
            return null;
        }
    },
    removeZfromRings: function (geometry: Polygon) {
        if(geometry.type !== 'polygon') return;
        const newRings = geometry.rings.map((ring) => {
            return ring.map((item) => [item[0], item[1]]);
        });
        geometry.rings = newRings;
        return geometry as Polygon;

    },
    updateGeomrtyRingswithTilt: function (graphic: Graphic, ring: number[][], pointGeometry: Point, centerLong: number, geometry: Polygon, centerLat: number) {
        for (let i = 0; i < ring.length; i++) {
            let long = ring[i][0];
            let lat = ring[i][1];
            // let heig = pointGeometry?.z;
            if (graphic.attributes?.type === "circle" || graphic.attributes?.title === "select-rectangle") {
                geometry.rings[0][i][2] = 0;
            } else {
                if (centerLong > long) {
                    geometry.rings[0][i][2] = 0;
                } else if (centerLat < lat) {
                    geometry.rings[0][i][2] = 0 - 10;
                    // return 'left';
                } else {
                    geometry.rings[0][i][2] = 0 - 10;
                    // return 'same';
                }
            }
        }
        return geometry;

    },
    removeButtonEvents: function () {
        Object.entries(this.sketchButton)
            .forEach(items => {
                if (items && items[1] !== null) {
                    if(typeof(items[1]) !== "string") {
                        const btnEle = items[1] as HTMLElement;
                        
                    }
                }
            })
    },
    removePolyLineswithTitle: function (title: string | string[], type?: string) {
        let removeGraphics = [] as Graphic[]
        if (this.lastactiveTool === "circle") return
        this.sketchLayers?.graphics.forEach((graphic: any) => {
            if (typeof (title) === "string") {
                if (graphic.title?.trim() === title?.trim() && (graphic.geometry.type === "polyline" || graphic.geometry.type === "point")) {
                    removeGraphics.push(graphic)
                }
            } else {
                if (title.includes(graphic?.title?.trim()) && (graphic.geometry.type === "polyline" || graphic.geometry.type === "point")) {
                    removeGraphics.push(graphic)
                }
            }
        });

        if (removeGraphics.length) {
            this.sketchLayers?.graphics.removeMany(removeGraphics)
        }

        // console.log(this.sketchLayers?.graphics)
    },
    togglePolyline: function (title: string, toggle: boolean) {
        if (this.sketchVM.state === "ready") {
            this.sketchLayers?.graphics.forEach((ele: any) => {
                if (ele.title === title && ele.geometry.type !== 'polygon') {
                    ele.visible = toggle
                }
            })
        }
        this.sketchLayers?.graphics.forEach((ele: any) => {
            if (!ele) return;
            if (ele.title === title && ele.geometry.type !== 'polygon') {
                ele.visible = toggle
            }
        })
    },
    // Function to go to a specific location with support for cancellation
    goToLocation: async function (center: [number, number], zoom?: number) {
        this.signalController = new AbortController();
        const signal = this.signalController.signal;

        try {
            await this.view?.goTo({ center, zoom }, { signal, duration: 5000 });
        } catch (error: any) {
            if (typeof error === 'object' && error.name !== "AbortError") {
                console.error(error);
            }
        }
        return this.signalController; // Return the controller so we can call abort on it
    },
    removeLocationGraphic: function () {
        if(!this.graphicLayerLocation) return null;
        this.graphicLayerLocation?.graphics.forEach(graphic => {
            if (graphic.attributes && graphic.getAttribute('name') === LocationMarker) {
                this.graphicLayerLocation?.graphics.remove(graphic)
            }
            if (graphic.attributes && graphic.getAttribute('title') === LocationMarker) {
                this.graphicLayerLocation?.graphics.remove(graphic)
            }
        })

    },
    getGraphicbyUID: function (uid: number): Graphic | null {
        let foundGraphic: Graphic | null = null;
        if(!Object.keys(this.sketchLayers).length) return null;
        this.sketchLayers.graphics.forEach(graphic => {
            if ((graphic as any).uid === uid) {
                foundGraphic = graphic;
            }
        });
        if (!foundGraphic) {
            if (this.previouslyDrawnPolygon === null) {
                foundGraphic = null
            } else foundGraphic = this.previouslyDrawnPolygon
        }
        return foundGraphic;
    },
    getGraphicbyItsName: function (name: string): Graphic | null {
        let foundGraphic: Graphic | null = null;
        if(Object.keys(this.sketchLayers).length === 0) return null;
        if(this.sketchLayers.graphics.length === 0) return null;
        try {
            this.sketchLayers.graphics.forEach(graphic => {
                if (graphic.attributes && (graphic.getAttribute('name') as string).includes(name)) {
                    foundGraphic = graphic;
                }
            });
            
        } catch (error) {
            console.error(`Grpahic by this name ${name}, not found.` )
        }
        return foundGraphic;
    },
    // to remove the graphic by it's name
    removeGraphicbyName: function (name: string): Graphic[] {
        let foundGraphic: Graphic[] = [];
        this.sketchLayers.graphics.forEach(graphic => {
            if (graphic.attributes && (graphic.getAttribute('name') as string).includes(name)) {
                foundGraphic.push(graphic)
                // this.sketchLayers.graphics.remove(graphic)
                // graphic.destroy();
            }
        });
        if (foundGraphic) {
            
            this.sketchLayers.graphics.removeMany(foundGraphic)
        }
        return foundGraphic;
    },
    graphicLayerLocationRemove: function(){
        if(this.graphicLayerLocation?.graphics.length){
            this.graphicLayerLocation?.graphics.removeAll()
        }
    },
    hideGrpahicByName: function (name: string){
        this.sketchLayers.graphics.forEach(graphic => {
            if (graphic.attributes && (graphic.getAttribute('name') as string).includes(name)) {
                graphic.visible = false
                // this.sketchLayers.graphics.remove(graphic)
                // graphic.destroy();
            }
        })
    },
    showGrpahicByName: function (name: string){
        this.sketchLayers.graphics.forEach(graphic => {
            if (graphic.attributes && (graphic.getAttribute('name') as string).includes(name)) {
                graphic.visible = true
                // this.sketchLayers.graphics.remove(graphic)
                // graphic.destroy();
            }
        })
    },
    showParapetGrpahicByName: function (name: string){
        const parapetwalls = this.getGraphicbyItsName(name)
        if(parapetwalls){
            for (let index = 0; index < this.sketchLayers.graphics.length; index++) {
                const graphic = this.sketchLayers.graphics.getItemAt(index);
                if (graphic.attributes && (graphic.getAttribute('name') as string).includes(name)) {
                    // graphic.visible = true
                    this.sketchLayers.graphics.remove(graphic)
                }
            }
        }
        createParapetWall(this.parapetwall)
    },
    // to update the attributes of the graphics
    updateGraphicbyName: function (name: string, attributes: any): Graphic | null {
        let foundGraphic: Graphic | null = null;
        this.sketchLayers.graphics.forEach(graphic => {
            if (graphic.attributes && graphic.getAttribute('name') === name) {
                graphic.attributes = { ...graphic.attributes, ...attributes }
            }
        });
        return foundGraphic;
    },
    // to select the graphic by it's name
    selectGraphicbyName: function (name: string): Graphic | null {
        let foundGraphic: Graphic | null = null;
        this.sketchLayers.graphics.forEach(graphic => {
            if (graphic.attributes && (graphic.getAttribute('name') as string).includes(name)) {
                foundGraphic = graphic;
                // globalLayers.sketchViewModel_Draw.update(graphic)
            }
        });
        return foundGraphic
    },
    enableUpdateonGraphicByName: function (name: string): Graphic | null {
        let foundGraphic: Graphic | null = null;
        this.sketchLayers.graphics.forEach(graphic => {
            if (graphic.attributes && (graphic.getAttribute('name') as string).includes(name)) {
                foundGraphic = graphic;
                globalLayers.sketchViewModel_Draw.update(graphic)
            }
        });
        return foundGraphic
    },
    removeLocationMarker: function () {
        if (!this.graphicLayerLocation) return;
        this.graphicLayerLocation.graphics.forEach((graphic) => {
            if (graphic.attributes && graphic.getAttribute("name") === LocationMarker) {
                globalLayers.graphicLayerLocation?.graphics.remove(graphic);
            }
            if (graphic.attributes && graphic.getAttribute("title") === LocationMarker) {
                globalLayers.graphicLayerLocation?.graphics.remove(graphic);
            }
        });
    },
    addStringGraphictoSketch : function(graphic: { geometry: Polygon, attributes: any  }, buildingHeight: number, mmstiltangle: number, mmsazimuthangle: number){
        if (!graphic || !graphic.geometry || !graphic.geometry.rings) {
            console.error("Invalid graphic object provided.");
            return;
        }

        // check if buildingis laready there 
        let alreadyThereBuilding = this.getGraphicbyItsName('build')
        if(alreadyThereBuilding) return;

        // Update polygon geometry to set Z values to 0
        const ring = graphic.geometry.rings.map(points => {
            return points.map(point => {
                return [point[0], point[1], 0];
            });
        });

        const updatedPolygon = new Polygon({
            rings: ring,
            hasZ: true,
            spatialReference: { wkid: 102100 }
        })

        let buildingGraphic;

        try {
            buildingGraphic = new Graphic({
                geometry: updatedPolygon,
                attributes: {
                    ...graphic.attributes,
                    height: buildingHeight ?? 0,
                    buildingheight: buildingHeight ?? 0,
                    tiltAngle: mmstiltangle ?? 0,
                    azimuthAngle: mmsazimuthangle ?? 0,
                    name: 'building' + Math.random() * 100
                },
                symbol: buildingSymbology
            });
        } catch (error) {
            console.error("Error creating building graphic:", error);
            throw new Error('Could not create building graphic.');
        }

        // Ensure the sketch layer exists
        if (Object.keys(this.sketchLayers).length === 0) {
            try {
                this.sketchLayers = new GraphicsLayer({
                    title: "sketch-layer",
                    id: "sketch-layer"
                });
            } catch (error) {
                console.error("Error creating sketch layer:", error);
                throw new Error('Could not create sketch layer.');
            }
        }
        
        try {
            this.sketchLayers.graphics.add(buildingGraphic);
        } catch (error) {
            console.error("Error adding graphic to sketch layer:", error);
            throw new Error('Could not add the graphic to sketch layer.');
        }

        // Attempt to zoom to the new building graphic
        this.view?.goTo(buildingGraphic).then(() => {
            console.log("Zoomed to the buildingGraphic!");

            try {
                globalLayers.removeLocationGraphic();
                globalLayers.removeGraphicbyName(LocationMarker);
            } catch (error) {
                console.error("Error removing location graphics:", error);
            }

        }).catch((error) => {
            console.error("Error zooming to the building graphic:", error);
            try {
                globalLayers.removeLocationGraphic();
                globalLayers.removeLocationMarker();
                globalLayers.removeGraphicbyName(LocationMarker);
            } catch (removeError) {
                console.error("Error removing location graphics after zoom failure:", removeError);
            }
        });
    },
    addKeepoutGraphicstoSketch : function(graphic: { geometry: Polygon, attributes: any  }){
        if(graphic === null) return
        const ring = graphic.geometry.rings.map(points => {
            return points.map(point => {
                return [point[0], point[1], 0]
            })
        })

        const updatedPolygon = new Polygon({
            rings: ring,
            hasZ: true,
            spatialReference: { wkid: 102100 }
        })

        let updateKeepout = new Graphic({
            geometry: updatedPolygon,
            attributes: { ...graphic.attributes
             },
             symbol: InfraSymbology
        });

        if(graphic.attributes && graphic.attributes?.name){
            this.removeGraphicbyName(graphic.attributes?.name);
        }
        this.sketchLayers.graphics.add(updateKeepout);
    },

    goto: function (latitude: number, longitude: number) {
        try {
            if (!this.view) return;
            this.view.goTo({
                center: [longitude, latitude],
                zoom: 20
            })

        }
        catch (e) {
        }
    },

    addWMSLayerBuilding: async function(polygon: Geometry) {
        if(!this.map) return;

        if(this.wmsLayers.baseLayer){
            this.map?.layers.remove(this.wmsLayers.baseLayer)
        }

        // height
        const height = this.selectedRoof.properties.height ? 
                        typeof this.selectedRoof.properties.height === 'string' ? parseInt(this.selectedRoof.properties.height) : 0
                    : 0;
        // first create graphic for basebuilidng 
        // this.wmsLayers.baseBuildingLayer = new Graphic({
        //     geometry: polygon,
        //     symbol: buildingSymbologyHeight(height)
        // })

        this.wmsLayers.baseLayer = new GraphicsLayer({
            title: 'wmslayers'
        });

        // this.wmsLayers.baseLayer.graphics.add(this.wmsLayers.baseBuildingLayer);

        this.map?.layers.add(this.wmsLayers.baseLayer);

    }

}

export default globalLayers;

export const basemapNames = [
    'satellite',
    'hybrid',
    'dark-gray',
    'oceans',
    'national-geographic',
    'terrain',
    'osm',
    'streets-navigation-vector',
    'streets-relief-vector',
    'streets-night-vector',
    'streets-vector',
    'topo-vector',
    'gray-vector',
    'google'
] as const;
export type BasemapName = typeof basemapNames[number];

export const mapLayesNames = [
    'esri',
    'bing'
];
