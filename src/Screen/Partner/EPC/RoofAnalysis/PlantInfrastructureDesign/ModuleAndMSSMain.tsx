import React, { memo, useEffect } from 'react'
import { IconInfo } from '../../../../../assests/icons/DrawerIcons'
import NewInput from '../../../../../Components/New/Input/NewInput'
import SelectPicker from '../../../../../Components/New/Select/SelectPicker'
import { setRoofDetailsError, setstructureDetails, structureDetailsType } from '../../../../../ReduxTool/Slice/Partner/EPC'
import { useAppDispatch, useAppSelector } from '../../../../../ReduxTool/store/hooks'
import { NewInputProps } from '../../../../../Utils/Const'
import { ProjectTy } from '../../../../../ReduxTool/Slice/Auth/types'
import { toast } from 'react-toastify'
import { Input } from '../../../../../Components/AllInput/AllInput'
import ReactSelect from '../../../../../Components/New/Select/ReactSelect'
import { updateErrorFields } from '../../../../../Utils/commonFunctions'
import { isNumberValidate } from '../../../../../Utils/Regex'
const forNewSelect = ["Flush Mount", "Fixed Tilt", "Tracker (HSAT)"]
const azumuthAngleArray = ["0", "45", "90", "180", "360"]
const ModuleAndMSSMain = ({ roofNum }: { roofNum: number }) => {
    const dispatch = useAppDispatch();
    const { roofDetails, selectedProject } = useAppSelector(state => state.EPCDetails.roofAnalysis);
    const selectedprojectDetails = selectedProject as ProjectTy;
    const { is3DMap } = useAppSelector(state => state.mapref)

    //form handler
    const handleChange = async (props: any, selectedOption?: any) => {
        let { name, value } = props?.target ?? props;
        if (selectedOption) {
          name = selectedOption.name;
          value = props;
        };
        if(name == "rowspacing" && (parseFloat(value)>20)){
            toast.warning("Row Spacing Not Exceed 20", { toastId: "Row Spacing" })
            return;
        }
        if(name == "modulespacing" && (parseFloat(value)>20)){
            toast.warning("Module Spacing Not Exceed 20", { toastId: "Module Spacing" })
            return;
        };
        let details = { ...roofDetails[roofNum].structureDetails, [name]: value };
        if (name === "tiltAngle" && (parseInt(value) <= 60) || value === "") {
            dispatch(setstructureDetails(details));
        }
        else if (name !== "tiltAngle") {
            dispatch(setstructureDetails(details));
        }
        else if (name === "tiltAngle" && (parseInt(value) > 60)) {
            toast.warning("Tilt Angle Should Not Exceed 60", { toastId: "tilt angle" })
            props.preventDefault()
        };
      
        dispatch(setstructureDetails(details));
        updateErrorFields(roofDetails[roofNum].error, [name],dispatch);
    };
    const moduleAndMSSError = roofDetails[roofNum]?.error ?? {};
    
    const inputElementsDetails = [
        // { name: "arrayRows", labelname: "Array Rows (nos)", id: "arrayRows", type: "number", star: true, value: roofDetails[roofNum].structureDetails.arrayRows, },
        // { name: "arrayColumns", labelname: "Array Columns (nos)", id: "arrayColumns", type: "number", star: true, value: roofDetails[roofNum].structureDetails.arrayColumns, },
        // { name: "heightFromGround", labelname: "Height From Ground (in m)", id: "heightFromGround", type: "number", star: true, value: roofDetails[roofNum].structureDetails.heightFromGround },
        { onChange: handleChange, name: "verticalSpaceBtwModules", labelname: "Vertical Space B/w Modules (in m)", id: "verticalSpaceBtwModules", type: "number", value: roofDetails[roofNum].structureDetails.verticalSpaceBtwModules, star: true },
        { onChange: handleChange, name: "horizontalSpaceBtwModules", labelname: "Horizontal Space B/w Modules (in m)", id: "horizontalSpaceBtwModules", type: "number", value: roofDetails[roofNum].structureDetails.horizontalSpaceBtwModules, star: true },
    ] as NewInputProps[]
    const inputElementsDetails1 = [
        { onChange: handleChange, name: "moduleOrientation", labelname: "Module Orientation", id: "moduleOrientation", type: "text", value: roofDetails[roofNum].structureDetails.moduleOrientation, error:moduleAndMSSError?.moduleOrientation },
        { onChange: handleChange, onKeyPress:(e: any) => isNumberValidate(e), className:'positiveInt noDecimal', name: "arrayRows", labelname: "Array Rows", id: "arrayRows", type: "number", star: false, value: roofDetails[roofNum].structureDetails.arrayRows,suftext:"nos", error:moduleAndMSSError?.arrayRows },
        { onChange: handleChange, onKeyPress:(e: any) => isNumberValidate(e), className:'positiveInt noDecimal', name: "arrayColumns", labelname: "Array Columns", id: "arrayColumns", type: "number", star: false, value: roofDetails[roofNum].structureDetails.arrayColumns,suftext:"nos", error:moduleAndMSSError?.arrayColumns },
        { onChange: handleChange, onKeyPress:(e: any) => isNumberValidate(e), className:'positiveInt threeDecimal', max:'20', name: "rowspacing", labelname: "Row Spacing", id: "rowspacing", type: "number", star: false, value: roofDetails[roofNum].structureDetails.rowspacing,suftext:"m", error:moduleAndMSSError?.rowspacing },
        { onChange: handleChange, onKeyPress:(e: any) => isNumberValidate(e), className:'positiveInt threeDecimal', max:'20', name: "modulespacing", labelname: "Module Spacing", id: "modulespacing", type: "number", star: false, value: roofDetails[roofNum].structureDetails.modulespacing, suftext:"m", error:moduleAndMSSError?.modulespacing },
        { onChange: handleChange, name: "azumuthAngle", labelname: "MMS Azimuth Angle ", id: "azumuthAngle", type: "number", value: roofDetails[roofNum].structureDetails.azumuthAngle, star: false, error:moduleAndMSSError?.azumuthAngle },
        { onChange: handleChange, onKeyPress:(e: any) => isNumberValidate(e), className:"positiveInt noDecimal", max:'60', name: "tiltAngle", labelname: "MMS Tilt Angle ", id: "tiltAngle", type: "number", value: roofDetails[roofNum].structureDetails.tiltAngle, star: false, error:moduleAndMSSError?.tiltAngle },
        // { name: "heightFromGround", labelname: "Height From Ground (in m)", id: "heightFromGround", type: "number", star: true, value: roofDetails[roofNum].structureDetails.heightFromGround },
        // { name: "verticalSpaceBtwModules", labelname: "Vertical Space B/w Modules (in m)", id: "verticalSpaceBtwModules", type: "number", value: roofDetails[roofNum].structureDetails.verticalSpaceBtwModules, star: true },
        // { name: "horizontalSpaceBtwModules", labelname: "Horizontal Space B/w Modules (in m)", id: "horizontalSpaceBtwModules", type: "number", value: roofDetails[roofNum].structureDetails.horizontalSpaceBtwModules, star: true },
    ] as NewInputProps[]
    const inputElementsDetails2 = [
        { onChange: handleChange, name: "arrayRows", labelname: "Tracker Orientation", id: "trackerOrientation", type: "number", star: false, value: roofDetails[roofNum].structureDetails.arrayRows, },
        { onChange: handleChange, name: "moduleName", labelname: "Module Name ", id: "moduleName ", type: "number", star: true, value: roofDetails[roofNum].structureDetails.moduleName, },
        { onChange: handleChange, name: "moduleOrientation", labelname: "Module Orientation", id: "ModuleOrientation", type: "number", star: true, value: roofDetails[roofNum].structureDetails.moduleOrientation },
        { onChange: handleChange, name: "mmsTiltAngle", labelname: "MMS Tilt Angle", id: "mmsTiltAngle", type: "number", value: roofDetails[roofNum].structureDetails.mmsTiltAngle, star: true },
        { onChange: handleChange, name: "mmsAzimuthAngle", labelname: "MMS Azimuth Angle ", id: "mmsAzimuthAngle", type: "number", value: roofDetails[roofNum].structureDetails.mmsAzimuthAngle, star: true },
        { onChange: handleChange, name: "arrayRows", labelname: "Array Rows", id: "arrayRows", type: "number", value: roofDetails[roofNum].structureDetails.arrayRows, star: true, suftext:"Nos" },
        { onChange: handleChange, name: "arrayColumns", labelname: "Array Columns", id: "arrayColumns", type: "number", value: roofDetails[roofNum].structureDetails.arrayColumns, star: true,suftext:"Nos" },
        { onChange: handleChange, name: "heightFromGround", labelname: "Height From Ground (in m)", id: "heightFromGround", type: "number", star: true, value: roofDetails[roofNum].structureDetails.heightFromGround },
        { onChange: handleChange, name: "verticalSpaceBtwModules", labelname: "Vertical Space B/w Modules (in m)", id: "verticalSpaceBtwModules", type: "number", value: roofDetails[roofNum].structureDetails.verticalSpaceBtwModules, star: true },
    ] as NewInputProps[]

    return (
        <div className="grid grid-cols-2 gap-x-2">
            <ReactSelect disabled={true} onChange={handleChange} name="MMSType" labelname='MMS Type' options={forNewSelect} value={roofDetails[roofNum].structureDetails.MMSType}/>
            {roofDetails[roofNum].structureDetails.MMSType.label === "Flush Mount" && <>
                    <Input suftext='deg' disabled={selectedprojectDetails.isepccomplete || is3DMap} onChange={handleChange} name="tiltAngle" label="MMS Tilt Angle " id="tiltAngle" type="number" value={roofDetails[roofNum].structureDetails.tiltAngle} />
                    <ReactSelect disabled={selectedprojectDetails.isepccomplete || is3DMap} onChange={handleChange} value={roofDetails[roofNum].structureDetails.azumuthAngle} options={azumuthAngleArray.map((el: any) => ({ label: el, value: el }))} isUpload={false} id="azumuthAngle" name="azumuthAngle" labelname="MMS Azimuth Angle " closeMenuOnSelect={true}/>
                    {
                        inputElementsDetails.map((each) => (<Input id={each.id} name={each.name} value={each.value.toString()} label={each.labelname} type={each.type} isRequired={each.star} onChange={each.onChange} disabled={selectedprojectDetails.isepccomplete || is3DMap} />))
                    }
                </>}
            {roofDetails[roofNum].structureDetails.MMSType.label === "Fixed Tilt" && inputElementsDetails1.map((each) => {
                if (each.labelname === 'MMS Azimuth Angle ') {
                    return <ReactSelect menuPlacement='top' disabled={selectedprojectDetails.isepccomplete || is3DMap} onChange={handleChange} value={roofDetails[roofNum].structureDetails.azumuthAngle} options={azumuthAngleArray.map((el: any) => ({ label: el, value: el }))} isUpload={false} id="azumuthAngle" name="azumuthAngle" error={each.error} labelname="MMS Azimuth Angle " closeMenuOnSelect={true}/>
                } else if (each.labelname === 'MMS Tilt Angle ') {
                    return <Input suftext='deg' onKeyPress={each.onKeyPress} classNames={each.className} max={each.max} disabled={selectedprojectDetails.isepccomplete || is3DMap} onChange={handleChange} name="tiltAngle" error={each.error} label="MMS Tilt Angle " id="tiltAngle" type="number" value={roofDetails[roofNum].structureDetails.tiltAngle} />
                } else if (each.labelname === 'Module Orientation') {
                    return <ReactSelect disabled={selectedprojectDetails.isepccomplete || is3DMap} onChange={handleChange} value={roofDetails[roofNum].structureDetails.moduleOrientation} id="moduleOrientation" name="moduleOrientation" error={each.error} labelname="Module Orientation" options={[{ label: "Landscape", value: "Landscape" }, { label: "Portrait", value: "Portrait" }]} isUpload={false} closeMenuOnSelect={true}/>
                }
                else {
                    return <Input suftext={each.suftext} onKeyPress={each.onKeyPress} classNames={each.className} max={each.max} id={each.id} name={each.name} value={each.value.toString()} label={each.labelname} type={each.type} isRequired={each.star} onChange={each.onChange} disabled={selectedprojectDetails.isepccomplete || is3DMap} error={each.error}/>
                }
            })}
            {roofDetails[roofNum].structureDetails.MMSType.label === "Tracker (HSAT)" && inputElementsDetails2.map((each) => (<Input id={each.id} name={each.name} value={each.value.toString()} label={each.labelname} type={each.type} isRequired={each.star} onChange={each.onChange} suftext={each.suftext} disabled={selectedprojectDetails.isepccomplete || is3DMap} />))}
        </div>
    )
}


export default memo(ModuleAndMSSMain);
