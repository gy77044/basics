import Compass from "@arcgis/core/widgets/Compass";
import { useEffect, useMemo, useRef, useState } from "react";
import { addsketchView } from "../../lib/EPC/SketchDraw/Sketch";
import { buildingBase } from "../../lib/EPC/SwitchingMapLayers/SwitchMap";
import { watchLocationMarkerChanges } from "../../lib/watchChanges";
import { ProjectTy } from "../../ReduxTool/Slice/Auth/types";
import { useAppDispatch, useAppSelector } from "../../ReduxTool/store/hooks";
import globalLayers from "../../Utils/EPCMaps/Maps/GlobaLMap";
import { AddSearchWidget } from "../../Utils/EPCMaps/Maps/LazyloadMap";
import { MapKeyboardEvent } from "../../Utils/EPCMaps/Maps/MapEvents/MapKeyboardEvent";
import { setupEventHandlers } from "../../Utils/EPCMaps/Maps/MapEvents/setupEventHandlers";
import InfoSlider from "../InfoModal/InfoSlider";
import LoadingScreen from "../Loader/LoadingScreen";
import Layers from "../MapTools/Layers";
import RoofConfirmBtn from "../RoofButton/RoofConfirmBtn";
import MapInfoModal from "../SlideModal/MapInfoModal";
import RightClickMarkerAttchment from "./RightClickMarkerAttchment";

export default function MapArea() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const { showConfirmBtn, showAddHeightModal, copyState, rightClick, informationModal, isBuildingThere } =useAppSelector((state) => state.mapref);
  const projectData = useAppSelector((state) => state.EPCDetails.roofAnalysis.selectedProject as ProjectTy);
  const [loading, setLoading] = useState(true);
  const initialRender = useRef(false);
  const dispatch = useAppDispatch();

  const getGeolocation = (lat: number, lng: number): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude });
            
          },
          (error) => {
            console.error("Error getting geolocation:", error.message);
            // If geolocation permission denied or not available, resolve with default coordinates
            resolve({ latitude: lat, longitude: lng });
          }
        );
      } else {
        console.error("Geolocation is not supported by your browser");
        // If geolocation not supported, resolve with default coordinates
        resolve({ latitude: lat, longitude: lng });
      }
    });
  };
  

  const InitializeMap = async () => {
    try {
      let lat = 19.08489;
      let lng = 72.85669;
      const { latitude, longitude } = await getGeolocation(lat, lng)
      await globalLayers.initialiseProps(mapRef, lng, lat, dispatch, '3D');
      if (!mapRef.current) return;
      globalLayers.container = mapRef.current;
      if (globalLayers.map && globalLayers.view) {
        globalLayers.currentZoomLevel = globalLayers.view.zoom;
        await watchLocationMarkerChanges();
      }
      // map event handlers
      setupEventHandlers(
        globalLayers.view!,
        dispatch,
        showConfirmBtn,
        copyState,
        informationModal
      )

      globalLayers.view?.when(async () => {
        console.info('Map Loaded...')
        const compass = new Compass({
          view: globalLayers.view!
        })
        if(document.getElementById('compass-widget')){
          compass.container = document.getElementById('compass-widget') as HTMLElement
        }
        await AddSearchWidget(globalLayers.view!, dispatch, rightClick);
        addsketchView(dispatch).then(() => {
          setLoading(false);
        });

      
        globalLayers.view?.watch('zoom', e => {
          if(globalLayers.getGraphicbyItsName(buildingBase)){
            
          }
          if(projectData.graphicLayer){
            globalLayers.removeLocationGraphic()
            globalLayers.removeLocationMarker()
          }
        })
      });

      initialRender.current = true;
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };


  // console.log('maparea')
  const RoofConfirmBtnMemo = useMemo(() => RoofConfirmBtn, []);

  useEffect(() => {
    if(process.env.NODE_ENV === "development"){
    return () => {
      InitializeMap();
      mapRef.current?.addEventListener("keydown", (e: any) =>
        MapKeyboardEvent(e)
      );
      mapRef.current?.addEventListener("keyup", (e: any) => {
        globalLayers.keys.keyC = false
        globalLayers.keys.ctrlPressed = false;
        if (globalLayers.shiftPressed) {
          globalLayers.shiftPressed = false;
        } 
      });
    };
  }else{
    InitializeMap();
      mapRef.current?.addEventListener("keydown", (e: any) =>
        MapKeyboardEvent(e)
      );
      mapRef.current?.addEventListener("keyup", (e: any) => {
        globalLayers.keys.keyC = false
        globalLayers.keys.ctrlPressed = false;
        if (globalLayers.shiftPressed) {
          globalLayers.shiftPressed = false;
        } 
      });
  }
  }, []);

  return (
    <>
      {loading && <LoadingScreen />}
      <div
        id="viewDiv"
        className="map-area-container h-[calc(100vh-90px)] w-[100%]"
        ref={mapRef}
      ></div>
      <Layers />
      {showAddHeightModal !== "" && <MapInfoModal />} 
      <RoofConfirmBtnMemo />
      {projectData?.isepccomplete === false &&  <RoofConfirmBtnMemo /> }
      <InfoSlider />
      {!projectData.isepccomplete && !isBuildingThere && globalLayers.activeView === "2D" && <RightClickMarkerAttchment />}
    </>
  );
}
