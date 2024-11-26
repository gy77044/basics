import { useEffect, useState } from "react"
import { Button } from "../../../../../Components/AllButton/AllButtons.tsx"
import { TableCheckBtn } from "../../../../../Components/AllInput/AllInput"
import { getWeatherDataSource } from "../../../../../ReduxTool/Slice/Partner/EPC"
import { useAppDispatch, useAppSelector } from "../../../../../ReduxTool/store/hooks"
import { calculateRatio, dcPowerBasedOnSanctionload, getActiveClass } from "../../../../../Utils/commonFunctions"



const OverviewModal = () => {
    const dispatch = useAppDispatch()
    const { modalData } = useAppSelector(state => state.commonReducers.modal);
    const {dataSource}= useAppSelector(state=>state.EPCDetails.roofAnalysis); 
    const [activeTab, setActiveTab] = useState("Project Information")
    const headers = ["Name","Details"]
    useEffect(()=>{
        if(activeTab == "Technical Specification" && modalData && modalData.weatherdatasource){
            dispatch(getWeatherDataSource({searchValue:"",id:modalData.weatherdatasource}));
        };
    },[activeTab]);
    const handleTheTab = (tabname: string) => setActiveTab(tabname);

    const OverviewInfo = () => {
        const projectDetails = [{ name: "Project Name", Details: modalData?.projectname ? modalData?.projectname : "-" }, { name: "Latitude, Longitutde", Details: `${modalData?.lat?.toFixed(4) ?? "-"}, ${modalData?.lng?.toFixed(4) ?? ""}` }, { name: "Total Usable Area", Details: modalData?.useablearea ? modalData?.useablearea?.toFixed(2) : modalData?.sanctionload ? modalData?.sanctionload*12 +" m":"-" }, { name: "Sanctioned Load", Details: modalData?.sanctionload ? modalData?.sanctionload + " kWp" : "-" }]
        const GenerationLoss = [{ name: "AC Cable Loss", Details: modalData?.projectlosscalculation?.accableloss ??"-"}, { name: "DC Cable Loss", Details: modalData?.projectlosscalculation?.dccableloss??"-" }, { name: "Performance Ratio", Details: "-" }, { name: "Specific Yield", Details: "-" }]
        return (
            <div className="overview-container">
                <TableCheckBtn tableCaption="Project Overview" headers={headers} data={projectDetails.map(each=>({Name:each.name,Details:each.Details}))} />
                <TableCheckBtn tableCaption="Generation Loss" headers={headers} data={GenerationLoss.map(each=>({Name:each.name,Details:each.Details}))} />
            </div>
        )
    };

    
    const OverviewTechSpecification = () => {
        const PlantDetails = [{ name: "DC Capacity", Details: modalData?.sanctionload ? modalData?.sanctionload +"kWp" : "-" }, { name: "AC Capacity", Details:modalData?.sanctionload?dcPowerBasedOnSanctionload(modalData?.sanctionload):"-" }, { name: "DC:AC", Details: modalData?.sanctionload?calculateRatio(modalData?.sanctionload,parseFloat(dcPowerBasedOnSanctionload(modalData?.sanctionload))):"-"}, { name: "Lifetime Generation (25yrs)", Details: modalData?.yearlygensanctioned?`${parseInt(modalData?.yearlygensanctioned*12 as any).toFixed(4).toString()} kW/hr` :"-" }]
        const weatherDetails = [{ name: "Meteo Data", Details: dataSource?.type??"-" }, { name: "Shadow Timings", Details: "-" }, { name: "Elevation", Details: dataSource?.elevation??"-" }, { name: "GHI", Details: dataSource.avgDNI?`${dataSource?.avgGHI.toFixed(4)} kWh/sq m`:"-" }, { name: "Avg Ambient Temperature ", Details: dataSource.avgtemp?`${dataSource?.avgtemp.toFixed(4)} deg`:"-" }]
        const EquipmentDetails = [{ name: "Module Info, Quantity", Details: `${modalData?.pvmodule?.manufacturer??"-"} / ${modalData?.pvmodule?.stc?modalData?.pvmodule?.stc:"-"} / ${ modalData?.noofmodules?modalData?.noofmodules:"-" }`  }, { name: "Inverter Info, Quantity", Details: `${modalData?.pvinverter?.name??"-"} / ${modalData?.pvinverter?.paco?modalData?.pvinverter?.paco:"-"} `}, { name: "Battery Info, Quantity", Details: "-" },
            { name: "Grid Type", Details:(modalData!==null && modalData?.pvinvid) ?modalData.invertertype === 0? "On Grid" : modalData.invertertype == 1 ?  "Off Grid" : "Both":"-" }, { name: "MMS Type", Details: (modalData && modalData.pvinvid)?modalData.mmstype:"-"}]
        return (
            <div className="overview-container">
                    <TableCheckBtn tableCaption="Plant Details" headers={headers} data={PlantDetails.map(each=>({Name:each.name,Details:each.Details}))} />
                    <TableCheckBtn tableCaption="Weather Details" headers={headers} data={weatherDetails.map(each=>({Name:each.name,Details:each.Details}))} />
                    <TableCheckBtn tableCaption="Equipment Details" headers={headers} data={EquipmentDetails.map(each=>({Name:each.name,Details:each.Details}))} />
                 </div>
          
        )
    };
    const OverviewProjectFinancials = () => {
        const CostOfProject = [{ name: "Est Total Capital Cost", Details: "-" }, { name: "Tariff Period", Details: "-" }, { name: "LCOE Generation", Details: "-" }]
        const totalElectricityGen = [{ name: "Monthly", Details: "-" }, { name: "Annual", Details: "-" }, { name: "Lifetime Generation (25 years)", Details: "-" }]
        const TotalFinancialSavings = [{ name: "Monthly", Details: "-" }, { name: "Lifetime Savings (25 years)", Details: "-" }, { name: "Payback Period", Details: "-" }, { name: "Project IRR", Details: "-" }]
        return (
            <div className="overview-container">
                    <TableCheckBtn tableCaption="Cost of Project" headers={headers} data={CostOfProject.map(each=>({Name:each.name,Details:each.Details}))} />
                    <TableCheckBtn tableCaption="Total Electricity Generation" headers={headers} data={totalElectricityGen.map(each=>({Name:each.name,Details:each.Details}))} />
                    <TableCheckBtn tableCaption="Total Financial Savings" headers={headers} data={TotalFinancialSavings.map(each=>({Name:each.name,Details:each.Details}))} />
            </div>
        )
    };

    const POverviewInstallerDetails = () => {
        const LoremIpsumDetails = [{ "Installer ID": "0987", "Installer Name": "John Doe", "Installer Mobile": "+91 9876543210", "Installer Email": "johndoe@example.com", "Project Timeline": "22/02/24 - 23/03/24" }]
        return (
            <div className="overview-container">
                <div>
                <TableCheckBtn tableCaption="PCost of Project" headers={Object.keys(LoremIpsumDetails[0])} data={[]} />
                    <Button type="button" className="float-right mt-1 btn btn-sm-outlineprimary" name="View Installer List"/>
                </div>
            </div>
        )
    };



    let tabsComponent = [
      { tab: "Project Information", Component: <OverviewInfo/> },
      { tab: "Technical Specification", Component: <OverviewTechSpecification /> },
      { tab: "Project Financials", Component: <OverviewProjectFinancials /> },
      { tab: "Installer Details", Component: <POverviewInstallerDetails /> },
    ];

    return (
        <>
            <div className="border-b border-gray-200">
            <ul className="-mb-px flex gap-6 ">
                {tabsComponent.map((item, index) => (
                <li className={`cursor-pointer ${getActiveClass(activeTab, item.tab, "tab-active","tab-inactive")}`} key={index} onClick={() => { handleTheTab( item.tab) }}>
                    {item.tab}
                </li>
                ))}
            </ul>
            </div>
            {tabsComponent.map((item, index) => <div className={` ${getActiveClass(activeTab, item.tab, "tabs-activebody","tabs-inactivebody")} overflow-auto custom-scrollbar-css`} key={index}>{item.Component}</div>)}
        </>
    )
}




export default OverviewModal
