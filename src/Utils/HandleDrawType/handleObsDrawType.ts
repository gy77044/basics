import { createParapetWall } from "../../lib/EPC/SketchDraw/DrawShapes/createParapetWall";
import { setInformationModal } from "../../ReduxTool/Slice/Map/MapReducer";
import { AppDispatch } from "../../ReduxTool/store/store";
import { globalLayerType } from "../Const";

export const  msg = `Click points on the map to draw an area of interest. Press ESC to cancel the drawing mode.`
export const handleObsDrawType = (value: string, dispatch: AppDispatch, globalLayers: globalLayerType) => {
  globalLayers.removeLocationGraphic()
    if (value === "Walkway") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("polygon");
      globalLayers.lastactiveTool = "walkaway";
    } else if (value === "Lifeline") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("polygon");
      globalLayers.lastactiveTool = "Lifeline";
    } else if (value === "Handrail") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("polygon");
      globalLayers.lastactiveTool = "Handrail";
    } else if (value === "AC Earthing Pit") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = "AC_Earthing_Pit";
    } else if (value === "DC Earthing Pit") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = "DC_Earthing_Pit";
    } else if (value === "Module Cleaning Pipe") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("polygon");
      globalLayers.lastactiveTool = "Module_Cleaning_Pipe";
    } else if (value === "Water Storage Tank") {
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = "waterstorage";
    } else if (value.toLowerCase().includes('water')){
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = "waterstorage";
    } else if (value === "Lightning Arrestor") {
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = "lightningArrestor";
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
    } else if (value === "Inverter Placement") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("polygon");
      globalLayers.lastactiveTool = "Inverter";
    } else if (value === "Existing Solar Modules") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("polygon");
      globalLayers.lastactiveTool = "existingsolarmodules";
    } else if (value === "Mobile Tower") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("polygon");
      globalLayers.lastactiveTool = 'Mobile Tower';
    } else if (value === "Chimney") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create('circle');
      globalLayers.lastactiveTool = "Chimney";
    } else if (value === "Nearby Trees") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = "Nearby_Trees";
    } else if (value === "Helipad") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = "circle";
    } else if (value === "Pipelines") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create('polygon');
      globalLayers.lastactiveTool = 'pipeline';
    } else if (value === "Turbo Vents") {
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = 'turbo_vent';
    } 
    else if (value === 'Skylights'){
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create('polygon');
      globalLayers.lastactiveTool = 'Skylights';
    }
    else if (value === 'Roof Ridge'){
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create('polygon');
      globalLayers.lastactiveTool = 'Roof_Ridge';
    }
    else if (value === 'Parapet Wall'){
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create('polygon');
      globalLayers.lastactiveTool = 'Parapet_Wall';
    }
    else if (value === 'Mumty Structure'){
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create('polygon');
      globalLayers.lastactiveTool = 'Mumty_Structure';
    }
    else if (value === 'HVAC Equipment'){
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create('polygon');
      globalLayers.lastactiveTool = 'HVAC_Equipment';
    }
    else if (value === 'Extended Columns'){
      dispatch(setInformationModal({state: true,title: "Drawing Mode",content: msg,}));
      globalLayers.sketchVM.create('polygon');
      globalLayers.lastactiveTool = 'Extended_Columns';
    }
    else if (value === "Others") {
    } 
  };
