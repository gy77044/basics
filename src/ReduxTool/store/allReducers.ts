import authReducer from "../Slice/Auth/AuthReducer";
import CardReducer from "../Slice/Card/CardReducer";
import DashboardReducer from "../Slice/Dashboard/DashboardReducer";
import drawerReducer from "../Slice/Drawer/DrawerReducer";
import MMSReducer from "../Slice/EquipmentSelection/ModuleMountStructure/MMSReducer";
import SelectionReducer from "../Slice/EquipmentSelection/SelectionReducer";
import footerReducer from "../Slice/Footer/footerReducer";
import GeometryReducer from '../Slice/Geometry/GeometryReducer';
import InfoModalReducer from "../Slice/InfoModal/InfoModalReducer";
import InstallerReducer from "../Slice/Installer/InstallerReducer";
import mapReducer from "../Slice/Map/MapReducer";
import MapToolsReducer from "../Slice/MapTools/MapToolsReducer";
import MarkersReducer from "../Slice/Marker/MarkersReducer";
import RoofDetailsReducer from "../Slice/Roof/RoofDetails/RoofDetailsReducer";
import RoofInfoReducer from "../Slice/Roof/RoofInfo/RoofInfoReducer";
import RooftopReducer from "../Slice/Roof/RoofType/RooftopReducer";
import YieldAnalysisReducer from "../Slice/Roof/YieldAnalysis/YieldAnalysisReducer";
import RoofandObstructionReducer from "../Slice/RoofAndObstructionReducer/RoofandObstructionReducer";
import RoofRequest from "../Slice/RoofRequest/RoofRequest";
import NewSelectReducer from "../Slice/SelectReducer/NewSelectReducer";
import WeatherAnalysisReducer from "../Slice/WeatherAnalysis/WeatherAnalysisReducer";

import UserVerifyReducer from "../Slice/Auth/UserVerifyReducer";
import CommonReducers from "../Slice/CommonReducers/CommonReducers";
import CountrySlice from "../Slice/GeneralSlice/CountrySlice";
import EpcReducer from "../Slice/Partner/EPC/EpcReducer";
import PvTableSlice from "../Slice/Partner/EPC/PvTableSlice";
import ElectricalEquipmentDesSlice from "../Slice/PartnerDesignSummary/ElectricalEquipmentDesSlice";



export const allReducers = {
    auth: authReducer,
    drawer: drawerReducer,
    installer: InstallerReducer,
    rooftopType: RooftopReducer,
    roofInfo: RoofInfoReducer,
    yieldanalysis: YieldAnalysisReducer,
    equipment: SelectionReducer,
    footer: footerReducer, 
    roofdetails: RoofDetailsReducer,
    mmsReducer: MMSReducer,
    mapref: mapReducer,
    mapToolsReducer: MapToolsReducer,
    geometryData: GeometryReducer,
    dashboard: DashboardReducer,
    card: CardReducer,
    selectslice: NewSelectReducer,
    wheatherslice: WeatherAnalysisReducer,
    roofandobstructionslice: RoofandObstructionReducer,
    markers: MarkersReducer,
    infoModal: InfoModalReducer,
    newroofrequest:RoofRequest,
    commonReducers:CommonReducers,

    //epc
    electricalEquipmentDesigningSlice:ElectricalEquipmentDesSlice,
    CountrySlice:CountrySlice,
    UserVerifyReducer:UserVerifyReducer,
    EPCDetails:EpcReducer,
    pvTable:PvTableSlice
}