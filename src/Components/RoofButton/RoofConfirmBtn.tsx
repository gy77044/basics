import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Polygon from "@arcgis/core/geometry/Polygon";
import { confirmRoofLocationonClick } from "../../lib/EPC/MarkersFunctions/changeLocationMarker";
import { ProjectTy } from "../../ReduxTool/Slice/Auth/types";
import { toggleDrawer } from "../../ReduxTool/Slice/Drawer/DrawerReducer";
import { setInformationModal, setMarkerState, setShowInfoModal, setToolTipModal, toggleRoofConfirmBtn } from "../../ReduxTool/Slice/Map/MapReducer";
import { useAppDispatch, useAppSelector } from "../../ReduxTool/store/hooks";
import { generateTheUniqueIdforProject } from "../../Utils/commonFunctions";
import { fetchChildWMSLayersByParentId_roof_All, fetchKeepOutsRoofsByParentId, fetchRooffromCoordinates } from "../../Utils/EPCMaps/Maps/fetchRoofFromCoordinates";
import globalLayers from "../../Utils/EPCMaps/Maps/GlobaLMap";
import { getStateFromCoordinates } from "../../Utils/EPCMaps/Maps/LazyloadMap";
import { saveProjectId, setRegionName } from "../../ReduxTool/Slice/Roof/RoofDetails/RoofDetailsReducer";
import { switchView } from "../../lib/EPC/SwitchingMapLayers/SwitchMap";

const RoofConfirmBtn = () => {
  const { showConfirmBtn, position } = useAppSelector((state) => state.mapref);
  const { roofAnalysis: { roofDetails,selectedProject,formDetails } } = useAppSelector(state => state.EPCDetails);
  const { user } = useAppSelector((state) => state.auth);
  const { searchedMarker } = useAppSelector((state) => state.markers);
  const projects = useAppSelector((state) => state.EPCDetails.roofAnalysis.roofDetails);
  const dispatch = useAppDispatch();
  const projectData = useAppSelector((state) => state.EPCDetails.roofAnalysis.selectedProject as ProjectTy);

  const handleBuildingGeoLocation = async (latitude: number, longitude: number) => {
    try {
      // const data = await fetchRooffromCoordinates(28.60836, 77.36889);
      const data = await fetchRooffromCoordinates(latitude, longitude);
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
      globalLayers.goto(latitude, longitude);
  
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
  
  async function handleBtn() {

    confirmRoofLocationonClick();
    dispatch(toggleRoofConfirmBtn(false));
    // const geometry = await handleBuildingGeoLocation(globalLayers.latitude, globalLayers.longitude)

    // dropPinSearchLocation({ latitude: searchedMarker.lat, longitude: searchedMarker.lng })
    const geometry = null;
    if (!geometry) {
      globalLayers.removeGraphicbyName('building');
      globalLayers.lastactiveTool = 'building'
      
      if(!roofDetails.length){
        dispatch(
          setInformationModal({
            state: true,
            title: "Drawing Mode",
            content: `Click points on the map to draw an area of interest. Press ESC to cancel the drawing mode.`,
          })
        );
      } 
      setTimeout(() => {  
        //globalLayers.sketchViewModel_Draw.create('polygon')
        if(globalLayers.sketchButton.polygonEPC){
          globalLayers.lastactiveTool = 'building';
          globalLayers.sketchButton.polygonEPC.click();
        }
      },500)
      globalLayers.userCurrentLocation.lat = globalLayers.latitude;
      globalLayers.userCurrentLocation.lng = globalLayers.longitude;
      dispatch(toggleRoofConfirmBtn(false));
      return;
    }

    if (geometry) {
      await fetchKeepOutsRoofsByParentId(
        globalLayers.selectedRoof.properties.fid,
        ["watertank", "mumptystructure"],
        geometry
      );
    }

    if (geometry) {
      getStateFromCoordinates(searchedMarker.lng, searchedMarker.lat).then(
        (stName) => {
          dispatch(setRegionName(stName));
        }
      );
      let useableGraphic: any = globalLayers.selectedGraphic;
      const id = generateTheUniqueIdforProject(
        user.fname,
        user.lname!,
        projects!.length
      );
      const area = geometryEngine.geodesicArea(geometry as Polygon, "square-meters");
      const useablearea = geometryEngine.geodesicArea(
        useableGraphic.geometry,
        "square-meters"
      );
      // generating unique id for project
      dispatch(
        saveProjectId({ id: id, totalRoofArea: area, useablearea })
      );

      globalLayers.zoomToGeometry(geometry);
      globalLayers.removeLocationMarker()
      globalLayers.removeLocationGraphic();
      // globalLayers.graphicLayerLocation?.graphics.forEach((graphic) => {
      //   if (graphic.attributes && graphic.getAttribute('name') === LocationMarker) {
      //     globalLayers.graphicLayerLocation?.graphics.remove(graphic);
      //   }
      //   if (graphic.attributes && graphic.getAttribute('title') === LocationMarker) {
      //     globalLayers.graphicLayerLocation?.graphics.remove(graphic);
      //   }
      // });
    }
   

    dispatch(toggleRoofConfirmBtn(false));
    dispatch(setShowInfoModal(false));
    globalLayers.markerState = "move-stop";
    dispatch(setMarkerState(""));

    // dispatch(setTitle("projectsetup"))
    dispatch(toggleDrawer(true))
    dispatch(setToolTipModal({ state: true, title: "Precise Analysis", content: "Let's work together to find the perfect solar solution for your home! To proceed, please fill out all details on the left." }))
  
  }

  return (
    <>
      {showConfirmBtn && !projectData?.isepccomplete &&
        <div
          className="btn-md-primary absolute cursor-pointer rounded-md p-2"
          onClick={() => handleBtn()}
          id="killer"
          style={{ top: `calc(${position.y + 30}px`, left: `calc(${position.x - 87}px` }}
        >
          Confirm Roof Location
        </div>
      }
    </>
  );
};

export default RoofConfirmBtn;
