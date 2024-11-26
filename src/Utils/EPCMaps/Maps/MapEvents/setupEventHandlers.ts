import SceneView from "@arcgis/core/views/SceneView";
import { setMapZoomLevel, setScale, TCopyState, toggleRoofConfirmBtn } from "../../../../ReduxTool/Slice/Map/MapReducer";
import { AppDispatch } from "../../../../ReduxTool/store/store";
import globalLayers from "../GlobaLMap";
import { pointerMove } from "../pointerMove";
import { handleMapClickEvents } from "./MapClickEvent";

/**
 * The function `setupEventHandlers` sets up various event listeners for a SceneView in TypeScript.
 * @param {SceneView} view - The `view` parameter is an instance of the SceneView class, which
 * represents the 3D view of a scene in the ArcGIS API for JavaScript. It is used to display and
 * interact with geographic data in a 3D environment.
 * @param {AppDispatch} dispatch - The `dispatch` parameter is a function that is used to dispatch
 * actions to the Redux store in a Redux application. It is typically provided by the Redux `connect`
 * function when connecting a component to the Redux store. The `dispatch` function takes an action
 * object as an argument and triggers the corresponding reducer
 * @param {boolean} showConfirmBtn - The `showConfirmBtn` parameter is a boolean value that determines
 * whether a confirm button should be displayed in the user interface.
 * @param {any} copyState - The `copyState` parameter in the `setupEventHandlers` function is used to
 * store a copy of the current state of the application. This can be helpful for scenarios where you
 * need to compare the current state with a previous state or maintain a snapshot of the state for
 * certain operations. It allows you
 */
export const setupEventHandlers = (
    view: SceneView,
    dispatch: AppDispatch,
    showConfirmBtn: boolean,
    copyState: TCopyState,
    informationModal: boolean
) => {
    view.on("click", (e) => handleMapClickEvents(e, showConfirmBtn, dispatch, copyState, informationModal));
    view.on("drag", (e) => {     
            dispatch(toggleRoofConfirmBtn(false))        
    });
    view.on("mouse-wheel", function (e) {
        if (showConfirmBtn) {
            dispatch(toggleRoofConfirmBtn(false))
        }
        dispatch(setMapZoomLevel(view.zoom))
        if(Object.keys(globalLayers.heatMapRender).length){
            // globalLayers.heatMapRender.referenceScale = globalLayers.view?.scale as number;
        }

        // Example usage with globalLayers.view
        const distances = getDistanceFromScale(globalLayers.view!);
        if(globalLayers.sketchButton.scale){
          dispatch(setScale({ m: distances.meters, f: distances.feet }))
          globalLayers.sketchButton.scale.innerText = `${distances.meters} m, ${distances.feet} ft`
        }
        // (document.getElementById("zoomDiv") as HTMLSpanElement).innerText = Math.round((globalLayers.view?.zoom as number)).toString()
        view.navigation.mouseWheelZoomEnabled = e.deltaY < 0 || view.zoom > 3;
    });
    view.on("pointer-move", (e) => pointerMove(e));


}



function getDistanceFromScale(view: __esri.MapView | __esri.SceneView) {
    const scale = view.scale;
    const spatialReference = view.spatialReference;
    
    // Determine the unit of the spatial reference
    let unitInMeters = 1; // Default is meters
    
    if (spatialReference.isGeographic) {
      // Geographic (degrees), convert degrees to meters (approximation)
      unitInMeters = 111_320; // Approx meters per degree at the equator
    } else if (spatialReference.isWebMercator) {
      // Web Mercator uses meters by default
      unitInMeters = 1; 
    } else {
      // For other projected coordinate systems, get the unit's conversion factor
      if (spatialReference.wkid === 102752) { // Example: State Plane (US Feet)
        unitInMeters = 0.3048; // Conversion factor from feet to meters
      }
      // Add more if needed for specific coordinate systems
    }
    
    // Calculate the ground distance per pixel
    const screenDistanceInMeters = scale * unitInMeters;
    
    // Convert the distance to feet (1 meter = 3.28084 feet)
    const screenDistanceInFeet = screenDistanceInMeters * 3.28084;
  
    // Return distances in both meters and feet
    return {
      meters: Math.round(screenDistanceInMeters),
      feet: Math.round(screenDistanceInFeet)
    };
  }
  

  