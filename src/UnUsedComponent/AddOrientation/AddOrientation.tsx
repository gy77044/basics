import { ChangeEvent, memo, useEffect, useState } from "react";
import {useAppDispatch,useAppSelector} from "../../ReduxTool/store/hooks";
import NewInput from "../../Components/New/Input/NewInput";
import { IconInfo } from "../../assests/icons/DrawerIcons";
import { setModalHeaderFooter } from "../../ReduxTool/Slice/CommonReducers/CommonReducers";
import { NewModal } from "../../Components/New/Modal/NewModal";
import RoofOrientationModel from "./RoofOrientationModel";
import { toast } from "react-toastify";
import { addOrientationType, setPlantInfraStructureAddOrientation, setRoofAnalysisDetails } from "../../ReduxTool/Slice/Partner/EPC";
import { ProjectTy } from "../../ReduxTool/Slice/Auth/types";

const AddOrientation = () => {
  const dispatch = useAppDispatch();
  const [isModalOrientationOpen,setIsModalOrientationOpen] = useState(false);
  const [addOrientation,setAddOrientation] = useState<addOrientationType>({} as addOrientationType);
  const [isEdit,setIsEdit] = useState<boolean>(true);
  const {formDetails,formDetails:{plantinfrastructuredesigningNew},selectedProject} = useAppSelector(state=>state.EPCDetails.roofAnalysis);
  const selectedprojectDetails = selectedProject as ProjectTy;

  useEffect(() => {
    if(selectedprojectDetails?.rooforientation){
      let orientation = {
        orientation:selectedprojectDetails?.rooforientation??"",
        projectType:selectedprojectDetails.projecttype??"",
        tiltAngle:selectedprojectDetails?.rooftiltangle??"",
        azimuthAngle:selectedprojectDetails?.roofazimuthangle??""
      }
      setAddOrientation(orientation);
      dispatch(setPlantInfraStructureAddOrientation([orientation]));
    }
  },[]);
  const handleAddOrientation = () =>{
    // setAddOrientation(plantinfrastructuredesigningNew.addOrientation[0])
    setIsModalOrientationOpen(prev=>!prev);
    dispatch(setModalHeaderFooter({btnTxt:"Save Orientation",title:"Add Orientation",secondaryBtnTxt:"Edit Orientation",modalData:"" }));
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => { };
  const isOrientaionValid = () =>{
    let isValid = true, msg = "";
    if(!addOrientation?.tiltAngle){
        isValid = false;
        msg = "Tilt Angle is Required";
    }else if(!addOrientation?.azimuthAngle){
        isValid = false;
        msg = "Azimuth Angle is Required";
    }else if(!addOrientation.projectType){
        isValid = false;
        msg = "Roof Type is Required";
    };
    if(!isValid) toast.error(msg,{toastId:"OrientationValidation"}); 
    return isValid
  }
  const ModalOrientationOpen = async(actionType:string) =>{
    try{
        if(actionType === "Edit Orientation"){
            setIsEdit(prev=>!prev);
        }else if(actionType === "Add Orientation"){
              if(isOrientaionValid()){
                setIsModalOrientationOpen(prev=>!prev);
                dispatch(setPlantInfraStructureAddOrientation([addOrientation]));
            }
          };
    }catch(err:any){
        toast.error(err.message);
    }
  };
  return (
    <></>
    // <div className="body-main space-y-[2vh]">
    //   <div className="h1"></div>
    //   {/* {plantinfrastructuredesigningNew.addOrientation.length>0 && <NewInput disabled={true} id={"orientation"} labelname={"No. of Orientation"} name={"orientation"} value={plantinfrastructuredesigningNew.addOrientation.length} type={"number"} onChange={handleChange} star={true} icon={<IconInfo />}/>} */}
    //   {isModalOrientationOpen && <NewModal btnName="add" isAbleCLick={true} onClick={(actionType)=>ModalOrientationOpen(actionType)} children={<RoofOrientationModel isEdit={isEdit} addOrientation={addOrientation!} setAddOrientation={setAddOrientation}/>} modalSize="md" name="Add Orientation" setIsCLose={setIsModalOrientationOpen} />}
    //     <div className="table-main">
    //         <div className="table-name">Orientation Details</div>
    //         <table className="table">
    //             <thead className='thead'>
    //                 <tr>
    //                     <th className="hvalue">Orientation</th>
    //                     <th className="hvalue">Roof Type</th>
    //                     <th className="hvalue">Tilt Angle (in °)</th>
    //                     {/* <th className="hvalue">Azimuth Angle</th> */}
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {plantinfrastructuredesigningNew.addOrientation.length>0 ? plantinfrastructuredesigningNew.addOrientation.map((item: any, index: number) => (
    //                  <tr className='trow' key={index}>
    //                     <td className="rheading">{`Orientation ${index+1}`}</td>
    //                     <td className="rvalue ">{item?.projectType??"-"}</td>
    //                     <td className="rvalue ">{item?.tiltAngle??"-"}</td>
    //                 </tr>
    //                 )):<tr><td className="rvalue text-center" colSpan={3}>No Orientation Found</td></tr>}
    //             </tbody>
    //         </table>
    //         <div className="table-footer">
    //             <button disabled={selectedprojectDetails.isepccomplete || is3DMap} className="light-sm-btn" onClick={handleAddOrientation}>
    //                 {`${plantinfrastructuredesigningNew.addOrientation.length == 0 ? 'Add':'Update'} Obstruction`}
    //             </button>
    //         </div>
    //     </div>
    // </div>
  );
};
export default memo(AddOrientation);
