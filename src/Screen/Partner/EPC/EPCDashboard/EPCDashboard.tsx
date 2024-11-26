import { AgGridReact } from "ag-grid-react";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllSubscribedLeads,
  getEPCProjects,
  getOwnLeadsDetails,
} from "../../../../ReduxTool/Slice/Partner/EPC";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../ReduxTool/store/hooks";
import { baseURL, requestUrl } from "../../../../Utils/baseUrls";
import {
  camelCaseToWordFormat,
  capitalizedObjKeys,
  dateFormater,
  dcPowerBasedOnSanctionload,
  filterKeyIncludeArr,
  getActiveClass,
  getOwnLeadsProjectDetails,
  handleTabNavbars,
  toTitleCase,
} from "../../../../Utils/commonFunctions";
import { APIResponse, defaultColDef } from "../../../../Utils/Const";
import EPCChart from "./EPCChart";
import { toogleTooltip } from "../../../../ReduxTool/Slice/Map/MapReducer";
import LeadProjectsTable from "../LeadBoard/LeadProjectsTable";
import RFPBidTableByAgGrid from "../LeadBoard/PvnxtLeads/RFPBiddingLeads";
import { setCardTitle } from "../../../../ReduxTool/Slice/Dashboard/DashboardReducer";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../../Routes";
import { Lead_Subscription_TAB, RFP_Project_Management } from "../LeadBoard/PvnxtLeads/PvNxtLeads";

interface Customertype {
  Industrial: number;
  Residential: number;
  Commercial: number;
  Government: number;
  Other: number;
}

interface EPCDashboardSummeryType {
  Lead: {
    ownLeads: number;
    pvNxtLeads: number;
  };
  Project: {
    completed: number;
    ongoing: number;
  };
  Installer: {
    ownInstaller: number;
    pvNxtInstaller: number;
  };
  Customer: {
    Industrial: number;
    Residential: number;
    Commercial: number;
    Government: number;
    Other: number;
  };
}

const EPCDashboard = () => {
  const dispatch = useAppDispatch();
  const Navigate = useNavigate();
  const { activeCard } = useAppSelector((state) => state.dashboard);
  const {
    roofAnalysis: { selectedProject },
    projectDetails,
  } = useAppSelector((state) => state.EPCDetails);
  const {
    user: { epcid, userid, country_mstr },
  } = useAppSelector((state) => state.auth);
  const [leadName, setLeadName] = useState("");
  const [dashboardSummery, setDashboardSummery] = useState({
    Lead: { Own_Leads: 0, PvNxt_Leads: 0,Subscribedleads:0,
      Bindownleads:0 },
    Project: { Completed: 0, Ongoing: 0 },
    Installer: { ownInstaller: 0, pvNxtInstaller: 0 },
    Customer: {
      Industrial: 0,
      Residential: 0,
      Commercial: 0,
      Government: 0,
      Other: 0,
      "Small industries": 0,
    },
  });
  const [summeryData, setSummeryData] = useState({
    Lead: { ownLeads: [], pvNxtLeads: [] },
    Project: { completed: [], ongoing: [] },
    Installer: { ownInstaller: [], pvNxtInstaller: [] },
    Customer: {
      Industrial: [],
      Residential: [],
      Commercial: [],
      Government: [],
      Other: [],
      Domestic: [],
      "Small industries": [],
      "Large industries": [],
      "Medium industries": [],
    }
  });
  const colors = ["#113F4A", "#587880", "#9fb2b6", "#b7c5c8", "#cfd8da"];

  useEffect(() => {
    handleTabNavbars(dispatch, "Lead Board");
    if (userid) {
      fatchUserProjectSummary();
    }
  }, [userid]);
  useEffect(() => {
    if (userid) {
      fetchDashBoardData();
      setLeadName("All");
    }
  }, [userid, activeCard]);
  const fatchUserProjectSummary = async () => {
    try {
      const { data }: AxiosResponse<APIResponse<any>> = await baseURL.get(
        requestUrl.epcEpcProjectSummary + epcid
      );
      
      if (data.code === "200") {
        setDashboardSummery(capitalizedObjKeys(data.responseData.value));
      }
    } catch (err: any) {
      toast.error(
        err.response?.data.message ??
          "There was an issue. Please try again later."
      );
    }
  };

  const fetchDashBoardData = async () => {
    const dashboardData = { ownLeads: [], pvNxtLeads: [] } as any,
      ProjectDetails = { completed: [], ongoing: [] } as any;
    switch (activeCard) {
      case "Lead Board":
        const { payload } = await dispatch(getOwnLeadsDetails(epcid));
        if (payload && payload.length) {
          let data = await getOwnLeadsProjectDetails(payload);
          dashboardData.ownLeads = data;
          // dashboardSummeryData.ownLeads = data.length;
        }
        const { payload: PvNxtPayload } = await dispatch(
          getAllSubscribedLeads({ userid, type: "RFP" })
        );
        if (PvNxtPayload && PvNxtPayload.length) {
          dashboardData.pvNxtLeads = PvNxtPayload;
          // dashboardSummeryData.pvNxtLeads = PvNxtPayload.length;
        }
        setSummeryData({ ...summeryData, Lead: dashboardData });
        // setDashboardSummery({ ...dashboardSummery, Lead: dashboardSummeryData });
        break;
      case "Project Board":
        const { payload: projectPayload } = await dispatch(
          getEPCProjects(epcid)
        );
        if (projectPayload) {
          ProjectDetails.completed = filterKeyIncludeArr(
            projectPayload,
            "iscompleted",
            true
          );
          ProjectDetails.ongoing = filterKeyIncludeArr(
            projectPayload,
            "iscompleted",
            false
          );
        }
        setSummeryData({ ...summeryData, Project: ProjectDetails });
        break;
      case "Installer Board":
        break;
      case "Customer Board":
        const CustomerDetails = {} as any;
        const { payload: projectPayloads } = await dispatch(
          getEPCProjects(epcid)
        );
        if (projectPayloads) {
          Object.keys(dashboardSummery.Customer).forEach((el: string) => {
            // if(projectPayloads.tariffconsumercategory_mstr.[el as keyof object]){
            CustomerDetails[el] = projectPayloads.filter(
              (ele) =>
                ele.tariffconsumercategory_mstr?.consumercategoryname.toLowerCase() ===
                el.toLowerCase()
            );
            // }
          });
        }
        setSummeryData({
          ...summeryData,
          Customer: { ...summeryData.Customer, ...CustomerDetails },
        });
        break;
      case "Card List":
        break;
      default:
        break;
    }
  };

  // installer cell renderer

  // subscription cell renderer

  const renderSubscriptionCell = (cell: string, id: any) => {
    const { data } = id;
    let result;
    switch (cell) {
      case "status":
        result = <div>Status</div>;
        break;
      case "earned credits":
        result = <div>earned credits</div>;
        break;
      default:
        break;
    }
    return result;
  };

  type columnDefsType = { Lead: any[]; Project: any[]; Installer: any[] };
  let customerdata = [] as Customertype[];
  switch (leadName) {
    case "All":
      customerdata = [
        ...summeryData.Customer?.Commercial,
        ...summeryData.Customer?.Domestic,
        ...summeryData.Customer?.Government,
        ...summeryData.Customer?.Industrial,
        ...summeryData.Customer?.Other,
        ...summeryData.Customer?.Residential,
        ...summeryData.Customer?.["Large industries"],
        ...summeryData.Customer?.["Small industries"],
        ...summeryData.Customer["Medium industries"],
      ];
      break;
    case "":
      customerdata = [
        ...summeryData.Customer?.Commercial,
        ...summeryData.Customer?.Domestic,
        ...summeryData.Customer?.Government,
        ...summeryData.Customer?.Industrial,
        ...summeryData.Customer?.Other,
        ...summeryData.Customer?.Residential,
        ...summeryData.Customer?.["Large industries"],
        ...summeryData.Customer?.["Small industries"],
        ...summeryData.Customer["Medium industries"],
      ];
      break;
    case "Domestic":
      customerdata = [...summeryData.Customer?.Domestic];
      break;
    case "Commercial":
      customerdata = [...summeryData.Customer?.Commercial];
      break;
    case "Government":
      customerdata = [...summeryData.Customer?.Government];
      break;
    case "Industrial":
      customerdata = [...summeryData.Customer?.Industrial];
      break;
    case "Other":
      customerdata = [...summeryData.Customer?.Other];
      break;
    case "Residential":
      customerdata = [...summeryData.Customer?.Residential];
      break;
    case "Large industries":
      customerdata = [...summeryData.Customer?.["Large industries"]];
      break;
    case "Small industries":
      customerdata = [...summeryData.Customer?.["Small industries"]];
      break;
    case "Medium industries":
      customerdata = [...summeryData.Customer?.["Medium industries"]];
      break;
    default:
      customerdata = [];
  }
  // if (leadName==="All" || leadName===""){
  //     customerdata = [...summeryData.Customer?.Commercial,...summeryData.Customer?.Domestic,...summeryData.Customer?.Government,...summeryData.Customer?.Industrial,...summeryData.Customer?.Other,...summeryData.Customer?.Residential, ...summeryData.Customer?.["Large industries"]]
  // }
  // else if (leadName==="Domestic"){
  //   customerdata = [...summeryData.Customer?.Domestic]
  // }
  // else if (leadName==="Commercial"){
  //   customerdata = [...summeryData.Customer?.Commercial]
  // }

  const rowData = {
    Lead:
      leadName == "All" || leadName == ""
        ? [...summeryData.Lead?.ownLeads, ...summeryData.Lead?.pvNxtLeads]
        : leadName === "Own_Leads"
        ? summeryData.Lead?.ownLeads
        : summeryData.Lead?.pvNxtLeads,
    Project:
      leadName == "All" || leadName == ""
        ? [...summeryData.Project?.completed, ...summeryData.Project?.ongoing]
        : leadName === "Completed"
        ? summeryData.Project?.completed
        : summeryData.Project?.ongoing,
    Installer: summeryData.Installer.ownInstaller,
    Customer: customerdata,
    // Customer:(leadName == "All" || leadName == "") ? [...summeryData.Customer?.Commercial,...summeryData.Customer?.Domestic,...summeryData.Customer?.Government,...summeryData.Customer?.Industrial,...summeryData.Customer?.Other,...summeryData.Customer?.Residential, ...summeryData.Customer?.["Large industries"]] : leadName === "Domestic" ? summeryData.Customer?.Domestic : summeryData.Customer?.["Large industries"]
  };
  const columnDefs = {
    Lead: [
      {
        headerName: "S.No",
        field: "sno",
        sortable: true,
        filter: true,
        maxWidth: 100,
      },
      {
        headerName: "Customer Name",
        field: "name",
        sortable: true,
        filter: true,
      },
      { headerName: "Address", field: "address", sortable: true, filter: true },
      { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
      { headerName: "Email", field: "emailid", sortable: true, filter: true },
      {
        headerName: "Consumer Type",
        field: "ConsumerType",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Lead Type",
        field: "LeadType",
        sortable: true,
        filter: true,
      },
    ],
    Project: [
      {
        headerName: "S.No",
        field: "sno",
        sortable: true,
        filter: true,
        maxWidth: 100,
      },
      // { headerName: "Project ID", field: "projectid", sortable: true, filter: true },
      {
        headerName: "Project Name",
        field: "projectname",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Installer",
        field: "Installer",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Created On",
        field: "createdon",
        sortable: true,
        filter: true,
      },
      {
        headerName: "City,  Address",
        field: "address",
        sortable: true,
        filter: true,
      },
      {
        headerName: "AC:DC (kW:kWp)",
        field: "ratio",
        sortable: true,
        filter: true,
      },
      { headerName: "Status", field: "status", sortable: true, filter: true },
      {
        headerName: "Project COD",
        field: "projectcod",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Customer Name",
        field: "customername",
        sortable: true,
        filter: true,
      },
    ],
    Installer: [
      {
        headerName: "Installer ID",
        field: "CustomerID",
        sortable: true,
        filter: true,
      },
      { headerName: "Name", field: "name", sortable: true, filter: true },
      { headerName: "Address", field: "address", sortable: true, filter: true },
      { headerName: "Mobile", field: "Mobile", sortable: true, filter: true },
      { headerName: "Email", field: "Email", sortable: true, filter: true },
      { headerName: "Status", sortable: true, filter: true },
      {
        headerName: "Onboarding Date",
        field: "LeadType",
        sortable: true,
        filter: true,
      },
    ],
    Customer: [
      {
        headerName: "S.No",
        field: "sno",
        sortable: true,
        filter: true,
        maxWidth: 100,
      },
      {
        headerName: "Customer Name",
        field: "customername",
        sortable: true,
        filter: true,
      },
      { headerName: "Address", field: "address", sortable: true, filter: true },
      { headerName: "Mobile", field: "mobile", sortable: true, filter: true },
      { headerName: "Email", field: "emailid", sortable: true, filter: true },
      {
        headerName: "Total Installed Project |Total AC | Total DC",
        field: "totalACDC",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Consumer Type",
        field: "customertype",
        sortable: true,
        filter: true,
      },
    ],
    Subscription: [
      { headerName: "S.No", field: "CustomerID", sortable: true, filter: true },
      {
        headerName: "Subscription Type",
        field: "name",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Purchased By",
        field: "Address",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Purchased/Renew Date",
        field: "Mobile",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Valid Up To",
        field: "Email",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Status",
        field: "ConsumerType",
        sortable: true,
        filter: true,
        cellRenderer: (id: any) => renderSubscriptionCell("status", id),
      },
      {
        headerName: "Earned Credits",
        field: "LeadType",
        sortable: true,
        filter: true,
        cellRenderer: (id: any) => renderSubscriptionCell("earned credits", id),
      },
    ],
  };
  const getFormattedRowData = (item: any, el: string, indx: number) => {
    dispatch(toogleTooltip({ dipy: 0, istooltip: "", msg: "" }));
    let result;
    switch (el) {
      case "Lead":
        result = {
          ...item,
          sno: indx + 1,
          name: item.user
            ? `${toTitleCase(item.user.fname)} ${item.user.lname}`
            : `${toTitleCase(item?.customerName)}`,
          mobile: item.user ? item.user.mobile : item?.mobile,
          emailid: item.user ? item.user.emailid : item?.emailid,
          ConsumerType: item.user ? toTitleCase(item.tariffconsumercategory_mstr?.consumercategoryname) : item.consumercategoryname?toTitleCase(item?.consumercategoryname):"-",
          LeadType: item.user ? "PvNxt Leads" : "Own Leads"
        }
        break
      case "Project":
        result = {
          ...item,
          sno: indx + 1,
          projectid: item.projectid,
          projectname: toTitleCase(item.projectname),
          Installer: item.installationmode === "" ? "-" : item.installationmode,
          createdon: dateFormater(item.createddt, "DD-MM-YYYY HH:mm"),
          address: toTitleCase(item.address),
          status: item.iscompleted === true ? "Completed" : "Ongoing",
          customername: item.user !== null ? toTitleCase(item.user.fname) : "-",
          installationmode:
            item.installationmode !== "" ? item.installationmode : "-",
          ratio: `${item.sanctionload}:${dcPowerBasedOnSanctionload(
            item.sanctionload
          )}`,
          projectcod: dateFormater(item.createddt, "DD-MM-YYYY HH:mm"),
        };
        break;
      case "Installer":
        result = {
          ...item,
          sno: indx + 1,
          name: item.user
            ? `${toTitleCase(item.user.fname)} ${toTitleCase(item.user.lname)}`
            : `${toTitleCase(item?.customerName)}`,
          mobile: item.user ? item.user.mobile : item?.mobile,
          emailid: item.user ? item.user.emailid : item?.emailid,
          ConsumerType: item.user
            ? toTitleCase(
                item.tariffconsumercategory_mstr?.consumercategoryname
              )
            : toTitleCase(item?.consumercategoryname),
          LeadType: item.user ? "PvNxt Leads" : "Own Leads",
        };
        break;
      case "Customer":
        result = {
          ...item,
          sno: indx + 1,
          customername: `${toTitleCase(item.user.fname)} ${
            toTitleCase(item?.user?.lname) ?? ""
          }`,
          mobile: item.user.mobile,
          emailid: item.user.emailid !== null ? item.user.emailid : "-",
          address: toTitleCase(item.address),
          ConsumerType: item.user
            ? toTitleCase(
                item.tariffconsumercategory_mstr?.consumercategoryname
              )
            : toTitleCase(item?.consumercategoryname),
          customertype: toTitleCase(
            item?.tariffconsumercategory_mstr?.consumercategoryname
          ),
          totalACDC: `${
            item.projectcost === "" ? "" : `${item.projectcost} |`
          } ${dcPowerBasedOnSanctionload(item.sanctionload)} | ${
            item.sanctionload
          }`,
        };
        break;
    }
    return result;
  };
  const getFormatRowData = (type: string): any => {
    let resultElement: any = [];

    Object.keys(dashboardSummery).map((el, ind) => {
      switch (type) {
        case "chart":
          let data = Object.values(
            dashboardSummery[el as keyof EPCDashboardSummeryType]
          );
          let labels = Object.keys(
            dashboardSummery[el as keyof EPCDashboardSummeryType]
          );
          resultElement.push(
            <EPCChart
              cardName={el + " Board"}
              active={activeCard == el + " Board" ? true : false}
              labels={labels}
              data={data}
              colors={colors}
              setLeadName={setLeadName}
              dataNotFound={data.some((el) => el > 0)}
            />
          );
          break;
        case "tabs":
          resultElement.push(
            <li
              className={`tabs ${getActiveClass(
                activeCard,
                el + " Board",
                "active-tabs"
              )}`}
              onClick={() => handleTabNavbars(dispatch, el + " Board")}
            >
              {el + " Board"}
            </li>
          );
          break;
        case "table":
          resultElement.push(
            <div
              className={`tabs-body ${getActiveClass(
                activeCard,
                el + " Board",
                "active-body"
              )} overflow-auto custom-scrollbar-css`}
            >
              {activeCard} List (
              {leadName
                ? leadName == "Own_Leads"
                  ? "Own Leads"
                  : leadName == "PvNxt_Leads"
                  ? "pvNxt Leads"
                  : camelCaseToWordFormat(leadName)
                : "All"}
              )<div className="h2"></div>
              <div className="ag-theme-alpine providerAgtable h-[24.5vh]">
                <AgGridReact
                  rowSelection="multiple"
                  rowData={(rowData[el as keyof object] as any[]).map(
                    (item, i) => getFormattedRowData(item, el, i)
                  )}
                  columnDefs={columnDefs[el as keyof object]}
                  defaultColDef={defaultColDef}
                  animateRows
                  pagination
                />
              </div>
            </div>
          );
      }
    });
    return resultElement;
  };
 
  return (
    <>
      <div className="xl:w-full px-8 py-8 space-y-8">
        <h2 className="heading heading-lg-bold">Highlights</h2>
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-x-6 gap-y-12">
          <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
            <span className="inline-block rounded bg-custom-primary-default p-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </span>

            <a href="#">
              <h3 className="heading-sm mt-1">Own Lead</h3>
            </a>

            <p className="para-sm text-gray-500 line-clamp-3 mt-2 capitalize">
             {`Count: ${dashboardSummery.Lead.Own_Leads}`}
            </p>

            <button onClick={() => Navigate(AppRoutes.OwnLeads)} className="btn-link mt-4 cursor-pointer">Find Out More</button>
          </article>
          <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
            <span className="inline-block rounded bg-custom-primary-default p-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </span>

            <a href="#">
              <h3 className="heading-sm mt-1">Project Management</h3>
            </a>

            <p className="para-sm text-gray-500 line-clamp-3 mt-2 capitalize">
            {`completed count: ${dashboardSummery.Project.Completed}, ongoing count: ${dashboardSummery.Project.Ongoing}`}
            </p>

            <button onClick={() => Navigate(AppRoutes.PvNxtLeads)} className="btn-link mt-4 cursor-pointer">Find Out More</button>
          </article>
          
          <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
            <span className="inline-block rounded bg-custom-primary-default p-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </span>

            <a href="#">
              <h3 className="heading-sm mt-1">RFP Project Management</h3>
            </a>

            <p className="para-sm text-gray-500 line-clamp-3 mt-2 capitalize">
              count: {`${dashboardSummery.Lead.Bindownleads || 0}`}
            {/* {` Commercial count :${summeryData.Customer.Commercial.length}, Domestic count :${summeryData.Customer.Domestic.length}, Government count :${summeryData.Customer.Government.length}, Industrial count :${summeryData.Customer.Industrial.length}, Large industries count :${summeryData.Customer["Large industries"] .length}   `} */}
            </p>

            <button onClick={() => Navigate(AppRoutes.PvNxtLeads,{state:RFP_Project_Management})} className="btn-link mt-4 cursor-pointer">Find Out More</button>
          </article>
          <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
            <span className="inline-block rounded bg-custom-primary-default p-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </span>

            <a href="#">
              <h3 className="heading-sm mt-1">pvNXT Subscribed Leads</h3>
            </a>

            <p className="para-sm text-gray-500 line-clamp-3 mt-2 capitalize">
            count: {`${dashboardSummery.Lead.Subscribedleads || 0}`}
            </p>

            <button onClick={() => Navigate(AppRoutes.PvNxtLeads,{state:Lead_Subscription_TAB})}  className="btn-link mt-4 cursor-pointer">Find Out More</button>
          </article>
        </div>

        {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
          <h2 className="heading heading-md-bold">pvNXT Leads</h2>
          {getFormatRowData("table")}
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
          <h2 className="heading heading-md-bold">Bid Won</h2>
          {getFormatRowData("table")}
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
          <h2 className="heading heading-md-bold">Subscribed Leads</h2>
          {getFormatRowData("table")}
          </div>
        </div> */}

        <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
            <h2 className="heading heading-md-bold">Own Leads</h2>
            <LeadProjectsTable leadsType="subscribedLeads" isDashboard={true}/>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-100  p-4">
            <h2 className="heading heading-md-bold">RFP Submission</h2>
            <RFPBidTableByAgGrid isDashboard={true}/>
          </div>
        </div>
      </div>
      {/* <div className="main-container custom-scrollbar-css">
        <div className="h2"></div>
        <div className="flex items-center">
          <span className=" text-brown-100/70 font-normal text-1.6xl">Showing Data</span>
          <input type="date" className="focus:ring-0 font-normal bg-primary-700/20 focus:none focus:outline-none  m-0  ml-1 p-0.8 w-[16vh] rounded-default" />
        </div>
        <div className="chart-container justify-between" >
          {getFormatRowData("chart")}
        </div>

        <div className="tabs-main">
          <ul className="tabs-content">
            {getFormatRowData("tabs")}
          </ul>
        </div>
        {getFormatRowData("table")}
      </div> */}
    </>
  );
};

export default EPCDashboard;
