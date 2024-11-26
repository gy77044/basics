import { memo, useEffect } from "react";
import { IconInfo } from "../../../../../../assests/icons/DrawerIcons";
import { Input, InputRadio } from "../../../../../../Components/AllInput/AllInput";
import ReactSelect from "../../../../../../Components/New/Select/ReactSelect";
import { ProjectTy } from "../../../../../../ReduxTool/Slice/Auth/types";
import { getmoduleAcCable, getmoduleDcCable, setelectricalDetails, setRoofDetailsError, setRowSpacing, setRowSpacingHoriValue, setRowSpacingVerticalValue, structureDetailsType } from "../../../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector } from "../../../../../../ReduxTool/store/hooks";
import { formatReactSelectOptions, updateErrorFields } from "../../../../../../Utils/commonFunctions";
const MMStructureOptions = [{ label: "Manual", value: "Manual" }, { label: "Automatic", value: "Automatic" }];
const InverterDetails = ({ roofNum }: { roofNum: number }) => {
  const dispatch = useAppDispatch();
  const { roofAnalysis: {selectedProject, cableBtwModuleAndInverter, cableBtwACCBAndTP, roofDetails, roofDetailsIndx } } = useAppSelector((state) => state.EPCDetails);
  const selectedprojectDetails = selectedProject as ProjectTy;
  const { is3DMap } = useAppSelector(state => state.mapref);
  useEffect(() => {
    if (selectedprojectDetails && !selectedprojectDetails.projectid) {
      const bindInitialData = async () => {
        try {
          const { payload }: any = await dispatch(getmoduleDcCable());
          const { payload: cablebtwaccbandtpRes }: any = await dispatch(getmoduleAcCable());
          if (typeof payload !== "string" && typeof cablebtwaccbandtpRes !== "string") {
            dispatch(setelectricalDetails({ ...roofDetails[roofNum].electricalDetails, cablebtwmoduleandinverter:{label:payload[0].gennocores,value:payload[0].cbcableid}, cablebtwaccbandtp:{label:cablebtwaccbandtpRes[0].mfgname,value:cablebtwaccbandtpRes[0].accableid} }));
          }
        } catch {

        }
      }
      bindInitialData();
    }
  }, []);
  const handleChange = async (props: any, selectedOption?: any) => {
    let { name, value } = props?.target ?? props;
    if (selectedOption) {
      name = selectedOption.name;
      value = props;
    };
    let details = { ...roofDetails[roofNum].electricalDetails, [name]: value };
    dispatch(setelectricalDetails(details));
    updateErrorFields(roofDetails[roofNum].error, [name],dispatch);

  };
  const electricalError = roofDetails[roofNum].error;
  return (
    <>
      {/* New UI Starts */}
      <div className='main-section1'>
        <div className="para-md">String/Cable Details <span className="text-red-500">*</span></div>
        <div className='grid grid-cols-2 gap-x-2'>
          <div className="main-box1">
            <label className="label-box1">Stringing Type</label>
            <div className="input-main2">
              <InputRadio value={roofDetails[roofDetailsIndx as any].electricalDetails.stringingType} options={MMStructureOptions} name="businessType" onChange={(e) => {
                  dispatch(setRowSpacing(e.target.name as any))
                  if (e.target.value === 'Automatic') {
                    dispatch(setRowSpacingHoriValue('0'))
                    dispatch(setRowSpacingVerticalValue('0'))
                  }
                }}
              // disabled={formDetails.plantinfrastructuredesigning.rowspacing === 'Automatic'} 
              />
            </div>
          </div>
          <Input error={electricalError.stringingSize} suftext="nos" disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"stringingSize"} label={"String Size"} name={"stringingSize"} value={roofDetails[roofNum].electricalDetails.stringingSize} type={"text"} onChange={handleChange} />
          <Input error={electricalError.moduletoinverterdistance} suftext="m" disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"moduletoinverterdistance"} label={"Cable Len (Mod-Inv)"} name={"moduletoinverterdistance"} value={roofDetails[roofNum].electricalDetails.moduletoinverterdistance} type={"text"} onChange={handleChange} />
          <Input error={electricalError.invertertoaccbdistance} suftext="m" disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"invertertoaccbdistance"} label={"Cable Len (Inv-ACCB-TP)"} name={"invertertoaccbdistance"} value={roofDetails[roofNum].electricalDetails.invertertoaccbdistance} type={"text"} onChange={handleChange} />
        </div>
        <ReactSelect error={electricalError.cablebtwmoduleandinverter} disabled={selectedprojectDetails.isepccomplete || is3DMap} onChange={handleChange} value={roofDetails[roofNum].electricalDetails.cablebtwmoduleandinverter} id="cablebtwmoduleandinverter" name="cablebtwmoduleandinverter" labelname="Cable Type (Mod-Inv)" options={formatReactSelectOptions(cableBtwModuleAndInverter, { labelKey: 'gennocores', valueKey: 'cbcableid' }, false)} isUpload={false} icon={<IconInfo />} />
        <ReactSelect error={electricalError.cablebtwaccbandtp} disabled={selectedprojectDetails.isepccomplete || is3DMap} onChange={handleChange} value={roofDetails[roofNum].electricalDetails.cablebtwaccbandtp} id="cablebtwaccbandtp" name="cablebtwaccbandtp" labelname="Cable Type (Inv-ACCB-TP)" options={formatReactSelectOptions(cableBtwACCBAndTP, { labelKey: 'mfgname', valueKey: 'accableid' }, false)} isUpload={false} icon={<IconInfo />} />
      </div>
    </>
  );
};

export default memo(InverterDetails);
