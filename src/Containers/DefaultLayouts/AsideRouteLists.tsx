
import { AppRoutes } from "../../Routes";
import MiscellaneousDesign from "../../Screen/Partner/EPC/RoofAnalysis/MiscellaneousDesign/MiscellaneousDesign";
import PlantInfrastructureDesign from "../../Screen/Partner/EPC/RoofAnalysis/PlantInfrastructureDesign/PlantInfrastructureDesign";
import ProjectSetupLayout from "../../Screen/Partner/EPC/RoofAnalysis/ProjectSetupContainer/ProjectSetupLayout";
import { IconBarChart, IconEngineering, IconInventory, IconMiscellaneousDesign, IconProjectSetup, IconRoofObstructionAnalysis, IconUserGroup } from "../../assests/icons/Icons";

export interface DefaultAsideType {
    Icon: (fill?:any) => JSX.Element,
    tooltip: string,
    title: string,
    path?: string,
    component?:React.Component
}

export type btnTitleType = '' | 'Plant Infrastructure Designing' | 'Draw Roof Boundary' | 'Design Summary' | 'Miscellaneous Design' | "Civil & MMS Design" | "Electrical Design" | "Equipment Selection" | "Weather Analysis" | "Roof & Obstruction Analysis" |"Generate BOQ" | "Confirm The Action"
export type EPCBtnTitleType = '' | 'Plant Infrastructure Designing' | 'Plant Infrastructure Designing' | 'Miscellaneous Design' | 'Generate BOQ' | "Confirm The Action";
interface EPCBTN {
    [key:string]:EPCBtnTitleType
}
export const EPCROOFBTN: EPCBTN={
    PROJECT_SETUP: "Plant Infrastructure Designing",
    PROJECT_DESIGN:"Plant Infrastructure Designing",
    PLANT_INFO:"Miscellaneous Design",
    MISC_DESIGN:"Generate BOQ",
    CONFIRM_ACTION:"Confirm The Action"
};


export const PartnerAsideRouteList: DefaultAsideType[] = [
    {Icon: IconBarChart,tooltip: "Dashboard",title: "Dashboard",path: AppRoutes.PartnerDashboard}, 
    {Icon: IconUserGroup,tooltip: "Lead Board & Analysis Section",title: "Own lead",path: AppRoutes.OwnLeads}, 
    {Icon: IconInventory,tooltip: "Lead Board & Analysis Section",title: "pvNXT Leads",path: AppRoutes.PvNxtLeads}, 
    {Icon: IconEngineering,tooltip: "Installer Board",title: "Installer Board",path: AppRoutes.PartnerInstallerBoard}, 
    // {Icon: IconInventary,tooltip: "Project Setup",title: "Training & SOP Board",path: "/Partner/TrainingSOPBoard"},
];

export const PartnerRoofAanalysisAsideRouteList: DefaultAsideType[] = [
    {
        Icon: IconProjectSetup,
        tooltip: "Project Setup",
        title: "projectsetup",
    },
    {
        Icon: IconRoofObstructionAnalysis,
        tooltip: "Plant Infrastructure Designing",
        title: "plantinfrastructuredesigning",
    },
    {
        Icon: IconMiscellaneousDesign,
        tooltip: "Miscellaneous Design",
        title: "miscellaneousdesign",
    }
];

export const EPCRoofAnalysisAsideList = {
    projectsetup: {
        title: "projectsetup",
        Component: ProjectSetupLayout,
        btnTitle: EPCROOFBTN.PROJECT_SETUP,
        headerName: "New Project Setup",
    },
    plantinfrastructuredesigning: {
        title: "plantinfrastructuredesigning",
        Component: PlantInfrastructureDesign,
        btnTitle:EPCROOFBTN.PLANT_INFO,
        headerName: "Plant Infrastructure Designing",
    },
    miscellaneousdesign: {
        title: "miscellaneousdesign",
        Component: MiscellaneousDesign,
        btnTitle: EPCROOFBTN.MISC_DESIGN,
        headerName: "Miscellaneous Design",
    }
}

export const contentlist = {
    content1: "Please add a suitable and unique name for the project. An example name for the project can be: Noida_One_5_kWp_RT_V0.",
    content2: "Consumers are categorized as Residential, Commercial, and Industrial. Residential users typically have a sanctioned load ranging from 2 kW to 10 kW, while Commercial and Industrial users have loads from 10 kW to 1000 kW. Choose your tariff based on your electricity bill.",
    content3: "Sanctioned load is the total electricity supply that is provided to a meter. This is calculated in Kilo-Watt (or kW). It's the permissible total Kilo-Watt provided to a meter based on the devices connected to the meter.",
    content4: "This is the rate at which the DISCOM charges you for the per unit electricity consumption. This is generally expressed in Rs/kWh or Rs/unit.",
    content5: "This is the total electricity consumed by the consumer in a given calendar year i.e., from Jan to Dec.",
    content6: "This is the total electricity bill paid by the consumer to the DISCOM in a given calendar year i.e., Jan to Dec",
    content7: "This is the summary of all the details that have been captured till now. In case any modification required in the project set up, then it can be done through Edit Details button given at the bottom of New Project Set up section.",
    content8: "The quick plant analysis provides you the system generated calculation w.r.t Environmental Impact, Cost of Plant, Financial Savings and Total Electricity Generation.",
    content9: "The quick plant analysis provides you the system generated calculation w.r.t Environmental Impact, Cost of Plant, Financial Savings and Total Electricity Generation.",
};