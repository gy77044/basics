import { ChangeEvent, memo, useEffect, useState } from "react";
import NewAccordion from "../../../../../Components/New/Accordion/NewAccordion";
import NewInput from "../../../../../Components/New/Input/NewInput";
import NewSelect from "../../../../../Components/New/Select/NewSelect";
import { setRoofAnalysisDetails } from "../../../../../ReduxTool/Slice/Partner/EPC";
import { toggleTheNoOfOrientationModal } from "../../../../../ReduxTool/Slice/WeatherAnalysis/WeatherAnalysisReducer";
import { useAppDispatch, useAppSelector } from "../../../../../ReduxTool/store/hooks";
import { IconInfo } from "../../../../../assests/icons/DrawerIcons";
import ObstructionAreaTable from "./ObstructionAreaTable";
import RoofOrientationModel from "../../../../../UnUsedComponent/AddOrientation/RoofOrientationModel";
import { setAccord } from "../../../../../ReduxTool/Slice/Drawer/DrawerReducer";
import SelectPicker from "../../../../../Components/New/Select/SelectPicker";

const ProjectDesign = () => {
  const dispatch = useAppDispatch();
  const ModuleOrientation = ["Portrait", "Landscape"];
  const toggleTheOrientationModal = useAppSelector((state) => state.wheatherslice.toggleOrientationModal)
  const [moduleOrientation, setmoduleOrientation] = useState("")
  const { formDetails } = useAppSelector(state => state.EPCDetails.roofAnalysis);
  const { title } = useAppSelector(state => state.drawer);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formData = { ...formDetails.projectdesign, [name]: value! };
    dispatch(setRoofAnalysisDetails({ ...formDetails, [title]: formData }));
  }

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => { };
useEffect(()=>{
  dispatch(setAccord("Add Boundary & Orientation"));
},[])

const handleClick = () =>{}
  return (
    <>
      {/* {toggleTheOrientationModal && <RoofOrientationModel  />} */}
      <div className="body-main">
        <div className="acc-main">
          <NewAccordion accordName={"Add Boundary & Orientation"} content={"Add Boundary & Orientation"} children={<> <div className="section-body">
            <NewInput disabled={true} id={"orientation"} labelname={"No. of Orientation"} name={"orientation"} value={formDetails.projectdesign?.orientation} type={"number"} onChange={handleChange} star={true} icon={<IconInfo />} />
            <div className="table-footer" style={{ marginTop: "1vh", marginBottom: 0 }}>
              <button className="light-sm-btn bg-grey-600" onClick={() => dispatch(toggleTheNoOfOrientationModal(true))}>Add/Update Orientation</button>
            </div>
            <NewInput id={"buildingheight"} labelname={"Building Height (m)"} name={"buildingheight"} value={formDetails.projectdesign?.buildingheight!} type={"number"} onChange={handleChange} star={true} icon={<IconInfo />} />
            <NewInput id={"parapetheight"} labelname={"Parapet Height (m)"} name={"parapetheight"} value={formDetails.projectdesign?.parapetheight} type={"number"} onChange={handleChange} star={true} icon={<IconInfo />} />
            <NewInput id={"parapetoffset"} labelname={"Parapet Offset (m)"} name={"parapetoffset"} value={formDetails.projectdesign?.parapetoffset} type={"number"} onChange={handleChange} star={true} icon={<IconInfo />} />
            {/* <NewSelect labelname="Module Orientation" isUpload={false} data={ModuleOrientation} wordEntered={moduleOrientation} setWordEntered={setmoduleOrientation} value={"Select an option .."} onChange={handleChanges} star={true} icon={<IconInfo />} /> */}
            <SelectPicker onClick={handleClick} onChange={handleChange} value={""} id="moduleOrientation" name="moduleOrientation" labelname="Module Orientation" data={ModuleOrientation.map((el: any) => ({ label: el, value: el }))} isUpload={false} star={true} icon={<IconInfo />} />
            </div>
          </>} />
        </div>
        <div className="acc-main">
          <NewAccordion accordName={"Roof Obstruction and Infra Drawing"} content={"Roof Obstruction and Infra Drawing"} children={<div className="section-body"><ObstructionAreaTable />  
            <div className="table-footer" style={{ marginTop: "1vh", marginBottom: 0 }}>
                <button  className="light-sm-btn bg-grey-600">
                    Add Obstruction
                </button>
            </div>
            </div>} />
        </div>
      </div>
    </>
  );
}
export default memo(ProjectDesign);