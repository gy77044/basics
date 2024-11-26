import { useEffect, useState } from "react";
import ObstructionAreaTable from "./ObstructionAreaTable";
import RoofAreaTable from "../../../../../UnUsedComponent/Drawer/EPCProjectSetup/Roof&ObstructionAnalysis/RoofAreaTable";
import { useAppDispatch, useAppSelector } from "../../../../../ReduxTool/store/hooks";
import { setRoofNObstructionData, setSaveroofObstructData } from "../../../../../ReduxTool/Slice/RoofAndObstructionReducer/RoofandObstructionReducer";
import NewSelect from "../../../../../Components/New/Select/NewSelect";
import { IconInfo } from "../../../../../assests/icons/DrawerIcons";
import NewRadioButton from "../../../../../Components/New/RadioButton/NewRadioButton";

export default function RoofObstructionAnalysis() {
  const isSaveroofObstrctiondata = useAppSelector(
    (state) => state.roofandobstructionslice.isSaveroofObstrctiondata
  );
  const dispatch = useAppDispatch();

  const handleChanges = () => {};

  const [roofType, setroofType] = useState("");
  const [structureType, setstructureType] = useState("");
  const [roofPVCoverage, setroofPVCoverage] = useState("");
  const [RoofObstructionAnalysisDetails,setRoofObstructionAnalysisDetails] = useState({roofModification:"No"})

  const RadioList = [
    { labelName: "Yes", name: "Yes" },
    { labelName: "No", name: "No" },
  ];

  const RoofType = [
    "BIPV Roof",
    "Tile Roof",
    "Metal Roof",
    "RCC Roof",
    "Carpark Roof",
  ];

  const StructureType = ["Ballasted Type MMS", "Counter Weight Type MMS"];

  const RoofPVCoverage = ["Complete Roof", "Partial Roof"];

  useEffect(() => {
    if (isSaveroofObstrctiondata) {
      if(roofType&&structureType&& roofPVCoverage){
        dispatch(setRoofNObstructionData({roofType,structureType, roofPVCoverage}));
        setTimeout(() => {
          // dispatch(setTitle("equipmentselection"))
          dispatch(setSaveroofObstructData(false));
        }, 500);

      }
    }
  }, [isSaveroofObstrctiondata]);

  const handleTheRoofObstructionRadio=(e:any,name:string)=>{
        setRoofObstructionAnalysisDetails(prev=>({...prev,[name]:e.target.value}))
  }

  return (
    <div className="body-main">
      <div className="drawer-main">
        <div className="drawer-section">Roof Analysis</div>
        <div className="section-body">
          <NewSelect
            labelname="Roof Type"
            isUpload={false}
            data={RoofType}
            wordEntered={roofType}
            setWordEntered={setroofType}
            value={""}
            onChange={handleChanges}
            star={true}
            icon={<IconInfo />}
          />
          <div className="radio-main">
            <div className="section-label">
              Do you allow roof modification? <span className="text-red-100 font-normal">*</span>
            </div>
            <div className="radio-body">
              {RadioList.map((item) => {
                return (
                  <>
                    <NewRadioButton
                      value={item.name}
                      name={"roofModification"}
                      labelname={item.labelName}
                      selectedOption={RoofObstructionAnalysisDetails.roofModification}
                      onClick={(e:any)=>handleTheRoofObstructionRadio(e,"roofModification")}

                    />
                  </>
                );
              })}
            </div>
          </div>
          <NewSelect
            labelname="Structure Type"
            isUpload={false}
            data={StructureType}
            wordEntered={structureType}
            setWordEntered={setstructureType}
            value={"Select an option .."}
            onChange={handleChanges}
            star={true}
            icon={<IconInfo />}
          />
          <NewSelect
            labelname="Roof PV Coverage"
            isUpload={false}
            data={RoofPVCoverage}
            wordEntered={roofPVCoverage}
            setWordEntered={setroofPVCoverage}
            value={"Select an option .."}
            onChange={handleChanges}
            star={true}
            icon={<IconInfo />}
          />
          <RoofAreaTable />
        </div>
      </div>
      <div className="drawer-main">
        <div className="drawer-section">Obstruction Analysis</div>
        <div className="section-body">
          <ObstructionAreaTable />
        </div>
      </div>
    </div>
  );
}
