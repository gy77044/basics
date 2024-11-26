import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IconClose } from '../../../../../../assests/icons/ModalIcons'
import { Input, InputRadio2, TableCheckBtn } from '../../../../../../Components/AllInput/AllInput'
import { FileData } from '../../../../../../Components/DropDown/Dropdown'
import Modal from '../../../../../../Components/New/Modal/Modal'
import ReactSelect from '../../../../../../Components/New/Select/ReactSelect'
import DragNDrop from '../../../../../../Components/Upload/DragNDrop'
import { ProjectTy } from '../../../../../../ReduxTool/Slice/Auth/types'
import { getTerrifData } from '../../../../../../ReduxTool/Slice/CommonReducers/CommonActions'
import { getModuleCapacity, getModuleInveter, getModuleInveterById, getModuleInveterCapacity, getModuleManufacturer, getPVModuleDetailsById, setInveterCapacity, setInveterManufacturer, setInveterModuleCapacity, setModulecapacity, setModuleInfo, setModuleManufacturer, setRoofDetailsError, setStringSize, setstructureDetails, structureDetailsType } from '../../../../../../ReduxTool/Slice/Partner/EPC'
import { useAppDispatch, useAppSelector } from '../../../../../../ReduxTool/store/hooks'
import { baseURL, requestUrl } from '../../../../../../Utils/baseUrls'
import { plantCapacitybyUseableArea } from '../../../../../../Utils/Common/PlantCapacity/plantCapacitybyUseableArea'
import { formatReactSelectOptions, isTruthy, updateErrorFields, useDebounce } from '../../../../../../Utils/commonFunctions'
import { labelIndexType } from '../../../../../../Utils/Const'
import globalLayers from '../../../../../../Utils/EPCMaps/Maps/GlobaLMap'
import { isNumberValidate } from '../../../../../../Utils/Regex'
import { InputActionMeta } from 'react-select'
import Toast from '../../../../../../Components/ErrorBoundry/Toast'
const tooltipcontent = {
  content1: `The number of solar modules that fit in a given area by dividing the total available area by the area of one module. The result is rounded to determine how many full solar panels can be installed.`,
  content2: `The total usable area is calculated by multiplying the roof area by 0.7 for metal roofs and 0.9 for RCC roofs.`,
  content3: `Calculates the maximum plant capacity based on the default module power and the total number of modules.`
}
const invertorTypeRadio = [{ label: "On Grid", value: "onGrid" }, { label: "Off Grid", value: "offGrid" }, { label: "Hybrid", value: "hybrid" }];
const roofTypeList = [{ id: "BIPV", type: "BIPV Roof" }, { id: "Tile", type: "Tile Roof" }, { id: "Metal", type: "Metal Roof" }, { id: "RCC", type: "RCC Roof" }, { id: "Carpark", type: "Carpark Roof" }]
const titleDirection = [{ label: "A-B" }, { label: "B-C" }, { label: "C-D" }, { label: "D-A" }];

const Mechanical = ({ roofNum }: { roofNum: number }) => {
  const dispatch = useAppDispatch();
  const { roofAnalysis: { roofDetails, moduleManufacturer, moduleCapacity, moduleInverter, moduleInverterCapacity, roofDesign, moduleDetails, selectedProject } } = useAppSelector(state => state.EPCDetails);
  const { is3DMap } = useAppSelector(state => state.mapref);
  const selectedprojectDetails = selectedProject as ProjectTy;
  const [fileInverterDetails, setFileInverterDetails] = useState<any>("")
  const [inverterFileModal, setInverterFileModal] = useState<boolean>(false)
  const [InverterFileName, setInverterFileName] = useState("");
  const structureDetailsError = roofDetails[roofNum]?.error ?? {};
  let currentController: AbortController | null = null;

  useEffect(() => {
    if (selectedprojectDetails && !selectedprojectDetails.pvmodid) {
      initialDataBiding()
    }
  }, []);
  useEffect(() => {
    if (Object.keys(moduleDetails).length > 0 && roofDetails[roofNum].structureDetails.sanctionload) {
      globalLayers.roofType = roofDetails[roofNum].structureDetails.rooftype.label
      const dcCapacity = parseFloat(roofDetails[roofNum].structureDetails.sanctionload);
      const noofModules = Math.floor((dcCapacity * 1000) / globalLayers.defaultmodulePower);
      globalLayers.totalNumberofModules = noofModules;
      dispatch(setModuleInfo({ totalModules: noofModules.toString(), defaultmodulePower: globalLayers.defaultmodulePower.toString() }))
    }
  }, [moduleDetails, roofDetails[roofNum].structureDetails.sanctionload, roofDesign.useablearea]);

  useEffect(() => {
    if (moduleCapacity && moduleCapacity.length) {
      handleChange({ name: "modulecapacity", value: { label: moduleCapacity[0].name, value: moduleCapacity[0].id } });
    }
  }, [moduleCapacity.length]);

  useEffect(() => {
      if (roofDetails[roofNum].structureDetails.modulecapacity && roofDetails[roofNum].structureDetails.sanctionload && !isTruthy(structureDetailsError.sanctionload) ) {
        moduleInveter(roofDetails[roofNum].structureDetails.inveterManufacturer?.label??"", roofDetails[roofNum].structureDetails.sanctionload, roofDetails[roofNum].structureDetails.modulecapacity?.value);
      }
  }, [roofDetails[roofNum].structureDetails.modulecapacity?.value, roofDetails[roofNum].structureDetails.sanctionload]);

  const initialDataBiding = async () => {
    try {
      const { payload: moduleManufacturer } = await dispatch(getModuleManufacturer(""));
      if (typeof moduleManufacturer !== "string") {
        dispatch(setModuleManufacturer({ label: moduleManufacturer[0].manufacturer, value: moduleManufacturer[0].id }));
        const { payload: moduleCapacity } = await dispatch(getModuleCapacity(moduleManufacturer[0].manufacturer));
        if (typeof moduleCapacity !== "string") {
          dispatch(setModulecapacity({ label: moduleCapacity[0].name, value: moduleCapacity[0].id }));
        }
      };
    } catch (err: any) {

    }
  };
  const moduleInveter = useDebounce(async (searchValue: string, sanctionload?: string, pvModuleID?: string) => {

    // Cancel previous request if it exists
    if (currentController) {
      currentController.abort();
    }

    // Create a new controller for the current request
    currentController = new AbortController();
    const signal = currentController.signal;

    

    try {
      const { payload }: any = await dispatch(getModuleInveter({ searchValue, pvModuleID, sanctionload }));
      if (typeof (payload) === "string") throw new Error(payload);
      if (payload && payload.length > 0) {
        dispatch(setInveterManufacturer({ label: payload[0].manufacturer, value: payload[0].id }));
        dispatch(setStringSize(payload[0].maxSeriesModules.toString()));
        const { payload: inverterCapacity } = await dispatch(getModuleInveterCapacity(payload[0].manufacturer.split(" | ")[0]));
        if (typeof inverterCapacity !== "string") {
          dispatch(setInveterCapacity({ label: inverterCapacity[0].name, value: inverterCapacity[0].id }))
        }
        dispatch(getModuleInveterById(payload[0]?.id));
      };
    } catch (err: any) {
      console.log(err);
      dispatch(setInveterModuleCapacity([]));
      err?.message && toast.error(err.message, { toastId: "module manufacturer" });
    }
  },1500);
  const handleModuleDetails = (value: string) => {
    let maxdcCapacity = 0;;
    if (roofDesign.totalModules !== '') {
      let defaultmodulePower = value.split('|')[0]?.split(' ')[0];
      globalLayers.defaultmodulePower = parseFloat(defaultmodulePower)
      globalLayers.roofType = roofDetails[roofNum].structureDetails.rooftype.label
      const stc = parseFloat(defaultmodulePower)
      const sactionedLoad = parseFloat(roofDetails[roofNum].structureDetails.sanctionload);
      const noofModules = Math.floor((sactionedLoad * 1000) / stc);
      console.log(noofModules, 'no')
      globalLayers.totalNumberofModules = noofModules;
      dispatch(setModuleInfo({ totalModules: noofModules.toString(), defaultmodulePower: defaultmodulePower }));
      maxdcCapacity = plantCapacitybyUseableArea(globalLayers.totalUseableRoofArea, globalLayers.defaultmodulePower);
    };
    return maxdcCapacity;
  };

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (files && files.length > 0) {
      const fNames: FileData[] = [];
      let file = "" as any
      for (let i = 0; i < files.length; i++) {
        file = files[i]
        // setFileModuleDetails(file)

        const fileExtension = "." + file.name.split(".").slice(1).join(".").toLowerCase().trim();
        if (fileExtension !== ".pan") {
          return toast.error("File not valid.");
        }
        if (file.size <= 10 * 1024 * 1024) {
          // Limit to 10MB
          fNames.push({ name: file.name, icon: file.name.split(".")[1]?.toUpperCase().trim() || "", file: file, });
        } else {
          alert(
            `File ${file.name} exceeds the maximum size of 10MB and will not be uploaded.`
          );
        }
      }
      // setFileModuleDetails(file)
      // setModuleFileName(file.name)

    }

  }, []);
  const mecProjectDetails = [
    { Name: "No of Modules", Details: roofDesign.totalModules === "NaN" ? 0 : roofDesign.totalModules },
    { Name: "Max Plant Capacity (as per roof area)", Details: `${roofDetails[roofNum].structureDetails.maxplantcapacity ? roofDetails[roofNum].structureDetails.maxplantcapacity : 0} kWp` },
    { Name: "Total Roof Area", Details: `${roofDesign.totalarea} sq m` },
    // { Name: "Total Roof Area", Details: `${roofDetails[roofNum].structureDetails.maxplantcapacity ? roofDetails[roofNum].structureDetails.maxplantcapacity : 0} kWp` },
    { Name: "Total Usable Area", Details: `${roofDesign?.useablearea?.toFixed(2) ?? 0} sq m` }
  ]


  const InverterFileUploadModal = () => {
    return (
      <>
        <div className="overflow-hidden">
          <DragNDrop onFileChange={(e) => handleFileChange(e.target.files)} uploadTitle={"Drag files here or click here to import items."} subTitle='' fileSize={"10MB"} acceptfile=".ond" />
          {InverterFileName && <div className="mt-2 flex justify-center items-center text-primary-200 bg-primary-700/40 p-1 rounded-default w-fit">
            <div className="font-semibold text-1.4xl leading-[2.8vh] t">{InverterFileName}</div>
            <button className="ml-2 text-red-500 hover:text-red-700" onClick={handleRemoveFile}>
              <IconClose />
            </button>
          </div>}
        </div>
      </>
    )
  }

  const handleInverterFileModal = async () => {
    if (fileInverterDetails) {
      try {
        const formDataModule = new FormData();
        formDataModule.append('file', fileInverterDetails)
        const { data } = await baseURL.post(requestUrl.inverterFileUpload, formDataModule);
        if (data.code === "200") {
          // const reducerbody = {name: `${data.responseData.paco} Wp | ${data.responseData.vac} V | ${data.responseData.cec_hybrid}`,id:data.responseData?.pvinvid ,manufacturer:data.responseData?.name,seriesModules:"",parallelStrings:"",numberOfInverters:""}
          // dispatch(addPvInverter(reducerbody))
          // let details = { ...roofDetails[roofNum].electricalDetails, inveterManufacturer:data.responseData?.name };
          // details.inveterCapacity=""
          // dispatch(setelectricalDetails(details));
          // await dispatch(getModuleInveterCapacity(data.responseData?.name.split(" | ")[0]));   
          setFileInverterDetails("")
          setInverterFileName("")
          setInverterFileModal(false)
        }
      }
      catch (err: any) {
        console.log(err.msg)
        toast.error(err.msg, { toastId: "module file" })
      }
    }
    else {
      toast.error("File Upload Required", { toastId: "upload file" })
    }
  }

  const handleRemoveFile = () => {
    setFileInverterDetails("")
    setInverterFileName("")
  }

  const handleFileUploadModalClose = () => {
    setFileInverterDetails("");
    setInverterFileName("")
    setInverterFileModal(false)
  }
  // const handleFileChange = async (files: FileList | null) => {
  //   if (files && files.length > 0) {
  //     const fNames: FileData[] = [];
  //     let file = "" as any
  //     for (let i = 0; i < files.length; i++) {
  //       file = files[i]
  //       setFileInverterDetails(file)

  //       const fileExtension = "." + file.name.split(".").slice(1).join(".").toLowerCase().trim();
  //       if (fileExtension !== ".ond") {
  //         return toast.error("File not valid.");
  //       }
  //       if (file.size <= 10 * 1024 * 1024) {
  //         // Limit to 10MB
  //         fNames.push({ name: file.name, icon: file.name.split(".")[1]?.toUpperCase().trim() || "", file: file, });
  //       } else {
  //         alert(
  //           `File ${file.name} exceeds the maximum size of 10MB and will not be uploaded.`
  //         );
  //       }
  //     }
  //     setFileInverterDetails(file)
  //     setInverterFileName(file.name)

  //   }

  // }



  const fetchOptions = useCallback(useDebounce(async (inputValue: string, name: string, prevData: InputActionMeta) => {
    try {
      if(prevData.action !== "input-change") return;
      if (name === "inveterManufacturer") {
        let pvModuleID = roofDetails[roofNum].structureDetails.modulemanufacturer?.value, sanctionload = roofDetails[roofNum].structureDetails.sanctionload;
        if (!pvModuleID && !sanctionload) return;
        await dispatch(getModuleInveter({ inputValue, pvModuleID, sanctionload }));
      } else if (name === "modulemanufacturer") {
        await dispatch(getModuleManufacturer(inputValue));
      }
    } catch (error) {
      console.error("Error fetching search results", error);
    } finally {
      // setIsLoading(false);
    }
  }, 300), []);


  const validateSantionload = useCallback(async (value: string): Promise<boolean> => {
    if (value.length > 4) return false;
    let name = 'sanctionload' as keyof structureDetailsType, isValid: boolean = true;
       if (value) {
      let msg = "";
      if (parseFloat(value) > 20) { msg = "Sanction load must be less than or equal to 20"; isValid = false };
      if (roofDetails[roofNum].structureDetails.maxplantcapacity && parseFloat(value) > parseFloat(roofDetails[roofNum].structureDetails.maxplantcapacity)) {
        msg = `Sanction load must be less or equal to maximum plant capacity ${roofDetails[roofNum].structureDetails.maxplantcapacity} kWp`;
        isValid = false;
      }
      if (msg) {
        dispatch(setRoofDetailsError({ ...roofDetails[roofNum].error, [name]: msg }));
      } else {
        updateErrorFields(roofDetails[roofNum].error, [name], dispatch);
      }
    }
    return isValid;
  }, [roofDetails[roofNum].structureDetails.sanctionload]);
  const handleChange = async (props: any, selectedOption?: any) => {
    let { name, value } = props?.target ?? props;
    if (selectedOption) {
      name = selectedOption.name;
      value = props;
    };
    let details = { ...roofDetails[roofNum].structureDetails, [name]: value }, errorKeys: Array<keyof structureDetailsType> = [name];
    switch (name) {
      case "parapetwall":
        if(value && parseInt(value)>5){
          return;
        }
        globalLayers.parapetwall = typeof value === 'string' ? parseInt(value) : value
        if (value > 10) {
          toast.warning('Parapet Wall must be less or equal to 10', { toastId: 'parapet' })
          return;
        }
        break;
      case "sanctionload":
        let isSanctionloadValid = await validateSantionload(value);
        if (!isSanctionloadValid) return;
        const stc = moduleDetails.stc
        var dcPower = typeof value === 'string' ? parseFloat(value) : value as number;
        const noofModules = Math.floor((dcPower * 1000) / stc);
        globalLayers.totalNumberofModules = noofModules;
        dispatch(setModuleInfo({ totalModules: noofModules.toString() }));
        details.inveterManufacturer = null;
        details.inveterCapacity = null;
        errorKeys = [...errorKeys, 'inveterManufacturer', 'inveterCapacity'];
        break;
      case "azimuthangle":
        if(value && parseInt(value)>360){
          return;
        }
        if (typeof value === 'string') {
          if (value !== '') {
            globalLayers.roofAzimuthAngle(parseInt(value))
            // globalLayers.roofTiltAngleDegree = parseInt(value)
          } else {
            globalLayers.roofAzimuthAngle(0)
            // globalLayers.roofTiltAngleDegree = 0
          }
        }
        globalLayers.roofTiltAngleDegree = value
        break;
      case "tiltangle":
        if(value && parseInt(value)>60){
          return;
        }
        if (typeof value === 'string') {
          globalLayers.addRoofTiltAngle(parseInt(value))
        } else {
          globalLayers.addRoofTiltAngle(value)
        }
        details.tiltdirection = null;
        errorKeys = [...errorKeys, 'tiltdirection'];
        break;
      case "buildingheight":
        if(value && parseInt(value)>99){
          return;
        }
        if (typeof value === 'string') {
          globalLayers.addHeightToBuilding(parseInt(value))
        } else {
          globalLayers.addHeightToBuilding(value)
        }
        break;
      case "modulemanufacturer":
        details.inveterManufacturer = null;
        details.inveterCapacity = null;
        let {payload} = await dispatch(getModuleCapacity(value.label));
        if(typeof payload !== 'string'){
          details.modulecapacity = formatReactSelectOptions([payload[0]],{labelKey:"name",valueKey:"id"},true);
        }
        errorKeys = [...errorKeys, 'modulecapacity', 'inveterManufacturer', 'inveterCapacity'];
        break;
      case "modulecapacity":
        var dcPower = handleModuleDetails(value?.label ?? "");
        details.maxplantcapacity = dcPower.toString();
        details.inveterManufacturer = null;
        details.inveterCapacity = null;
        const moduleid = value.value;
        dispatch(getPVModuleDetailsById(moduleid));
        errorKeys = [...errorKeys, 'inveterManufacturer', 'inveterCapacity'];
        break;
      case "providerid":
        await dispatch(getTerrifData(props.value));
        break;
      case "tiltdirection":
        const direction = props.value;
        const PointstoElevate = [] as number[]
        direction.split('-').forEach((ele: any) => {
          // get the index for selected direction 
          PointstoElevate.push(globalLayers.lableIndexs[ele as keyof labelIndexType])
        });
        globalLayers.removeCornerLabels(PointstoElevate, direction)
        break;
      case "inveterManufacturer":
        if(!props?.isCompatible){
          Toast({messageText:"Selected inveter is not compatible",messageType:"W"})
        }
        details.inveterCapacity = null;
        await dispatch(getModuleInveterCapacity(props.label.split(" | ")[0]));
        dispatch(getModuleInveterById(props.value));
        dispatch(setStringSize(value.maxSeriesModules.toString()));
        errorKeys = [...errorKeys, 'inveterCapacity'];
        break;
      default:
        break;
    };
    dispatch(setstructureDetails(details));
    updateErrorFields(roofDetails[roofNum].error, errorKeys, dispatch);
  };
  const handleInputChange = (newValue: string, name: string, actionMeta: InputActionMeta) => fetchOptions(newValue, name, actionMeta);
  const handleFocusout = (e: any) => {
    const { name, value } = e.target;
    if (name === "sanctionload") {
      validateSantionload(value || "0");
    }
  }
  return (
    <>
      {inverterFileModal && <Modal headerTitle="Upload OND File" btnTitle='Upload' modalSize='md' children={InverterFileUploadModal()} onClick={handleInverterFileModal} closeModal={handleFileUploadModalClose} />}
      <TableCheckBtn tableCaption={`1.2 Site Area Details`} headers={Object.keys(mecProjectDetails[0])} data={mecProjectDetails} />
      <div className='main-section1'>
        <div className="para-md">Load/Module/Inverter Details <span className="text-red-500">*</span></div>
        <div className='grid grid-cols-2 gap-x-2'>
          <Input error={structureDetailsError.sanctionload} key="santionload" name="sanctionload" id="sanctionload" label="Sanctioned Load" type='number' onChange={handleChange} onBlur={handleFocusout} value={roofDetails[roofNum].structureDetails.sanctionload} suftext='kWp' disabled={selectedprojectDetails.isepccomplete || is3DMap} />
          <Input error={structureDetailsError.loading} key="loading" name="loading" label="Project loading" type='number' onChange={handleChange} value={roofDetails[roofNum].structureDetails.loading} suftext='%' disabled={selectedprojectDetails.isepccomplete || is3DMap} />
          <ReactSelect error={structureDetailsError.modulemanufacturer} key="modulemanufacturer" onChange={handleChange} handleInputChange={handleInputChange} onBlurChangeEvent={false} options={formatReactSelectOptions(moduleManufacturer, { labelKey: "manufacturer", valueKey: "id" }, false)} value={roofDetails[roofNum].structureDetails.modulemanufacturer} closeMenuOnSelect={true} labelname='Module Manufacture' name='modulemanufacturer' placeholder='Select an option ..' disabled={selectedprojectDetails.isepccomplete || is3DMap} />
          <ReactSelect error={structureDetailsError.modulecapacity} key="modulecapacity" onChange={handleChange} options={formatReactSelectOptions(moduleCapacity, { labelKey: "name", valueKey: "id" }, false)} value={roofDetails[roofNum].structureDetails.modulecapacity} closeMenuOnSelect={true} labelname='Module Capacity' name='modulecapacity' placeholder='Select an option ..' disabled={selectedprojectDetails.isepccomplete || is3DMap} />
          <div className="main-box2">
            <label className="label-box1">Inverter Type</label>
            <div className="input-main2">
              <InputRadio2 options={invertorTypeRadio} name="inveterType" onChange={handleChange} value={roofDetails[roofNum].structureDetails.inveterType} disabled={selectedprojectDetails.isepccomplete || is3DMap} />
            </div>
          </div>
          <div></div>
          <ReactSelect error={structureDetailsError.inveterManufacturer} key="moduleInverter" onChange={handleChange} handleInputChange={handleInputChange} options={formatReactSelectOptions(moduleInverter, { labelKey: "manufacturer", valueKey: "id",otherKeys:['minSeriesModules','maxSeriesModules','isCompatible'] }, false,"isCompatible")} value={roofDetails[roofNum].structureDetails.inveterManufacturer} closeMenuOnSelect={true} labelname='Inverter Manufacturer' name='inveterManufacturer' placeholder='Select an option ..' disabled={selectedprojectDetails.isepccomplete || is3DMap} />
          <ReactSelect error={structureDetailsError.inveterCapacity} key="moduleInverterCapacity" onChange={handleChange} options={formatReactSelectOptions(moduleInverterCapacity, { labelKey: "name", valueKey: "id" }, false)} value={roofDetails[roofNum].structureDetails.inveterCapacity} closeMenuOnSelect={true} labelname='Inverter Capacity' name='inveterCapacity' placeholder='Select an option ..' disabled={selectedprojectDetails.isepccomplete || is3DMap} />
        </div>
      </div>
      <div className='main-section1'>
        <div className="para-md">Roof Details <span className="text-red-500">*</span></div>
        <div className="grid grid-cols-2 gap-x-2">
          <Input error={structureDetailsError.buildingheight} disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"buildingheight"}  label={"Building Height"} name={"buildingheight"} classNames='positiveInt twoDecimal' value={roofDetails[roofNum].structureDetails.buildingheight} type={"number"} onKeyPress={(e: any) => isNumberValidate(e)} max='100' onChange={handleChange} suftext='m' />
          <Input error={structureDetailsError.parapetwall} disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"parapetwall"} label={"Parapet Wall"} name={"parapetwall"} value={roofDetails[roofNum].structureDetails.parapetwall} type={"number"} onChange={handleChange} suftext='m' />
          <ReactSelect menuPlacement='top' error={structureDetailsError.rooftype} onChange={handleChange} options={formatReactSelectOptions(roofTypeList, { labelKey: "type", valueKey: "type" }, false)} value={roofDetails[roofNum].structureDetails.rooftype} closeMenuOnSelect={true} labelname='Roof Type' name='rooftype' placeholder='Select an option ..' disabled={selectedprojectDetails.isepccomplete || is3DMap} infoDetails={"contentlist.content2"} />
          <Input error={structureDetailsError.azimuthangle} disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"azimuthangle"} label={"Roof Azimuth Angle"} onKeyPress={(e: any) => isNumberValidate(e)} classNames='positiveInt noDecimal' name={"azimuthangle"} value={roofDetails[roofNum].structureDetails.azimuthangle} type={"number"} onChange={handleChange} max='360' suftext='deg' />
          <Input error={structureDetailsError.tiltangle} handlefocus={(e) => globalLayers.removeCornerLabels([])} onKeyPress={(e: any) => isNumberValidate(e)} classNames="positiveInt noDecimal" disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"tiltangle"} label={"Roof Tilt Angle"} name={"tiltangle"} value={roofDetails[roofNum].structureDetails.tiltangle} type={"number"} onChange={handleChange} max={'60'} suftext='deg' />
          <ReactSelect menuPlacement='top' error={structureDetailsError.tiltdirection} onChange={handleChange} onFoucs={() => globalLayers.addCornerLabels()} options={formatReactSelectOptions(titleDirection, { labelKey: "label", valueKey: "label" }, false)} value={roofDetails[roofNum].structureDetails.tiltdirection!} closeMenuOnSelect={true} labelname='Tilt Direction' name='tiltdirection' placeholder='Select an option' disabled={selectedprojectDetails.isepccomplete || is3DMap} infoDetails={"contentlist.content2"} isRequired={parseFloat(roofDetails[roofNum].structureDetails.tiltangle) > 0 ? true : false} />
        </div>
      </div>
    </>
  );
};

export default Mechanical;
