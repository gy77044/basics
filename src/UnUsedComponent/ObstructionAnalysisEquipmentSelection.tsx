import React from "react";
import CustomerInformation from "../Screen/Partner/EPC/LeadBoard/PvnxtLeads/QuoteNow/CustomerInformation";
import NewInput from "../Components/New/Input/NewInput";
import { IconInfo } from "../assests/icons/DrawerIcons";
import NewRadioButton from "../Components/New/RadioButton/NewRadioButton";

export const epcRoofDetailsData = [
  { name: "Total Roof Area", value: "1,140" },
  { name: "Usable Area", value: "400" },
];
export const epcObstructionAreaData = [
  { name: "Obstruction 1", value: "2x5x1" },
  { name: "Obstruction 2", value: "2x5x3" },
  { name: "Obstruction 3", value: "2x5x1" },
];

export const ConfirmRadioList = [
  { labelname: "Yes", name: "Yes" },
  { labelname: "No", name: "No" },
];

const ObstructionAnalysisEquipmentSelection = () => {
  const handleChange = () => {};
  return (
    <div className="drawer-main">
      <div className="drawer-section">Obstruction Analysis</div>
      <div className="section-body mt-1">
        <div>
          <CustomerInformation
            data={epcRoofDetailsData}
            headingName={"Roof Details"}
          />
          <div className="h2"></div>
          <CustomerInformation
            data={epcObstructionAreaData}
            headingName={"Roof Details"}
          />
        </div>
      </div>
      <div className="w-full flex justify-end">
        <button className="light-sm-btn">View Module Details</button>
      </div>
      <div className="h1"></div>

      <div className="drawer-section">Inverter Details</div>

      <div className="h4"></div>
      <NewInput
        id={"widthwalkway"}
        labelname={"Width of Walkway (m)"}
        name={"widthwalkway"}
        value={"0.3"}
        type={"text"}
        onChange={handleChange}
        star={true}
        icon={<IconInfo />}
        content={"contentlist.content1"}
      />
      <div className="section-body mt-1">
        <div className="radio-main">
          <div className="section-label">
            Do you want inverter to be wall mounted? *
          </div>
          <div className="radio-body">
            {ConfirmRadioList.map((item) => {
              return (
                <>
                  <NewRadioButton value={item.name} name={item.name} labelname={item.labelname} />
                </>
              );
            })}
          </div>
          <div className="h2"></div>
        </div>
        <div className="radio-main">
          <div className="section-label">
            Do you want ACCB to be wall mounted?
          </div>
          <div className="radio-body">
            {ConfirmRadioList.map((item) => {
              return (
                <>
                  <NewRadioButton value={item.name} name={item.name} labelname={item.labelname} />
                </>
              );
            })}
          </div>
          <div className="h2"></div>
        </div>
        <NewInput
          id={"earthingpit"}
          labelname={"No of AC Earthing Pit"}
          name={"earthingpit"}
          value={"1"}
          type={"text"}
          onChange={handleChange}
          star={true}
          icon={<IconInfo />}
          content={"contentlist.content1"}
        />
      </div>
    </div>
  );
};

export default ObstructionAnalysisEquipmentSelection;
