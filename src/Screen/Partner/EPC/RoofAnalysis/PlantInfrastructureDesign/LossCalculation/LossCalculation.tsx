import React, { memo } from "react";
import { Input } from "../../../../../../Components/AllInput/AllInput";
import { ProjectTy } from "../../../../../../ReduxTool/Slice/Auth/types";
import { setPlantInfraStructureLoss } from "../../../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector, } from "../../../../../../ReduxTool/store/hooks";
import { updateRoofAnalysisErrorFields } from "../../../../../../Utils/commonFunctions";

const LossCalculation = () => {
  const dispatch = useAppDispatch();
  const { selectedProject,error, formDetails: { plantinfrastructuredesigningNew: { lossCalculation } } } = useAppSelector((state) => state.EPCDetails.roofAnalysis);
  const selectedprojectDetails = selectedProject as ProjectTy;
  const { is3DMap } = useAppSelector(state => state.mapref)
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch(setPlantInfraStructureLoss({ ...lossCalculation, [name]: name === 'accableloss' ? parseInt(value) : value }))
    updateRoofAnalysisErrorFields(error,[name],dispatch);
  };

  return (
    <>
      <div className='main-section1'>
        <div className="para-md">Cable Loss <span className="text-red-500">*</span></div>
        <div className="grid grid-cols-2 gap-2">
          <Input error={error.dccableloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="dccableloss" name="dccableloss" type="number" onChange={changeHandler} label="DC Cable Loss" value={lossCalculation.dccableloss.toString()} />
          <Input error={error.accableloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="accableloss" name="accableloss" type="number" onChange={changeHandler} label="AC Cable Loss" value={lossCalculation.accableloss.toString()} />
        </div>
      </div>
      <div className='main-section1'>
        <div className="para-md">Module Loss <span className="text-red-500">*</span></div>
        <div className="grid grid-cols-2 gap-2">
          <Input error={error.moduleefficiencyloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="moduleefficiencyloss" name="moduleefficiencyloss" type="number" onChange={changeHandler} label="Module Efficiency" value={lossCalculation.moduleefficiencyloss.toString()} />
          <Input error={error.lidloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="lidloss" name="lidloss" type="number" onChange={changeHandler} label="LID Loss" value={lossCalculation.lidloss.toString()} />
          <Input error={error.modulemissmatchloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="modulemissmatchloss" name="modulemissmatchloss" type="number" onChange={changeHandler} label="Module Mismatch" value={lossCalculation.modulemissmatchloss.toString()} />
          <Input error={error.stringvoltagemissmatchloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="stringvoltagemissmatchloss" name="stringvoltagemissmatchloss" type="number" onChange={changeHandler} label="String Voltage Mismatch" value={lossCalculation.stringvoltagemissmatchloss.toString()} />
          <Input error={error.soilingloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="soilingloss" name="soilingloss" type="number" onChange={changeHandler} label="Soiling Loss" value={lossCalculation.soilingloss.toString()} />
          <Input error={error.auxloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="auxloss" name="auxloss" type="number" onChange={changeHandler} label="Aux Loss" value={lossCalculation.auxloss.toString()} />
          <Input error={error.unavailloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="unavailloss" name="unavailloss" type="number" onChange={changeHandler} label="Unavailability Loss" value={lossCalculation.unavailloss.toString()} />
          <Input error={error.climateloss} disabled={selectedprojectDetails.isepccomplete || is3DMap} suftext="%" id="climateloss" name="climateloss" type="number" onChange={changeHandler} label="Climate Variability Loss " value={lossCalculation.climateloss.toString()} />
        </div>
      </div>
    </>
  );
};

export default memo(LossCalculation);
