import Graphic from "@arcgis/core/Graphic";
import Map from "@arcgis/core/Map";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";
import BingMapsLayer from "@arcgis/core/layers/BingMapsLayer.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import MapView from "@arcgis/core/views/MapView";
import SceneView from "@arcgis/core/views/SceneView";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import Editor from "@arcgis/core/widgets/Editor.js";
import Search from "@arcgis/core/widgets/Search.js";
import ShadowCast from "@arcgis/core/widgets/ShadowCast.js";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import SnappingControls from "@arcgis/core/widgets/support/SnappingControls.js";
import axios from "axios";
import { loadModules, setDefaultOptions } from "esri-loader";
import { ProjectTy } from "../../../ReduxTool/Slice/Auth/types";
import { newPos, setInformationModal, setMarkerState, setRightClick, setShowInfoModal, setToolTipModal, TCopyState, toggleRoofConfirmBtn } from "../../../ReduxTool/Slice/Map/MapReducer";
import { setLocationPinLatLng } from "../../../ReduxTool/Slice/Marker/MarkersReducer";
import { setSearchedLocationLatLong, setSerachedLocation } from "../../../ReduxTool/Slice/Partner/EPC";
import { AppDispatch } from "../../../ReduxTool/store/store";
import { changeLocationMarker } from "../../../lib/EPC/MarkersFunctions/changeLocationMarker";
import { IUpdateEvent, LocationMarker } from "../../Const";
import { fetchCompleteAddressStr, getfilterObjKeysByArr } from "../../commonFunctions";
import { getSymbol, LocationMarkerWhiteSymbol, markerSymbol } from "../Markers/MarkerSymbols";
import globalLayers from "./GlobaLMap";
import { loadEsriModules } from "./getEsriModules";
import { toast } from "react-toastify";

setDefaultOptions({ css: true });

export const loadMultipleModules = async (moduleNames: string[]) => {
    const loadedModules = await loadModules(moduleNames);
    return loadedModules;
};
export const getCustomSearchSource = async (): Promise<__esri.SearchSource> => {
    const [SearchSource] = await loadMultipleModules(["esri/widgets/Search/SearchSource"]);
    const searchSource = new SearchSource();
    searchSource.placeholder = "Enter Address"; // Change the placeholder text

    return searchSource;
};
// epc used
// Function to get the state name from coordinates
export const getStateFromCoordinates = async (longitude: number, latitude: number) => {
    try {
        const [locator, Point] = await loadEsriModules(['esri/rest/locator', 'esri/geometry/Point'])
        let url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        const point = new Point({
            longitude: longitude,
            latitude: latitude
        })

        // Use the locator to reverse geocode the coordinates
        const result = await (locator as __esri.locator).locationToAddress(url, {
            location: point
        });

        if (result && result.address && result.address) {
            // Access the state (Region) name
            const stateName = result.attributes.Region;
            return stateName;
        } else {
            console.warn("State name not found for the given coordinates.");
            return null;
        }
    } catch (error) {
        console.error("Error getting state name:", error);
        return null;
    }
};
export const getCityFromCoordinates = async (longitude: number, latitude: number) => {
    try {
        const [locator, Point] = await loadEsriModules(['esri/rest/locator', 'esri/geometry/Point'])
        let url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        const point = new Point({
            longitude: longitude,
            latitude: latitude
        })

        // Use the locator to reverse geocode the coordinates
        const result = await (locator as __esri.locator).locationToAddress(url, {
            location: point
        });

        if (result && result.address && result.address) {
            // Access the state (Region) name
            const stateName = result.attributes?.MetroArea ? result.attributes.MetroArea : result.attributes?.CntryName;
            return stateName;
        } else {
            console.warn("State name not found for the given coordinates.");
            return null;
        }
    } catch (error) {
        console.error("Error getting state name:", error);
        return null;
    }
};

type loadMapProps = {
    SceneView: SceneView;
    Map: Map;
    Search: Search;
    GraphicsLayer: GraphicsLayer;
    MapView: MapView;
    Editor: Editor;
    SnappingControls: SnappingControls;
    reactiveUtils: any;
    GroupLayer: GroupLayer;
    Sketch: any;
    GeoJSONLayer: GeoJSONLayer;
    Polygon: Polygon;
    BingMapsLayer: BingMapsLayer;
    BasemapToggle: BasemapToggle;
}

export const lazyLoadArcGisMapModules = async (): Promise<loadMapProps> => {
    const [SceneView, Map, Search, GraphicsLayer, MapView, Editor, SnappingControls, reactiveUtils, GroupLayer, Sketch, GeoJSONLayer, Polygon, BingMapsLayer, BasemapToggle] = await loadMultipleModules(["esri/views/SceneView", "esri/Map", "esri/widgets/Search", "esri/layers/GraphicsLayer", "esri/views/MapView", "esri/widgets/Editor", "esri/widgets/support/SnappingControls", 'esri/core/reactiveUtils', 'esri/layers/GroupLayer', 'esri/widgets/Sketch', 'esri/layers/GeoJSONLayer', 'esri/geometry/Polygon', 'esri/layers/BingMapsLayer', "esri/widgets/BasemapToggle"]);
    return { SceneView, Map, Search, GraphicsLayer, MapView, Editor, SnappingControls, reactiveUtils, GroupLayer, Sketch, GeoJSONLayer, Polygon, BingMapsLayer, BasemapToggle };
}

export const searchWidget = async (view: SceneView) => {
    globalLayers.searchWidgetInput = new Search({
        view: view,
        container: "searchDiv",
        allPlaceholder: "Enter Address",
        includeDefaultSources: true,
        sources: [{}],
        icon: "redo",
    })
    return globalLayers.searchWidgetInput;
};

export const searchWidget_setup = async (dispatch: AppDispatch) => {
    if (globalLayers.view) {
        if (globalLayers.projectSearch) {
            globalLayers.projectSearch = null
        } else {
            globalLayers.projectSearch = new Search({
                view: globalLayers.view,
                container: "projectInput_searchloaction1",
                // title: 'project_search',
                allPlaceholder: "Enter Address",
                includeDefaultSources: true,
                sources: [{}],
                icon: "redo"
            });
            searchEventHandler(globalLayers.projectSearch, dispatch, globalLayers.view)

        }
    }
    // globalLayers.map?.add(globalLayers.projectSearch)
    return globalLayers.projectSearch;
};

// epc used
export const AddSearchWidget = async (view: SceneView, dispatch: AppDispatch, rightClick: TCopyState) => {
    // searchWidget(view, "projectInput_searchloaction1")
    const widget = await searchWidget(view)
    if (!widget) {
        console.warn("Search widget coould not attached.")
        return
    }
    setTimeout(() => {
        const searchInput = widget?.container?.querySelector(".esri-search__input");
        if (searchInput) {
            searchInput.focus(); // Activate the focus on the search input
        }
    }, 2000);

    if (globalLayers.view?.graphics.length) {
        globalLayers.view?.graphics.forEach(ele => {
            if (ele.symbol.type === "point-3d" && (ele.symbol as any).title === "pin") {
                globalLayers.view?.graphics.remove(ele);
            }
        })
    }

    widget.allSources.on("after-add", (ele: any) => {
        ele.item.resultSymbol = {
            type: "point-3d",  // autocasts as new PointSymbol3D()
            symbolLayers: [{
                type: "icon",  // autocasts as new IconSymbol3DLayer()
                size: 0,  // points
                resource: { href: "" },
                material: { color: "#FF881B" }
            }],
            title: 'pin'
        };
    });

    // dispatch(
    //     setInformationModal({
    //       state: true,
    //       title: "Search Location/Add Marker",
    //       content: `Search your address or right click on the map to confirm the desired roof.`,
    //     })
    //   );
    searchEventHandler(widget, dispatch, view, rightClick)
}

export const getGraphicLayer = () => {
    return new GraphicsLayer();
}



const searchEventHandler = (widget: any, dispatch: AppDispatch, view: __esri.SceneView, rightClick?: TCopyState) => {
    widget.on("search-complete", (event: __esri.SearchSearchCompleteEvent) => {
        if(globalLayers.sketchButton.rightbuttonMarkerState === 'start' || globalLayers.sketchButton.rightbuttonMarkerState === 'ongoing'){
            dispatch(setRightClick('completed'))
        }
        let layer = globalLayers.sketchLayers;
        let grap = globalLayers.selectedGraphic;
        let selectedProject = globalLayers.currentSelectedProject;

        if(globalLayers.sketchLayers?.graphics.length){
            globalLayers.sketchLayers?.graphics.removeAll()
        }

        
        if (selectedProject.length) {
            globalLayers.sketchLayers?.graphics.forEach(ele => {
                if (ele.attributes && ele.attributes?.title === "roofboundry") {
                    globalLayers.sketchLayers?.graphics.remove(ele);
                }
            })

            // commented for consumer reducer
            // dispatch(setnewAddress(event.searchTerm))
        }
        
        if (event.searchTerm) {
            dispatch(setSerachedLocation(event.searchTerm))
        }
        // dispatch(setTitle("projectsetup"))
        dispatch(setInformationModal({ state: true, title: "Great Job!", content: "You've reached at your selected destination. Now, simply click on the marker or click new roof button." }))
        // dispatch(toggleDrawer(true))

        dispatch(setToolTipModal({ state: true, title: "Locate Roof", content: `Please locate your roof by moving the marker to its exact position on the map. Your input will assist us in accurately identifying your roof. Your confirmation is essential for accurate record-keeping.`}))

        const searchResult = event.results[0] as __esri.SearchSearchCompleteEventResults
        console.log(searchResult.results, 'searchResult.results')
        if (searchResult.results.length > 0) {
            if (event.searchTerm === '') {
                dispatch(setSerachedLocation(searchResult.results[0].name))
            }
            const extent = (searchResult.results[0].feature.geometry as Point)
            const lat = extent.latitude;
            const lng = extent.longitude;
            dispatch(setSearchedLocationLatLong({lat:lat,lng:lng}));
            // dispatch(setLatlng({ lat, lng })) // commented for consumer reducer

            const point = {
                type: "point",
                longitude: lng,
                latitude: lat,
            } as any;
                 
                    
            let pointGraphic = new Graphic({
                geometry: webMercatorUtils.geographicToWebMercator(point),
                symbol: LocationMarkerWhiteSymbol as any,
                attributes: {
                    title: LocationMarker
                }
            });

            globalLayers.LocationMarkerPointGraphic = pointGraphic;
            globalLayers.removeLocationGraphic()
            globalLayers.graphicLayerLocation?.graphics.addMany([pointGraphic]);

            if(globalLayers.sketchViewModel){
                globalLayers.sketchViewModel.destroy();    
                globalLayers.sketchViewModel = null;
            }
            
            if(globalLayers.sketchViewModel === null){
                globalLayers.sketchViewModel = new SketchViewModel({
                    view,
                    layer: globalLayers.graphicLayerLocation!,
                    updateOnGraphicClick: true,
                    // multipleSelectionEnabled: true,
                    defaultUpdateOptions: {
                        toggleToolOnClick: true,
                        tool: "reshape",
                    }
                });
                
            }

            try {
                globalLayers.view?.goTo(pointGraphic)
                
            } catch (error) {
                
            }


            const handlePosition = (event: MouseEvent) => {
                globalLayers.lastCursorPositionSelected = { x: event.offsetX, y: event.offsetY };
                dispatch(newPos(globalLayers.lastCursorPositionSelected!))
            }
            document.addEventListener("mouseup", (event) => handlePosition(event));
            SearchViewModal(dispatch, handlePosition)

        } else {
            toast.warn('Something went wrong while fecthing the location.')
        }

    })

    globalLayers.graphicLayerLocation?.graphics.on("change", (element: any) => {
try{
        if (element?.target && element.target?._items?.length) {
            let geometry = element.target?._items[0].geometry;
            setTimeout(() => {
                if(globalLayers.sketchButton.rightbuttonMarkerState === 'ongoing') return
                //    console.log(globalLayers.graphicLayerLocation?.graphics, 'graphics')
                globalLayers.view?.goTo({
                    center: [geometry?.longitude, geometry?.latitude],
                    zoom: 20
                })
            })
        }     
    }
    catch(e){

    }
    })

}


export const SearchViewModal = (dispatch: AppDispatch, handlePosition: (event: MouseEvent) => void) => {
    (globalLayers.sketchViewModel as any)?.on('update', function (event: IUpdateEvent) {
        if (event.state === "start") {
            dispatch(toggleRoofConfirmBtn(true));
            dispatch(setInformationModal({ state: true, title: "Locate Roof", content: "Move the marker to precisely locate your roof on the map." }))
            // dispatch(setLatlng({ lat: event.graphics[0].geometry.latitude, lng: event.graphics[0].geometry.longitude })); // commented for consumer reducer
            dispatch(setLocationPinLatLng({ lat: event.graphics[0].geometry.latitude, lng: event.graphics[0].geometry.longitude }));
            // getAddressFromPinDropCoordinates(event.graphics[0].geometry.longitude, event.graphics[0].geometry.latitude).then(
            //     (searchAddress: any) => {
            //         dispatch(setSerachedLocation(searchAddress))
            //     }
            // );
            
            fetchCompleteAddress(event.graphics[0].geometry.latitude, event.graphics[0].geometry.longitude,true)
            .then((addr:any) => dispatch(setSerachedLocation(addr)))
        }
        if (event.toolEventInfo) {
            changeLocationMarker(event, markerSymbol)
            if (event.toolEventInfo.type === "move") {
                if (globalLayers.markerState !== 'move') {
                    globalLayers.markerState = 'active';
                    dispatch(setMarkerState('locate'))
                    dispatch(setShowInfoModal(true))
                }
            }
            // 
            if (event.toolEventInfo.type === "move-stop") {
                console.log('object', event.state, 'lazyload')
                dispatch(setMarkerState('confirm'));
                globalLayers.latitude = event.graphics[0].geometry.latitude;
                globalLayers.longitude = event.graphics[0].geometry.longitude;
                globalLayers.RemoveLayer('GeoJson');
                globalLayers.showRoofSelectionBtn = true;
                dispatch(toggleRoofConfirmBtn(true));
                // dispatch(setLatlng({ lat: event.graphics[0].geometry.latitude, lng: event.graphics[0].geometry.longitude })); // commented for consumer reducer
                dispatch(setLocationPinLatLng({ lat: event.graphics[0].geometry.latitude, lng: event.graphics[0].geometry.longitude }));
                getAddressFromPinDropCoordinates(event.graphics[0].geometry.longitude, event.graphics[0].geometry.latitude).then(
                    (searchAddress: any) => {
                        dispatch(setSerachedLocation(searchAddress))
                    }
                );
                document.removeEventListener('click', (e) => handlePosition(e));
                globalLayers.sketchViewModel?.cancel()
            }
        }

    });
}

export const addDrawEvents = async (view: SceneView, dispatch: AppDispatch): Promise<SceneView> => {
    globalLayers.changeView = document.getElementById("changeActiveView");
    globalLayers.addSketchDraw();
    return view
}

export const addMeasurementTools = async (view: SceneView) => {
};

export const renderer = {
    type: "unique-value", // autocasts as new UniqueValueRenderer()
    defaultSymbol: getSymbol("#FFFFFF"),
    defaultLabel: "Other",
    field: "TYPE",
    visualVariables: [
        {
            type: "size",
            field: "Max_Elev_F"
        }
    ]
};

export const addFeatureLayer = async (lat?: number, lng?: number) => {
    if (!globalLayers.featureLayers.layerlist) {
        // globalLayers.featureLayers.layerlist = new LayerList({
        //     view: globalLayers.view!,
        //     id: 'Layers'
        // });
    }
    if(!globalLayers.roofGroupLayer){
        // globalLayers.roofGroupLayer = new GroupLayer({
        //     title: "US Demographics",
        //     visible: true,
        //     visibilityMode: "exclusive",
        //     layers: [  globalLayers.sketchLayers],
        //     opacity: 1,
        // })

        // globalLayers.map?.layers.add(globalLayers.roofGroupLayer);
    }
};

export const getShadowCastWidget = async () => {
    globalLayers.shadowCastWidget = new ShadowCast({
        view: globalLayers.view!,
    })
};

export const addMarkerToMap = async (dispatch: AppDispatch, lat: any, lng: any, selectedProject?: ProjectTy) => {

    const point = {
        type: "point",
        longitude: lng,
        latitude: lat,
    } as any;

    let pointGraphic = new Graphic({
        geometry: webMercatorUtils.geographicToWebMercator(point),
        symbol: LocationMarkerWhiteSymbol as any,
        attributes: {
            title: LocationMarker
        }
    });


    globalLayers.LocationMarkerPointGraphic = pointGraphic;

    // globalLayers.graphicLayerLocation?.graphics.forEach((ele: Graphic) => {
    //     if (ele.attributes && ele.getAttribute('title') === LocationMarker) {
    //         globalLayers.graphicLayerLocation?.graphics.remove(ele);
    //     }
    // });
    globalLayers.removeLocationGraphic()

    if(!globalLayers.graphicLayerLocation){
        globalLayers.graphicLayerLocation = new GraphicsLayer({
            id: LocationMarker,
            title: LocationMarker
        });
    }

    globalLayers.graphicLayerLocation?.graphics.addMany([pointGraphic]);

    if(globalLayers.sketchViewModel){
        globalLayers.sketchViewModel.destroy();    
        globalLayers.sketchViewModel = null;
    }

    if(globalLayers.sketchViewModel === null){
        globalLayers.sketchViewModel = new SketchViewModel({
            view: globalLayers.view!,
            layer: globalLayers.graphicLayerLocation!,
            updateOnGraphicClick: true,
            defaultUpdateOptions: {
                toggleToolOnClick: true,
                tool: "reshape",
            }
        });
    }
   

    dispatch(setToolTipModal({ state: true, title: "Great Job!", content: "You've reached at your selected destination. Now, simply click on the marker or click new roof button." }))
    const handlePosition = (event: MouseEvent) => {
        globalLayers.lastCursorPositionSelected = { x: event.offsetX, y: event.offsetY };
        dispatch(newPos(globalLayers.lastCursorPositionSelected!))
    }
    document.addEventListener("mouseup", (event) => handlePosition(event));
    SearchViewModal(dispatch, handlePosition);

    if(globalLayers.isDone){
        setTimeout(() => {
            globalLayers.removeLocationGraphic();
            globalLayers.removeLocationMarker();
        },1500)
    }

  
};

export const getAddressFromPinDropCoordinates = async (longitude: number, latitude: number) => {
    try {
        const locator  = await import('@arcgis/core/rest/locator.js')
        // Create a new Locator instance
        let url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";
        const point = new Point({
            longitude: longitude,
            latitude: latitude
        });
        // Use the locator to reverse geocode the coordinates
        const result = await locator.locationToAddress(url, {
            location: point
        });
        if (result && result.address && result.address) {
            const matchAddressName = result.attributes.Match_addr;
            return matchAddressName;
        } else {
            console.warn("Region name not found for the given coordinates.");
            return null;
        }
    } catch (error) {
        console.error("Error getting region name:", error);
        return null;
    }
};

export const fetchCountryNamefromLatLng = async (lat: number, long: number) => {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${long},${lat}&outSR=4326&f=json`;
    try {
        const response = await axios.get(url);
        if (response.data && response.data.address && response.data.address.CntryName) {
            const country = response.data.address.CntryName;
            return country;
        } else {
            console.log('Country not found');
        }
    } catch (error) {
        console.error('Error fetching country:', error);
        console.log('Error fetching country');
    }
};


export const getCoordinatesFromAddress = async (address: string) => {
    try {
        const [locator] = await loadEsriModules(['esri/rest/locator']);
        let url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";
        // Use the locator to geocode the address
        const results = await (locator as __esri.locator).addressToLocations(url, {
            address: { SingleLine: address },
            maxLocations: 1
        });
        if (results && results.length > 0) {
            const location = results[0].location;
            const coordinates = {
                latitude: location.y,
                longitude: location.x
            };
            return coordinates;
        } else {
            console.warn("Coordinates not found for the given address.");
            return null;
        }
    } catch (error) {
        console.error("Error getting coordinates:", error);
        return null;
    }
};



export const fetchCompleteAddress = async (lat: number, lng: number,isStringFormat?:boolean,fieldsReq?:any[]) => {
    const url = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?location=${lng},${lat}&outSR=4326&f=json`;
    try {
      const {data} = await axios.get(url);
      if (data && data.address && data.address.CntryName) {
          let addressobj: any = {
              city: data.address.City,
              district: data.address.District,
              state: data.address.Region,
              pincode: data.address.Postal,
              countryAbbr: data.address.CountryCode
          }
        if(fieldsReq){
            addressobj =  getfilterObjKeysByArr(addressobj,fieldsReq);
        }
        if(isStringFormat){ 
            addressobj = fetchCompleteAddressStr(addressobj); // Removes undefined or empty values
        }
        return addressobj;
      } else {
       console.log('Country not found');
      }
    } catch (error) {
      console.error('Error fetching country:', error);
      console.log('Error fetching country');
    }
};
