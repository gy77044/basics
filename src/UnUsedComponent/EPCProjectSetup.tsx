import React from "react";
import CustomerInformation from "../Screen/Partner/EPC/LeadBoard/PvnxtLeads/QuoteNow/CustomerInformation";
import {
  customerDataInEPC,
  epcProjectSetupData,
} from "../Screen/Partner/EPC/LeadBoard/PvnxtLeads/QuoteNow/EPCList";
import NewInput from "../Components/New/Input/NewInput";
import { IconInfo } from "../assests/icons/DrawerIcons";


const EPCProjectSetup = () => {
  const handleChange = () => {};
  return (
    <>
      <div className="drawer-main">
        <div className="drawer-section">Project Details</div>
        <div className="section-body">
          <div className="pb-0.6">
            <CustomerInformation data={epcProjectSetupData} />
          </div>
          <NewInput
            id={"Project Name"}
            labelname={"Project Name"}
            name={"projectname"}
            value={"Noida Rooftop Demo 1"}
            type={"text"}
            onChange={handleChange}
            star={true}
            icon={<IconInfo />}
            content={"contentlist.content1"}
          />
          <NewInput
            id={"CompleteProjectAddress"}
            labelname={"Complete Project Address"}
            name={"projectname"}
            value={"KLJ Noida One Sec 62, Noida Uttar Pradesh"}
            type={"text"}
            onChange={handleChange}
            star={true}
            icon={<IconInfo />}
            content={"contentlist.content1"}
          />
          <NewInput
            id={"ProjectType"}
            labelname={"Project Type"}
            name={"projecttype"}
            value={"Rooftop"}
            type={"text"}
            onChange={handleChange}
            star={true}
            icon={<IconInfo />}
            content={"contentlist.content1"}
          />
          <NewInput
            id={"consumertype"}
            labelname={"Consumer Type"}
            name={"consumertype"}
            value={"Residential"}
            type={"text"}
            onChange={handleChange}
            star={true}
            icon={<IconInfo />}
            content={"contentlist.content1"}
          />
        </div>
        <div className="drawer-section">Project Load Details</div>
        <div className="section-body mt-1">
          <NewInput
            id={"connectedload"}
            labelname={"Connected Load (kW)"}
            name={"connectedload"}
            value={"4"}
            type={"text"}
            onChange={handleChange}
            star={true}
            icon={<IconInfo />}
            content={"contentlist.content1"}
          />
          <NewInput
            id={"connectedvoltageEB"}
            labelname={"Connected Voltage From EB Point"}
            name={"connectedvoltageEB"}
            value={"220 V, 1-Phase, 50Hz"}
            type={"text"}
            onChange={handleChange}
            star={true}
            icon={<IconInfo />}
            content={"contentlist.content1"}
          />
          <NewInput
            id={"electricityrate"}
            labelname={"Per Unit Electricity Rate (Rs/Unit)"}
            name={"electricityrate"}
            value={"7"}
            type={"text"}
            onChange={handleChange}
            star={true}
            icon={<IconInfo />}
            content={"contentlist.content1"}
          />
        </div>
      </div>
    </>
  );
};

export default EPCProjectSetup;
