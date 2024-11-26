import { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IconInfo } from "../../../../../../assests/icons/DrawerIcons";
import { TableCheckBtn } from "../../../../../../Components/AllInput/AllInput";
import ReactSelect from "../../../../../../Components/New/Select/ReactSelect";
import { ProjectTy } from "../../../../../../ReduxTool/Slice/Auth/types";
import { getWeatherDataSource, setweatherdatadetails } from "../../../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector } from "../../../../../../ReduxTool/store/hooks";
import { checkValue, updateRoofAnalysisErrorFields } from "../../../../../../Utils/commonFunctions";


const WeatherData = () => {
  const dispatch = useAppDispatch();
  const { roofAnalysis: { moduleCapacity, formDetails, selectedProject, error } } = useAppSelector(state => state.EPCDetails);
  const [WeatherData, setWeatherData] = useState<string[]>(["OPENMETEO", "NSRDB"])
  const [CorrosionData, setCorrosionData] = useState<string[]>(["C1 - Corrosivity Very Low", "C2 - Corrosivity Low", "C3 - Corrosivity Medium", "C4 - Corrosivity High", "C5 - Corrosivity Very High"])
  const selectedprojectDetails = selectedProject as ProjectTy;
  const { is3DMap } = useAppSelector(state => state.mapref)
  useEffect(() => {
    if (selectedprojectDetails && selectedprojectDetails.weatherdatasource) {
      getWeatherDetails(selectedprojectDetails.weatherdatasource);
    } else {
      handleChange({ label: "OPENMETEO 28.5862,77.3556", value: "OPENMETEO 28.5862,77.3556" },{name:"weatherdatasource"})
    }
  }, []);

  const getWeatherDetails = async (projectDetails: string) => { ///*value: string, id?: string*/) => {
    try {
      const { payload } = await dispatch(getWeatherDataSource({ searchValue: "", id: projectDetails }));
      let corrosioncategory = selectedprojectDetails.corrosioncategory;
      let weatherdatasource = payload.type ? `${updateDataSourceName(payload.type)} ${selectedprojectDetails.lat?.toFixed(4)},${selectedprojectDetails.lng?.toFixed(4)}` : null
      dispatch(setweatherdatadetails({ corrosioncategory: {label:corrosioncategory,value:corrosioncategory}, weatherdatasource: weatherdatasource ? {label:weatherdatasource,value:weatherdatasource}:null}));
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const updateDataSourceName = (type: string) => {
    let isDetails = "";
    if (type === "NsrdbData") {
      isDetails = "NSRDB";
    } else if (type === "Openmetio") {
      isDetails = "OPENMETEO";
    }
    return isDetails;
  }

  const handleChange = async (props: any, selectedOption?: any) => {
    let { name } = selectedOption,value=props.label;
    let formData = { ...formDetails.plantinfrastructuredesigningNew.weatherdata, [name]: props };
    
    if (name === "weatherdatasource") {
      let weatherValue = value.split(" "), isDetails = "";
      if (weatherValue[0] === "NSRDB") {
        isDetails = "NsrdbData";
      } else if (weatherValue[0] === "OPENMETEO") {
        isDetails = "openmetio";
      }
      await dispatch(getWeatherDataSource({ searchValue: `${weatherValue[1].replace(',', "/")}/${isDetails}`, id: '' }));
    };
    dispatch(setweatherdatadetails(formData));
    updateRoofAnalysisErrorFields(error,[name],dispatch);
  };

  const headersPD = ['Name', 'Details'];
  const { roofAnalysis: { dataSource } } = useAppSelector(state => state.EPCDetails)
  const dataPD = [
    { id: '1', Name: `Data Type`, Details: `Synthetic Monthly` },
    { id: '2', Name: `Avg. Ambient Temprature`, Details: `${dataSource?.avgtemp?.toFixed(4) ?? "-"}` },
    { id: '3', Name: `City`, Details: `${dataSource?.city ?? "-"}` },
    { id: '4', Name: `Latitude & Longitude`, Details: `${dataSource?.latitude?.toFixed(4), dataSource?.longitude?.toFixed(4) ?? "-"}` },
    { id: '5', Name: `Distance From Site`, Details: `${dataSource.distancefromsite ? dataSource.distancefromsite?.toFixed(4) + " km" : "-"}` },
    { id: '6', Name: `Elevation`, Details: `${dataSource?.elevation ?? "-"}` },
    { id: '7', Name: `GHI`, Details: <>{dataSource.avgGHI?.toFixed(4) ?? "0"} kWh/m <sup>2</sup></> },
    { id: '8', Name: `DNI`, Details:  <>{dataSource?.avgDNI?.toFixed(4) ?? "0"} kWh/m<sup>2</sup></>},
    { id: '8', Name: `GIC`, Details: `${dataSource?.gic ?? "-"}` },
    { id: '9', Name: `Wind Speed`, Details: <>{dataSource?.windspeed?.toFixed(4) ?? "0"} m/s</>},
    { id: '10', Name: `Snowfall`, Details: `${dataSource?.snow ?? "-"}` },
  ]

  return (
    <>
      <div className='main-section1'>
        <ReactSelect error={error.corrosioncategory} disabled={selectedprojectDetails.isepccomplete || is3DMap} isSearchable={true}  onChange={handleChange} value={formDetails.plantinfrastructuredesigningNew.weatherdata.corrosioncategory} id="corrosioncategory" name="corrosioncategory" labelname="Corrosion Category" options={CorrosionData.map((el: any) => ({ label: `${el} ${checkValue(formDetails.projectsetup.lat?.toFixed(4))},${checkValue(formDetails.projectsetup.lng?.toFixed(4))}`, value: `${el} ${formDetails.projectsetup.lat},${formDetails.projectsetup.lng}` }))} isUpload={false} isRequired={true} icon={<IconInfo />} />
        <ReactSelect error={error.weatherdatasource} disabled={selectedprojectDetails.isepccomplete || is3DMap} isSearchable={true}  onChange={handleChange} value={formDetails.plantinfrastructuredesigningNew.weatherdata.weatherdatasource} id="weatherdatasource" name="weatherdatasource" labelname="Weather Data Source" options={WeatherData.map((el: any) => ({ label: `${el} ${checkValue(formDetails.projectsetup.lat?.toFixed(4))},${checkValue(formDetails.projectsetup.lng?.toFixed(4))}`, value: `${el} ${formDetails.projectsetup.lat},${formDetails.projectsetup.lng}` }))} isUpload={false} isRequired={true} icon={<IconInfo />} />
      </div>
        <TableCheckBtn tableCaption="2.1 Weather Data Details" headers={headersPD} data={dataPD} />
    </>
  );
};

export default memo(WeatherData)
