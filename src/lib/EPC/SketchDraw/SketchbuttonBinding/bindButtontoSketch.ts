import { toast } from "react-toastify";
import { setInformationModal, setIs3dMap, setToolTipModal } from "../../../../ReduxTool/Slice/Map/MapReducer";
import { AppDispatch, store } from "../../../../ReduxTool/store/store";
import { LocationMarker } from "../../../../Utils/Const";
import { pvHandleRoofTop } from "../../../../Utils/EPCMaps/GenerateRoof/GenrateRoof";
import globalLayers from "../../../../Utils/EPCMaps/Maps/GlobaLMap";
import { removeSearchedGraphic } from "../../../../Utils/EPCMaps/Maps/removeSearchedLocationGraphic";
import { buildingBase, switchView } from "../../SwitchingMapLayers/SwitchMap";
import Measurement from "@arcgis/core/widgets/Measurement";
import { setResetRoof } from "../../../../ReduxTool/Slice/Partner/EPC";
import { getScreenShot } from "../../../ScreenShot/getScreenShot";
import { toggleDrawer } from "../../../../ReduxTool/Slice/Drawer/DrawerReducer";


export const bindButtontoSketchObject = async (dispatch?: AppDispatch) => {
    const { sketchButton, sketchViewModel_Draw } = globalLayers;

    sketchButton.select = document.getElementById("selectButton");
    sketchButton.polygonEPC = document.getElementById("polygon");
    sketchButton.rectangle = document.getElementById("rectangle");
    sketchButton.delete = document.getElementById("delete_layer");
    sketchButton.polyline = document.getElementById("bigPolyline");
    sketchButton.circle = document.getElementById("circle");
    sketchButton.refresh = document.getElementById("refresh-map");
    sketchButton.measurement = document.getElementById("measurement");
    sketchButton.featureAdd = document.getElementById("featureAdd");
    const flipGeometry = document.getElementById("flip") as HTMLElement;

    sketchButton.scale = document.getElementById("scale") as HTMLSpanElement;

    var drawPanles = document.getElementById("panel") as HTMLElement;

    // shadow button 
    sketchButton.shadow = document.getElementById("shadow");
    sketchButton.shadow?.addEventListener('click', e => {
        if (globalLayers.toggleshadowCast) {
            globalLayers.shadowCast('remove')
        } else {
            globalLayers.shadowCast('add')
        }
    })

    // zoom button's
    sketchButton.zoomIn = document.getElementById("zoomIn");
    sketchButton.zoomOut = document.getElementById("zoomOut");

    // bind footer lat and lng to global objecr
    globalLayers.footers.lat = document.getElementById('footer-lat')
    globalLayers.footers.lng = document.getElementById('footer-lng')

    // skyline 
    document.getElementById('skyline')?.addEventListener('click', async e => {
        globalLayers.lastactiveTool = 'skyline'
        sketchViewModel_Draw.create("polygon");
    })

    // skyline 
    document.getElementById('tank')?.addEventListener('click', async e => {
        globalLayers.lastactiveTool = 'circle'
        sketchViewModel_Draw.create('circle');
    })

    // pipeline 
    document.getElementById('pipeline')?.addEventListener('click', async e => {
        globalLayers.lastactiveTool = 'pipeline'
        sketchViewModel_Draw.create('polyline');
    })

    // draw ppolygon for existing solar modules 
    document.getElementById('solarmodule')?.addEventListener('click', async e => {
        globalLayers.sketchViewModel_Draw.complete();
        globalLayers.lastactiveTool = 'solarmodule'
        sketchViewModel_Draw.create('polygon');
    })

    // // switching view
    // document.getElementById('3d_view')?.addEventListener('click', async e => {
    //     if(!globalLayers.getGraphicbyItsName(buildingBase)) return;
    //     if (globalLayers.activeView === '2D') {
    //         globalLayers.activeView = '3D';
    //         store.dispatch(
    //             setInformationModal({
    //               state: true,
    //               title: "Mode Switch",
    //               content: `You are currently in 3D mode. Please switch to 2D mode to enable editing.`,
    //             })
    //           );

    //         if(globalLayers.sketchViewModel_Draw.activeTool){
    //             globalLayers.sketchViewModel_Draw.cancel()
    //         }
    //         store.dispatch(setIs3dMap(true));
    //         const inp = globalLayers.searchWidgetInput;
    //         if(inp && inp.container.querySelector(".esri-search__input")){
    //             inp.container.querySelector(".esri-search__input").disabled = true;      
    //         }
    //         globalLayers.sketchViewModel_Draw.cancel()
    //     } else {
    //         globalLayers.activeView = '2D';
    //         store.dispatch(setIs3dMap(false));
    //         store.dispatch(setInformationModal({ state: false, title: "", content: "" }));
    //         const inp = globalLayers.searchWidgetInput;
    //         if(inp && inp.container.querySelector(".esri-search__input")){
    //             inp.container.querySelector(".esri-search__input").disabled = false;      
    //         }
    //     }
    //     if(!globalLayers.sketchLayers.graphics.length) return;
    //     await switchView(globalLayers.activeView)
    // })


    sketchButton.polygonEPC?.addEventListener("click", () => {
        if(globalLayers.sketchViewModel_Draw.activeTool === 'polygon'){
            globalLayers.sketchViewModel_Draw.cancel()
        }
        globalLayers.lastactiveTool = 'building';
        globalLayers.removeLocationGraphic()
        const buildingGraphic = globalLayers.getGraphicbyItsName('building')
        if (buildingGraphic) {
            globalLayers.enableUpdateonGraphicByName(buildingBase)
        } else {
            globalLayers.selectionTool = ''
            let name = 'poly' + globalLayers.polygonListCounts.length
            globalLayers.polygonListCounts.push(name)
            // globalLayers.polygonListCounts[index] = name
            sketchViewModel_Draw.create("polygon");
            globalLayers.height = 0
            removeSearchedGraphic()
        }
    })

    // create reactagne event
    sketchButton.rectangle?.addEventListener("click", () => {
        globalLayers.lastactiveTool = 'rectangle'
        sketchViewModel_Draw.create("rectangle");
    })

    sketchButton.circle?.addEventListener("click", () => {
        globalLayers.selectionTool = ''
        globalLayers.lastactiveTool = 'circle'
        sketchViewModel_Draw.create("circle");
        let name = 'circle' + globalLayers.polygonListCounts.length
        globalLayers.polygonListCounts.push(name)
    })

    // create selection 
    sketchButton.select?.addEventListener("click", () => {
        sketchViewModel_Draw.create("rectangle");
    })

    // refresh the layesr 
    sketchButton.refresh?.addEventListener("click", () => {
        
        globalLayers.selectionTool = '';
        globalLayers.LocationMarkerPointGraphic = null;
        globalLayers.graphicLayerLocation?.graphics.removeAll();
        globalLayers.sketchLayers?.graphics.removeAll();
        globalLayers.sketchViewModel_Draw.cancel();
        if (globalLayers.measurement) {
            globalLayers.measurement.clear();
        }
        if(dispatch){
            dispatch(setResetRoof())
        }
    });

    // delete the layer 
    sketchButton.delete?.addEventListener("click", () => {
        if (sketchViewModel_Draw.updateGraphics.length > 0) {
            globalLayers.deleteSelectedGraphics()
            globalLayers.selectedGraphic = null;
        } else {
            console.log("No selected layer found.");
        }
        if (globalLayers.measurement) {
            globalLayers.measurement.clear();
        }
    });

    // enable measurement
    sketchButton.measurement?.addEventListener('click', () => {
        globalLayers.selectionTool = ''
        if (globalLayers.measurement) {
            // Clear any existing measurement
            globalLayers.measurement.clear();
            
            // Set the active tool to 'direct-line' to start a new measurement
            // console.log(globalLayers.measurement)
            globalLayers.measurement.activeTool = 'direct-line';
            // console.log(globalLayers.measurement)
        }
    })

    // zoom in & out button's
    sketchButton.zoomIn?.addEventListener('click', () => {
        try{
            // globalLayers.zoomInButton()
            if (globalLayers.view) {
                globalLayers.view?.goTo({
                    zoom: globalLayers.view.zoom + 1
                });
                globalLayers.currentZoomLevel = globalLayers.view.zoom + 1;
                (document.getElementById("zoomDiv") as HTMLSpanElement).innerText = globalLayers.currentZoomLevel.toFixed(2)
            }
        }
        catch(e){
        }
    })

    sketchButton.zoomOut?.addEventListener('click', () => {
        try{
       
        if (globalLayers.view) {
            if (globalLayers.view.zoom <= 3) return;
            globalLayers.view.goTo({
                zoom: globalLayers.view.zoom - 1
            });
            globalLayers.currentZoomLevel = globalLayers.view.zoom - 1;
            (document.getElementById("zoomDiv") as HTMLSpanElement).innerText = globalLayers.currentZoomLevel.toFixed(2)
        }
             
    }
    catch(e){

    }
    })

    // feature add button 
    sketchButton.featureAdd?.addEventListener('click', (e) => {
        globalLayers.featureAddState = 'active'
        sketchViewModel_Draw.complete()
    })

    document.getElementById("deleteGraphic")?.addEventListener('click', (e) => {
        globalLayers.featureAddState = 'delete';
    })

    document.getElementById("selectGraphic")?.addEventListener('click', (e) => {
        globalLayers.featureAddState = 'select';
        // console.log(globalLayers.featureAddState)
        sketchViewModel_Draw.complete();
    })

    // to place panels on the drawn polygon 
    // drawPanles.addEventListener('click', async () => {
    //     if (globalLayers.previouslyDrawnPolygon) {
    //         globalLayers.attribute = globalLayers.previouslyDrawnPolygon.attributes
    //         await pvHandleRoofTop(globalLayers.previouslyDrawnPolygon.geometry, globalLayers.elevationP, 'title')
    //     }
    // })

    flipGeometry?.addEventListener('click', () => {
        globalLayers.flipSelectedGraphic()
    })

    globalLayers.removeButtonEvents()
}
