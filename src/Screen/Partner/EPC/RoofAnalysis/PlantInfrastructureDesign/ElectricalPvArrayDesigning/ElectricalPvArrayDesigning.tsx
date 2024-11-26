import { ChangeEvent, memo } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../ReduxTool/store/hooks";
import AddPvArrayTable from "./AddPvArrayTable";
import PvArrayGlobalSummaryTable from "./PvArrayGlobalSummaryTable";

const ElectricalPvArrayDesigning = () => {
  const dispatch = useAppDispatch();

  const { formDetails } = useAppSelector(
    (state) => state.EPCDetails.roofAnalysis
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {};

  return (
    <div className="body-main space-y-[2vh]">
      <AddPvArrayTable />
      <PvArrayGlobalSummaryTable />
    </div>
  );
};
export default memo(ElectricalPvArrayDesigning);
