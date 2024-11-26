import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import { getAuthState } from "../../Utils/AuthRedirections";
import { AuthState, USER_TYPE_ADMIN, USER_TYPE_PARTNER, USER_TYPE_Verify, userRole } from "../../Utils/Const";
import {DefaultAsideType,PartnerAsideRouteList,PartnerRoofAanalysisAsideRouteList} from "./AsideRouteLists";
import DefaultAside from "./DefaultAside";
import DefaultHeader from "./DefaultHeader";
import { AppRoutes } from "../../Routes";
// console.log(Object.keys(AppRoutes).map(el=> (el !== ('AdminRoofAnalysis' || 'PartnerRoofAnalysis')) ? {[el]:PartnerAsideRouteList}:{[el]:PartnerRoofAanalysisAsideRouteList}));

export const routeMap: { [key: string]: DefaultAsideType[] } = {
  "/Partner/Dashboard": PartnerAsideRouteList,
  "/Partner/Ownlead": PartnerAsideRouteList,
  "/Partner/PvNxtLeads": PartnerAsideRouteList,
  "/Partner/ProjectCard": PartnerAsideRouteList,
  "/Partner/InstallerBoard": PartnerAsideRouteList,
  "/Partner/TrainingSOPBoard": PartnerAsideRouteList,
  "/Partner/RoofAnalysis": PartnerRoofAanalysisAsideRouteList,
  "/Admin/RoofAnalysis": PartnerRoofAanalysisAsideRouteList,
};

const DefaultContainer = ({ pathname }: { pathname: string }) => {
  const [routeList, setRouteList] = useState([] as DefaultAsideType[]);

  useEffect(() => {
    setRouteList(getRouteList(pathname));
    // Check if the footer bar exists and then update its classes
    const footerBar = document.getElementsByTagName('footer')[0];
    if (footerBar ) {
      if (pathname === AppRoutes.AdminRoofAnalysis || pathname === AppRoutes.PartnerRoofAnalysis) {
        footerBar.classList.remove("invisible");
        footerBar.classList.add("visible");
      } else {
        footerBar.classList.remove("visible");
        footerBar.classList.add("invisible");
      }
    }
  }, [pathname]);

  const getRouteList = (pathname: string): DefaultAsideType[] => {
    return routeMap[pathname] || [];
  };
  
  return (
    <>
      <div className="flex flex-col h-screen">
        <header className="flex-none sticky top-0 h-[60px] z-50"><DefaultHeader /></header>
        <main className="grow flex flex-row h-[calc(100vh-90px)]">
          <nav className={`${pathname===AppRoutes.VerifyUserType?"hidden":"flex-none w-[4rem]"}`}><DefaultAside routeList={routeList} /></nav>
          <section className="grow w-auto overflow-auto"><Outlet /></section>
        </main>
        {pathname.includes('/RoofAnalysis') && <footer className="flex-none sticky bottom-0 bg-gray-100 h-[30px]"><Footer /> </footer>}
      </div>
    </>
  );
};

const DefaultProtectedContainer: React.FC<any> = () => {
  let { pathname } = useLocation(),
    allowedRoles = [USER_TYPE_ADMIN,USER_TYPE_PARTNER,USER_TYPE_Verify] as userRole[];
  const auth: AuthState = getAuthState();
  const userRole = auth?.user?.role;
  if (!auth.isAuthenticated || !userRole) {
    localStorage.clear();
    return <Navigate to="/" />;
  }
  if (!pathname.startsWith(`/${userRole}`)) {
    allowedRoles = [];
  }
  if (!allowedRoles.includes(userRole!)) {
    return (
      <Navigate to={userRole === USER_TYPE_PARTNER ? AppRoutes.PartnerDashboard: userRole === USER_TYPE_Verify ? AppRoutes.VerifyUserType : AppRoutes.AdminRoofAnalysis}/>
    );
  }
  if (pathname === `${AppRoutes.AdminRoofAnalysis}/`) {
    pathname = AppRoutes.AdminRoofAnalysis;
    window.location.href = `${window.location.origin}${AppRoutes.AdminRoofAnalysis}`;
  }
  return <DefaultContainer pathname={pathname} />
};

export default DefaultProtectedContainer;