import { useEffect } from "react";

import { setCardTitle } from "../../../../ReduxTool/Slice/Dashboard/DashboardReducer";
import {
  setIsBuildingDrawn,
  setShowInfoModal,
  toogleTooltip,
} from "../../../../ReduxTool/Slice/Map/MapReducer";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../ReduxTool/store/hooks";
import {
  getActiveClass,
  handleTabNavbars,
} from "../../../../Utils/commonFunctions";
import "./../../../../assests/scss/epc/EPCDashboard.scss";
import OwnLeads from "./OwnLeads/OwnLeads";
import PvNxtLeads from "./PvnxtLeads/PvNxtLeads";
import LeadsCardView from "./LeadsCardViews/LeadsCardView";

const EPCLeadBoard = () => {
  const dispatch = useAppDispatch();
  const { activeCard } = useAppSelector((state) => state.dashboard);
  useEffect(() => {
    dispatch(toogleTooltip({ dipy: 0, istooltip: "", msg: "" }));
    dispatch(setCardTitle("Own Lead"));
    dispatch(setIsBuildingDrawn(false));
    // console.log('is')
  }, [dispatch]);
  let tabsComponent = [
    { tab: "Own Lead", Component: <OwnLeads /> },
    { tab: "PvNxt Leads", Component: <PvNxtLeads /> },
    { tab: "Card View", Component: <LeadsCardView /> },
  ];
  return (
    <>
      <div className="xl:w-full px-8">
        <div className="border-b border-gray-200">
          <ul className="-mb-px flex gap-6">
            {tabsComponent.map((item, index) => (
              <li className={`tab-inactive ${getActiveClass(activeCard, item.tab, "tab-active")}`} key={index} onClick={() => { handleTabNavbars(dispatch, item.tab); dispatch(setShowInfoModal(false)); }}>
                {item.tab}
              </li>
            ))}
          </ul>
        </div>
        {tabsComponent.map((item, index) => <div className={`tabs-inactivebody ${getActiveClass(activeCard, item.tab, "tabs-activebody")} overflow-auto custom-scrollbar-css`} key={index}>{item.Component}</div>)}
      </div>
    </>
  );
};

export default EPCLeadBoard;
