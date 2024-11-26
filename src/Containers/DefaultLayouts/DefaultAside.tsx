import { useLocation, useNavigate } from "react-router-dom";
import Toast from "../../Components/ErrorBoundry/Toast";
import { setTitle, toggleDrawer } from "../../ReduxTool/Slice/Drawer/DrawerReducer";
import { setInformationModal, setToolTipModal, toogleTooltip } from "../../ReduxTool/Slice/Map/MapReducer";
import { useAppDispatch, useAppSelector } from "../../ReduxTool/store/hooks";
import { AppRoutes } from "../../Routes";
import PartnerDrawerContainer from "../../Screen/Partner/EPC/RoofAnalysis/PartnerDrawerContainer";
import { getUserType } from "../../Utils/AuthRedirections";
import globalLayers from "../../Utils/EPCMaps/Maps/GlobaLMap";
import { getActivePageTitle } from "../../Utils/commonFunctions";
import { DefaultAsideType } from "./AsideRouteLists";
const DefaultAside = ({ routeList }: { routeList: DefaultAsideType[] }) => {
  const { pathname } = useLocation(),dispatch = useAppDispatch(),Navigate = useNavigate(),userType = getUserType(),title = getActivePageTitle(pathname);
  let { displayDrawer,title:innerTitle } = useAppSelector((state) => state.drawer);
  const { isBuildingThere, is3DMap } = useAppSelector((state) => state.mapref);

  const handleClick = (item: any) => {
    dispatch(toogleTooltip({ dipy: 0, istooltip: "", msg: "" }));
    if (pathname === AppRoutes.PartnerRoofAnalysis || pathname === AppRoutes.AdminRoofAnalysis) {
      if (is3DMap) {
        Toast({messageText:"Please switch to 2D mode to enable editing",messageType:"E"});
        return;
      };
      if (!isBuildingThere) {
        dispatch(setToolTipModal({state: false,title: "Locate your Roof",content: `Type your address or input the coordinates of your location in the search box.`}));
        return;
      };
      if (!sessionStorage.getItem("projectid")) {
        if (globalLayers.activeView === "3D") {
          dispatch(setInformationModal({state: true,title: "Mode Switch",content: `You are currently in 3D mode. Please switch to 2D mode to enable editing.`,}));
        } else {
          Toast({messageText:"Need to complete project setup.",messageType:"E"});
        };
        return;
      };
      dispatch(toggleDrawer(true));
      dispatch(setTitle(item.title));
    }else{
      item && item.path && Navigate(item.path);
    };
  };
  return (
    <>
      {pathname !== AppRoutes.VerifyUserType && 
      <div className="bg-gradient-to-b from-custom-primary-default to-custom-primary-default/80 p-2 h-full">
        <div className="grow w-full h-full flex flex-col gap-8 justify-start items-center mt-4">
          {routeList.map((item: any) => (
            <button onClick={() => { handleClick(item)}}  name="Logo" style={{ width: "inherit" }} title={item.title} className={`flex justify-center items-center hover:lls ${(title === item.title || innerTitle === item.title)? "lls lsbicons" : "" }`}> <item.Icon /> </button>
          ))}
        </div>
      {pathname == `/${userType}/RoofAnalysis` && displayDrawer && <div className="absolute top-[60px] w-0"><PartnerDrawerContainer /></div>}
      </div>}
    </>
  );
};

export default DefaultAside;
