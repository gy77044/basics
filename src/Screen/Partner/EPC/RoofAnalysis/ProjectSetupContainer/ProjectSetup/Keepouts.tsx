import Graphic from "@arcgis/core/Graphic";
import ShadowCast from "@arcgis/core/widgets/ShadowCast.js";
import { ChangeEvent, memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IconSelCircle, IconSelRectangle, IconSelTriangle } from "../../../../../../assests/icons/EPCIcon";
import { IconRSBDelete, IconRSBEdit, IconRSBSave, StatusActive, StatusInActive } from "../../../../../../assests/icons/MapToolsIcons";
import shadowImg from "../../../../../../assests/img/shadow.png";
import ReactSelect from "../../../../../../Components/New/Select/ReactSelect";
import { buildingBase } from "../../../../../../lib/EPC/SwitchingMapLayers/SwitchMap";
import { ProjectTy } from "../../../../../../ReduxTool/Slice/Auth/types";
import { removeInfraDesignData, setInfraDesignData, updateInfraDesignData, } from "../../../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector, } from "../../../../../../ReduxTool/store/hooks";
import { getShadowPointPolygon } from "../../../../../../Utils/Common/ShadowWidget/getShowPointsPolygon";
import { filterKeyIncludeArr, getElementByIndex } from "../../../../../../Utils/commonFunctions";
import { pvHandleRoofTop_updated } from "../../../../../../Utils/EPCMaps/GenerateRoof/GenrateRoof";
import { getGeometryAfterObsctructionCutoff } from "../../../../../../Utils/EPCMaps/GetGeometry/getGeometryAfterObsctructionCutoff";
import globalLayers from "../../../../../../Utils/EPCMaps/Maps/GlobaLMap";
import { handleObsDrawType } from "../../../../../../Utils/HandleDrawType/handleObsDrawType";
import { infratype } from "../../MapToolBtnlChildren/_consts";
import { formatMSSDataObject } from "../../MapToolBtnlChildren/formatMMSObject";
import ModuleAndMSSMain from "../../PlantInfrastructureDesign/ModuleAndMSSMain";
import Shadowwidget from "../../../../../../lib/EPC/ShadowWidget";
import { Button } from "../../../../../../Components/AllButton/AllButtons.tsx";
import { EditableTable, Input, InputSufBtn, Toogle1 } from "../../../../../../Components/AllInput/AllInput";
import { KeepoutDetailsTable } from "./KeepoutDetailsTable";
import { addNewRow } from "../../../../../../ReduxTool/Slice/Map/MapReducer";
import { isNumberValidate } from "../../../../../../Utils/Regex";

const toast_id = "toast_id" + Math.random() * 100;

const Keepouts = ({ roofNum }: { roofNum: number }) => {
  const infraDesignData = useAppSelector((state) => state.EPCDetails.roofAnalysis.roofDetails[0]?.keepoutsDetails ?? []);
  const newRow = useAppSelector(state=>state.mapref.keepout)
  const [activestatus, setActivStatus] = useState(false);
  const [activeIrradiance, setActivIrradiance] = useState(false);
  const [enableEditRow, setEnableEditRow] = useState<boolean>(false);
  const [selectedRowIndex, setselectedRowIndex] = useState<null | { index: number; name: string; }>(null);
  const [selectedRowIndex1, setselectedRowIndex1] = useState<number[]>([]);
  const { roofDetails } = useAppSelector((state) => state.EPCDetails.roofAnalysis);
  const selectedProject = useAppSelector((state) => state.EPCDetails.roofAnalysis.selectedProject as ProjectTy);
  const [formdata, setFromData] = useState({ infraheight: "", infraoffset: "", infratype: "" });
  const [groupedOptions, setGroupedOptions] = useState<{ label: string, options: any[] }[]>([]);
  const { is3DMap } = useAppSelector(state => state.mapref);
  const dispatch = useAppDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if(name === "infraheight" && value && parseFloat(value)>15){
      return;
    }
    if(value && parseFloat(value)>5 && name === "infraoffset"){
      return;
    }
    setFromData({ ...formdata, [name]: value });
  };
  
  const handleTheStatus = async (status: boolean) => {
    if(globalLayers.activeView === '2D'){
      return;
    }
    if (status) {

      if (globalLayers.shadowCastWidget === null) {
        globalLayers.shadowCastWidget = new ShadowCast({
          view: globalLayers.view!,
          container: document.getElementById("shadow") as HTMLElement,
        });

        globalLayers.shadowCastWidget.when(() => {
          console.log('shadow Initilized')
          const viewModel = globalLayers.shadowCastWidget?.viewModel!;
          // Set the default shadow color to green
          globalLayers.shadowCastWidget?.set('color', '#b3b1b1');

          viewModel.watch(['startTimeOfDay'], (startTimeOfDay: number) => {
            // debouncedUpdateShadowPointsRender()
            if (activeIrradiance) {
              globalLayers.removeShadowIrradianceMap()
              setActivIrradiance(false)
            }
          })
          viewModel.watch(['endTimeOfDay'], (endTimeOfDay: number) => {
            if (activeIrradiance) {
              globalLayers.removeShadowIrradianceMap()
              setActivIrradiance(false)
            }
          })

        })
      }
      globalLayers.shadowCastWidget.visible = true;
      globalLayers.shadowCastWidget.visibleElements.tooltip = true;
    } else {
      if (globalLayers.shadowCastWidget) {
        globalLayers.shadowCastWidget.visible = false;
        globalLayers.shadowCastWidget.visibleElements.tooltip = false;
        globalLayers.removeShadowIrradianceMap()
      }
    }
    setActivStatus(status);
  };

  const handleDrawbyInferType = (e: any) => {
    const { value } = e;
    handleObsDrawType(value, dispatch, globalLayers);
    setFromData({ ...formdata, infratype: value });
    removeInfraObject(true)
  };

  const handleSave = () => {
    if (selectedRowIndex1.length > 1) {
      console.warn("Multiple Infra can not be edited at once.");
      return;
    }
    if (globalLayers.sketchViewModel_Draw.activeTool !== null) {
      if (globalLayers.sketchViewModel_Draw.activeTool !== "reshape") {
        toast.info("Complete your draw first.", {
          toastId: toast_id,
        });
        return;
      }
    }

    if (!formdata.infratype || !formdata.infraheight || !formdata.infraoffset) {
      toast.error("Both height & offset is Required", { toastId: toast_id });
      return;
    }
    let cloned_infra = null as Graphic | null;
    if (selectedRowIndex1.length && enableEditRow === true) {
      const selectedRowData = infraDesignData[selectedRowIndex1[0]];
      cloned_infra = globalLayers.getGraphicbyItsName(selectedRowData.name);
    } else {
      cloned_infra = globalLayers.getGraphicbyUID(globalLayers.lastdrawnGraphicUID);
    }
    if (!cloned_infra) return;



    // let cloned_infra = found.clone();
    cloned_infra.attributes = {
      ...cloned_infra.attributes,
      height: parseInt(formdata.infraheight),
      offset: parseInt(formdata.infraoffset),
      type: formdata.infratype,
    };

    // globalLayers.removeGraphicbyName(cloned_infra.getAttribute("name"));
    // globalLayers.addSketchGraphic(cloned_infra);

    if (enableEditRow && selectedRowIndex1.length === 1) {
      dispatch(
        updateInfraDesignData({
          uid: (cloned_infra as any).uid,
          name: cloned_infra.getAttribute("name"),
          infraheight: formdata.infraheight,
          infraoffset: formdata.infraoffset,
          // graphic: JSON.stringify(cloned_infra)
        })
      );
    } else {
      dispatch(
        setInfraDesignData({
          ...formdata,
          infraType: formdata.infratype,
          uid: (cloned_infra as any).uid,
          totalarea: cloned_infra.getAttribute("totalarea"),
          name: cloned_infra.getAttribute("name"),
          graphic: JSON.stringify(cloned_infra),
        })
      );
    }

    dispatch(addNewRow(null))
    setEnableEditRow(false);
    setFromData({ infraheight: "", infraoffset: "", infratype: "" });
    setselectedRowIndex(null);
    setselectedRowIndex1([]);
  };

  const handleEdit = () => {
    if (selectedRowIndex1.length === 0) return;
    const obs = infraDesignData[selectedRowIndex1[0]];
    if (!enableEditRow) {
      setFromData({
        infraheight: obs.infraheight,
        infraoffset: obs.infraoffset,
        infratype: obs.infraType,
      });
    }
    setEnableEditRow(true);
  };

  const removeInfraObject = (justGraphic: boolean = false) => {
    if (selectedRowIndex === null && newRow !== null) {
      if (globalLayers.sketchViewModel_Draw.activeTool) {
        globalLayers.sketchViewModel_Draw.cancel();
      }
      if (
        infraDesignData.length !==
        globalLayers.sketchLayers.graphics.length - 1
      ) {
        // remove the extra graphic if drawn but clicked on delete
        const names = infraDesignData.map((item) => item.name);
        globalLayers.sketchLayers.graphics.forEach((graphic) => {
          const graphicName = graphic.getAttribute("name") as string;
          if (
            graphic.attributes &&
            !graphicName.includes(buildingBase) &&
            !names.includes(graphicName)
          ) {
            globalLayers.sketchLayers.graphics.remove(graphic);
          }
        });
      }
      if (!justGraphic) {
        dispatch(addNewRow(null));
      }
      return;
    }
    if (selectedRowIndex === null)
      // return toast.error("Select an item first.", { toastId: toast_id });
    if (selectedRowIndex1.length === 0) return;
    if (selectedRowIndex1.length >= 1) {
      selectedRowIndex1.forEach((ind) => {
        if(infraDesignData.length > 0){
          const selectedRowData = infraDesignData[ind];
          if (globalLayers.removeGraphicbyName(selectedRowData.name)) {
            dispatch(removeInfraDesignData(selectedRowData.name));
          }
        }
      });
    }
    setselectedRowIndex1([]);
    setselectedRowIndex(null);
  };

  const handleGraphicSelection = (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e.target;
    
    const selectedRowData = infraDesignData[id];
    const graphic = globalLayers.selectGraphicbyName(
      selectedRowData.name
    ) as Graphic;
    // Create a reference to the `updateGraphics` array for easier manipulation
    const updateGraphics = globalLayers.sketchViewModel_Draw.updateGraphics;

    if (checked) {
      if (!selectedRowIndex1.includes(id)) {
        selectedRowIndex1.push(id);
      }
      if (!graphic) {
        setselectedRowIndex(null);
        if (selectedRowIndex1.includes(id)) {
          setselectedRowIndex1(selectedRowIndex1.filter((ele) => ele !== id));
        }
        return;
      }
      // Add the graphic to `updateGraphics` if it's not already present
      if (
        !updateGraphics.some(
          (g) => g.getAttribute("name") === graphic.getAttribute("name")
        )
      ) {
        const grArray = Array.from(
          updateGraphics.filter(
            (ele) => (ele as any).uid !== (graphic as any).uid
          )
        );
        grArray.push(graphic);
        // Manually create a new array for update
        globalLayers.sketchViewModel_Draw.update(grArray); // Update with new graphic
      }
    } else {
      
      if (!graphic) {
        setEnableEditRow(false);
        setselectedRowIndex(null);
        if (selectedRowIndex1.includes(id)) {
          setselectedRowIndex1(selectedRowIndex1.filter((ele) => ele !== id));
        }
        return;
      }
      if(enableEditRow){
        setFromData({ infraheight: '', infraoffset: '', infratype: ''})
      }
      const filteredGraphics = updateGraphics.filter((g) => g.getAttribute("name") !== graphic.getAttribute("name"));
      if (!filteredGraphics.length) {
        setEnableEditRow(false);
        setselectedRowIndex(null);
        if (selectedRowIndex1.includes(id)) {
          setselectedRowIndex1(selectedRowIndex1.filter((ele) => ele !== id));
        }
        if(globalLayers.sketchViewModel_Draw.updateGraphics.length){
          globalLayers.sketchViewModel_Draw.cancel()
        }
        return;
      }
      const newGraphicsArray = Array.from(filteredGraphics);
      globalLayers.sketchViewModel_Draw.update(newGraphicsArray); // Update with filtered graphics
      setselectedRowIndex(null);
      if (selectedRowIndex1.includes(id)) {
        setselectedRowIndex1(selectedRowIndex1.filter((ele) => ele !== id));
      }
      setEnableEditRow(false);
    }
  };

  // console.log(selectedRowIndex1, 'out')
  const handleRoofGen = async () => {
    globalLayers.cancelDrawActiveTool()
    const graphic = await getGeometryAfterObsctructionCutoff(globalLayers);
    if (!graphic) return;
    // to remove any solar panles previously generated
    globalLayers.removeSolarPanelLayer();
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

  const groupedOption = () => {
    let value = [] as { label: string, options: any[] }[]
    const uniqueCatagory = new Set(infratype.map(el => el.category));
    uniqueCatagory.forEach(ele => {
      let labels = {} as any;
      infratype.forEach(el => {
        if (ele === el.category) {
          labels['label'] = el.category;
          let ll = { label: <div style={{ display: "flex", alignItems: "center", gap: 5, whiteSpace: 'nowrap' }}> {el.type === 'circle' ? <div className="w-1vh"><IconSelCircle /></div> : el.type === 'rectangle' ? <div className="w-1vh"><IconSelRectangle /></div> : <div className="w-1vh"><IconSelTriangle /></div>}{el.name}</div>, value: el.name };
          if (labels.options && labels.options.length) {
            labels['options'] = [...labels?.options, ll];
          } else {
            labels.options = [ll];
          }
        }
      })
      value.push(labels);
    });
    setGroupedOptions(value);
  };

  const filterOption = ({ label, value }: { label: any; value: any; }, string: any) => {
    if (value.includes(string) || value.includes(string)) return true;
    return false;
  };

  // to show heat map on the sceneview 
  const handleShadowHeatMap = async () => {
    globalLayers.removeShadowIrradianceMap();
    if(!activestatus) return;
    if(!activeIrradiance){
      // await updateShadowPointsRender();
      await getShadowPointPolygon()
    } else {
      globalLayers.removeShadowIrradianceMap()
    }
    setActivIrradiance(!activeIrradiance)
  }

  useEffect(() => {
    groupedOption();
  },[])

  return (
    <>
      <div className='main-section1'>
        <div className="para-md">Keepout Details <span className="text-red-500">*</span></div>
        <div className="grid grid-cols-1">
          {/* <Input placeholder="Select Keepout" name={""} value={""} type={"number"} onChange={() => { }} /> */}
          <ReactSelect filterOptions={filterOption} placeholder="Select an option" 
            closeMenuOnSelect={true} 
            onChange={handleDrawbyInferType}  
            options={groupedOptions} 
            disabled={selectedProject.isepccomplete || is3DMap}
            name="keepouts"
            value={formdata.infratype ? {label:(<div style={{display:"flex",alignItems:"center"}}>
              {getElementByIndex(filterKeyIncludeArr(infratype, 'name', formdata.infratype),0, 'type') ==='circle'?<IconSelCircle/> : 
              getElementByIndex(filterKeyIncludeArr(infratype, 'name', formdata.infratype),0, 'type') ==='rectangle'?<IconSelRectangle/>:<IconSelTriangle/>}
              {getElementByIndex(filterKeyIncludeArr(infratype, 'name', formdata.infratype),0, 'name')}
              </div> as any),value:getElementByIndex(filterKeyIncludeArr(infratype, 'name', formdata.infratype),0, 'name')} : null} 
              />

          <div className="grid grid-cols-2 gap-x-2">
            <Input disabled={selectedProject.isepccomplete || is3DMap}  suftext="m" max={'15'} onKeyPress={(e: any) => isNumberValidate(e)} classNames='positiveInt noDecimal' placeholder="Height" type="number" name="infraheight" value={formdata.infraheight} onChange={(e) => handleChange(e)} />
            <Input disabled={selectedProject.isepccomplete || is3DMap} suftext="m" max='5' onKeyPress={(e: any) => isNumberValidate(e)} classNames='positiveInt twoDecimal' placeholder="Offset" name={"infraoffset"} value={formdata.infraoffset} type={"number"} onChange={(e) => handleChange(e)} />
          </div>
        </div>
        <div className="flex justify-end mt-[10px]">
          <Button disabled={selectedProject.isepccomplete || is3DMap} className="btn btn-xs-primary" name="Draw Keepout" onClick={handleSave} />
        </div>
        <KeepoutDetailsTable 
          removeInfraObject={removeInfraObject} 
          selectedRowIndex1={selectedRowIndex1} 
          setselectedRowIndex1={setselectedRowIndex1} 
          formdata={formdata} 
          setFromData={setFromData} 
          enableEditRow={enableEditRow} 
          setEnableEditRow={setEnableEditRow} 
          handeleEdit={() => handleEdit()} 
          setselectedRowIndex={setselectedRowIndex}
          handleGraphicSelection={handleGraphicSelection}
          
          selectedRowIndex={selectedRowIndex}
        />
      </div>
      <div className='main-section1'>
        <div className="para-md">Module Structure Details <span className="text-red-500">*</span></div>
        <ModuleAndMSSMain roofNum={roofNum} />
        <div className="flex justify-end mt-[10px]">
          <Button className="btn btn-xs-primary" name="Update Strcuture" onClick={handleRoofGen} />
        </div>
      </div>
    </>
  );
};

export default memo(Keepouts);
