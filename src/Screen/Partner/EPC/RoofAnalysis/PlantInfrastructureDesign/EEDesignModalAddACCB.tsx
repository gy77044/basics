import React, { useState } from 'react'
import { useAppDispatch } from '../../../../../ReduxTool/store/hooks'
import { toggleTheEDDModal } from '../../../../../ReduxTool/Slice/PartnerDesignSummary/ElectricalEquipmentDesSlice'
import { IconClose } from '../../../../../assests/icons/ModalIcons'
import NewInput from '../../../../../Components/New/Input/NewInput'
import { IconInfo } from '../../../../../assests/icons/DrawerIcons'
import SelectPicker from '../../../../../Components/New/Select/SelectPicker'
import GlobalTableForLSBDetails from '../../../../../UnUsedComponent/GlobalComponents/GlobalTableForLSBDetails'

const EEDesignModalAddACCB = ()=>{

    const [ACCBDetails,setACCBDetails] = useState({
        ACCBName:"",noOfMFMs:"0",noOfIncomingTeriminals:"0",SPDType:"",accuracyClassOfMFMs:"",noOfOutGoingTeriminals:"0"
    })
    const dispatch = useAppDispatch()

    const handleTheModalInputEl =(event:React.ChangeEvent<HTMLInputElement>)=>{
            const {name,value} = event.target
            //console.log(event.target.value)
            setACCBDetails(prev=>({...prev,[name]:event.target.value}))
    }

    const SpdTypes = [{label:"Class i",value:"Class i"},{label:"Class ii",value:"Class ii"},{label:"Class i + ii",value:"Class i + ii"}]

    const accuracyClassOfMFMsTypes = [{label:"0.5",value:"0.5"},{label:"0.5s",value:"0.5s"},{label:"0.2",value:"0.2"},{label:"0.2s",value:"0.2s"}]

    const inAndOutTerminalDetails = [
        {name:"incomer 1","Circuit Breaker Rating (in A)":"20","Circuit Breaker Type":["MCB","MCCB","ACB","VCB"]},
        {name:"incomer 2","Circuit Breaker Rating (in A)":"20","Circuit Breaker Type":["MCB","MCCB","ACB","VCB"]},
        {name:"outGoing 1","Circuit Breaker Rating (in A)":"10","Circuit Breaker Type":["MCB","MCCB","ACB","VCB"]},
        {name:"outGoing 2","Circuit Breaker Rating (in A)":"10","Circuit Breaker Type":["MCB","MCCB","ACB","VCB"]},
    ]

    
    const inAndOutTerminalColumns = Object.keys(inAndOutTerminalDetails[0])

    const handleTheSubmitBtn = (event:React.MouseEvent<HTMLButtonElement>)=>{
        dispatch(toggleTheEDDModal(false))
    }

    const handleSelect= ()=>{}

    const onClickSelectEl = (props:({value:string,name:string}))=>{
        const {value,name} = props
        setACCBDetails(prev=>({...prev,[name]:value}))
    }


    return (
        <div className="modal-backdrop">
            <div className="bg-white w-[40vw] h-fit p-2 rounded-sm">
                <div className="modal-header">
                    <div className="modal-heading">ACCB Designing</div>
                    <button type="button" onClick={()=>dispatch(toggleTheEDDModal(false))}>
                        <IconClose/>
                    </button>
                </div>
                <div className="h2"></div>
                <div className="w-full flex justify-between items-center pt-2">
                    <div className="w-[50%]">
                        <div className="w-[95%] h-[8.1vh]">
                            <NewInput id="ACCBName" labelname='ACCB Name' name="ACCBName"  value={ACCBDetails.ACCBName} type="text" onChange={handleTheModalInputEl} star={true} icon={<IconInfo/>}/>
                        </div>
                        <div className="w-[95%] h-[8.1vh]">
                            <NewInput id="noOfMFMs" labelname="No Of MFMs" name="noOfMFMs"  value={ACCBDetails.noOfMFMs} type="number" onChange={handleTheModalInputEl} star={true} icon={<IconInfo/>}/>
                        </div>
                        <div className="w-[95%] h-[8.1vh]">
                            <NewInput id="noOfIncomingTeriminals" labelname='No Of Incoming Teriminals' name="noOfIncomingTeriminals"  value={ACCBDetails.noOfIncomingTeriminals} type="number" onChange={handleTheModalInputEl} star={true} icon={<IconInfo/>}/>
                        </div>
                    </div>
                    <div className="w-[50%]">
                    <div className="w-[95%] h-[8.1vh]">
                        {/*  <SelectPicker name="typeOfBusBar" onClick={handleOnClick}  value={EEDDesignDetails.typeOfBusBar} id='typeOfBusBar' labelname='Types Of Busbar' data={typesOfBusbar.map(el=>({label:el.name,value:el.id}))} isUpload={false} onChange={handleSelectEl} icon={<IconInfo />}/> */}
                            <SelectPicker onClick={onClickSelectEl} name="SPDType" value={ACCBDetails.SPDType} id='SPDType' labelname='SPD Type' data={SpdTypes.map((el)=>({label:el.label,value:el.value}))} isUpload={false} onChange={handleSelect} star={true} icon={<IconInfo/>}/>
                        </div>
                        <div className="w-[95%] h-[8.1vh]">
                       
                        <SelectPicker  onClick={onClickSelectEl} name="accuracyClassOfMFMs" value={ACCBDetails.accuracyClassOfMFMs} id='accuracyClassOfMFMs' labelname='Accuracy Class Of MFMs' data={accuracyClassOfMFMsTypes.map((el)=>({label:el.label,value:el.value}))} isUpload={false} onChange={handleSelect} star={true} icon={<IconInfo/>}/>
                        </div>
                        <div className="w-[95%] h-[8.1vh]">
                            <NewInput id="noOfOutGoingTeriminals" labelname='No Of Outgoing Teriminals' name="noOfOutGoingTeriminals"  value={ACCBDetails.noOfOutGoingTeriminals} type="number" onChange={handleTheModalInputEl} star={true} icon={<IconInfo/>}/>
                        </div>
                    </div>
                </div>
                <div className='h2'></div>
                <GlobalTableForLSBDetails onButtonClick={handleSelect} rowData={inAndOutTerminalDetails}  columns={inAndOutTerminalColumns} tableName='Incoming/Outgoing Terminal Details'/>
                <div className="w-full flex justify-center items-center mt-2">
                    <button type="button" className="dark-md-btn" onClick={handleTheSubmitBtn}>Add ACCB</button>
                </div>
            </div>
        </div>
    )
}


export default EEDesignModalAddACCB