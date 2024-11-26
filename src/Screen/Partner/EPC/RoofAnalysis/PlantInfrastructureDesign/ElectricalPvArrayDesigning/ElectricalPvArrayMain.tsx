import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IconThreeDots } from '../../../../../../assests/icons/Icons'
import { NewModal } from '../../../../../../Components/New/Modal/NewModal'
import { setModalHeaderFooter } from '../../../../../../ReduxTool/Slice/CommonReducers/CommonReducers'
import { plantinfrastructuredesigningNew, pvArrayDesignType, setPlantInfraStructureAddPvArray, setRoofAnalysisDetails } from '../../../../../../ReduxTool/Slice/Partner/EPC'
import { useAppDispatch, useAppSelector } from '../../../../../../ReduxTool/store/hooks'
import GlobalTableForLSBDetails from '../../../../../../UnUsedComponent/GlobalComponents/GlobalTableForLSBDetails'
import ElectricalAddPvArrayModal from './ElectricalAddPvArrayModal'
import { ProjectTy } from '../../../../../../ReduxTool/Slice/Auth/types'
const optionList = { "action": [{ name: "Edit", id: "edit" }, { name: "Duplicate", id: "Duplicate" }, { name: "Delete", id: "Delete" }] }

const ElectricalPvArrayMain = () => {
    const [isPvArrayModal, setIsPvArrayModal] = useState<boolean>(false)
    const { formDetails, formDetails: { plantinfrastructuredesigningNew: { pvArrayDesign }},selectedProject } = useAppSelector((state) => state.EPCDetails.roofAnalysis);
    const dispatch = useAppDispatch()
    const [specificModalId, setSpecificModalId] = useState<number>(0);
    const [pvArrayModalDetails, setPvArrayModalDetails] = useState<pvArrayDesignType>();
    const {is3DMap} = useAppSelector(state=>state.mapref)
    const globelSummeryArrya = [{ name: "Total DC Power", Details: "-" }, { name: "Total AC Power", Details: "-" }, { name: "No. of modules", Details: "-" }, { name: "No. of Inverters", Details: "-" }, { name: "DC:AC Ratio", Details: "-" }]
    const globelSummeryArryaColumns = Object.keys(globelSummeryArrya[0]);
    const selectedprojectDetails = selectedProject as ProjectTy;
    useEffect(() => {
        // console.log(selectedprojectDetails);
        const bindDataArray = async()=>{
            let details:pvArrayDesignType = {
                pvArrayName: selectedprojectDetails?.pvarrayname??"",
                invertorManufacture: ""/*selectedprojectDetails?.pvinverter??"",*/,
                noOfMPPTs: selectedprojectDetails?.mppt??"",
                noOfString: selectedprojectDetails?.numberofstrings??"",
                roofOrientation: selectedprojectDetails?.rooforientation??"",
                invertorCapacity:"",
                invertorType: selectedprojectDetails?.invertertype === 0? "On Grid" : selectedprojectDetails?.invertertype == 1 ?  "Off Grid" : "Both",
                noOfModulesInSeries: selectedprojectDetails?.moduleinseries??"",
                action:false,
                moduleName:selectedprojectDetails.pvmodule?.manufacturer??""
            }
            setPvArrayModalDetails(details);
            await dispatch(setPlantInfraStructureAddPvArray([details]));
        };
        if(selectedprojectDetails?.pvarrayname){
            bindDataArray();
        }
    },[]);
    const handleClickBtn = (name: any, value: any, pvInx: number) => {
        let details: pvArrayDesignType[] = [];
        switch (name) {
            case "action":
                details = pvArrayDesign.map((el:any,ind:number)=>{
                    if(ind === pvInx){
                        return {...el,[name]:value}
                    }else{
                        return {...el,action:false}
                    }
                });
                break;
            case "edit":
                setSpecificModalId(pvInx);
                setPvArrayModalDetails(pvArrayDesign[pvInx]);
                setIsPvArrayModal(prev => !prev);
                break;
            case "add":
                setSpecificModalId(pvArrayDesign.length);
                setPvArrayModalDetails(plantinfrastructuredesigningNew.pvArrayDesign[0]);
                setIsPvArrayModal(prev => !prev);
                dispatch(setModalHeaderFooter({ btnTxt: "Add PV Array", title: "PV Array Designing", secondaryBtnTxt: "", modalData: "" }));
                break;
            case "delete":
                details = pvArrayDesign.filter((el, ind) => ind !== pvInx);
                break;
            case "duplicate":
                details = [...pvArrayDesign, pvArrayDesign[pvInx]].map(el=>({...el,action:false}));
                break;
        }
        name !== "add" && dispatch(setPlantInfraStructureAddPvArray(details))
    };
    const isAddPvArrayFormValid = () => {
      let isFormValid = true, msg = "";
      if(!pvArrayModalDetails?.pvArrayName){
        isFormValid = false;
        msg = "PV Array Name is Required";
      }else if(!pvArrayModalDetails?.roofOrientation){
        isFormValid = false;
        msg = "Roof Orientation is Required";
      }else if(!formDetails.projectsetup?.modulemanufacturer){
        isFormValid = false;
        msg = "module manufacturer from project setup is Required";
      }else if(!pvArrayModalDetails?.invertorType){
        isFormValid = false;
        msg = "Inveter Type is Required";
    }else if(!pvArrayModalDetails?.invertorManufacture){
        isFormValid = false;
        msg = "Inveter Manufacture is Required";
    }else if(!pvArrayModalDetails?.invertorCapacity){
        isFormValid = false;
        msg = "Inveter Capacity is Required";
      }else if(!pvArrayModalDetails?.noOfMPPTs){
          isFormValid = false;
          msg = "No. of MPPTs is Required";
      }else if(!pvArrayModalDetails?.noOfModulesInSeries){
          isFormValid = false;
          msg = "No. of modules in series is Required";
      }else if(!pvArrayModalDetails?.noOfString){
          isFormValid = false;
          msg = "No. of string is Required";
      }
      !isFormValid && toast.error(msg); 
      return isFormValid
    };
    const handleClick = () => {
        if(!isAddPvArrayFormValid()) return;
        let details:pvArrayDesignType[] = [];
        if(specificModalId == pvArrayDesign.length){
            details = [...pvArrayDesign, pvArrayModalDetails!];
        }else{
            details[specificModalId!] = pvArrayModalDetails!
        };
        dispatch(setPlantInfraStructureAddPvArray(details));
        setIsPvArrayModal(prev => !prev);
    }
    const renderTheActions = (id: any) => {
        return <><ul className="border-[#FAF3E6] border-[0.4vh] grid gap-y-2 p-1 absolute top-[30px] w-full z-1 bg-white" style={{ zIndex: 1 }}>
            <li><button type="button" onClick={() => handleClickBtn("edit", "", id)}>Edit</button></li>
            <li><button type="button" onClick={() => handleClickBtn("duplicate", "", id)}>Duplicate</button></li>
            <li><button type="button" onClick={() => handleClickBtn("delete", "", id)}>Delete</button></li>
        </ul></>
    }
    
    return (
        <>
            {isPvArrayModal && <NewModal btnName='AddPvArray' onClick={handleClick} children={<ElectricalAddPvArrayModal pvArrayModalDetails={pvArrayModalDetails!} setPvArrayModalDetails={setPvArrayModalDetails} pvInx={specificModalId} />} name='AddPvArray' setIsCLose={setIsPvArrayModal} isAbleCLick={true} modalSize='lgx' />}
            <div className='table-main'>
                <div className="table-name">PV Array Details</div>
                <table className="table">
                    <thead className="thead">
                        <tr>
                            <th className='hvalue'>Name</th>
                            <th className='hvalue'>Details</th>
                            <th className='hvalue'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(pvArrayDesign && pvArrayDesign.length > 0) ? pvArrayDesign.map((el, ind: number) => (
                            <tr className="" key={ind}>
                                <td className="rvalue">{el?.pvArrayName}</td>
                                <td className="rvalue">{el?.roofOrientation}</td>
                                <td className="rvalue relative" style={{ "whiteSpace": "nowrap", textAlign: 'center', padding: 'inherit' }}>
                                    <button type="button" className='flex justify-center w-full' onClick={() => handleClickBtn("action", !el?.action!, ind)}><IconThreeDots /></button>
                                    {el?.action && renderTheActions(ind)}
                                </td>
                            </tr>
                        )) : <tr><td className="rvalue text-center" colSpan={3}>No Details Found</td></tr>}
                    </tbody>
                </table>
            </div>
            <div className="mt-1 w-full h-fit flex justify-end items-center">
                <button disabled={selectedprojectDetails.isepccomplete || is3DMap} type="button" onClick={()=>handleClickBtn("add","",0)} className="light-sm-btn">PV Array Details</button>
            </div>
            <div className='h1'></div>
            <GlobalTableForLSBDetails tableName="Global Summary" rowData={globelSummeryArrya} columns={globelSummeryArryaColumns} />
        </>
    )
}



export default ElectricalPvArrayMain
