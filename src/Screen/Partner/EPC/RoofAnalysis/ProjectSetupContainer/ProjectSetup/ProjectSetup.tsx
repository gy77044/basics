import { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IconInfo } from "../../../../../../assests/icons/DrawerIcons";
import NewInput from "../../../../../../Components/New/Input/NewInput";
import SelectPicker from "../../../../../../Components/New/Select/SelectPicker";
import { contentlist } from "../../../../../../Containers/DefaultLayouts/AsideRouteLists";
import { ProjectTy } from "../../../../../../ReduxTool/Slice/Auth/types";
import { dataSourceResType, EPCProjectSetupType, getModuleCapacity, getModuleManufacturer, getPVModuleDetailsById, getWeatherDataSource, moduleCapacityType, setModuleCapacity, setRoofAnalysisProjectSetupDetails } from "../../../../../../ReduxTool/Slice/Partner/EPC";
import { getTerrifData } from "../../../../../../ReduxTool/Slice/CommonReducers/CommonActions";
import { useAppDispatch, useAppSelector } from "../../../../../../ReduxTool/store/hooks";
import { checkValue, filterKeyIncludeArr, formatReactSelectOptions, getElementByIndex } from "../../../../../../Utils/commonFunctions";
import { getCoordinatesFromAddress, getStateFromCoordinates } from "../../../../../../Utils/EPCMaps/Maps/LazyloadMap";
import ProjectDetailsTable from "./WeatherDetailsTable";
import { getStateDiscom } from "../../../../../../ReduxTool/Slice/CommonReducers/CommonActions";
import { IallTypestate, ITariffType } from "../../../../../../ReduxTool/Slice/CommonReducers/types";
const ProjectSetup = () => {
  const dispatch = useAppDispatch();
  const { title } = useAppSelector(state => state.drawer);
  const { roofAnalysis: { moduleManufacturer, dataSource, moduleCapacity, formDetails, selectedProject }, projectDetails } = useAppSelector(state => state.EPCDetails);
  const { user: { country_mstr } } = useAppSelector(state => state.auth);
  const {is3DMap} = useAppSelector(state=>state.mapref)
  const { allDiscom } = useAppSelector(state => state.commonReducers);
  const { providertype } = useAppSelector((state) => state.commonReducers);
  const [WeatherData, setWeatherData] = useState<string[]>(["OPENMETEO", "NSRDB"])
  const selectedprojectDetails = selectedProject as ProjectTy;
  useEffect(() => {
    
    if(selectedprojectDetails && selectedprojectDetails.projectid){
      getModuleManufacturerFun(selectedprojectDetails);
    }else{
      getInitialLists();
    };
  }, []);
  const getInitialLists = async () => {
    await dispatch(getModuleManufacturer(""));
    const coordinates = await getCoordinatesFromAddress(selectedprojectDetails.address);
    if(coordinates?.latitude && coordinates?.longitude){
      const stName = await getStateFromCoordinates( coordinates!.longitude,coordinates!.latitude);
      await dispatch(getStateDiscom(stName));
    };
  };
  const getModuleManufacturerFun = async (projectDetails: ProjectTy) => { ///*value: string, id?: string*/) => {
    try{
      await dispatch(getModuleManufacturer(projectDetails?.pvmodule?.manufacturer));
      await dispatch(getPVModuleDetailsById(projectDetails.pvmodid));
      const stName = await getStateFromCoordinates(projectDetails.lng, projectDetails.lat);
      const { payload: allDiscom } = await dispatch(getStateDiscom(stName));
      const { payload: providertype } = await dispatch(getTerrifData(projectDetails.providerid))
      let weatherPayload ={} as dataSourceResType;
      if(projectDetails.weatherdatasource){
        const {payload} = await dispatch(getWeatherDataSource({ searchValue: "", id: projectDetails.weatherdatasource }));
        weatherPayload = payload;
      };
      let moduleCapacity = [] as moduleCapacityType[];
      if(projectDetails.pvmodule && projectDetails.pvmodule.manufacturer){
        const { payload } = await dispatch(getModuleCapacity(projectDetails.pvmodule.manufacturer));
        moduleCapacity = payload;
      };
      await updateFormDetails(projectDetails, moduleCapacity, weatherPayload, allDiscom, providertype);
    }catch(err:any){
      console.log(err);
      toast.error(err.message);
    }
  };

  const updateFormDetails = async (projectDetails: ProjectTy, moduleCapacity: moduleCapacityType[], weatherdatasource: dataSourceResType, allDiscom: IallTypestate[], providertype: ITariffType[]) => {    
    let updatedForm: EPCProjectSetupType = {
      projectname: checkValue(projectDetails.projectname),
      projectid: checkValue(projectDetails.projectid),
      address: checkValue(projectDetails.address),
      lat: checkValue(projectDetails.lat?.toFixed(4)),
      lng: checkValue(projectDetails.lng?.toFixed(4)),
      sanctionload: checkValue(projectDetails.sanctionload),
      modulemanufacturer: checkValue(projectDetails.pvmodule?.manufacturer),
      // weatherdatasource: weatherdatasource.type ? `${updateDataSourceName(weatherdatasource.type)} ${projectDetails.lat?.toFixed(4)},${projectDetails.lng?.toFixed(4)}` : "",
      meteringpoint: checkValue(projectDetails.meteringpoint),
      connectedvoltage: checkValue(projectDetails.connectedvoltage),
      modulecapacity: getElementByIndex(filterKeyIncludeArr(moduleCapacity, "id", projectDetails.pvmodid), 0, "name"),
      loading: checkValue(projectDetails.loading),
      moduleorientation: checkValue(projectDetails.moduleorientation),
      providerid: formatReactSelectOptions(filterKeyIncludeArr(allDiscom, "providerid", projectDetails.providerid), {labelKey:"providerid",valueKey:"providername"},true),
      consumercategoryid: formatReactSelectOptions(filterKeyIncludeArr(providertype, "consumercategoryid", projectDetails.consumercategoryid), {labelKey:"consumercategoryid",valueKey:"consumercategoryname"},true),
    }
    dispatch(setRoofAnalysisProjectSetupDetails(updatedForm));
  }

  //form handler
  const handleChange = async (e: any) => {
    const { name, value }: { name: string, value: any } = e.target;
    let formData = { ...formDetails.projectsetup, [name]: value! };
    if(name === ''){
      
    }
    if (name === "modulemanufacturer") {
      formData.modulecapacity = "";
      await dispatch(getModuleManufacturer(value));
      dispatch(setModuleCapacity([]))
    };
    dispatch(setRoofAnalysisProjectSetupDetails(formData));
  }
  const updateDataSourceName = (type: string) => {
    let isDetails = "";
    if (type === "NsrdbData") {
      isDetails = "NSRDB";
    } else if (type === "Openmetio") {
      isDetails = "OPENMETEO";
    }
    return isDetails;
  }
  const handleClick = async (props: { name: string, value: string }) => {
    const { name, value } = props;
    let formData = { ...formDetails.projectsetup, [name]: value! };
    if (name === "modulemanufacturer") {
      formData.modulecapacity = "";
      await dispatch(getModuleCapacity(value))
    }else if(name == "modulecapacity"){
      const moduleid = getElementByIndex(filterKeyIncludeArr(moduleCapacity, "name", value), 0, "id");
      dispatch(getPVModuleDetailsById(moduleid));
    } else if (name === "weatherdatasource") {
      let weatherValue = value.split(" "), isDetails = "";
      if (weatherValue[0] === "NSRDB") {
        isDetails = "NsrdbData";
      } else if (weatherValue[0] === "OPENMETEO") {
        isDetails = "openmetio";
      }
      await dispatch(getWeatherDataSource({ searchValue: `${weatherValue[1].replace(',', "/")}/${isDetails}`, id: '' }));
    } else if (name === "providerid") {
      await dispatch(getTerrifData(getElementByIndex(filterKeyIncludeArr(allDiscom, "providername", value), 0, "providerid")));
    };
    dispatch(setRoofAnalysisProjectSetupDetails(formData));
  };

  return (
    <div className="body-main space-y-[3vh]">
        <div className="table-main">
          <table className="table">
            <thead className="thead">
              <tr>
                <th className="hvalue">Name</th>
                <th className="hvalue">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="trow">
                <td className="rvalue">No of Modules</td>
                <td className="rvalue">165 (46.2kWp)</td>                             
              </tr>
              <tr className="trow">
                <td className="rvalue">Total Area</td>
                <td className="rvalue">332.6 sq m</td>                              
              </tr>            
            </tbody>
          </table>
        </div>
   <div className="h2"></div>
      <NewInput disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"projectname"} labelname={"Project Name"} name={"projectname"} value={formDetails.projectsetup.projectname} type={"text"} onChange={handleChange} star={true} icon={<IconInfo />} />
      <div title={`${formDetails.projectsetup.address.length ? formDetails.projectsetup.address : 'Project Complete Address'}`}>
        <NewInput disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"projectCompleteAddress"} labelname={"Project Complete Address"} name={"address"} value={formDetails.projectsetup.address.length && formDetails.projectsetup.address} type={"text"} onChange={handleChange} star={true} icon={<IconInfo />} />
      </div>
      <NewInput disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"projectdcCap"} labelname={"Project DC Capacity (kWp)"} name={"sanctionload"} value={formDetails.projectsetup.sanctionload} type={"text"} onChange={handleChange} star={true} icon={<IconInfo />} />
      <NewInput disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"projectacCap"} labelname={"loading(in %)"} name={"loading"} value={formDetails.projectsetup.loading} type={"text"} onChange={handleChange} star={true} icon={<IconInfo />} />
      {allDiscom.length > 0 && <>
        {/* <SelectPicker disabled={selectedprojectDetails.isepccomplete || is3DMap} onClick={handleClick} onChange={handleChange} value={formDetails.projectsetup.providerid!} id={"provider"} name={"providerid"} labelname="Select Provider" data={allDiscom.map((el: any) => ({ label: el.providername, value: el.providerid }))} isUpload={false} star={false} icon={<IconInfo />} content={contentlist.content2} isFilter={true} /> */}
        {/* <SelectPicker disabled={selectedprojectDetails.isepccomplete || is3DMap} onClick={handleClick} onChange={handleChange} value={formDetails.projectsetup.consumercategoryid!} id={"consumercategoryid"} name={"consumercategoryid"} labelname="Select Provider Type" data={providertype.map((el: any) => ({ label: el.consumercategoryname, value: el.consumercategoryid }))} isUpload={false} star={false} icon={<IconInfo />} isFilter={true} content={contentlist.content2} /> */}
      </>}
      <div className="lsb-heading">Module Details</div>
      <SelectPicker disabled={selectedprojectDetails.isepccomplete || is3DMap} isRecomm={true} onClick={handleClick} onChange={handleChange} value={formDetails.projectsetup.modulemanufacturer} id="modulemanufacturer" name="modulemanufacturer" labelname="Module Manufacturer" data={moduleManufacturer?.map((el: any) => ({ label: el.manufacturer, value: el.manufacturer }))??[]} isUpload={true} star={true} icon={<IconInfo />} content={contentlist.content2} />
      <SelectPicker disabled={selectedprojectDetails.isepccomplete || is3DMap} onClick={handleClick} onChange={handleChange} value={formDetails.projectsetup.modulecapacity} isFilter={true} id="modulecapacity" name="modulecapacity" labelname="Module Capacity" data={moduleCapacity.map((el: any) => ({ label: el.name, value: el.id }))} isUpload={true} star={true} icon={<IconInfo />} content={contentlist.content2} />
      <SelectPicker disabled={selectedprojectDetails.isepccomplete || is3DMap} onClick={handleClick} onChange={handleChange} value={formDetails.projectsetup.moduleorientation} id="modulecapacity" name="moduleorientation" labelname="Module Orientation" data={[{ label: "Landscape", value: "Landscape" }, { label: "Portrait", value: "Portrait" }]} isUpload={false} star={true} icon={<IconInfo />} content={contentlist.content2} />
      <NewInput disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"meteringpoint"} labelname={"No of Metering Point"} name={"meteringpoint"} value={formDetails.projectsetup.meteringpoint} type={"number"} onChange={handleChange} star={true} icon={<IconInfo />} />
      <NewInput disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"connectedvoltage"} labelname={"Connected Voltage"} name={"connectedvoltage"} value={formDetails.projectsetup.connectedvoltage} type={"number"} onChange={handleChange} star={true} icon={<IconInfo />} />
      <div className="lsb-heading">Weather Data Details</div>
      {/* <SelectPicker disabled={selectedprojectDetails.isepccomplete || is3DMap} isFilter={true} onClick={handleClick} onChange={handleChange} value={formDetails.projectsetup.weatherdatasource!} id="weatherdatasource" name="weatherdatasource" labelname="Weather Data Source" data={WeatherData.map((el: any) => ({ label: `${el} ${formDetails.projectsetup.lat},${formDetails.projectsetup.lng}`, value: `${el} ${formDetails.projectsetup.lat},${formDetails.projectsetup.lng}` }))} isUpload={false} star={true} icon={<IconInfo />} content={contentlist.content2} /> */}
      {/* <ProjectDetailsTable /> */}
    </div>
  );
};

export default memo(ProjectSetup)
