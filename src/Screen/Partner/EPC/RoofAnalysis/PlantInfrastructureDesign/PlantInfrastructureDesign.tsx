import { memo, useEffect } from "react";
import NewAccordion from "../../../../../Components/New/Accordion/NewAccordion";
import { setAccord } from "../../../../../ReduxTool/Slice/Drawer/DrawerReducer";
import { useAppDispatch } from "../../../../../ReduxTool/store/hooks";
import ElectricalEquipmentDesigning from "./ElectricalEquipmentDesigning/ElectricalEquipmentDesigning";
import ElectricalPvArrayMain from "./ElectricalPvArrayDesigning/ElectricalPvArrayMain";
import LossCalculation from "./LossCalculation/LossCalculation";
import ProjectSetup from "../ProjectSetupContainer/ProjectSetup/ProjectSetup";
import WeatherData from "../ProjectSetupContainer/ProjectSetup/WeatherData";
import { Accordion1 } from "../../LeadBoard/PvnxtLeads/PvNxtLeads";

const PlantInfrastructureDesign = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setAccord("Weather Data"))
  }, [])
  return (
    <div className="lsb-body space-y-3">
      {/* <NewAccordion
        accordName={"Add Orientation"}
        content={"contentlist.content8"}
        children={<AddOrientation />}
      /> */}
      {/* <NewAccordion
        accordName={"Weather Data"}
        content={"contentlist.content8"}
        children={<ElectricalPvArrayMain />}
      /> */}
       <Accordion1
        headName={"Weather Data"}
        children={<WeatherData />}
        open={true}
      />
      <Accordion1
        headName={"Electrical Equipment Designing"}
        children={<ElectricalEquipmentDesigning />}
      />
      <Accordion1
          headName={"Loss Calculation"}
          children={<LossCalculation />}
        />
    </div>
  );
}
export default memo(PlantInfrastructureDesign)