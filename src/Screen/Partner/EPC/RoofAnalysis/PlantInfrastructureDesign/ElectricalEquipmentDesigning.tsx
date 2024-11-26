import React, { useState } from 'react'
import { SingleValue } from 'react-select'
import { v4 as uuidv4 } from "uuid"
import NewInput from '../../../../../Components/New/Input/NewInput'
import NewRadioButton from '../../../../../Components/New/RadioButton/NewRadioButton'
import SelectPicker from '../../../../../Components/New/Select/SelectPicker'
import { ToggleTheActionModal, deleteTheAccbRow, duplicateTheAccbRow, toggleTheEDDModal } from '../../../../../ReduxTool/Slice/PartnerDesignSummary/ElectricalEquipmentDesSlice'
import { useAppDispatch, useAppSelector } from '../../../../../ReduxTool/store/hooks'
import { ConfirmRadioList } from '../../../../../UnUsedComponent/ObstructionAnalysisEquipmentSelection'
import { IconInfo } from '../../../../../assests/icons/DrawerIcons'
import GlobalTableForLSBDetails, { RowData } from '../../../../../UnUsedComponent/GlobalComponents/GlobalTableForLSBDetails'
import { EEDesignModalAdd } from './ElectricalEquipmentDesigning/EEDesignModalAdd'
import { setRoofAnalysisDetails } from '../../../../../ReduxTool/Slice/Partner/EPC'


const ElectricalEquipmentDesigning = () => {
    const toggleEDDModal = useAppSelector((state) => state.electricalEquipmentDesigningSlice.toggleEDDModal)
    const accbTableDetails = useAppSelector((state) => state.electricalEquipmentDesigningSlice.accbTableDetails)
    const {formDetails} = useAppSelector(state=>state.EPCDetails.roofAnalysis);
    const {title} = useAppSelector(state=>state.drawer);
    const [accbUserId, setModalACCBId] = useState("")



    // const accbTable:RowData [] = [
    //     {name:"ACCB1",details:"Incomer 2 | Outgoing 2",actions:["Edit","Duplicate","Delete"]},
    //     {name:"ACCB2",details:"Incomer 2 | Outgoing 2",actions:["Edit","Duplicate","Delete"]}
    // ]

    const terminalDetails = [
        { "name": "Extension Panel 2", "CB Rating (in A)": "select", "Circuit Breaker Type": "select" },
        { "name": "Extension Panel 1", "CB Rating (in A)": "select", "Circuit Breaker Type": "select" }
    ]

    interface optionType {
        name: string,
        id: string
    }

    interface OptionsListType {
        "CB Rating (in A)": optionType[],
        "Circuit Breaker Type": optionType[],
    }

    const optionsList = {
        "CB Rating (in A)": [{ name: "20", id: "20" }, { name: "30", id: "30" }, { name: "40", id: "40" }],
        "Circuit Breaker Type": [
            { name: "MCB", id: "MCB" }, { name: "MCCB", id: "MCCB" }, { name: "ACB", id: "ACB" }, { name: "VCB", id: "VCB" }
        ],
        "actions": [
            { name: "Edit", id: "edit" }, { name: "Duplicate", id: "Duplicate" }, { name: "Delete", id: "Delete" }
        ],
    }


    const typesOfBusbar = [
        { id: "alumninium", name: "Aluminium" },
        { id: "Copper", name: "Copper" },
    ]





    // console.log("action",accbTableDetails[0])

    const handleAccbTableDetails = (option: SingleValue<PropsType>, row: RowData, column: string) => {
        /*   setACCBDetails(prev=>{
               const newUpdatedDetails = prev.map((each)=>{
                   if (each.name===row.name){
                       return {...each,[column]:option?.label}
                   }
                   return each
               })
               return newUpdatedDetails
           })*/
    }

    const [inAndOutTerminalDetails, setInAndOutTerminalDetails] = useState([{ "name": "Extension Panel 2", "CB Rating (in A)": "select", "Circuit Breaker Type": "select" },
    { "name": "Extension Panel 1", "CB Rating (in A)": "select", "Circuit Breaker Type": "select" }])

    interface PropsType {
        label: string,
        value: string,

    }

    const handleInAndOutTerminal = (option: SingleValue<PropsType>, row: RowData, column: string) => {
        // console.log(column)

        setInAndOutTerminalDetails((prev) => {
            const newData = prev.map((each) => {
                //     console.log(each)
                if (each.name === row.name) {
                    return { ...each, [column]: option?.value }
                }
                return each
            })
            return newData

        })
    }


    const handleTheActions = (id: any) => {

        dispatch(ToggleTheActionModal(id))
    }

    const dispatch = useAppDispatch()

    const handleTheEEDInputEl = (event: any) => {
        const { name, value } = event.target
       
        // setEDDDesignDetails(prev => ({ ...prev, [name]: value }))
        dispatch(setRoofAnalysisDetails({...formDetails,[title]:{...formDetails.plantinfrastructuredesigning,[name]:value}}));
    };

    const handleSelectEl = (event: any) => { 
        // console.log(event.target.value)
    }

    const handleModal = () => {
        dispatch(toggleTheEDDModal(true))
    }

    const handleOnClick = (props: { name: string, value: string }) => {
        const { name, value } = props
        // setEDDDesignDetails(prev => ({ ...prev, [name]: value }))
        dispatch(setRoofAnalysisDetails({...formDetails,[title]:{...formDetails.plantinfrastructuredesigning,[name]:value}}));
    }

    const handleTheThreeDots = (id: any, action: string) => {
        if (action === "delete") {
            dispatch(deleteTheAccbRow(id))
            dispatch(ToggleTheActionModal(id))
        }
        else if (action === "duplicate") {
            const newId = uuidv4()
            dispatch(duplicateTheAccbRow({ newId, id }))
            dispatch(ToggleTheActionModal(id))
        }
        else if (action === "edit") {
            dispatch(ToggleTheActionModal(id))
            setModalACCBId(id)
            dispatch(toggleTheEDDModal(true))
        }
    }

    const columns = Object.keys(accbTableDetails[0]).slice(1)
    const terminalColumns = Object.keys(inAndOutTerminalDetails[0])

    /** ACCBName: "",
    noOfMFMs: "0",
    noOfIncomingTeriminals: "0",
    SPDType: "",
    accuracyClassOfMFMs: "",
    noOfOutGoingTeriminals: "0", */

    const handleAddAccbDetails = (e: string) => {
        setModalACCBId("")
    }

    return (
        <>
            {/* {toggleEDDModal && <EEDesignModalAdd modalAccBId={accbUserId} handleTheAdd={(e: any) => handleAddAccbDetails(e)} />} */}
            <div>
                <div>
                    <GlobalTableForLSBDetails handleTheThreeDots={(id, action) => handleTheThreeDots(id, action)} onClick={(id) => handleTheActions(id)} onButtonClick={handleModal} onChange={(e: any, row, column) => handleAccbTableDetails(e, row, column)} buttonName='Add ACCB' tableName="ACCB Details" columns={columns} rowData={accbTableDetails} optionList={optionsList} />

                </div>
                <div className="h1"></div>
                <div className="radio-main mb-1">
                    <div className="section-label">
                        Do you need extension panel? <span className="text-red-200">*</span>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <div className="radio-body">
                            {ConfirmRadioList.map((item) => {
                                return (
                                    <>
                                        <NewRadioButton value={item.name} key={item.name} name={"panelStatus"} labelname={item.labelname} selectedOption={formDetails.plantinfrastructuredesigning.panelStatus} onClick={handleTheEEDInputEl} />
                                    </>
                                );
                            })}
                        </div>
                        {/* <IconInfo /> */}
                    </div>
                </div>
                <div className="h3"></div>
                <NewInput id="noOfExtensionPanel" labelname='No Of Extension Panel' name="noOfExtensionPanel" value={formDetails.plantinfrastructuredesigning.noOfExtensionPanel} type="number" onChange={handleTheEEDInputEl} star={true} icon={<IconInfo />} />
                <div className="h3"></div>
                <SelectPicker name="typeOfBusBar" onClick={handleOnClick} value={formDetails.plantinfrastructuredesigning.typeOfBusBar} id='typeOfBusBar' labelname='Types Of Busbar' data={typesOfBusbar.map(el => ({ label: el.name, value: el.id }))} isUpload={false} onChange={handleSelectEl} icon={<IconInfo />} />
                <div className="h3"></div>
                <div className="radio-main mb-1">
                    <div className="section-label">
                        Do you need RYB Indication in the EP? <span className="text-red-200">*</span>
                        {/* <span className="text-red-100 font-normal">*</span> */}
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <div className="radio-body">
                            {ConfirmRadioList.map((item) => {
                                return (
                                    <>
                                        <NewRadioButton value={item.name}  key={item.labelname} name={"RYBIndication"} labelname={item.labelname} selectedOption={formDetails.plantinfrastructuredesigning.RYBIndication} onClick={handleTheEEDInputEl} />
                                    </>
                                );
                            })}
                        </div>
                        {/* <IconInfo /> */}
                    </div>
                </div>
                <div className="h3"></div>
                <div>
                    <GlobalTableForLSBDetails tableName="Incoming/Outgoing Terminal Details" columns={terminalColumns} optionList={optionsList} rowData={inAndOutTerminalDetails} onChange={(e, row, column) => handleInAndOutTerminal(e, row, column)} />
                </div>

            </div>
        </>
    )
}

export default ElectricalEquipmentDesigning