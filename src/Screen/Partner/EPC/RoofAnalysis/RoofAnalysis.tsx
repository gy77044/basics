import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { IconBigPolyline } from "../../../../assests/icons/MapToolsIcons";
import Footer from "../../../../Components/Footer/Footer";
import MapArea from "../../../../Components/Map/MapArea";
import Layers from "../../../../Components/MapTools/Layers";
import MapToolbar from "../../../../Components/MapTools/MapToolbar";
import MaptoolsContainer from "../../../../Components/MapTools/MaptoolsContainer";
import InfomationContent from "../../../../Components/New/Modal/InfomationContent";
import InformationModal from "../../../../Components/New/Modal/InformationModal";
import { setTitle, toggleDrawer } from "../../../../ReduxTool/Slice/Drawer/DrawerReducer";
import { setInformationModal, setIs3dMap, toogleTooltip } from "../../../../ReduxTool/Slice/Map/MapReducer";
import { setMapToolsTitle } from "../../../../ReduxTool/Slice/MapTools/MapToolsReducer";
import { getProjectsByProjectid, projectsetup, resetRoofAnalysisDetails, roofAnalysisFormTyp, setRoofAnalysisDetails, setSelectedProject } from "../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector } from "../../../../ReduxTool/store/hooks";
import globalLayers from "../../../../Utils/EPCMaps/Maps/GlobaLMap";
import { addMarkerToMap, getCoordinatesFromAddress } from "../../../../Utils/EPCMaps/Maps/LazyloadMap";
import { buildingBase, switchView } from "../../../../lib/EPC/SwitchingMapLayers/SwitchMap";
import { ProjectTy } from "../../../../ReduxTool/Slice/Auth/types";
import BaseMaps from "../../../../Components/MapTools/BaseMaps";
import { toast } from "react-toastify";
import Toast from "../../../../Components/ErrorBoundry/Toast";

const RoofAnalysis = () => {
  const dispatch = useAppDispatch(), { state } = useLocation();
  // const { esriDraw } = useAppSelector((state) => state.consumerReducers.roofAnalysis); // commented for consumer reducer
  const { informationModal, isToolTip, infomationbtnTitle } = useAppSelector((state) => state.mapref);
  const { loadingModuleManufacturer, roofAnalysis: { formDetails, selectedProject } } = useAppSelector((state) => state.EPCDetails);
  const newMapToolstitle = useAppSelector((state) => state.mapToolsReducer.newMapToolstitle);
  const MemoMap = useMemo(() => MapArea, []);
  const { displayDrawer } = useAppSelector(state => state.drawer)
  const { is3DMap } = useAppSelector(state => state.mapref);
  useEffect(() => {

    dispatch(resetRoofAnalysisDetails());
    dispatch(setIs3dMap(false))
    dispatch(setTitle(""));
    globalLayers.isDone = false;
    if (state && state.project) {
      sessionStorage.setItem("projectid", state.project?.projectid ?? '');
    }
    if (selectedProject.projectid) {
      //sessionStorage.setItem("projectid", selectedProject.projectid);
    }
    let projectid = sessionStorage.getItem("projectid") ?? "";
    if (projectid) {
      getProjectDetails(projectid);
    } else if (state && state?.project) {
      dispatch(setSelectedProject(state?.project));
      let updateFormDetails = { ...formDetails, projectsetup: { ...projectsetup, address: state?.project.address, } } as roofAnalysisFormTyp;
      fetchCurrentProjectLocation(state.project.address, updateFormDetails, false);
    }
  }, []);


  const handleClosePopUp = () => {
    // if(is3DMap){
    //   dispatch(setInformationModal({ state: false, title: "", content: "" }));
    // }
  };

  useEffect(() => {
    if (informationModal) {
      document.addEventListener("mousedown", handleClosePopUp);
    }
    if (newMapToolstitle || isToolTip.istooltip) {
      document.addEventListener("mousedown", hncleCloseMap);
    }
    // if (window.scrollY >= 5 || window.scrollY <= -5) {
    //   document.addEventListener("mousedown", hncleCloseMap);
    // }
    return () => {
      document.removeEventListener("mousedown", hncleCloseMap);
    };
  }, [newMapToolstitle, isToolTip.istooltip, informationModal])

  const hncleCloseMap = () => {
    // dispatch(setMapToolsTitle(""));
    // dispatch(toogleTooltip({ dipy:0, istooltip:"", msg:""}));
  }

  const handleCloseInfomation = async () => {
   
    globalLayers.activeView = '2D';
    dispatch(setIs3dMap(false));
    dispatch(setInformationModal({ state: false, title: "", content: "" }));
    const inp = globalLayers.searchWidgetInput;
    if (inp && inp.container.querySelector(".esri-search__input")) {
      inp.container.querySelector(".esri-search__input").disabled = false;
    }
    // (document.getElementById('3d_view') as HTMLElement).innerHTML = '3D'  as string;
    // (document.getElementById('3d_view') as HTMLElement).classList.add('mapTool-icon-content-active');
    // (document.getElementById('3d_view') as HTMLElement).classList.add('text-white');
    if(!globalLayers.sketchLayers.graphics.length) return;
        await switchView(globalLayers.activeView)
    if(globalLayers.sketchViewModel_Draw.activeTool){
      if(informationModal) return;
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: `Click points on the map to draw an area of interest. Press ESC to cancel the drawing mode.`}));
    } else {
      if (!informationModal) return
      dispatch(setInformationModal({ state: false, title: "", content: "" }));
    }

    

  };

  const getProjectDetails = async (projectid: string) => {
    try {
      const { payload }: any = await dispatch(getProjectsByProjectid(projectid));
      if (payload) {
        if (payload.isepccomplete) {
          globalLayers.isDone = payload.isepccomplete;
        };
        let updateFormDetails = { ...formDetails, projectsetup: { ...formDetails.projectsetup, projectid: payload.projectid, address: payload.address, projectname: payload.projectname, lat: payload.lat, lng: payload.lng, load: payload.sanctionload } } as roofAnalysisFormTyp;
        if (payload.lat && payload.lng) {
          addLocationMarker(payload.lat, payload.lng, updateFormDetails, payload?.isepccomplete ?? false);
        } else {
          fetchCurrentProjectLocation(payload.address, updateFormDetails, payload?.isepccomplete ?? false);
        };
      };
    } catch (err) {
      console.log(err);
    };
    return;
  };
  const fetchCurrentProjectLocation = async (address: string, updateFormDetails: roofAnalysisFormTyp, isepccomplete: boolean) => {
    const res = await getCoordinatesFromAddress(address);
    if (res) {
      updateFormDetails.projectsetup.lat = res.latitude;
      updateFormDetails.projectsetup.lng = res.longitude;
      addLocationMarker(res!.latitude, res!.longitude, updateFormDetails, isepccomplete);
    } else {
      Toast({ messageText: address+ ' could not find this address, Please search your address.', messageType: 'E', autoClose: 5000, toastId: address })
    }
  };

  const addLocationMarker = (lat: number, lng: number, updateFormDetails: roofAnalysisFormTyp, isepccomplete: boolean) => {
    setTimeout(() => {

      globalLayers.userCurrentLocation = { lat, lng };
      const widgetSearch = globalLayers.searchWidgetInput;
      const inp = document.querySelector(".esri-search__input-container");
      // console.log(inp, 'inp')
      if(widgetSearch){
        (widgetSearch as __esri.Search).set('searchTerm', updateFormDetails.projectsetup.address)
      }
      if (inp) {
        const inputElement = inp.querySelector(".esri-search__input");
        if (inputElement) {
          (inputElement as HTMLInputElement).value = updateFormDetails.projectsetup.address;
          if (isepccomplete) {
            (inputElement as HTMLInputElement).disabled = true;
          } else {
            (inputElement as HTMLInputElement).disabled = false;
          }
        } else {
          console.log('Input element with class "esri-search__input" not found.');
        };
      } else {
        console.log("Container with class 'esri-search__input-container' not found.");
      };
      if (!globalLayers.getGraphicbyItsName(buildingBase)) {
        addMarkerToMap(dispatch, lat, lng);
      }
      if(!isepccomplete){
        dispatch(
          setInformationModal({
            state: true,
            title: "Perform action",
            content: `You have reached at project destination. Now, simply perform action of project setup.`,
          })
        );
      }
      // globalLayers.removeLocationGraphic();
    }, 1500);
    dispatch(setRoofAnalysisDetails(updateFormDetails));
    dispatch(setTitle("projectsetup"));
    dispatch(toggleDrawer(true));
  };

  return (
    <>
      {isToolTip.istooltip && <InfomationContent displayDrawer={displayDrawer} isToolTip={isToolTip} />}
      <MaptoolsContainer title={newMapToolstitle}>
        {newMapToolstitle === "Map Layer" && <Layers />}
        {newMapToolstitle === "Basemap" && <BaseMaps />}
      </MaptoolsContainer>
      {informationModal && 
      <div className="w-3/4 justify-center mx-auto" style={{ zIndex: 1 }}><InformationModal handleBtn={handleCloseInfomation} isHandleBtn={is3DMap} btnTitle={"Switch to 2D"} modaltitle={"title"} content={"content"} setClose={() =>dispatch(setInformationModal({ state: false, title: "", content: "" }))}/></div>}
      <div className="map-container">
        <div className="map-area relative partnerMapcontainer">
          <MemoMap />
        </div>
        <div className="absolute top-0 right-[1em] h-[calc(100vh-8.5vh)]">
          <MapToolbar type="partner" />
        </div>
      </div>
    </>
  );
};

export default RoofAnalysis;
