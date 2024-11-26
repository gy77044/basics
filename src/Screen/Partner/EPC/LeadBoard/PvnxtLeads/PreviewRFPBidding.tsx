import moment from "moment";
import { useEffect, useState } from "react";
import { ProjectTy } from "../../../../../ReduxTool/Slice/Auth/types";
import { useAppSelector } from "../../../../../ReduxTool/store/hooks";
import { dcPowerBasedOnSanctionload } from "../../../../../Utils/commonFunctions";
import { DGPVDetails, accbDetails, miscellaneousDetails, moduleDetails, previewRFPData, previewRFPDataTyp, previewTableFieldTy, previewTableTy, projectDetails } from "./PreviewRFPList";
import RingLoader from "../../../../../Components/Loaders/RingLoader";
const PreviewRFPWrapper = ({ isEditable,changeHandler,setPreviewDownloadData,loader} : { isEditable: boolean,changeHandler:(e:any)=>void,setPreviewDownloadData:any,loader:boolean }) => {
  const {modalData:rowData} = useAppSelector(state=>state.commonReducers.modal)
  const {miscellaneousdesign} = useAppSelector(state=>state.EPCDetails.roofAnalysis.formDetails)
  console.log("rowdata",rowData)

  const formattedData = (item:any,i:number,isExisted?:string)=>({
    Sno:(i+1).toString(),
    Particular: item.Particular,
    Details: isExisted?item.Quantity:"-",
    UOM: item.UOM,
    "Proposed Make":item['Proposed Make'],
     Specification:item.Specification

})

  
  let initialState={
    projectDetails: {
      headerTitle: "Roof, Client, Misc. & Project Details",
      feilds: projectDetails,
    },
    moduleDetails: {
      headerTitle: "Module Details",
      feilds: moduleDetails
    },
    inverterDetails: {
      headerTitle: "Inverter Details",
      feilds: [
        {Sno:"1", Particular: "Inverter Make", Details: rowData.pvinverter?.name ,key:""},
        {Sno:"2", Particular: "Each Inverter Capacity (kW)", Details: rowData.pvinverter?.stname,key:""},
        {Sno:"3", Particular: "Location of Inverter", Details: "-" ,key:""},
        {Sno:"4", Particular: "Mode for inverter Installation", Details: "-" ,key:""},
      ],
    },
    moduleMountingDetails: {
      headerTitle: "Module Mounting Structure",
      feilds: [
        {Sno:"1", Particular: "Roof Type", Details:rowData.projecttype,key:"projecttype" },
        {Sno:"2", Particular: "Roof Penetration Allowed", Details: "-" ,key:""},
        {Sno:"3", Particular: "MMS Make", Details: "-" ,key:""},
        {Sno:"4", Particular: "MMS Type", Details:rowData.mmstype ,key:""},
      ],
    },
    accbDetails: {
      headerTitle: "ACCB Details",
      feilds: accbDetails,
    },
    miscellaneousDetails:{
      headerTitle:"Miscellaneous Details",
      feilds:miscellaneousDetails
    },
    DGPVDetails:{
      headerTitle:"DG-PV Details",
      feilds:DGPVDetails
    },
    // RPRProtection: {
    //   headerTitle:"",
    //   feilds:miscellaneousdesign.needRPRProtection.details.map((each,i:number)=>({Sno:String(i+1),Particular:each.Particular,Details:each.Quantity,UOM:each.UOM}))
    // },
    FirefightingSys: {
      headerTitle:"Fire Fighting System Design",
      feilds:rowData.firefightingdata!==null?rowData.firefightingdata.map((each:any,i:number)=>formattedData(each,i,"yes")):miscellaneousdesign.needFirefightingSys.details.map((each,i:number)=>formattedData(each,i)) // add row data here if existed
    },
    Lifeline:{
      headerTitle:"Lifeline Design",
      feilds:rowData.lifelinedata!==null?rowData.lifelinedata.map((each:any,i:number)=>formattedData(each,i,"yes")):miscellaneousdesign.needLifeline.details.map((each,i:number)=>formattedData(each,i))
    },
    WalkWay:{
      headerTitle:"Walkway Design",
      feilds:rowData.walkwaydata!==null?rowData.walkwaydata.map((each:any,i:number)=>formattedData(each,i,"yes")):miscellaneousdesign.needWalkWay.details.map((each,i:number)=>formattedData(each,i))
    },
    MonitoringSys: {
      headerTitle:"Monitoring System Design",
      feilds:rowData.monitoringdata!==null?rowData.monitoringdata.map((each:any,i:number)=>formattedData(each,i,"yes")):miscellaneousdesign.needMonitoringSys.details.map((each,i:number)=>formattedData(each,i))
    },
    ModuleCleaning:{
      headerTitle:"Module Cleaning System Design",
      feilds:rowData.modulecleaning!==null?rowData.modulecleaning.map((each:any,i:number)=>formattedData(each,i,"yes")):miscellaneousdesign.needModuleCleaning.details.map((each,i:number)=>formattedData(each,i))
    },

  };
  const [previewRFPData, setPreviewRFPData] = useState<previewRFPDataTyp>(JSON.parse(JSON.stringify(initialState)));
  useEffect(()=>{
    projectDetails.forEach(el=>{
      switch(el.key){
        case "address":
          el.Details=`${rowData["address"]} (${rowData.lat.toFixed(2)}, ${rowData.lng.toFixed(2)})`??null;
          break;
        case "sanctionloadDC":
          el.Details=rowData.sanctionload ? rowData.sanctionload+" kWp" : "-"
          break;
        case "commissioningDate":
          el.Details=rowData.bidding?`${rowData.bidding?.submissiondate}`:'-';
          break;
        default:
          el.Details=rowData[el.key as keyof ProjectTy]??null
      }
    });
    // moduleMountingDetails.forEach(el=>{
    //   switch(el.key){
    //     case "moduleMountingStructure":
    //       el.Details=rowData.projecttype??null;
    //       break;
    //     default:
    //       el.Details=rowData[el.key as keyof ProjectTy]??null
    //   }
    // });
    const moduleMounting:previewTableFieldTy[]=[
      { Sno: "1", Particular: "Roof Type", Details: rowData.projecttype ,  },
      { Sno: "2", Particular: "Roof Penetration Allowed", Details: "-",},
      { Sno: "3", Particular: "MMS Make", Details: "Custom",  },
      { Sno: "4", Particular: "MMS Type", Details: rowData.mmstype, },
    ];

    // moduleDetails.forEach(el=>{
    //     let keys = el.key.split(".");
    //     el.Details = rowData[keys[0] as keyof ProjectTy] || null;
    //     if (keys.length > 1) {
    //       el.Details = rowData[keys[0] as keyof ProjectTy]?.[keys[1]];
    //     };
    //   });

      const pvinverter:previewTableFieldTy[] = [
        { Sno: "1", Particular: "Inverter Make", Details: rowData?.pvinverter?.name?rowData.pvinverter.name.toString():"-" },
        { Sno: "2", Particular: "Each Inverter Capacity (kW)", Details: `${rowData?.pvinverter?.vdco?rowData.pvinverter.vdco.toString():"-"} Wp | ${rowData?.pvinverter?.vac?rowData.pvinverter.vac.toString():"-"} V | ${rowData?.pvinverter?.cec_hybrid?rowData.pvinverter.cec_hybrid.toString():"-"}`},
        { Sno: "3", Particular: "Location of Inverter", Details: "-" },
        { Sno: "4", Particular: "Mode for inverter Installation", Details: "-" },
      ];

      const pvmodule:previewTableFieldTy[] = [
        { Sno: "1", Particular: "Module Make ", Details: rowData?.pvmodule?.name?rowData.pvmodule.name.toString():"-", },
        { Sno: "2", Particular: "Each Module Capacity Range (Wp)", Details: rowData?.pvmodule?.stc?rowData.pvmodule.stc.toString():"-", },
        { Sno: "3", Particular: "Module Details based on each module capacity", Details:`${rowData?.pvmodule?.v_mp_ref?rowData.pvmodule.v_mp_ref :"-"} V | ${rowData?.pvmodule?.technology?rowData.pvmodule.technology:"-"} | ${rowData?.pvmodule?.n_s?rowData.pvmodule.n_s:"-"} cells `},
      ];


  

    accbDetails.forEach(el=>{
      switch(el.key){
        case "address":
          el.Details=`${rowData["address"]} (${rowData.lat.toFixed(2)}, ${rowData.lng.toFixed(2)})`??null;
          break;
          case "dc":
            el.Details=rowData.sanctionload.toString()??null;
            break;
        case "ac":
          el.Details=dcPowerBasedOnSanctionload(rowData.sanctionload).toString()??null;
          break;
        case "ac":
          el.Details=dcPowerBasedOnSanctionload(rowData.sanctionload).toString()??null;
          break;
        case "mmstiltangle":
          el.Details=rowData.rooftiltangle??null;
          break;
          case "totalroofarea":
            el.Details=rowData.totalroofarea.toString() +" m"??null;
            break;
        case "commissioningDate":
          el.Details=rowData.bidding?`${moment(rowData.bidding?.submissiondate,"format").format("DD-MM-YYYY")} ${moment(rowData.bidding?.lsttimesubmission,"HH:mm").format("HH:mm")}`:'N/A';
          break;
        default:
          el.Details=rowData[el.key as keyof ProjectTy]??null
        // case "address":
        //   el.Details=`${rowData.lat.toFixed(2)} - ${rowData.lng.toFixed(2)} (${rowData["address"]})`??null;
        //   break;
        // case "sanctionloadDC":
        //   el.Details=dcPowerBasedOnSanctionload(rowData.sanctionload).toString()??null;
        //   break;
        //   case "totalroofarea":
        //     el.Details=rowData.totalroofarea.toString() +" m"??null;
        //     break;
        // default:
        //   el.Details=rowData[el.key as keyof ProjectTy]??null
      }
    });
    // inverterDetails.forEach(el=>{
    //   let keys = el.key.split(".");
    //   el.Details = rowData[keys[0] as keyof ProjectTy] || null;
    //   if (keys.length > 1) {
    //     el.Details = rowData[keys[0] as keyof ProjectTy]?.[keys[1]];
    //   };
    // })
    let updatePrivewData = {...initialState,
      projectDetails:{...initialState.projectDetails,feilds:projectDetails.map(item=>({...item,Sno:item.Sno,Particular:item.Particular,Details:item.Details!==null?item.Details:"-"}))},
      moduleMountingDetails:{...initialState.moduleMountingDetails,feilds:moduleMounting},
      accbDetails:{...initialState.accbDetails,feilds:accbDetails.map(item=>({Sno:item.Sno,Particular:item.Particular,Details:item.Details!==null?item.Details:"-"}))},
      moduleDetails:{...initialState.moduleDetails,feilds:pvmodule},
      inverterDetails:{...initialState.inverterDetails,feilds:pvinverter}
    } as previewRFPDataTyp;
    setPreviewRFPData(updatePrivewData);
    setPreviewDownloadData(updatePrivewData)
  },[])
  const tableInputChangeHandler = (e:any,index: any,type:previewRFPData) => { 
    const {name,value} = e.target
    console.log(index,type,value);
    setPreviewRFPData({...previewRFPData,[type]:{...previewRFPData[type],feilds:previewRFPData[type].feilds.map((el:any,index1:any)=>index1===index?{...el,Details:value}:el)}})
  };
  // const tableMain = (tableDetals: previewTableTy, tableHeaderList: any,tableName:previewRFPData) => (
  //   <div className="table-main mt-2">
  //     <div className="table-name font-medium text-primary-200 ">{tableDetals.headerTitle}</div>
  //     <table className="table">
  //       <thead className="thead">
  //         <tr>{tableHeaderList.map((el: any) => (el !== "key" &&<th className="hvalue">{el}</th>))}</tr>
  //       </thead>
  //       <tbody>
  //         {tableDetals.feilds.map((row, index) => (
  //           <tr className="trow" key={index}>
  //             <td className="rheading">{row.Sno || index}</td>
  //             <td className="rheading">{row.Particular}</td>
  //             <td className="rvalue">
  //               {isEditable ?
  //                 <div className="group flex justify-between items-center w-full border-none prepareEdit">
  //                   <Input placeholder={row.Particular} onChange={(e:any) => tableInputChangeHandler(e,index,tableName)} id="id" name={row.Particular} type="text" label="" value={row.Details} />
  //                 </div>
  //                 :
  //                 <span>{row?.Details??"-"}</span>
  //               }
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // )

  const tableMain = (tableDetals: previewTableTy, tableHeaderList: any,tableName:previewRFPData) => (
    <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 mt-2">
      <div className="para-md mb-2">{tableDetals.headerTitle}</div>
      <div  className="main-section1 mt-4">
      <table className="table-main1">
        <thead className="table-head1">
          <tr>{tableHeaderList.map((el: any) => (el !== "key" &&<th className="table-headth1">{el=="Sno"?"S.No":el}</th>))}</tr>
        </thead>
        <tbody className="table-body1">
          {tableDetals.feilds.map((row, index) => (
            <tr className="table-bodytr1" key={index}>
              {tableHeaderList.map((el: any) => (el !== "key" &&<td className="table-bodytd1">{row[el as keyof object]}</td>))}
              {/* <td className="rheading">{row.Sno || index}</td>
              <td className="rheading">{row.Particular}</td>
              <td className="rvalue">
                {isEditable ?
                  <div className="group flex justify-between items-center w-full border-none prepareEdit">
                    <GblInput placeholder={row.Particular} handleChange={(e) => tableInputChangeHandler(e,index,tableName)} id="id" inputName={row.Particular} inputType="text" labelname="" value={row.Details} />
                  </div>
                  :
                  <span>{row?.Details??"-"}</span>
                }
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )


  const bindPFPTableDetails = () => {
    let tableKeys:any = Object.keys(previewRFPData);
    return (
      <>
        {tableKeys.map((table:previewRFPData, tableIndx:number) => {
          let tableDetals = previewRFPData[table as keyof previewRFPDataTyp];
          let tableHeaderList = Object.keys(tableDetals.feilds[0]);
          return (
            <>{tableIndx > 0 && tableMain(tableDetals, tableHeaderList,table)}</>)
        })}
      </>
    );
  };
  const bindPFPProjectTableDetails = () => {
    let tableKeys:any = Object.keys(previewRFPData);
    return (
      <>
        {tableKeys.map((table:previewRFPData, tableIndx:number) => {
          let tableDetals = previewRFPData[table as keyof previewRFPDataTyp];
          let tableHeaderList = Object.keys(tableDetals.feilds[0]);
          return (
            <>{tableIndx === 0 && tableMain(tableDetals, tableHeaderList,table)}</>)
        })}

      </>
    );
  };
  return (
    <>
    {loader && <RingLoader/>}
          <div className="flex gap-4">
        <div className="flex-1 previewTable">
          {bindPFPProjectTableDetails()}
        </div>
        <div className="flex-1 previewTable">
          {bindPFPTableDetails()}
        </div>
      </div>
    </>
  );
};

export default PreviewRFPWrapper;
