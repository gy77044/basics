import { useEffect, useRef } from "react";
import { IconRsb2d, IconRsb3d, IconRsbDelete, IconRsbMeasure, IconRsbPolygon, IconRsbZoomIn, IconRsbZoomOut} from "../../assests/icons/EPCIcons/Icons";
import {IconAdd,IconSub} from "../../assests/icons/MapToolsIcons";
import { buildingBase, switchView } from "../../lib/EPC/SwitchingMapLayers/SwitchMap";
import { setInformationModal, setIs3dMap } from "../../ReduxTool/Slice/Map/MapReducer";
import { useAppDispatch, useAppSelector } from "../../ReduxTool/store/hooks";
import { Accordion2 } from "../../Screen/Partner/EPC/LeadBoard/PvnxtLeads/PvNxtLeads";
import globalLayers from "../../Utils/EPCMaps/Maps/GlobaLMap";
import BaseMaps from "./BaseMaps";
import Layers from "./Layers";
import ShadowCastModal from "./ShadowCast";
import { fetchChildWMSLayersByParentId_roof_All, fetchRooffromCoordinates } from "../../Utils/EPCMaps/Maps/fetchRoofFromCoordinates";

const MapToolbar = ({ type }: { type?: string }) => {
  const dispatch = useAppDispatch();
  const { is3DMap } = useAppSelector(state => state.mapref)

  const newMapToolstitle = useAppSelector(
    (state) => state.mapToolsReducer.newMapToolstitle
  );

  useEffect(() => {
    if (newMapToolstitle !== "Shadow") {
      globalLayers.shadowCast("remove");
    }
  }, [newMapToolstitle]);

  const handleSwitching = async () => {
    if(!globalLayers.sketchLayers.graphics.length) return;
    if(!globalLayers.getGraphicbyItsName(buildingBase)) return;

    if (globalLayers.activeView === '2D') {
        globalLayers.activeView = '3D';
        dispatch(
            setInformationModal({
              state: true,
              title: "Mode Switch",
              content: `You are currently in 3D mode. Please switch to 2D mode to enable editing.`,
            })
          );

        if(globalLayers.sketchViewModel_Draw.activeTool){
            globalLayers.sketchViewModel_Draw.cancel()
        }
        dispatch(setIs3dMap(true));
        const inp = globalLayers.searchWidgetInput;
        if(inp && inp.container.querySelector(".esri-search__input")){
            inp.container.querySelector(".esri-search__input").disabled = true;      
        }
        globalLayers.sketchViewModel_Draw.cancel()
    } else {
        globalLayers.activeView = '2D';
        dispatch(setIs3dMap(false));
        dispatch(setInformationModal({ state: false, title: "", content: "" }));
        const inp = globalLayers.searchWidgetInput;
        if(inp && inp.container.querySelector(".esri-search__input")){
            inp.container.querySelector(".esri-search__input").disabled = false;      
        }
    }    
    await switchView(globalLayers.activeView)
  }
  const mainRef = useRef<HTMLDivElement>(null)

  const handleBuildingGeoLocation = async () => {
    try {
      const data = await fetchRooffromCoordinates(28.60836, 77.36889);
      if (!data) return;
      // // // convert the wkid 4326 to 102100 first
      const convertedGeom = await globalLayers.convertCoordinateSystem(
        data,
        102100
      );
      if (!convertedGeom) return;
      globalLayers.goto(28.6080805, 77.3689462);

      await globalLayers.addWMSLayerBuilding(convertedGeom);
      // now look for the corresponsding obstrcuion on the roof and then add the on the roof
      // await fetchChildWMSLayersByParentId(globalLayers.selectedRoof.properties.fid)

      // await fetchChildWMSLayersByParentId_roof(globalLayers.selectedRoof.properties.fid) // for just one roof
      await fetchChildWMSLayersByParentId_roof_All(
        globalLayers.selectedRoof.objectid
      );
    } catch (e) {}
  };


  return (
    <>
      {type ? (
        <>
          <div className="mapTools flex flex-col justify-between items-end h-[98%] my-2">
            <div className="flex flex-col justify-start gap-2" ref={mainRef}>
                <Accordion2 mainRef={mainRef} headName="Base map" open={false} children={ <BaseMaps />  } />
                <Accordion2 mainRef={mainRef} headName="Map layer" children={ <Layers />   } />
                <Accordion2 mainRef={mainRef} headName="Shading" children={ <ShadowCastModal />   } />
            </div>
       
            <div className="flex flex-col justify-end gap-4">
              <div className={`flex flex-col p-3 gap-3 w-fit h-fit bg-white rounded-md`}>
                <button style={{ width: "inherit", pointerEvents: 'visible' }} title="Switch to 3D view" className="" id="3d_view" >{!is3DMap ? <IconRsb3d onClick={() => handleSwitching()} /> : <IconRsb2d onClick={() => handleSwitching()} />}</button>
                <button style={{ width: "inherit" }} title="Area Measurement" className="" id="measurement" disabled={globalLayers.activeView === "3D"}> <IconRsbMeasure /> </button>
                <button style={{ width: "inherit" }} title="Draw/Edit Shape" id="polygon" className="" disabled={globalLayers.activeView === "3D"}> <IconRsbPolygon /> </button>
                <button style={{ width: "inherit" }} title="Refresh Map" className="" id="refresh-map" disabled={globalLayers.activeView === "3D"}> <IconRsbDelete /> </button>
              </div>
              <div className={`flex flex-col p-3 gap-3 w-fit h-fit bg-white rounded-md`}>
                <button style={{ width: "inherit" }} title="Zoom In" id="zoomIn"> <IconRsbZoomIn /> </button>
                <button style={{ width: "inherit" }} title="Zoom Out" id="zoomOut"> <IconRsbZoomOut /> </button>
              </div>
              <div className={`flex flex-col p-3 gap-3 w-fit h-fit bg-white rounded-md`}>
                <button style={{ width: "inherit" }} title="Compass" id="compass-widget"></button>
                {/* <button style={{  }} title="3d_building_layer" id="building_layer" onClick={() => handleBuildingGeoLocation()}>
                  B
                </button> */}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mapTools flex flex-col">
          <div className="h2"></div>
          <div className={`rsb-bottom mapTool-container mt-3 `}>
            <div id="zoomIn" style={{ width: "inherit" }} title="Zoom In" className={`cursor-pointer hover:bg-primary-200 w-[3vh] h-[3vh] flex justify-center items-center  mapTool-icon-content `} > <IconAdd /> </div>
            <div id="zoomOut" style={{ width: "inherit" }} title="Zoom Out" className="cursor-pointer hover:bg-primary-200 w-[3vh] h-[3vh] flex justify-center items-center mapTool-icon-content" > <IconSub /> </div>
          </div>
        </div>
      )}
    </>
  );
};
export default MapToolbar;
