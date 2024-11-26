import { setInformationModal } from "../../../../ReduxTool/Slice/Map/MapReducer";
import { store } from "../../../../ReduxTool/store/store";
import globalLayers from "../GlobaLMap";
import { addMarkerToMap } from "../LazyloadMap";

export const MapKeyboardEvent = (e: KeyboardEvent) => {
    if(e.key === 'Escape'){
        if(globalLayers.drawState === 'ready'){
            // dispatch any action for active draw after esc key is pressed
            store.dispatch(setInformationModal({state: false,title: "",content: ""}));              
            globalLayers.drawState = '';
            addMarkerToMap(store.dispatch, globalLayers.userCurrentLocation.lat, globalLayers.userCurrentLocation.lng)
        }
    }
    if (e.shiftKey) {
        if (!globalLayers.shiftPressed) {
            globalLayers.shiftPressed = true;
        }
    }
    if(e.ctrlKey){
        globalLayers.keys.ctrlPressed = true
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        globalLayers.keys.keyC = true // for copying the geometry 
        // console.log('object', globalLayers.sketchViewModel_Draw.updateGraphics)
        for (const graphic of globalLayers.multipleSelectedGraphic) {
            let copiedGraphic = graphic.clone();
            copiedGraphic.attributes = { ...copiedGraphic.attributes, name: copiedGraphic.attributes.name + (Math.random() * 0.1)  + '_' + 'copied' }
            // console.log(copiedGraphic, 'copiedGraphic')
            if((copiedGraphic.getAttribute('name') as string).includes('panel')){
                // create a copy of module panel selected 
                globalLayers.createDuplicateSolarPanelGraphic(copiedGraphic)
            } else {
                // globalLayers.createDuplicateGraphic('copyied', []);
    
            }
            
        }
        
       
    }
};
