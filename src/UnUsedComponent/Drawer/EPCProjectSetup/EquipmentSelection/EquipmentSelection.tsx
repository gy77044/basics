import { ChangeEvent, useEffect, useState } from "react";
import NewSelect from "../../../../Components/New/Select/NewSelect";
import { IconInfo } from "../../../../assests/icons/DrawerIcons";
import PlaceInverterTable from "./PlaceInverterTable";
import NewInput from "../../../../Components/New/Input/NewInput";
import PanelDetailsTable from "./PanelDetailsTable";
import NewRadioButton from "../../../../Components/New/RadioButton/NewRadioButton";
import { useAppDispatch, useAppSelector } from "../../../../ReduxTool/store/hooks";
import { setOpenNewModal } from "../../../../ReduxTool/Slice/Card/CardReducer";
import {
  setModalHeaderFooter,
  toggleModalState,
} from "../../../../ReduxTool/Slice/CommonReducers/CommonReducers";
import {
  setEquipmentData,
  setModuleData,
  setSaveEquipmentData,
} from "../../../../ReduxTool/Slice/EquipmentSelection/SelectionReducer";
import { setTitle } from "../../../../ReduxTool/Slice/Drawer/DrawerReducer";
import * as Papa from "papaparse";

const EquipmentSelection = () => {
  const [prjData, setPrjDate] = useState({ newDaa: "" });
  const isSaveEquipmentData = useAppSelector(
    (state) => state.equipment.isSaveEquipmentData
  );
  // const moduleData = useAppSelector(state=>state.rooftopType.)
  const dispatch = useAppDispatch();

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrjDate({ ...prjData, [name]: value });
  };

  const [EquipmentDetails,setEquipmentDetails] = useState({moduleConfType:"Single Capacity",invertorConfType:"Single Capacity",invertorType:"On Grid"})

  const handleTheEquipmentRadio=(event:any,name:string)=>{
    setEquipmentDetails(prev=>({...prev,[name]:event.target.value}))
  }

  const ModuleRadioList = [
    { labelName: "Single Capacity", name: "Single Capacity" },
    { labelName: "Multiple Capacity", name: "Multiple Capacity" },
  ];

  const InverterRadioList = [
    { labelName: "Single Capacity", name: "Single Capacity" },
    { labelName: "Multiple Capacity", name: "Multiple Capacity" },
  ];

  const InverterTypeRadioList = [
    { labelName: "On Grid", name: "On Grid" },
    { labelName: "Off Grid", name: "Off Grid" },
    { labelName: "Hybrid", name: "Hybrid" },
  ];

  const [moduleManufacturer, setmoduleManufacturer] = useState("");
  const ModuleManufacturer = [
    "JinkoSolar",
    "Energiesysteme Holleis",
    "Soventix Canada Inc.",
    "Ahead Renewable Energy ltd.",
    "Anchor Electricals Pvt. Ltd.",
  ];

  const [moduleName, setmoduleName] = useState("");
  const ModuleName = [
    "330 Wp | 28 V | Si-mono | JKM330M ..",
    "335 Wp | 32 V | Si-mono | JKM335M ..",
    "340 Wp | 33 V | Si-mono | JKM340M ..",
    "500 Wp | 28 V | Si-mono | JKM500M ..",
    "545 Wp | 33 V | Si-mono | JKM545M ..",
  ];

  const [inverterManufacturer, setinverterManufacturer] = useState("");
  const InverterManufacturer = [
    "Growatt New Energy",
    "Sungrow",
    "Sineng",
    "Afore",
    "Beacon",
  ];

  const [inverterName, setinverterName] = useState("");
  const InverterName = [
    "2.0 kW | 50-500 V | TL | 50/60Hz ..",
    "2.5 kW | 80-500 V | TL | 50/60Hz ..",
    "3.0 kW | 80-500 V | TL | 50/60Hz ..",
    "5.0 kW | 50-550 V | TL | 50/60Hz ..",
    "10.0 kW | 50-550 V | TL | 50/60Hz ..",
  ];

  const handleModalViewModuleDetails = () => {
    dispatch(setModalHeaderFooter({ title: "Module", btnTxt: "Button Name",secondaryBtnTxt:"" }));
    dispatch(toggleModalState(true));
  };

  const handleModalViewInverterDetails = () => {
    dispatch(
      setModalHeaderFooter({ title: "Inverter", btnTxt: "Button Name",secondaryBtnTxt:"" })
    );
    dispatch(toggleModalState(true));
  };

  const handleModalSelectionVCC = () => {
    dispatch(setModalHeaderFooter({ title: "view_vcc", btnTxt: "view_vcc",secondaryBtnTxt:"" }));
    dispatch(toggleModalState(true));
  };
  //Pan File
  const readPanFile = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const fileContent = event.target.result as string;
          // onFileRead(fileContent);
        }
      };
      reader.readAsText(file);
    }
  };
  //OND File
  // const [fileData, setFileData] = useState<string | null>(null);
  const readONDFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // Read the content of the .ond file
          const fileContent = e.target.result as string;
          // setFileData(fileContent);
          // Now you can process the file content as needed
          // console.log('File content:', fileContent);
        }
      };
      reader.readAsText(file);
    }
  };


  useEffect(() => {
    if (isSaveEquipmentData) {
      if (
        inverterName &&
        inverterManufacturer &&
        moduleName &&
        moduleManufacturer
      ) {
        dispatch(
          setEquipmentData({
            inverterName,
            inverterManufacturer,
            moduleName,
            moduleManufacturer,
          })
        );

        setTimeout(() => {
          // dispatch(setTitle("electricaldesign"));
          dispatch(setSaveEquipmentData(true));
        }, 500);
      }
    }
  }, [isSaveEquipmentData]);

  return (
    <>
      <div className="body-main">
        {/* Module Details */}
        <div className="drawer-main">
          <div className="drawer-section">Module Details</div>
          <div className="section-body">
            <div className="radio-main">
              <div className="section-label">
                Module Configuration Type <span className="text-red-100 font-normal">*</span>
              </div>
              <div className="radio-body">
                {ModuleRadioList.map((item) => {
                  return (
                    <>
                      <NewRadioButton
                        value={item.name}
                        labelname={item.labelName}
                        name={"moduleConfType"}
                        selectedOption={EquipmentDetails.moduleConfType}
                        onClick={(e:any)=>handleTheEquipmentRadio(e,"moduleConfType")}
                      />
                    </>
                  );
                })}
              </div>
            </div>
            <NewSelect
              labelname="Manufacturer"
              isUpload={true}
              uploadBtnTxt="Upload PAN File (.pan)"
              data={ModuleManufacturer}
              wordEntered={moduleManufacturer}
              setWordEntered={setmoduleManufacturer}
              value={"JinkoSolar"}
              onChange={readPanFile}
              star={true}
              icon={<IconInfo />}
              typeaccept=".pan"
            />
            <div className="section-btn">
              <NewSelect
                labelname="Name"
                isUpload={true}
                uploadBtnTxt="Upload PAN File (.pan)"
                data={ModuleName}
                wordEntered={moduleName}
                setWordEntered={setmoduleName}
                value={"Select an option .."}
                onChange={handleChanges}
                star={true}
                icon={<IconInfo />}
                typeaccept=".pan"
              />
              <div className="table-footer">
                <button
                  className="light-sm-btn"
                  onClick={() => handleModalViewModuleDetails()}
                >
                  View Module Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inverter Details */}
        <div className="drawer-main">
          <div className="drawer-section">Inverter Details</div>
          <div className="section-body">
            <div className="radio-main">
              <div className="section-label">
                Inverter Configuration Type
                <span className="text-red-100 font-normal">*</span>
              </div>
              <div className="radio-body">
                {InverterRadioList.map((item) => {
                  return (
                    <>
                      <NewRadioButton
                        value={item.name}
                        labelname={item.labelName}
                        name={"invertorConfType"}
                        selectedOption={EquipmentDetails.invertorConfType}
                        onClick={(e:any)=>handleTheEquipmentRadio(e,"invertorConfType")}
                      />
                    </>
                  );
                })}
              </div>
            </div>
            <div className="radio-main">
              <div className="section-label">
                Inverter Type
                <span className="text-red-100 font-normal">*</span>
              </div>
              <div className="radio-body">
                {InverterTypeRadioList.map((item) => {
                  return (
                    <>
                      <NewRadioButton
                        value={item.name}
                        labelname={item.labelName}
                        name={"invertorType"}
                        selectedOption={EquipmentDetails.invertorType}
                        onClick={(e:any)=>handleTheEquipmentRadio(e,"invertorType")}
                      />
                    </>
                  );
                })}
              </div>
            </div>
            <NewSelect
              labelname="Manufacturer"
              isUpload={true}
              uploadBtnTxt="Upload OND File (.ond)"
              data={InverterManufacturer}
              wordEntered={inverterManufacturer}
              setWordEntered={setinverterManufacturer}
              value={"Select an option .."}
              onChange={readONDFile}
              star={true}
              icon={<IconInfo />}
              typeaccept=".ond"
            />
            <div className="section-btn">
              <NewSelect
                labelname="Name"
                isUpload={true}
                uploadBtnTxt="Upload OND File (.ond)"
                data={InverterName}
                wordEntered={inverterName}
                setWordEntered={setinverterName}
                value={"Select an option .."}
                onChange={handleChanges}
                star={true}
                icon={<IconInfo />}
              />
              <div className="table-footer">
                <button
                  className="light-sm-btn"
                  onClick={() => handleModalViewInverterDetails()}
                >
                  View Inverter Details
                </button>
              </div>
            </div>
            <PlaceInverterTable />
          </div>
        </div>

        {/* Combiner Box Details */}
        <div className="drawer-main hidden">
          <div className="drawer-section">Combiner Box Details</div>
          <div className="section-body"></div>
        </div>

        {/* ACCB Details */}
        <div className="drawer-main hidden">
          <div className="drawer-section">AACB Details</div>
          <div className="section-body">
            <PanelDetailsTable />
            <div className="section-btn">
              <NewInput
                labelname={"No of AACB Panels"}
                name={"noofaacbpanels"}
                value={prjData.newDaa}
                type={"text"}
                onChange={handleChanges}
                star={true}
                icon={<IconInfo />}
              />
              <div className="table-footer">
                <button
                  onClick={() => handleModalSelectionVCC()}
                  className="light-sm-btn"
                >
                  View ACCB Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Extension Panel Details */}
        <div className="drawer-main hidden">
          <div className="drawer-section">Extension Panel Details</div>
          <div className="section-body">
            <div className="section-btn">
              <NewInput
                labelname={"No of Extension Panels"}
                name={"noofextensionpanels"}
                value={prjData.newDaa}
                type={"text"}
                onChange={handleChanges}
                star={true}
                icon={<IconInfo />}
              />
              <div className="table-footer">
                <button className="light-sm-btn">View Extension Details</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EquipmentSelection;
