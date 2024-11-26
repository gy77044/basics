import { ChangeEvent,memo } from "react";
import NewInput from "../../../../../../Components/New/Input/NewInput";
import { useAppSelector } from "../../../../../../ReduxTool/store/hooks";
import { dcPowerBasedOnSanctionload, formatINR, getInverterCost, getmoduleCost, isTruthy } from "../../../../../../Utils/commonFunctions";
import { IconInventary } from "../../../../../../assests/icons/Icons";
import CustomerInformation from "./CustomerInformation";
import { quoteNowDataInEPCCostDetails, quoteNowDataInEPCCostProjectDetails } from "./EPCList";
import { Input, TableCheckBtn } from "../../../../../../Components/AllInput/AllInput";
import { valTy } from "../RFPBiddingLeads";

const QuoteNow = ({ setVals, val, handleChange, selected, setSelected, handlefocus,error }: { setVals: any, val: any, handlefocus: (e: ChangeEvent<HTMLInputElement>) => void, handleChange: (e: ChangeEvent<HTMLInputElement>) => void, selected: string, setSelected: any,error:valTy}) => {
  const { modalData: { isQouteSubmitted, modalData, isWinning, isLost, isWonByOther } } = useAppSelector(state => state.commonReducers.modal);

  quoteNowDataInEPCCostProjectDetails.forEach(el => {
    let keys = el.key!.split(".");
    el.value = el.key == "sanctionload" ? `${modalData[keys[0]]} kWp` : el.key == "sanctionloadAC" ? dcPowerBasedOnSanctionload(modalData['sanctionload']) : modalData[keys[0]];
    if (keys.length > 1) {
      el.value = modalData[keys[0]][keys[1]];
    }
    if (el.key === "yearlygenusablearea") {
      el.value = <span>{`${(parseFloat(el.value as string) / 12).toFixed(2)} / ${parseFloat(el.value as string).toFixed(2)}`} Units</span>;
    } else if (el.key === 'useablearea') {
      el.value = <span>{`${parseFloat(el.value as string).toFixed(2)}`} sq m{/*<sup>2</sup>*/}</span>;
    }
  });
  quoteNowDataInEPCCostDetails.forEach(el => {

    if (el.key == "projectcost") {
      el.value = formatINR(modalData['projectcost']);
    } else if (el.key === 'inverterCost') {
      let inverterCost = getInverterCost(modalData?.sanctionload as number, modalData?.pvinverter?.paco, modalData.bidding?.invertercost ?? 0);
      el.value = isTruthy(inverterCost) ? formatINR(inverterCost) : '-';
    } else if (el.key === "moduleCost") {
      let moduleInverter = getmoduleCost(modalData?.sanctionload as number, modalData?.noofmodules, modalData.bidding?.modulecost ?? 0);
      el.value = isTruthy(moduleInverter) ? formatINR(moduleInverter!) : '-'
    }
  });

  console.log("modaldata",modalData)

  return (
    <>
      {(isQouteSubmitted || isWinning || isLost || isWonByOther) && <div className="relative">
        <span className="flex text-primary-300 text-1.4xl font-medium gap-1 items-center">
          {<IconInventary fill={(isWonByOther || isLost) ? "rgb(234 84 85 / var(--tw-text-opacity))" : "#28C76F"} />} {isWinning ? "You have won the bid successfully." : isLost ? "You have lost this bid" : isWonByOther ? "This bid has allocated to other epc." : "Your bid has been successfully submitted and is currently undergoing review. Kindly await the outcome."}
        </span>
      </div>}
      <div className="flex gap-[3vh]">
        <div className="flex justify-between items-center flex-1">
          <Input error={error.turnkey as string} id={"turnkey"} disabled={!modalData!.bidding.turnkey || isQouteSubmitted} label={"Turnkey Cost (₹)"} name={"turnkey"} value={val.turnkey > 0 ? val.turnkey : ""} type={"number"} onChange={handleChange} isRequired={true} handlefocus={handlefocus} />
        </div>
        <div className="flex justify-between items-center flex-1">
          <Input error={error.bos as string} id={"bos"} disabled={!modalData!.bidding.bos || isQouteSubmitted} label={"BOS Cost (₹)"} name={"bos"} value={val.bos > 0 ? val.bos : ""} type={"number"} onChange={handleChange} isRequired={true} handlefocus={handlefocus} />
        </div>
      </div>
      {modalData!.bidding.bos ? <>
        <div className="space-y-2">
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
            <h4 className="para-md mb-2">Cost Details</h4>
            <TableCheckBtn headers={Object.keys(quoteNowDataInEPCCostDetails[0]).filter(item=>item!=="key")} data={quoteNowDataInEPCCostDetails} />
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
            <h4 className="para-md mb-2">Project Details</h4>
            <TableCheckBtn headers={Object.keys(quoteNowDataInEPCCostProjectDetails[0]).filter(item=>item!=="key")} data={quoteNowDataInEPCCostProjectDetails} />
          </div>
        </div>
      </> : <>
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
          <h4 className="para-md mb-2">Project Details</h4>
          <TableCheckBtn headers={Object.keys(quoteNowDataInEPCCostProjectDetails[0]).filter(item=>item!=="key")} data={quoteNowDataInEPCCostProjectDetails} />
        </div>
      </>}
    </>
  );
};

export default memo(QuoteNow);
