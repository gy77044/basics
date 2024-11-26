import { lazy } from "react";
const UserVerification = lazy(()=> import("./Screen/UserVerification/UserVerification"));
const EPCDashBoard = lazy(() => import('./Screen/Partner/EPC/EPCDashboard/EPCDashboard'));
const EPCLeadBoard = lazy(() => import('./Screen/Partner/EPC/LeadBoard/EPCLeadBoard'));
const EPCOwnLeads = lazy(() => import('./Screen/Partner/EPC/LeadBoard/OwnLeads/OwnLeads'));
const EPCPvnxtLead = lazy(() => import('./Screen/Partner/EPC/LeadBoard/PvnxtLeads/PvNxtLeads'));
const EPCProjectCard = lazy(() => import('./Screen/Partner/EPC/LeadBoard/LeadsCardViews/LeadsCardView'));
const EPCInstallerBoardDashboard = lazy(() => import('./Screen/Partner/EPC/InstallerBoardDashboard/InstallerBoardDashboard'));
const EPCTrainingAndSOPs = lazy(() => import('./Screen/Partner/EPC/TrainingAndSOPs/TrainingAndSOPsMain'));
const EPCRoofAnalysis = lazy(() => import('./Screen/Partner/EPC/RoofAnalysis/RoofAnalysis'));
export type routeType = { path: string, Component: React.LazyExoticComponent<() => JSX.Element>}[];
export enum AppRoutes {
    PartnerDashboard = "/Partner/Dashboard",
    PartnerLandingPage = "/Partner",
    PartnerLeadBoard = "/Partner/LeadBoards",
    PartnerInstallerBoard = "/Partner/InstallerBoard",
    PartnerRoofAnalysis = "/Partner/RoofAnalysis",
    AdminRoofAnalysis = "/Admin/RoofAnalysis",
    VerifyUserType = "/verifyUserType",
    OwnLeads = "/Partner/Ownlead",
    PvNxtLeads = "/Partner/PvNxtLeads"
}
export const routes: routeType = [
    { path: AppRoutes.PartnerDashboard, Component: EPCDashBoard },
    { path: AppRoutes.PartnerLeadBoard, Component: EPCLeadBoard },
    { path: AppRoutes.PartnerInstallerBoard, Component: EPCInstallerBoardDashboard },
    { path: AppRoutes.PartnerRoofAnalysis, Component: EPCRoofAnalysis },
    { path: AppRoutes.AdminRoofAnalysis, Component: EPCRoofAnalysis },
    { path: AppRoutes.VerifyUserType, Component: UserVerification },
    { path: AppRoutes.PvNxtLeads, Component: EPCPvnxtLead },
    { path: AppRoutes.OwnLeads, Component: EPCOwnLeads },
    // { path: AppRoutes.PartnerTrainingSOPBoard, Component: EPCTrainingAndSOPs },
    // { path: "/Partner/ProjectCard", Component: EPCProjectCard },
    // { path: "/Partner", Component: EPCLandingPage },
    // { path: "/Partner/Ownlead", Component: EPCLeadBoard },//comment
    
]

