import { memo, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IconInfo } from "../../../../../../assests/icons/DrawerIcons";
import { Input, InputRadio2 } from "../../../../../../Components/AllInput/AllInput";
import FormModal from "../../../../../../Components/New/Modal/FormModal";
import SelectPicker from "../../../../../../Components/New/Select/SelectPicker";
import { contentlist } from "../../../../../../Containers/DefaultLayouts/AsideRouteLists";
import { setModalHeaderFooter } from "../../../../../../ReduxTool/Slice/CommonReducers/CommonReducers";
import { setRoofAnalysisDetails } from "../../../../../../ReduxTool/Slice/Partner/EPC";
import { addACCBDesignDetails, deleteTheAccbRow, duplicateTheAccbRow, toggleACCBArrayActionModal, toggleTheEDDModal } from "../../../../../../ReduxTool/Slice/PartnerDesignSummary/ElectricalEquipmentDesSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../ReduxTool/store/hooks";
import GlobalTableForLSBDetails from "../../../../../../UnUsedComponent/GlobalComponents/GlobalTableForLSBDetails";
import { EEDesignModalAdd } from "./EEDesignModalAdd";
import { ProjectTy } from "../../../../../../ReduxTool/Slice/Auth/types";

export const ACCBRadioList = [
  { label: "String", value: "String" },
  { label: "Central", value: "Central" },
];
export const EPRadioList = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];
export const RYBList = [
  { labelname: "Yes", name: "Yes" },
  { labelname: "No", name: "No" },
];


type incomingTy={
  name:string,
  type:string,
  rating:string
}
interface PropsType{
  incoming:incomingTy[],
  outgoing:incomingTy[]
}

interface EDDState{
  extensionPanel:string,
  noOfExtentionPanel:string,
  typeBusbar:string,
  needRYBIndicator:string,
  inComingAndOutGoingTerminalDetails: incomingTy[]
}
export interface SelectTy{
  label:string,
  value:string
}

const ElectricalEquipmentDesigning = () => {
  const dispatch = useAppDispatch();
  const { title } = useAppSelector(state=>state.drawer);
  const ACCBArrData = useAppSelector(state=>state.electricalEquipmentDesigningSlice.accbTableDetails)
  const selectedProject = useAppSelector((state) => state.EPCDetails.roofAnalysis.selectedProject as ProjectTy);

  const Busbar = ["Aluminium", "Copper"];
  const [addACCBArrayModal,setAddACCBArrayModal] = useState(false);
  //modal state
  const [ACCBDetails, setACCBDetails] = useState({id:uuidv4(),ACCBName: "",noOfMFMs: "",noOfIncomingTeriminals: "",SPDType:{} as SelectTy ,accuracyClassOfMFMs: {} as SelectTy,noOfOutGoingTeriminals: ""});
  //incoming outgoing state
  const [inAndOutTerminalModal,setInAndOutTerminalModal] = useState<PropsType>({incoming:[],outgoing:[]})
  //form Details state
  const [EEDState,setEEDState] = useState<EDDState>({  extensionPanel:"No",noOfExtentionPanel:"",typeBusbar:"",needRYBIndicator:"No",inComingAndOutGoingTerminalDetails: []})

  const [specificACCBId,setSpcecificACCbId] = useState("")


  const { formDetails } = useAppSelector(
    (state) => state.EPCDetails.roofAnalysis
  );

  // const rowData = [
  //   {name:"-",details:"-",action:false}
  // ]

  
  // const columns = Object.keys(ACCBArrData[0]).slice(1,)
  const columns = ["name","details","actions"]


const inAndOutTerminalColumns = ["name","CB Rating (in A)","Circute Breaker Type "]
  
const CBRating = ["10", "20", "30", "40"];
const CBType = ["MCB", "MCCB", "ACB", "VCB"];

  const handleChange = (e:any) => {
    const { name, value } = e;
    dispatch(setRoofAnalysisDetails({ ...formDetails, [title]: { ...formDetails.plantinfrastructuredesigning, [name]: value } }));
  };

 


  const handleTheToggleAction = (id:any)=>{
    if (id!=="-"){
      dispatch(toggleACCBArrayActionModal(id))
    }
  }


    const handleTheThreeDots = (id: any, action: string) => {
      if (action === "delete") {
          dispatch(deleteTheAccbRow(id))
          dispatch(toggleACCBArrayActionModal(id))
      }
      else if (action === "duplicate") {
          const newId = uuidv4()
          dispatch(duplicateTheAccbRow({ id, newId }))
          dispatch(toggleACCBArrayActionModal(id))
      }
      else if (action === "edit") {
          dispatch(toggleTheEDDModal(id))
         setSpcecificACCbId(id)
         setAddACCBArrayModal(true)
      }
  }
  

 

  const handleACCBModal = ()=>{
     setAddACCBArrayModal(prev=>!prev)
  }

 

  const handleTheSubmitBtn = (event: any) => {
    let isEmpty = false,msg ="";
    if (!isEmpty){
      if (ACCBDetails.ACCBName===""){
        msg = "ACCB Name is Required";
        isEmpty = true
      } else if (ACCBDetails.SPDType.label===""){
         msg= "SPD Type is Required"
        isEmpty = true
      }
      else if (ACCBDetails.noOfMFMs==="" || parseInt(ACCBDetails.noOfMFMs)<1){
        msg = "No. of MFMs is Required"
        isEmpty = true
      }
      else if (ACCBDetails.accuracyClassOfMFMs.value===""){
        msg = "Accuracy Class of MFMs is Required"
        isEmpty = true
      }
      else if (ACCBDetails.noOfIncomingTeriminals==="" || parseInt(ACCBDetails.noOfIncomingTeriminals)<1){
        msg = "No. of Incoming Teriminals is Required"
        isEmpty = true
      }
      else if (ACCBDetails.noOfOutGoingTeriminals==="" || parseInt(ACCBDetails.noOfOutGoingTeriminals)<1){
        msg = "No. of OutGoing Teriminals is Required"
        isEmpty = true
      }
    }

    if (!isEmpty){
      for (let item of inAndOutTerminalModal.incoming){
        if (item.rating===""){
         msg = `Rating ${item.name} is Required`
          isEmpty = true
          break;
        }else if (item.type===""){
        msg = `Type ${item.name} is Required`
          isEmpty = true
          break;
        }
      }

    }

    if (!isEmpty){
      for (let item of inAndOutTerminalModal.outgoing){
        if (item.rating===""){
          msg = `Rating ${item.name} is Required`
          isEmpty = true
          break;
        }else if (item.type===""){
          msg = `Type ${item.name} is Required`
          isEmpty = true
          break;
        }
      }
    }

    if (isEmpty){
      toast.error(msg,{toastId:"accb form"})
    }


    if (!isEmpty){
      dispatch(addACCBDesignDetails({...ACCBDetails}))
      setAddACCBArrayModal(false)
      setACCBDetails({id:uuidv4(),ACCBName: "",noOfMFMs: "",noOfIncomingTeriminals: "",SPDType:  {} as SelectTy,accuracyClassOfMFMs:  {} as SelectTy,noOfOutGoingTeriminals: ""})
      // handleTheAdd?.("")
    }
  
 
  };

  

  const opentheModal = ()=>{
    dispatch(setModalHeaderFooter({title:"ACCB Designing",btnTxt: "Add ACCB",secondaryBtnTxt:"" }))
    setAddACCBArrayModal(prev=>!prev)
  }

  const handleOnChange = (e:any)=>{
     const {name,value} = e;     
    if((name === "noOfExtentionPanel") && parseInt(value)>5){
      e.preventDefault();
      toast.error('Value should be less than 5',{toastId:"noOfExtentionPanel"})
      return;
    }
    setEEDState(prev=>({...prev,[name]:value}))
    
    if (name==="noOfExtentionPanel"){
      let row :any = []
      if (parseInt(value)>0){
        for (let i=0;i<parseInt(value);i++){
          const item = {
            name: `Extention Panel ${i+1}`,
            rating: "",
            type: "",
          } 
          row = [...row,item]
        }          
      }
      setEEDState(prev=>({...prev,inComingAndOutGoingTerminalDetails:[...row]}))
    }
  }

  const handleClick = (e:any) => {
    const {name,value} = e 
    setEEDState(prev=>({...prev,[name]:value}))
  };

  const handleTerminalTableOnClick = (e:any,type:string,i:number)=>{
    const {name,value} = e 
    setEEDState(prev=>{
      const updatedData = { ...prev,inComingAndOutGoingTerminalDetails:[...prev.inComingAndOutGoingTerminalDetails.map((each:any,ind:number)=>ind===i?{...each,[name]:value}:{...each})] }
      return updatedData
    })
  }

  const handleTerminalTableOnChange = (e:any,type:string,i:number)=>{
    const {name,value} = e.target 
  }


  return (
    <>
    {addACCBArrayModal && <FormModal overflow={false} headerTitle="" onSubmit={handleTheSubmitBtn} modalSize="md" btnTitle="" children={<EEDesignModalAdd setInAndOutTerminalState={setInAndOutTerminalModal} InAndOutTerminalState={inAndOutTerminalModal}  modalAccBId={specificACCBId!==""?specificACCBId:null} state={ACCBDetails} setState={setACCBDetails}/>} closeModal={handleACCBModal}  />}
    <div className="body-main space-y-[3vh]">
      {/* <div className="radio-main mb-1">
        <div className="section-label">
          Do you need ACCB panel? <span className="text-red-200">*</span>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="radio-body">
            {ACCBRadioList.map((item) => (
                  <NewRadioButton
                    value={item.name}
                    key={item.name}
                    name={"accblist"}
                    labelname={item.labelname}
                    selectedOption={
                      formDetails.plantinfrastructuredesigning.accblist
                    }
                    onClick={handleChange}
                  />
                ))}
          </div>
        </div>
      </div> */}

      <div className="main-box2">
            <label className="label-box1">Inverter Type</label>
            <div className="input-main2">
              <InputRadio2 disabled={selectedProject.isepccomplete} options={ACCBRadioList} name="accblist" onChange={handleChange} value={formDetails.plantinfrastructuredesigning.accblist} />
            </div>
          </div>


      {formDetails.plantinfrastructuredesigning.accblist === "Yes" ?
      <>
      {/* <AddACCBTable /> */}
      <GlobalTableForLSBDetails onButtonClick={opentheModal} onClick={(id:any) => handleTheToggleAction(id)} handleTheThreeDots={(id:any, action:any) => handleTheThreeDots(id, action)}  rowData={ACCBArrData} columns={columns}  tableName="ACCB Array Details" buttonName='Add ACCB Array'  />

      <div className="radio-main mb-1">
        <div className="section-label">
          Do you need extension panel?<span className="text-red-200">*</span>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="radio-body">
                  <div className="w-full flex items-center gap-5">
                        <InputRadio2 key="extensionpanel" name="extensionPanel" options={EPRadioList} onChange={(e) => { handleOnChange(e) }}  value={EEDState.extensionPanel}  />
                  </div>
            </div>
        </div>
      </div>
      { EEDState.extensionPanel === "Yes" ?<>
      <Input
        id={"noOfExtentionPanel"}
        label={"No of Extension Panel"}
        name={"noOfExtentionPanel"}
        value={EEDState.noOfExtentionPanel}
        type={"number"}
        onChange={handleOnChange}
        isRequired={true}
      />
      <SelectPicker
        isFilter={true}
        onClick={handleClick}
        onChange={handleOnChange}
        value={EEDState.typeBusbar}
        id="typeBusbar"
        name="typeBusbar"
        labelname="Type of Busbar"
        data={Busbar.map((el: any) => ({ label: el, value: el }))}
        isUpload={false}
        star={true}
        icon={<IconInfo />}
        content={contentlist.content2}
      />
      <div className="radio-main mb-1">
        <div className="section-label">
          Do you need RYB Indication in the EP? <span className="text-red-200">*</span>
        </div>
        <div className="w-full flex justify-between items-center">
          <div className="radio-body">
          <div className="w-full flex items-center gap-5">
          <InputRadio2 key="extensionpanel" name="needRYBIndicator" options={EPRadioList} onChange={(e) => { handleOnChange(e) }}  value={EEDState.needRYBIndicator}  />
           </div>
            {/* {RYBList.map((item) => {
              return (
                <>
                  <NewRadioButton
                    value={item.name}
                    key={item.name}
                    name={"RYBIndication"}
                    labelname={item.labelname}
                     selectedOption={
                      formDetails.plantinfrastructuredesigning.RYBIndication
                    } 
                    onClick={handleChange}
                  />
                </>
              );
            })} */}
          </div>
          {/* <IconInfo /> */}
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
            <div className="para-md mb-2">Incoming/Outgoing Terminal Details</div>
            <div className="className='overflow-x-auto'">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="text-left">
                <tr>
                {inAndOutTerminalColumns.map((each,i)=><th key={`each/${i}`} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{each}</th>)}
                </tr>
              </thead>
              <tbody>
                  {EEDState.inComingAndOutGoingTerminalDetails.length>0 ? EEDState.inComingAndOutGoingTerminalDetails.map((el,idx)=>(
                      <tr key={`${el}/${idx}`}>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">EP {idx+1}</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"><SelectPicker isFilter={true}  data={CBRating.map(el=>({label:el,value:el}))} name="rating" onChange={(e:any)=>handleTerminalTableOnChange(e,"inComingAndOutGoingTerminalDetails",idx)} onClick={(e)=>handleTerminalTableOnClick(e,"inComingAndOutGoingTerminalDetails",idx)} value={el.rating}/></td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"><SelectPicker isFilter={true} data={CBType.map(el=>({label:el,value:el}))} name="type" onChange={(e:any)=>handleTerminalTableOnChange(e,"inComingAndOutGoingTerminalDetails",idx)} onClick={(e)=>handleTerminalTableOnClick(e,"inComingAndOutGoingTerminalDetails",idx)} value={el.type}/></td>
                      </tr>
                    )):<tr><td className='text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900' colSpan={3}>No Details Found</td></tr>}
                   
              </tbody>
            </table>
            </div>
        </div>
      {/* <InOutTerminalEPTable /> */}
      </>:<></>}
      </> : <></>}
    </div>
    </>
  );
};
export default memo(ElectricalEquipmentDesigning);
