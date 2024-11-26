import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { IconInfo } from "../../../../../../assests/icons/DrawerIcons";
import NewInput from "../../../../../../Components/New/Input/NewInput";
import SelectPicker from "../../../../../../Components/New/Select/SelectPicker";
import { toggleTheEDDModal } from "../../../../../../ReduxTool/Slice/PartnerDesignSummary/ElectricalEquipmentDesSlice";
import { useAppDispatch, useAppSelector } from "../../../../../../ReduxTool/store/hooks";
import "../style.css";
import { Input } from "../../../../../../Components/AllInput/AllInput";
import { formatReactSelectOptions } from "../../../../../../Utils/commonFunctions";
import ReactSelect from "../../../../../../Components/New/Select/ReactSelect";
import { SelectTy } from "./ElectricalEquipmentDesigning";

interface stateType{
  id:string,
  ACCBName: string,
  noOfMFMs: string,
  noOfIncomingTeriminals: string,
  SPDType: SelectTy,
  accuracyClassOfMFMs: SelectTy,
  noOfOutGoingTeriminals: string,
}

type incomingTy={
  name:string,
  type:string,
  rating:string
}
interface PropsType{
  incoming:incomingTy[],
  outgoing:incomingTy[]
}

interface ACCBModalType{
  handleTheAdd?:(e:any)=>void,
  modalAccBId?:string | null
  state:stateType,
  setState:React.Dispatch<React.SetStateAction<stateType>>
  InAndOutTerminalState:PropsType
  setInAndOutTerminalState:React.Dispatch<React.SetStateAction<PropsType>>
}




export const EEDesignModalAdd:React.FC<ACCBModalType> = ({handleTheAdd,modalAccBId,state,setState,setInAndOutTerminalState,InAndOutTerminalState}) => {
  const dispatch = useAppDispatch();
  const accbDesignList = useAppSelector((state)=>state.electricalEquipmentDesigningSlice.accbTableList)

  useEffect(()=>{
    const accbSpecificDetails = accbDesignList.find((each)=>each.id===modalAccBId)
    if (accbSpecificDetails){
      setState(prev=>({
        id:accbSpecificDetails.id,
        ACCBName: accbSpecificDetails.ACCBName,
        noOfMFMs: accbSpecificDetails.noOfMFMs,
        noOfIncomingTeriminals: accbSpecificDetails.noOfIncomingTeriminals,
        SPDType: {label:accbSpecificDetails.SPDType.label,value:accbSpecificDetails.SPDType.value},
        accuracyClassOfMFMs: {label:accbSpecificDetails.accuracyClassOfMFMs.label,value:accbSpecificDetails.accuracyClassOfMFMs.value},
        noOfOutGoingTeriminals: accbSpecificDetails.noOfOutGoingTeriminals,
      }));
    };
  },[]);
  const incomingTable = (value:any,type:string)=>{
    let details:any=[]  
    if (parseInt(value)>0){
      for (let i=0;i<parseInt(value);i++){
        const item = {
          name: `${type} ${i+1}`,
          rating: "",
          type: "",
        };
        details = [...details,item]
      };       
    };
    setInAndOutTerminalState(prev=>({...prev,[type]:[...details]}));
  };

  const handleTheModalInputEl = (event: any,field?:any) => {
    if (field.name==="SPDType" || field.name==="accuracyClassOfMFMs"){
     setState((prev) => ({ ...prev, [field.name]: event }));
    }  
    else{
     const  {name,value} = event
      if((name === "noOfIncomingTeriminals" || name === "noOfOutGoingTeriminals") && parseInt(value)>5){
        event.preventDefault();
        toast.error('Value should be less than 5 & greater than 0',{toastId:"noOfIncomingTeriminals"})
        return;
      };
      if (name==="noOfIncomingTeriminals" || name==="noOfOutGoingTeriminals"){
        incomingTable(event.target.value,name==="noOfIncomingTeriminals"?"incoming":"outgoing");
      };
      setState((prev) => ({ ...prev, [name]:value }));
    }
  };

  const SpdTypes = [{label:"Class II",value:"Class II"},{label:"Class II",value:"Class II"},{label:"Class I + II",value:"Class I + II"}]


  const accuracyClassOfMFMsTypes = [{label:"0.5",vaue:"0.5"},{label:"0.5s",vaue:"0.5s"},{label:"0.2",vaue:"0.2"},{label:"0.2s",vaue:"0.2s"}];


  const optionsList = 
   [{id:"MCB",name:"MCB"}, {id:"MCCB",name:"MCCB"}, {id:"ACB",name:"ACB"}, {id:"VCB",name:"VCB"}]
  

  // const inAndOutTerminalColumns = Object.keys(inAndOutTerminalDetails[0]);

  const inAndOutTerminalColumns = ["name","Circuit Breaker Rating (in A)","Circuit Breaker Type"]



    const handleSelect = (props:{name:string,value:string})=>{
    const {name,value} = props
    setState(prev=>({...prev,[name]:value}))
    }

    const handleCloseModal = (event:React.MouseEvent<HTMLButtonElement>)=>{
      dispatch(toggleTheEDDModal(false))
      handleTheAdd?.("")
    }

    const handleTheOnChange=(e:any,type:string,i:number)=>{
      const {name,value} = e.target;
      setInAndOutTerminalState((prev:any)=>{
        const updatedData ={ ...prev,[type as keyof object]:prev[type as keyof object].map((each:any,idx:number)=>( idx === i ? {...each,[name]:value} : {...each})) }    
        return updatedData
      })
    }


    const handleOnClick=(e:any,type:string,i:number)=>{
      const {name,value} =e
      setInAndOutTerminalState((prev:any)=>{
        const updatedData ={ ...prev,[type as keyof object]:prev[type as keyof object].map((each:any,idx:number)=>( idx === i ? {...each,[name]:value} : {...each})) }    
        return updatedData
      })
    
    }

const dd = ["10","20","30","40"]
  return (
    <>
        <div className="h2"></div>
        <div className="EEDModal-container">
              <Input id="ACCBName" label="ACCB Name" name="ACCBName" value={state.ACCBName} type="text" onChange={handleTheModalInputEl} isRequired={true} />
              <ReactSelect onChange={handleTheModalInputEl} options={formatReactSelectOptions(SpdTypes, { labelKey: "label", valueKey: "value" }, false)} value={state.SPDType} closeMenuOnSelect={true} key='SPDType' labelname='SPD Type' name='SPDType' placeholder="Select Spd Types" />

              {/* <SelectPicker name="SPDType" value={state.SPDType} id="SPDType" labelname="SPD Type" data={SpdTypes.map(el=>({label:el.label,value:el.value}))} isUpload={false} onChange={handleTheModalInputEl} star={true} icon={<IconInfo />} onClick={(e:any)=>{handleSelect(e)}} isFilter={true}/> */}
   
              <Input id="noOfMFMs" label="No Of MFMs" name="noOfMFMs" value={state.noOfMFMs} type="number" onChange={handleTheModalInputEl} isRequired={true} />
              <ReactSelect onChange={handleTheModalInputEl} options={formatReactSelectOptions(accuracyClassOfMFMsTypes, { labelKey: "label", valueKey: "value" }, false)} value={state.accuracyClassOfMFMs} closeMenuOnSelect={true} key='accuracyClassOfMFMs' labelname='Accuracy Class Of MFMs' name='accuracyClassOfMFMs' placeholder="Select MFMs" />

              {/* <SelectPicker name="accuracyClassOfMFMs" value={state.accuracyClassOfMFMs} id="accuracyClassOfMFMs" labelname="Accuracy Class Of MFMs" data={accuracyClassOfMFMsTypes.map(el=>({label:el.name,value:el.id}))} isUpload={false} onChange={handleTheModalInputEl} star={true} icon={<IconInfo />} onClick={(e:any)=>{handleSelect(e)}} isFilter={true}/> */}

              <Input id="noOfIncomingTeriminals" label="No Of Incoming Teriminals" name="noOfIncomingTeriminals" value={state.noOfIncomingTeriminals} type="number" onChange={handleTheModalInputEl} isRequired={true} />
              <Input id="noOfOutGoingTeriminals" label="No Of Outgoing Teriminals" name="noOfOutGoingTeriminals" value={state.noOfOutGoingTeriminals} type="number" onChange={handleTheModalInputEl} isRequired={true}/>
        </div>
        <div className="h2"></div>
        {/* <GlobalTableForLSBDetails onChange={(e:any,row,column)=>handleInAndOutTerminal(e,row,column)} rowData={inAndOutTerminalModal} columns={inAndOutTerminalColumns} tableName="Incoming/Outgoing Terminal Details" optionList={optionsList}/>    */}
        <div className='rounded-lg border border-gray-200 bg-gray-100 p-4'>
            <div className="para-md mb-2">Incoming/Outgoing Terminal Details</div>
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
              <thead className="text-left">
                <tr>
                {inAndOutTerminalColumns.map((each,i)=><th key={`each/${i}`} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 text-center">{each}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {InAndOutTerminalState.incoming.length>0 || InAndOutTerminalState.outgoing.length>0 ?
                  <>{InAndOutTerminalState.incoming.length>0 && InAndOutTerminalState.incoming.map((el,idx)=>(
                      <tr key={`${el}/${idx}`}>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Incoming {idx+1}</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"><SelectPicker isFilter={true}  data={dd.map(el=>({label:el,value:el}))} name="rating" onChange={(e:any)=>handleTheOnChange(e,"incoming",idx)} onClick={(e)=>handleOnClick(e,"incoming",idx)} value={el.rating}/></td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"><SelectPicker isFilter={true} data={optionsList.map(el=>({label:el.name,value:el.id}))} name="type" onChange={(e:any)=>handleTheOnChange(e,"incoming",idx)} onClick={(e)=>handleOnClick(e,"incoming",idx)} value={el.type}/></td>
                      </tr>
                    ))}
                    {InAndOutTerminalState.outgoing.length>0 && InAndOutTerminalState.outgoing.map((el,idx)=>(
                      <tr key={`${el}/${idx}`}>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">OutGoing {idx+1}</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"><SelectPicker isFilter={true} data={dd.map(el=>({label:el,value:el}))} value={el.rating} name="rating" onChange={(e:any)=>handleTheOnChange(e,"outgoing",idx)} onClick={(e)=>handleOnClick(e,"outgoing",idx)} /></td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"><SelectPicker  isFilter={true} data={optionsList.map(el=>({label:el.name,value:el.id}))} value={el.type} name="type" onChange={(e:any)=>handleTheOnChange(e,"outgoing",idx)} onClick={(e)=>handleOnClick(e,"outgoing",idx)} /></td>
                      </tr>
                    ))}</>:<tr><td className='text-center whitespace-nowrap px-4 py-2 font-medium text-gray-900' colSpan={3}>No Details Found</td></tr>}
              </tbody>
            </table>
            </div>
        </div>
    </>
  );
};
