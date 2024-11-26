import { AxiosResponse } from 'axios'
import React, { useState,memo } from 'react'
import { Link } from 'react-router-dom'
import { IconEngineering2, IconHouse } from '../../../../assests/icons/Icons'
import AgGrid from '../../../../Components/AgGrid/AgGrid'
import { Button } from '../../../../Components/AllButton/AllButtons.tsx'
import FormModal from '../../../../Components/New/Modal/FormModal'
import { ProjectTy, user_mstr_modal } from '../../../../ReduxTool/Slice/Auth/types'
import { setModalHeaderFooter } from '../../../../ReduxTool/Slice/CommonReducers/CommonReducers'
import { LeadType } from '../../../../ReduxTool/Slice/Partner/EPC'
import { useAppDispatch, useAppSelector } from '../../../../ReduxTool/store/hooks'
import { getUserType } from '../../../../Utils/AuthRedirections'
import { baseURL, requestUrl } from '../../../../Utils/baseUrls'
import { dateFormater, filterKeyIncludeArr, getIndexWiseDetails, getOwnLeadsProjectDetails, toTitleCase } from '../../../../Utils/commonFunctions'
import { AgGridResponseType, APIResponse } from '../../../../Utils/Const'
import DocumentModal from './OwnLeads/DocumentModal'
import InstallerAssignemntModal from './OwnLeads/InstallerAssignemntModal'
import OverviewModal from './OwnLeads/OverviewModal'

const LeadProjectsTable = ({leadsType,isGridUpdate=0,isDashboard=false}:{leadsType:"ownLeads"|"bidWonLeads"|"subscribedLeads",isGridUpdate?:number,projectDetails?:ProjectTy,isDashboard?:boolean}) => {
    const dispatch = useAppDispatch()
    const [modal, setModal] = useState({ InstallerAssignemnt: false, document: false, overview: false });
    const { user: { epcid } } = useAppSelector(state => state.auth)        
    const [projectDetails,setProjectDetails] = useState([] as ProjectTy[] | user_mstr_modal[]);
        /*********************Handle Modals Controller *********************************/
    const modalHandler = (modalType: string) => {
        setModal(prev => ({ ...prev, [modalType]: !prev[modalType as keyof object] }))
        let modalHeaderFooter = {title:"",btnTxt:"",secondaryBtnTxt:""}
        switch(modalType){
          case "document":
            modalHeaderFooter = {title:"Document Upload",btnTxt:"Ok",secondaryBtnTxt:""}
            break;
          case "InstallerAssignemnt":
            modalHeaderFooter = {title:"Installer Assignment",btnTxt:"Notify Installer",secondaryBtnTxt:""}
            break;
          default:
            break;  
        }
        dispatch(setModalHeaderFooter(modalHeaderFooter));
      };
      const overviewModalHandler = (event: React.MouseEvent<HTMLButtonElement>, rowData: LeadType) => {
        modalHandler("overview");
        let projectDetail={} as ProjectTy;
        if (leadsType !== "ownLeads") {
            projectDetail = getIndexWiseDetails(filterKeyIncludeArr(projectDetails, "projectid", rowData.projectid), 0);
        }else{
            let data = getIndexWiseDetails(filterKeyIncludeArr(projectDetails, "userid", rowData.userid), 0);
            projectDetail = getIndexWiseDetails(filterKeyIncludeArr(data.projects, "projectid", rowData.projectid), 0);
        }
        dispatch(setModalHeaderFooter({ title: "Project Overview", btnTxt: "Ok", secondaryBtnTxt: "", modalData: projectDetail }))
      };
       /*********************Table Binding columns *********************************/
      const RenderTheAction = (rowData: any) => {
        let { data } = rowData;
        return (
          <div className="w-fit h-fit flex justify-between items-center m-auto gap-2">
                      <Button className="btn-link" name="Documents" onClick={() => modalHandler("document")}/>
                      <Button className="btn-link" name="Overview" onClick={(e:any) => overviewModalHandler(e, data)}/>
            {/* <button onClick={() => modalHandler("document")} type="button" className="dark-sm-btn p-1.2">Documents</button>
            <button onClick={(e) => overviewModalHandler(e, data)} type="button" className="light-sm-btn p-1.2">Overview</button> */}
          </div>
        )
      };
      const RenderTheRoofAnalaysisProcess = ({ data }: any) => {
        return data ? (
          <div className="GenericTableIcons-container">
            <Link to={`/${getUserType()}/RoofAnalysis`} title='Roof Analysis' state={{ userid: data?.userid, project: data }} className={`GenericTableIcons`/*${data.RoofAnalysisCompleted ? "disabled" : ""} */}>
              <IconHouse fill={data.RoofAnalysisCompleted ? "#28C76F" : "#337AB7"} />
              <span style={{ color: data.RoofAnalysisCompleted ? "#28C76F" : "#337AB7" }} >Roof Analysis</span>
            </Link>
            <button disabled={!data.RoofAnalysisCompleted} title={!data.RoofAnalysisCompleted?"Please Complete Roof Analysis First":"Installer Assignment"} style={{cursor:!data.RoofAnalysisCompleted?'not-allowed':'pointer'}} onClick={() => modalHandler("InstallerAssignemnt")} className="GenericTableIcons">
              <IconEngineering2 />
              <span>Installer Assignment</span>
            </button>
          </div>
        ): null
      };
      const colDefs: any = [
        { headerName: "S.No", field: "index", sortable: true, headerClass: 'gridtable-header', maxWidth: 90, cellClass: "row-value" },
        { headerName: "Customer Name", field: "customerName", sortable: true, headerClass: 'gridtable-header' },
        { headerName: "Project Name", field: "projectName", sortable: true, headerClass: 'gridtable-header' },
        { headerName: "Address", field: "address", sortable: true, headerClass: 'gridtable-header' },
        { headerName: "Mobile Number", field: "mobile", sortable: false, headerClass: 'gridtable-header' },
        { headerName: "Email Id", field: "emailid", sortable: true, headerClass: 'gridtable-header' },
        leadsType == 'bidWonLeads' && { headerName: "Bid Won Type", field: "bidwontype", sortable: true, headerClass: 'gridtable-header' },
        !isDashboard && { headerName: "Roof Analaysis Process", sortable: false, headerClass: 'gridtable-header', cellRenderer: RenderTheRoofAnalaysisProcess,minWidth:200 },
        !isDashboard && { headerName: "Action", sortable: false, headerClass: 'gridtable-header', cellRenderer: RenderTheAction,minWidth:200 }
      ].filter(el=>el);
      const formatedRowData = (data: any, index: number) => {
        return { ...data, 
            index: index
        }
      };
      const getScubscribedLeadsProjectDetails = async(data: any): Promise<LeadType[]> => {
       let leads:LeadType[] = [];   
       data.forEach((el:ProjectTy,ind:number)=>{
            let lead:LeadType = {
                userid: el.userid!,
                customerName: `${toTitleCase(el.user.fname)} ${el.user.lname !== null ? toTitleCase(el.user.lname!) : ""}`,
                emailid: el.user.emailid!,
                mobile: el.user.mobile!,
                address: el.address ? toTitleCase(el.address) : "-",
                projectid: el.projectid,
                projectName: toTitleCase(el.projectname),
                projectCost: el.projectcost,
                RoofAnalysisCompleted: el.isepccomplete,
                projecttype: toTitleCase(el.projecttype),
                createddt: dateFormater(el.createddt, "DD-MM-YYYY"),
                sanctionload: el.sanctionload,
                // consumercategoryname:el?.tariffconsumercategory_mste.consumercategoryname,
            };
            if(leadsType=='bidWonLeads'){
                lead.bidwontype=el.bidepc.length>0 ? el.bidepc[0].iswinning == 0 ? "BOS" : "Turnkey" : "-"
            }
            leads.push(lead);
        });
       return leads;
      };
      let subDummy = {"projectid":"","address":"Noida one, Uttar Pradesh, IND","projectname":"PvNxtFP00","projectcost":"00000","userid":"","user":{"fname":"example","lname":"example","emailid":"example@gmail.com","mobile":"8798789789"},"isepccomplete":false,"sanctionload":0,"createddt":"10-12-2024"};
      const getTableData = async (page: number, rows: number): Promise<AgGridResponseType<any[]>> => {
        try {
            let reqUrl = requestUrl.getEPCUsers;
            if(leadsType === "subscribedLeads"){
                reqUrl = requestUrl.getSubscribedLeads;
            }else if(leadsType === "bidWonLeads"){
                reqUrl = requestUrl.getBidWonLeads;
            };
            const { data }: AxiosResponse<APIResponse<AgGridResponseType<any[]>>> = await baseURL.get(`${reqUrl+ epcid}?page=${page}&per_page=${rows}`);
            let formatedData = [];
            if (leadsType === "ownLeads"){
                formatedData = await getOwnLeadsProjectDetails(data.responseData.data);
                setProjectDetails(data.responseData.data);
            }else{
              if(leadsType === "subscribedLeads" && !data.responseData.data.length && !isDashboard){
                for(var i=0;i<10;i++){
                  data.responseData.data.push(subDummy);
                }
                data.responseData.total = 10
              }
                formatedData = await getScubscribedLeadsProjectDetails(data.responseData.data);
                setProjectDetails(data.responseData.data);
            }
            data.responseData.data = formatedData.map((el: any, ind: number) => formatedRowData(el, ind+1+(page*10)));
            return data.responseData
        }catch (err: any) {
            return err.response.data.responseData as AgGridResponseType<any[]>
        }
    }
    return (
        <>
            {modal.InstallerAssignemnt && <FormModal modalSize='lg' name="installerAssignment" btnTitle='Notify Installer' headerTitle="Installer Assignment" onSubmit={() => { }} children={<InstallerAssignemntModal />} closeModal={() => modalHandler("InstallerAssignemnt")} />}
            {modal.overview && <FormModal modalSize='lgx' name="modal name" btnVisible={false} btnTitle='' onSubmit={() => modalHandler("overview")} headerTitle="Project Overview" children={<OverviewModal  />} closeModal={() => modalHandler("overview")} />}
            {/* {modal.overview && <Modal5 handleModal={()=>{}} description='SDLCNLKSDHCKDHC' modalSize='lg' name="modal name" cancelBtn='No' yesBtn={"Yes"} modalName="Project Overview" closeModal={() => modalHandler("overview")} />} */}
            {modal.document && <FormModal modalSize='lg' name="Modal name" btnTitle='Ok' headerTitle={"Document Upload"} onSubmit={() => modalHandler("document")} children={<DocumentModal />} closeModal={() => modalHandler("document")} />}
            {epcid && <AgGrid colDefs={colDefs} getTableData={getTableData} isGridUpdate={isGridUpdate} maxHeight= {isDashboard ? 460 : leadsType !== "subscribedLeads" ? 790 : 750}/>}
        </>
    )
}

export default memo(LeadProjectsTable)
