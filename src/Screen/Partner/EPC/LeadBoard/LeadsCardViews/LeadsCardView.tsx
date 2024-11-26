import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconClock, IconPinDrop } from "../../../../../assests/icons/DrawerIcons";
import { IconFilter, IconSearch } from "../../../../../assests/icons/MapToolsIcons";
import { ProjectTy, user_mstr_modal } from "../../../../../ReduxTool/Slice/Auth/types";
import { getAllProjectsByEPCid, LeadType } from "../../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector } from "../../../../../ReduxTool/store/hooks";
import { getUserType } from "../../../../../Utils/AuthRedirections";
import { dateFormater, getOwnLeadsProjectDetails } from "../../../../../Utils/commonFunctions";

const LeadsCardView = () => {
  const dispatch = useAppDispatch();
  const { cardView: cardList} = useAppSelector((state) => state.EPCDetails.pvNxtLeads);
  const { user: { epcid } } = useAppSelector((state) => state.auth);
  const { activeCard } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    if (epcid && activeCard == "Card View") {
      dispatch(getAllProjectsByEPCid(epcid));
    }
  }, [epcid,activeCard]);

  return (
    <div className="xl:w-full px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="w-full justify-end flex right-[0vh] top-[0vh] gap-[1vh]">
          <button className="light-md-btn"><IconSearch />
            <input id="inpSearch" className={`text-primary-500 text-1.6xl font-medium placeholder-primary-500 focus:outline-none`} type="search" placeholder="Search"/>
          </button>
          <button className="light-md-btn"><IconFilter />Filter </button>
        </div>
      </div>
      <div>
        <div className="tabs-main">
            <div className="flex flex-wrap mt-2 gap-[30px] min-h-[70vh] max-h-[76vh]">
              {(cardList && cardList.length>0 )? cardList.map((data:ProjectTy) => (
                <div className="card-content" style={{margin:'inherit'}}>
                  <Link to={`/${getUserType()}/RoofAnalysis`}  state={{ userid: data.userid, project: data }} className="flex flex-col space-y-[2vh] ">
                    <div className="card-header" data-bs-toggle="tooltip" title="Map">
                      {/* <button className="dark-sm-btn absolute top-0 right-0" data-bs-toggle="tooltip" title="Project mode type">{data.installationmode!=""?data.installationmode:"Own Mode"}</button> */}
                      {data.projecttype! === "Rooftop" ? (
                        <img src={require("../../../../../assests/img/Dashboard/rooftopimg.png")} className="header-img mt-2" alt="..." />
                      ) : (
                        <img src={require("../../../../../assests/img/Dashboard/rooftopimg.png")} className="header-img mt-2" alt="..." />
                      )}
                    </div>
                    <div className="card-body">
                      <div className="body-time">
                        <div className="time-content" data-bs-toggle="tooltip" title="Created project date">
                          <IconClock />
                          Created On: {dateFormater(data.createddt!, "DD-MM-YYYY")}
                        </div>
                        <button className="dark-sm-btn" data-bs-toggle="tooltip" title="Project mode type">{data.installationmode!=""?/* <data.installationmode*/"PVNxt Lead":"Own Lead"}</button>
                      </div>
                      <div className="card-body">
                        <div className="body-title" data-bs-toggle="tooltip" title="Project name">
                          {data && data.projectname}
                        </div>
                        <div className="time-content" data-bs-toggle="tooltip" title="Project Address">
                          <IconPinDrop />
                          {data && data.address!.length > 20 ? data.address!.substring(0, 37) : data.address}
                        </div>
                        <div className="table-sm-main">
                          <table className="table-sm">
                            <thead className="thead-sm">
                              <tr>
                                <th className="hvalue-sm">Project Type</th>
                                <th className="hvalue-sm">AC (kW)</th>
                                <th className="hvalue-sm">DC (kWp)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="trow-sm">
                                <td className="rvalue-sm">
                                  {data.projecttype}
                                </td>
                                <td className="rvalue-sm">
                                  {isFinite(data.sanctionload! / 1.25) ? Math.abs(data.sanctionload! / 1.25 - Math.floor(data.sanctionload! / 1.25)) >= 0.5 ? Math.ceil(data.sanctionload! / 1.25) : Math.floor(data.sanctionload! / 1.25) : 0}
                                </td>
                                <td className="rvalue-sm">
                                  {data.sanctionload}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )):<div className="text-primary-200 font-medium m-auto">No Data To Show</div>}
               
            </div>
          </div>
        </div></div>
  );
};

export default LeadsCardView;