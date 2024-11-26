import { AxiosResponse } from 'axios'
import moment from 'moment'
import React, { ChangeEvent, useState } from 'react'
import { toast } from 'react-toastify'
import AgGrid from '../../../../../Components/AgGrid/AgGrid'
import { NewModal } from '../../../../../Components/New/Modal/NewModal'
import { ProjectTy } from '../../../../../ReduxTool/Slice/Auth/types'
import { setModalHeaderFooter } from '../../../../../ReduxTool/Slice/CommonReducers/CommonReducers'
import { BOQEPCDetails, setRFPBidding } from '../../../../../ReduxTool/Slice/Partner/EPC'
import { useAppDispatch, useAppSelector } from '../../../../../ReduxTool/store/hooks'
import { AgGridResponseType, APIResponse } from '../../../../../Utils/Const'
import { fetchCompleteAddress } from '../../../../../Utils/EPCMaps/Maps/LazyloadMap'
import { baseURL, requestUrl } from '../../../../../Utils/baseUrls'
import { dcPowerBasedOnSanctionload, downloadPDFFile, fetchCompleteAddressStr, filterKeyIncludeArr, getElementByIndex, getfilterObjKeysByArr, getStateAbbreviations, isTruthy, toTitleCase } from '../../../../../Utils/commonFunctions'
import logoimage from "../../../../../assests/img/Dashboard/EPC/terranxt_logo 1.png"
import PreviewRFPWrapper from './PreviewRFPBidding'
import { previewRFPDataTyp } from './PreviewRFPList'
import QuoteNow from './QuoteNow/QuoteNow'
import { Button } from '../../../../../Components/AllButton/AllButtons.tsx'

export interface valTy { turnkey: number | string, bos: number | string };
type selectedTy = "turnkey" | "bos";
// const formattedData = (item:miscellaneousdetailsTy,i:number)=>({
//     Sno:(i+1).toString(),
//     Particular: item.Particular,
//     Details: item.Quantity,
//     UOM: item.UOM,
//     "Proposed Make":item['Proposed Make'],
//      Specification:item.Specification

// })
const RFPBidTableByAgGrid = ({isDashboard=false}:{isDashboard?:boolean}) => {
    const dispatch = useAppDispatch()
    const [isQouetModal, setIsQouetModal] = useState(false);
    const {auth} = useAppSelector((state)=>state)
    const [isPreModal, setIsPreModal] = useState(false);
    const [projectid, setProjectid] = useState("");
    let initialVal = { turnkey: "", bos: "" }
    const [val, setVals] = useState<valTy>(initialVal);
    const [valError,setError] = useState<valTy>(initialVal);
    const [selected, setSelected] = useState<selectedTy>("turnkey");
    const { user: { userid, epcid } } = useAppSelector(state => state.auth);
    const [isPreviewEdit, setIsPreviewEdit] = useState(false);
    const { modalData } = useAppSelector(state => state.commonReducers.modal);
    const { pvNxtLeads: { PvNxt: { RFPBid } } } = useAppSelector(state => state.EPCDetails);
    const [isGridUpdate, setIsGridUpdate] = useState(0);
    const [previewDownlaodData,setPreviewDownloadData] = useState({} as previewRFPDataTyp)
    const [loader,setLoader] = useState<boolean>(false)

    const handleQuoteNow = (id: string) => {
        let filterProject = getElementByIndex(filterKeyIncludeArr(RFPBid, "projectid", id), 0) as any,
            qouteSubmitted = filterProject.bidepc && filterProject.bidepc.length > 0 && filterProject.bidepc[0], 
            isQouteSubmitted = (qouteSubmitted.bidcostturnkey>0 || qouteSubmitted.bidcostbos>0) ? true : false,
            isWinning= qouteSubmitted.iswinning !== null ? true :false;
        let isLost = (isQouteSubmitted && filterProject.winbyother!==null);
        let isWonByOther = ((qouteSubmitted.bidcostturnkey==0 || qouteSubmitted.bidcostbos==0) && filterProject.winbyother!==null)?true:false;
            //  (qouteSubmitted.bidcostturnkey || qouteSubmitted.bidcostbos) ? true : false;
        // setVals({ turnkey: qouteSubmitted.bidtype == 1 ? qouteSubmitted.bidcost : "", bos: qouteSubmitted.bidtype == 0 ? qouteSubmitted.bidcost : "" })
        setVals({ turnkey: isTruthy(qouteSubmitted.bidcostturnkey) ? qouteSubmitted.bidcostturnkey : "", bos: isTruthy(qouteSubmitted.bidcostbos) ? qouteSubmitted.bidcostbos : "" })
        setProjectid(id)
        setIsQouetModal(true);
        setError(initialVal)
        dispatch(setModalHeaderFooter({ title: "Quote Now", btnTxt: (isQouteSubmitted || isLost || isWonByOther)? "" : "Submit Quote", secondaryBtnTxt: "", modalData: { isLost,isWonByOther,isQouteSubmitted: isQouteSubmitted,isWinning, modalData: filterProject } }))
    }
    const handlePreviewRFPWrapper = (id: string) => {
        setIsPreModal(true);
        dispatch(setModalHeaderFooter({ title: "Preview RFP", btnTxt: "Download RFP", secondaryBtnTxt: "Edit RFP", modalData: getElementByIndex(filterKeyIncludeArr(RFPBid, "projectid", id), 0) }))
    }

    const RenderTheActiion = ({ data }: { data: any }) => {
        return (
            <div className="w-fit h-fit flex justify-between items-center m-auto gap-[1.6vh]">
                <Button className="btn btn-xs-primary" name={data?.iswinning?"Bid Won":data?.isQouetSubmitted ? "Quote Submitted" : "Quote Now"} onClick={() => handleQuoteNow(data?.projectid)} />
                <Button className="btn btn-xs-primary" name="Preview RFP" onClick={() => handlePreviewRFPWrapper(data?.projectid)}/>

                {/* <button type="button" className="dark-sm-btn py-1.2 w-[12vh]" onClick={() => handleQuoteNow(data?.projectid)}>{data?.iswinning?"Bid Won":data?.isQouetSubmitted ? "Quote Submitted" : "Quote Now"}</button>
                <button type="button" className="light-sm-btn py-1.2 w-[12vh]" onClick={() => handlePreviewRFPWrapper(data?.projectid)}>Preview RFP</button> */}
            </div>
        )
    }

    const colDefs: any = [
        { headerName: "S.No", field: "sno", sortable: true, headerClass: "gridtable-header", maxWidth: 100 },
        { headerName: "Customer Name", field: "customerName", sortable: true, headerClass: "gridtable-header" },
        { headerName: "Address", field: "address", headerClass: "gridtable-header" },
        { headerName: "Plant DC Capacity", field: "plantDC", headerClass: "gridtable-header" },
        { headerName: "Consumer Type", field: "tariffconsumercategory_mstr.consumercategoryname", headerClass: "gridtable-header" },
        { headerName: "Submission Dead Line", field: "bidding.submissiondate", headerClass: "gridtable-header" },
        !isDashboard && { headerName: "Action", field: "index", headerClass: "gridtable-header", cellRenderer: RenderTheActiion },
    ].filter(el=>el);


  const formattedData = (item:any,i:number)=>({
    Sno:(i+1).toString(),
    Particular: item.Particular,
    Details: item.Details!==null?item.Details:"-",
    UOM: item.UOM,
    "Proposed Make":item['Proposed Make'],
     Specification:item.Specification

})

const fetchEpcDetails = async()=>{
    try{
        let epcDetails = {} as any;
        if(auth.user.epcid){
            const {data} = await baseURL.get(`${requestUrl.saveEPC}/${auth.user.epcid}`);
            if (data.code==="200"){
                epcDetails = {name:`${auth.user.fname} ${auth.user.lname}`,companyname:data.responseData.companyname,registrationNo:data.responseData.registrationnumber,serviceState:getStateAbbreviations(data.responseData.serviceablestate.map((each:any)=>each.state)),email:`${auth.user.emailid}`,mobile:auth.user.mobile!==null?`${auth.user.country_mstr?.countrycode}${auth.user.mobile}`:""};   
            }else{
                throw new Error("Epc details not found");
            }
        }else{
            epcDetails = {name:"Team Terranxt",companyname:"Terranxt Pvt Ltd",registrationNo:"U74999HR2020PTC089683",serviceState:"Worldwide",email:"admin@terranxt.com",mobile:"+919719499553"};   
        }
        await generatePreviewRFP("Preview RFP",epcDetails);
    }catch(error){
    }
}

    const generatePreviewRFP = async (title: string,epcUser:any) => {  
        setLoader(true);  
        const downloadTableData: any = {
            "Roof, Client, Misc. & Project Details": previewDownlaodData.projectDetails.feilds.map(item=>({"S.No":item.Sno,Particular:item.Particular,Details:item.Details!==null?item.Details:"-"})),
            "Module Details": previewDownlaodData.moduleDetails.feilds.map(item=>({"S.No":item.Sno,Particular:item.Particular,Details:item.Details!==null?item.Details:"-"})),
            "Inverter Details": previewDownlaodData.inverterDetails.feilds.map(item=>({"S.No":item.Sno,Particular:item.Particular,Details:item.Details!==null?item.Details:"-"})),
            "Module Mounting Structure": previewDownlaodData.moduleMountingDetails.feilds.map(item=>({"S.No":item.Sno,Particular:item.Particular,Details:item.Details!==null?item.Details:"-"})),
            "ACCB Details": previewDownlaodData.accbDetails.feilds.map(item=>({"S.No":item.Sno,Particular:item.Particular,Details:item.Details!==null?item.Details:"-"})),
            "Miscellaneous Details": previewDownlaodData.miscellaneousDetails.feilds.map(item=>({"S.No":item.Sno,Particular:item.Particular,Details:item.Details!==null?item.Details:"-"})),
            "DG-PV Details": previewDownlaodData.DGPVDetails.feilds.map(item=>({"S.No":item.Sno,Particular:item.Particular,Details:item.Details!==null?item.Details:"-"})),
            "Fire Fighting Details": previewDownlaodData.FirefightingSys.feilds.map((item:any,i:number)=>(formattedData(item,i))),
            "Lifeline Details": previewDownlaodData.Lifeline.feilds.map((item:any,i:number)=>(formattedData(item,i))),
            "Walkway Details": previewDownlaodData.WalkWay.feilds.map((item:any,i:number)=>(formattedData(item,i))),
            "Monitoring System Design": previewDownlaodData.MonitoringSys.feilds.map((item:any,i:number)=>(formattedData(item,i))),
            "Module Cleaning Details": previewDownlaodData.ModuleCleaning.feilds.map((item:any,i:number)=>(formattedData(item,i))),
        }



        const completeaddress = await fetchCompleteAddress(modalData.lat,modalData.lng);
        const completeaddressStr =  fetchCompleteAddressStr(completeaddress);
        const everypageaddress =  fetchCompleteAddressStr(getfilterObjKeysByArr(completeaddress,['city','state','pincode']));
        const userDetailsText = `${toTitleCase(epcUser.name)} | ${toTitleCase(epcUser.companyname)} | ${epcUser.registrationNo} | ${epcUser.email}`  
          const pd = `${modalData.projectname} | ${toTitleCase(modalData.user.fname)} ${modalData.user.lname!==null?toTitleCase(modalData.lname):""}| ${everypageaddress} | ${toTitleCase(modalData.user.emailid)}`
          const plantcapcity = dcPowerBasedOnSanctionload(modalData.sanctionload)
         await downloadPDFFile(title,downloadTableData,logoimage,completeaddressStr!==undefined?completeaddressStr:"",plantcapcity,modalData.projectname,userDetailsText,pd,epcUser,)

         setLoader(false)

    };
    const validateBiddingData = (): boolean => {
        let isValid = true;
        const errors= {} as valTy;
        const { bos, turnkey } = modalData.modalData.bidding;
        const { bos: bosValue, turnkey: turnkeyValue } = val;
        const validations = [
            // {   field: "turnkey",condition: bos && turnkey && (typeof turnkeyValue === 'string' ? turnkeyValue.trim() === "" : turnkeyValue === 0) && (typeof bosValue === 'string'? bosValue.trim() === "" : bosValue ===0),message: "At least one bid cost is required"},
            bos && {   field: "bos",condition: bos && typeof bosValue === 'string' ? bosValue.trim() === "" : bosValue === 0,message: "BOS cost is required"},
            turnkey  && {   field: "turnkey",condition: turnkey && typeof turnkeyValue === 'string'?turnkeyValue.trim() === "" : turnkeyValue === 0,message: "Turnkey cost is required"},
            // {   field: "bos",condition: bos && parseFloat(bosValue as string) === 0,message: "BOS cost cannot be 0"},
            // {   field: "turnkey",condition: turnkey && parseFloat(turnkeyValue as string) === 0,message: "Turnkey cost cannot be 0",},
        ].filter(el=>el);
        for (const { field, condition, message } of validations) {
            if (condition) {
                errors[field as keyof valTy] = message;
                isValid = false;
            }
        };
        if (Object.keys(errors).length > 0) {
            (setError(errors));
        }
    
        return isValid;
    };
    
    const updateProject = async () => {
        // let isErr = false, toastmsg = ""
        // if (modalData.modalData.bidding.bos || modalData.modalData.bidding.turnkey) {
        //     if (modalData.modalData.bidding.bos && modalData.modalData.bidding.turnkey) {
        //         if ((val.turnkey === "" && val.turnkey.trim() === "") && (val.bos === "" && val.bos.trim() === "")){
        //             isErr = true
        //             toastmsg = "Atleast one bid cost is required"
        //         }
        //         // else if (val.bos === "") {
        //         //     isErr = true
        //         //     toastmsg = "Please Enter BOS Cost"
        //         // }
        //     }
        //     else if (modalData.modalData.bidding.bos && val.bos === "") {
        //         isErr = true
        //         toastmsg = "BOS cost is required"
        //     }
        //     else if (modalData.modalData.bidding.turnkey && val.turnkey === "") {
        //         isErr = true
        //         toastmsg = "Turnkey cost is required"
        //     }
        // }
        // if (isErr){
        //     toast.error(toastmsg, { toastId: "update project" })
        //     return;
        // }
        // // toast.success("success",{toastId:"successs"})
        // // if (!val.bos && !val.turnkey) {
        // //     toast.error("Please provide atleast one value");
        // //     return;
        // // }
        const isValid = validateBiddingData();
        if(!isValid) return;
        try {
            let reqBody = {} as any;
            if (val.bos) {
                reqBody.bos = val.bos;
                reqBody.bidtype = 0;
            };
            if (val.turnkey) {
                reqBody.turnkey = val.turnkey;
                reqBody.bidtype = 1;
            };
            if (modalData && modalData.modalData && modalData.modalData!.bidding.bos && modalData.modalData!.bidding.turnkey) {
                reqBody.bidtype = 2;
            }
            const { data }: AxiosResponse<APIResponse<any>> = await baseURL.patch(requestUrl.qouteBidCost + "/" + projectid + "/" + epcid, reqBody);
            if (data.code === "200") {
                toast.success(data.message);
                setIsGridUpdate(prev => prev + 1);
                setIsQouetModal(false);
                setError(initialVal);
                setVals(initialVal);
            }
        } catch (err: any) {
            toast.error(err.response?.data.message ?? "There was an issue to fetch generation. Please try again later.")
        }
    };
    const handleOnClick = async(btnTitle: string) => {
        if (btnTitle === "Quote Now") {
            if (modalData && !modalData.isQouteSubmitted) {
                updateProject();
            } else {
                toast.info("Your bid has been successfully submitted and is currently undergoing review. Kindly await the outcome")
            }
        }
        else if (btnTitle === "Preview RFP") {
            await fetchEpcDetails();
        }

    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // if (name === "turnkey") {
        //     setSelected("turnkey")
        //     setVals({ turnkey: parseFloat(value), bos: value ? 0 : val.bos });
        // } else if (name === "bos") {
        //     setSelected("bos")
        //     setVals({ turnkey: value ? 0 : val.turnkey, bos: parseFloat(value) });
        // }
        if(valError && valError[name as keyof valTy]){
            delete valError[name as keyof valTy]
            setError(valError);
        }
        if(value && value.length>10){
            return;
        }
        setVals({ ...val, [name]: parseFloat(value) });
    }
    const handlefocus = (e: ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setSelected(name as selectedTy)
        // if (name === "turnkey") {
        //     setVals({ ...val, bos: "" });
        // } else if (name === "bos") {
        //     setVals({ ...val, turnkey: "" });
        // }
    }
    
    const formatedRowData = (el: ProjectTy, ind: number) => ({
        ...el,
        sno: ind + 1,
        bidding: {
            ...el.bidding,
            submissiondate: `${moment(el.bidding.submissiondate).format("DD-MM-YYYY")} ${moment(el.bidding.lsttimesubmission, "HH:mm").format("HH:mm")}`
        },
        isQouetSubmitted: el.bidepc.some(el => (el.bidcostbos || el.bidcostturnkey) > 0),
        iswinning: el.bidepc.some(el => el.iswinning !== null),
        plantDC: `${el.sanctionload} kWp`,
        customerName:`${toTitleCase(el.user.fname)} ${toTitleCase(el?.user?.lname)??""}`,
        isLost : (el.bidepc.some(el => (el.bidcostbos || el.bidcostturnkey) > 0) && el.winbyother!==null),
        isWonByOther : (el.bidepc.some(el => (el.bidcostbos || el.bidcostturnkey) === 0) && el.winbyother!==null),
        tariffconsumercategory_mstr:{
            ...el.tariffconsumercategory_mstr,
            consumercategoryname:toTitleCase(el.tariffconsumercategory_mstr.consumercategoryname),
        }
    });
    const changeHandler = () => {
        setIsPreviewEdit(prev => !prev);
    }
    const getTableData = async (page: number, rows: number): Promise<AgGridResponseType<any[]>> => {
        try {
            const { data }: AxiosResponse<APIResponse<AgGridResponseType<any[]>>> = await baseURL.get(`${requestUrl.getRFPByEPCId + epcid}?page=${page}&per_page=${rows}`);
            data.responseData.data = data.responseData.data.map((el: any, ind: number) => formatedRowData(el, ind));
            dispatch(setRFPBidding(data.responseData.data));
            return data.responseData
        } catch (err: any) {
            dispatch(setRFPBidding([]));
            return {} as AgGridResponseType<any[]>
        }
    }
    return (
        <>
            {/* {isQouetModal && <FormModal headerTitle={"Qouet now"} modalSize="lgx" name={"Model Name"} btnTitle={"Button Name"} onSubmit={handleOnClick} children={<QuoteNow selected={selected} setSelected={setSelected} setVals={setVals} val={val} handleChange={handleChange} handlefocus={handlefocus} />} closeModal={()=>setIsQouetModal(false)}/>} */}
        
            {isQouetModal && <NewModal isAbleCLick={true} modalSize="lgx" name={"Model Name"} btnName={"Button Name"} onClick={handleOnClick} children={<QuoteNow selected={selected} setSelected={setSelected} setVals={setVals} val={val} handleChange={handleChange} handlefocus={handlefocus} error={valError}/>} setIsCLose={setIsQouetModal}/>}
            {isPreModal && <NewModal isAbleCLick={true} name={"Model Name"} btnName={"Button Name"} modalSize='lgx' onClick={handleOnClick}  children={<PreviewRFPWrapper loader={loader} isEditable={isPreviewEdit} changeHandler={changeHandler} setPreviewDownloadData={setPreviewDownloadData}/>} setIsCLose={setIsPreModal}/>}
            {epcid && <AgGrid isGridUpdate={isGridUpdate} getTableData={getTableData} colDefs={colDefs} maxHeight={isDashboard?460:790} />}
        </>
    )
}
export default React.memo(RFPBidTableByAgGrid)
