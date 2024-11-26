import Graphic from "@arcgis/core/Graphic";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { IconElectrical, IconKeepouts, IconReport, IconStructure } from "../../../../../../../assests/icons/EPCIcons/Icons";
import { IconProcessCheck } from "../../../../../../../assests/icons/Icons";
import { Button } from "../../../../../../../Components/AllButton/AllButtons.tsx";
import Toast from "../../../../../../../Components/ErrorBoundry/Toast";
import { ProjectTy } from "../../../../../../../ReduxTool/Slice/Auth/types";
import { setIsbtnHide } from "../../../../../../../ReduxTool/Slice/Drawer/DrawerReducer";
import { toogleTooltip } from "../../../../../../../ReduxTool/Slice/Map/MapReducer";
import { roofDetailsType, setRoofDetailsError, setRoofDetailsIndx, setRoofOneError, structureDetailsError } from "../../../../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector } from "../../../../../../../ReduxTool/store/hooks";
import { isTruthy } from "../../../../../../../Utils/commonFunctions";
import { pvHandleRoofTop_updated } from "../../../../../../../Utils/EPCMaps/GenerateRoof/GenrateRoof";
import { getGeometryAfterObsctructionCutoff } from "../../../../../../../Utils/EPCMaps/GetGeometry/getGeometryAfterObsctructionCutoff";
import globalLayers from "../../../../../../../Utils/EPCMaps/Maps/GlobaLMap";
import { formatMSSDataObject } from "../../../MapToolBtnlChildren/formatMMSObject";
import InverterDetails from "../InverterDetails";
import Keepouts from "../Keepouts";
import Mechanical from "../Mechanical";
import Report from "../Report";
type fiels = Array<{ field: keyof structureDetailsError; message: string; condition?: boolean }>
export interface roofDetailsValidationType {structureDetails:fiels,keepoutsDetails:fiels,electricalDetails:fiels}
const RoofOne = ({ roofNum }: { roofNum: number }) => {
  const dispatch = useAppDispatch();
  const { roofDetails, selectedProject, formDetails: { projectsetup } } = useAppSelector(
    (state) => state.EPCDetails.roofAnalysis
  );
  const { isbtnHide } = useAppSelector((state) => state.drawer);
  const { isBuildingThere, is3DMap } = useAppSelector((state) => state.mapref);

  const tabs = useMemo(() => [
      { name: "Structure", icon: <IconStructure />, content: <Mechanical roofNum={roofNum} /> },
      { name: "Keepouts", icon: <IconKeepouts />, content: <Keepouts roofNum={roofNum} /> },
      { name: "Electrical", icon: <IconElectrical />, content: <InverterDetails roofNum={roofNum} /> },
      { name: "Report", icon: <IconReport />, content: <Report roofNum={roofNum} /> },
  ],[roofNum]);

  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);

  const isInitialTab = activeTab === tabs[0].name;
  const isLastTab = activeTab === tabs[tabs.length - 1].name;

  useEffect(() => {
    dispatch(setRoofDetailsIndx(roofNum));
  }, [dispatch, roofNum]);

  useEffect(() => {
    setActiveTab(is3DMap ? "Keepouts" : "Structure");
  }, [is3DMap]);

  useEffect(() => {
    dispatch(setIsbtnHide(activeTab !== "Report"));
  }, [activeTab, dispatch]);
  const handleTabClick = (tabName: string) => {
    if (is3DMap) {
      toast.error("Please switch to 2D mode to enable editing", { toastId: "tab Error" });
      return;
    }
    dispatch(toogleTooltip({ dipy: 0, istooltip: "", msg: "" }));
    const currentIndex = tabs.findIndex((tab) => tab.name === activeTab);
    const newIndex = tabs.findIndex((tab) => tab.name === tabName);
    if (newIndex < currentIndex) {
      setActiveTab(tabName);
    } else if (validateStructureForm(roofNum)) {
      setActiveTab(tabName);
    }
  };

  const handlePrevClick = () => {
    if (is3DMap) {
      toast.error("Please switch to 2D mode to enable editing", { toastId: "tab Error" });
      return;
    }
    dispatch(toogleTooltip({ dipy: 0, istooltip: "", msg: "" }))
    const currentIndex = tabs.findIndex((tab) => tab.name === activeTab);
    const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[prevIndex].name);
  };

  const handleNextClick = async () => {
    if (is3DMap) {
      toast.error("Please switch to 2D mode to enable editing", { toastId: "tab Error" });
      return;
    }
    dispatch(toogleTooltip({ dipy: 0, istooltip: "", msg: "" }))
    if (!(selectedProject as ProjectTy).isepccomplete) {
      if (!validateStructureForm(roofNum)) return;
    }
    if (activeTab === 'Keepouts') {
      await handleRoofGen();
    }
    if (activeTab === 'Structure') {
      await addAttributestoGraphic();
      globalLayers.parapetwall = roofDetails.length ? typeof roofDetails[0].structureDetails.parapetwall === 'string' ? parseFloat(roofDetails[0].structureDetails.parapetwall) : 0 : 0
    };

    const currentIndex = tabs.findIndex((tab) => tab.name === activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex].name);
    setCompletedTabs((prev: any) => [...prev, tabs[currentIndex].name]);
  };

  const validateStructureForm = (roofNum: number) => {
    let isValid = true,projectSetupErr = {} as any,msg="",activetab = activeTab;
    const errors= {} as structureDetailsError;
    if(activeTab === 'Structure' && !isBuildingThere){
        isValid = false;
        msg = "Confirm your roof location and draw the building area."
    };
    if(activeTab === "Keepouts"){
      activetab = 'structure'
    }
    const structureDetails = roofDetails[roofNum][`${activetab.toLocaleLowerCase()}Details` as keyof roofDetailsType];
    const validations:roofDetailsValidationType = {
      structureDetails:[
      { field: "modulemanufacturer", message: "Module Manufacturer is Required" },
      { field: "modulecapacity", message: "Module Capacity is Required" },
      { field: "inveterType", message: "Inverter Type is Required" },
      { field: "inveterManufacturer", message: "Inverter Manufacturer is Required" },
      { field: "inveterCapacity", message: "Inverter Capacity is Required" },
      { field: "sanctionload", message: "Project DC Capacity is Required" },
      { field: "loading", message: "Loading is Required" },
      { field: "buildingheight", message: "Building Height is Required" },
      { field: "parapetwall", message: "Parapet Wall is Required" },
      { field: "rooftype", message: "Roof Type is Required" },
      // { field: "tiltangle", message: "Tilt Angle is Required" },
      { field: "tiltdirection", message: "Tilt Direction is Required", condition: (parseFloat(structureDetails.tiltangle) === 0 || structureDetails.tiltangle == "") ? true :false },
      { field: "azimuthangle", message: "Azimuth Angle is Required" },
    ],
    keepoutsDetails:[
      { field: "MMSType", message: "MMSType is Required" },
      { field: "moduleOrientation", message: "Module Orientation is Required" },
      { field: "arrayRows", message: "Array Rows is Required" },
      { field: "arrayColumns", message: "Array Columns is Required" },
      { field: "rowspacing", message: "Row Spacing is Required" },
      { field: "modulespacing", message: "Module Spacing is Required" },
      { field: "azumuthAngle", message: "Azimuth Angle is Required" },
      { field: "tiltAngle", message: "Tilt Angle is Required" },
    ],
    electricalDetails:[
      { field: "stringingType", message: "Stringing Type is Required" },
      { field: "stringingSize", message: "String Size is Required" },
      { field: "cablebtwmoduleandinverter", message: "Module Orientation is Required" },
      { field: "cablebtwaccbandtp", message: "Array Rows is Required" },
      { field: "moduletoinverterdistance", message: "Cable Len (Mod-Inv) is Required" },
      { field: "invertertoaccbdistance", message: "Cable Len (Inv-ACCB-TP) is Required" },
    ]
  }

    for (const { field, message, condition } of validations[`${activeTab?.toLocaleLowerCase()}Details` as keyof roofDetailsValidationType]) {
      if(!condition){
        if ((!structureDetails[field] && !isTruthy(structureDetails[field]))) {
          errors[field] = message;
          isValid = false;
        }
      }
    };
    let isValidRoofOne=true;
    if(!isTruthy(projectsetup.projectname)){
      projectSetupErr['projectname'] = 'Project name is Required';
      isValidRoofOne = false
    }
    if(!isTruthy(projectsetup.address)){
      projectSetupErr['address'] = 'Project address is Required';
      isValidRoofOne = false
    }
    if(!isValidRoofOne){
      dispatch(setRoofOneError(projectSetupErr));
    };
    console.log(errors);
    !isValid && dispatch(setRoofDetailsError(errors));
    msg && Toast({messageText:msg,messageType:"E"});
    return isValid && isValidRoofOne;
  };

  const addAttributestoGraphic = async () => {
    // add all the attributes to the roof building
    let buildingGraphic = {} as Graphic
    const { structureDetails: { buildingheight, mmsAzimuthAngle, mmsTiltAngle, arrayColumns, arrayRows, azumuthAngle } } = roofDetails[0]
    if (Object.keys(selectedProject).length) {
      if ((selectedProject as ProjectTy)?.projectid) {
        buildingGraphic = globalLayers.selectGraphicbyName('building') as Graphic
        globalLayers.buildingdDrawn.push(buildingGraphic)
        // const { mmsazimuthangle, mmstiltangle, arraycolumns, arrayrows,  } = selectedProject as ProjectTy
      }
    }
    if (!globalLayers.buildingdDrawn.length) return;

    // const { structureDetails: { buildingheight, mmsAzimuthAngle, mmsTiltAngle, arrayColumns, arrayRows, azumuthAngle } } = roofDetails[globalLayers.buildingdDrawn.length - 1]
    buildingGraphic = globalLayers.buildingdDrawn[globalLayers.buildingdDrawn.length - 1];
    if (!buildingGraphic) return;
    // let graphic = buildingGraphic.clone();
    // if (!graphic) return;
    buildingGraphic.attributes = {
      ...buildingGraphic.attributes,
      height: parseInt(buildingheight),
      buildingheight: parseInt(buildingheight),
      tiltAngle: typeof mmsTiltAngle === 'string' && mmsTiltAngle.length > 0 ? parseInt(mmsTiltAngle) : 0,
      azimuthAngle: typeof mmsTiltAngle === 'string' && mmsTiltAngle.length > 0 ? parseInt(azumuthAngle?.label!) : 0,
    }

    globalLayers.panlesAngles = {
      tiltAngle:
        typeof mmsTiltAngle === "string" ? parseInt(mmsTiltAngle) : mmsTiltAngle,
      azimuthAngle: typeof azumuthAngle?.label === "string" ? parseInt(azumuthAngle.label) : azumuthAngle?.label!,
    };

    globalLayers.buildingdDrawn[globalLayers.buildingdDrawn.length - 1] = buildingGraphic;

    // globalLayers.removeGraphicbyName(buildingGraphic.getAttribute('name'));
    // globalLayers.removeSketchGraphic(buildingGraphic);
    // globalLayers.addSketchGraphic(graphic)
  };

  const handleRoofGen = async () => {
    if (globalLayers.sketchViewModel_Draw.activeTool) {
      globalLayers.sketchViewModel_Draw.cancel();
    }
    const graphic = await getGeometryAfterObsctructionCutoff(globalLayers);
    if (!graphic) return;
    // const removedObstructionArea = geometryEngine.geodesicArea(
    //   graphic.geometry as Polygon,
    //   "square-meters"
    // );
    globalLayers.map?.allLayers.forEach((lyer) => {
      if (lyer.title && lyer.title.includes("Solar Panels")) {
        globalLayers.map?.allLayers.remove(lyer);
      }
    });
    globalLayers.solarpanelLayer?.graphics.forEach((ele) => {
      globalLayers.solarpanelLayer?.graphics.remove(ele);
    });
    globalLayers.multipleSolarPanelLayers.map((layer) => {
      layer.graphics.removeAll();
      layer.graphics.forEach((ele) => {
        layer.graphics.remove(ele);
      });
    });

    if (globalLayers.solarpanelLayer?.graphics.length) {
      globalLayers.solarpanelLayer?.graphics.removeAll();
    }

    const data = formatMSSDataObject(roofDetails[0].structureDetails);

    setTimeout(() => {
      pvHandleRoofTop_updated(
        graphic.geometry,
        graphic.getAttribute("elevation") ?? 0,
        "panels" + Math.random() * 10,
        data
      );
    }, 500);
  };
  let isepccomplete = (selectedProject as ProjectTy)?.isepccomplete??null;
  return (
    <>
      <div>
        <ul className="flex items-end max-w-screen-lg mx-auto mb-4 mt-2 pr-1 pl-1">
          {tabs.map((tab, index) => (
            <li key={tab.name} className={`${index == tabs.length - 1 ? '' : 'w-full'} cursor-pointer`} onClick={() => handleTabClick(tab.name)}>
              <h6 className={`para-md mb-2 w-max ${tab.name === activeTab ? 'text-custom-primary-default' : (completedTabs.includes(tab.name) || isepccomplete) ? 'text-custom-primary-default' : 'text-gray-400'}`}>
                {tab.name}
              </h6>
              <div className="flex items-center w-full">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full p-0.5 ${(completedTabs.includes(tab.name) || tab.name === activeTab || isepccomplete) ? '-2' : ''} shrink-0 border border-custom-primary-default ${(completedTabs.includes(tab.name) || isepccomplete) ? 'bg-custom-primary-default border-custom-primary-default' : tab.name === activeTab ? 'border-custom-primary-default' : 'border-gray-400'}`}>
                  {(completedTabs.includes(tab.name) || isepccomplete) ? <IconProcessCheck/> : <span className={`w-2 h-2 rounded-full ${tab.name === activeTab ? 'bg-custom-primary-default' : 'bg-gray-400'}`}></span>}
                </div>
                {index < tabs.length - 1 && <div className={`w-full h-0.5 ${(completedTabs.includes(tab.name) || isepccomplete) ? 'bg-custom-primary-default' : 'bg-gray-300'}`}></div>}
              </div>
            </li>
          ))}
        </ul>
        {tabs.map((tab, index) => (
          <div key={tab.name} className={`mt-2 ${tab.name === activeTab ? 'block' : 'hidden'}`}>
            {tab.content}
          </div>
        ))}
      </div>
      <div className="sticky bottom-1 flex flex-row gap-2 w-full bg-white">
        {(!isInitialTab || !isbtnHide) && activeTab !== "Report" && <Button className="btn btn-md-outlineprimary w-full" name="Prev" onClick={handlePrevClick} />}
        {!isLastTab && <Button className="btn btn-md-primary w-full" name="Next" onClick={handleNextClick} />}
      </div>
    </>
  )
};

export default RoofOne;
