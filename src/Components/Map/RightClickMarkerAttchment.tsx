import Point from "@arcgis/core/geometry/Point";
import { buildingBase } from "../../lib/EPC/SwitchingMapLayers/SwitchMap";
import { setRightClick } from "../../ReduxTool/Slice/Map/MapReducer";
import { useAppDispatch, useAppSelector } from "../../ReduxTool/store/hooks";
import globalLayers from "../../Utils/EPCMaps/Maps/GlobaLMap";
import { fetchChildWMSLayersByParentId_roof_All, fetchRooffromCoordinates } from "../../Utils/EPCMaps/Maps/fetchRoofFromCoordinates";



const RightClickMarkerAttchment = () => {
  const dispatch = useAppDispatch();
  const { rightClick, zoomlevel, showConfirmBtn,lat,lng, rightClickposition, rightClickpositionMarker } = useAppSelector((state) => state.mapref);
  const toastId = "custom_id_toast";
  const handleBuildingGeoLocation = async () => {
    try {
      const data = await fetchRooffromCoordinates(28.60836, 77.36889);
      if (!data) {
        return false; // Return false if no data is found
      }
  
      // Convert the WKID 4326 to 102100
      const convertedGeom = await globalLayers.convertCoordinateSystem(
        data,
        102100
      );
      if (!convertedGeom) {
        return false; // Return false if conversion fails
      }
  
      // Navigate to the specified location
      globalLayers.goto(28.6080805, 77.3689462);
  
      // Add WMS layer for the building
      await globalLayers.addWMSLayerBuilding(convertedGeom);
  
      // Fetch child WMS layers for all roofs
      await fetchChildWMSLayersByParentId_roof_All(
        globalLayers.selectedRoof.objectid
      );
  
      // Cancel any active SketchViewModel interaction after a delay
      setTimeout(() => {
        globalLayers.sketchVM.cancel();
      }, 2000);
  
      return true; // Return true if everything executes successfully
    } catch (e) {
      console.error("Error in handleBuildingGeoLocation:", e);
      return false; // Return false if any error occurs
    }
  };
  
  const addMarker = async () => {



 
    globalLayers.removeGraphicbyName(buildingBase)
    globalLayers.removeLocationGraphic();
    globalLayers.removeLocationMarker();
    if(globalLayers.sketchVM.activeTool){
      globalLayers.sketchVM.cancel();
    };
    const gb = rightClickpositionMarker;

    const point = new Point({
      latitude: rightClickpositionMarker.latitude,
      longitude: rightClickpositionMarker.longitude,
      spatialReference: { wkid: 102100 }
    });

    const data = await handleBuildingGeoLocation()


    if(data === false){
      
        globalLayers.lastactiveTool = 'building';
        globalLayers.sketchViewModel_Draw.create('polygon')
          
    }
        dispatch(setRightClick(''))
    
  }
  
  return (
    <>
      <div
        className="flex flex-col h-auto rounded-default gap-2 py-1 absolute cursor-pointer"
        style={{
          left: rightClickposition.x,
          top: rightClickposition.y,
        }}
      >
        {!showConfirmBtn && rightClick === "start" && (
          <button
            className="btn-md-primary cursor-pointer rounded-md p-2"
            onClick={addMarker}
          >
          Mark Location
          </button>
        )}
      </div>
    </>
  );
};
 
export default RightClickMarkerAttchment;