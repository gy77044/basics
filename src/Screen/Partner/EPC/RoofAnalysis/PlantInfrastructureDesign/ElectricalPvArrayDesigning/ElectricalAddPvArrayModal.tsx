import React, { useEffect } from 'react'
import { IconInfo } from '../../../../../../assests/icons/DrawerIcons'
import NewInput from '../../../../../../Components/New/Input/NewInput'
import NewRadioButton from '../../../../../../Components/New/RadioButton/NewRadioButton'
import SelectPicker from "../../../../../../Components/New/Select/SelectPicker"
import { getModuleInveter, getModuleInveterById, getModuleInveterCapacity, pvArrayDesignType, setInveterModuleCapacity } from '../../../../../../ReduxTool/Slice/Partner/EPC'
import { useAppDispatch, useAppSelector } from '../../../../../../ReduxTool/store/hooks'
import { filterKeyIncludeArr, getElementByIndex } from '../../../../../../Utils/commonFunctions'
import "../style.css"

interface ModalDataType {
    pvInx: number,
    pvArrayModalDetails: pvArrayDesignType,
    setPvArrayModalDetails:(prev:any)=>void
}
const invertorTypeRadio = [{ lablename: "On Grid", name: "onGrid" }, { lablename: "Off Grid", name: "offGrid" }, { lablename: "Hybrid", name: "hybrid" }];
const ElectricalAddPvArrayModal: React.FC<ModalDataType> = ({ pvInx,pvArrayModalDetails,setPvArrayModalDetails }) => {
    const dispatch = useAppDispatch();
    const { roofAnalysis: { moduleInverter, moduleInverterCapacity,moduleInverterDetails, formDetails,moduleDetails, formDetails: { plantinfrastructuredesigningNew: { /*addOrientation,*/ pvArrayDesign } } } } = useAppSelector(state => state.EPCDetails);
    useEffect(() => {  
        moduleInveter(pvArrayModalDetails?.invertorManufacture??"", pvArrayModalDetails?.invertorCapacity ?? "");
    }, []);
    const moduleInveter = async (value: string, inveterCapacity?: string) => {
        const { payload }: any = await dispatch(getModuleInveter(value));
        if (payload) {
            if (inveterCapacity) {
                const { payload } = await dispatch(getModuleInveterCapacity(inveterCapacity));
                if(pvInx && payload){
                }
            };
        };
    };

    const handleRadioBtn = (e: any) => {
        const { name,value } = e.target;
        setPvArrayModalDetails((prev:any)=>({...prev,[name]:value}));
    }

    const handleChange = async (e: any) => {
        const { name, value }: { name: any, value: any } = e.target;
        if (name == "invertorManufacture") {
            await dispatch(getModuleInveter(value));
            dispatch(setInveterModuleCapacity([]));
        };
        setPvArrayModalDetails((prev:any)=>({...prev,[name]:value}));
    };
    const handleClick = async (props: { name: string, value: string }) => {
        const { name, value } = props;
        if (name === "invertorManufacture") {
            const inverterid = getElementByIndex(filterKeyIncludeArr(moduleInverter,"manufacturer",value),0,"id");
            await dispatch(getModuleInveterCapacity(value));
           dispatch(getModuleInveterById(inverterid))
           
        }
        setPvArrayModalDetails((prev:any)=>({...prev,[name]:value}));
    };
   
    
    return (
        <div className='flex flex-row justify-between mt-2'>
            <div className="flex flex-1 flex-row gap-7 items-center flex-wrap pr-3">
                <div className='min-w-[300px] max-w-[400px] flex-1'>
                    <NewInput id="pvArrayName" labelname='Pv Array Name' name="pvArrayName" value={pvArrayModalDetails?.pvArrayName} type="text" onChange={handleChange} star={true} icon={<IconInfo />} />
                </div>
                <div className='min-w-[300px] max-w-[400px] flex-1'>
                    {/* <SelectPicker data={addOrientation.length>0 ? addOrientation.map(el => ({ label:'Orientation 1', value: 'Orientation 1'})):[]} id="roofOrientation" name='roofOrientation' onChange={handleChange} onClick={handleClick} value={pvArrayModalDetails?.roofOrientation} icon={<IconInfo />} isFilter={true} isRecomm={true} star={true} labelname='Roof Orientation' /> */}
                </div>
                <div className='min-w-[300px] max-w-[400px] flex-1'>
                    <NewInput id="moduleName" disabled={true} labelname='Module Name' name="moduleName" value={formDetails?.projectsetup?.modulemanufacturer && `${formDetails?.projectsetup?.modulemanufacturer} | ${formDetails?.projectsetup?.modulecapacity}`} type="text" onChange={handleChange} star={true} icon={<IconInfo />} />
                </div>
                <div className='min-w-[300px] max-w-[400px] flex-1'>
                    <label className="text-primary-500 text-1.3xl font-normal">Inverter Type <span className="text-red-200">*</span></label>
                    <div className="w-[100%] flex gap-x-5 items-center mt-1">
                        {invertorTypeRadio.map((each) => {
                            return (
                                <NewRadioButton key={each.name} value={each.lablename} onClick={(e: any) => handleChange(e)} name="invertorType" labelname={each.lablename} selectedOption={pvArrayModalDetails?.invertorType} />
                            )
                        })}
                        {/* <IconInfo /> */}
                    </div>
                </div>
                <div className='min-w-[300px] max-w-[400px] flex-1'>
                    <SelectPicker uploadBtnTxt={"Upload OND File (.ond)"} typeaccept='ond' labelname='Inverter Manufacturer' onChange={handleChange} onClick={handleClick} data={moduleInverter.map((el: any) => ({ label: el.manufacturer, value: el.id }))} name='invertorManufacture' value={pvArrayModalDetails?.invertorManufacture} icon={<IconInfo />} isFilter={false} isUpload={true} isRecomm={true} star={true} />
                </div>
                <div className='min-w-[300px] max-w-[400px] flex-1 relative'>
                    <SelectPicker uploadBtnTxt={"Upload OND File (.ond)"} typeaccept='ond' isRecomm={true} onChange={handleChange} onClick={handleClick} value={pvArrayModalDetails?.invertorCapacity} id='invertorCapacity' name='invertorCapacity' labelname='Inverter Capacity' data={moduleInverterCapacity.map((el: any) => ({ label: el.name, value: el.id }))} icon={<IconInfo />} isFilter={true} isUpload={true} star={true} />
                    <div className='text-[#9FB2B6] text-right pt-1 absolute right-0'>Inverter with 5 MPPTs</div>
                </div>
                <div className='min-w-[300px] max-w-[400px] flex-1'>
                    <NewInput id="noOfMPPTs" labelname='No Of MPPTs' name="noOfMPPTs" value={pvArrayModalDetails?.noOfMPPTs} type="number" onChange={handleChange} star={true} icon={<IconInfo />} />
                </div>
                <div className='min-w-[300px] max-w-[400px] flex-1 relative'>
                    <NewInput max="20" min="5" id="noOfModulesInSeries" labelname='No. Of Modules In Series' name="noOfModulesInSeries" value={pvArrayModalDetails?.noOfModulesInSeries} type="number" onChange={handleChange} star={true} icon={<IconInfo />} />
                    <div className='text-[#9FB2B6] text-right pt-1 absolute right-0'>Between 5 and 20</div>
                </div>
                <div className='min-w-[300px] max-w-[400px] flex-1 relative'>
                    <NewInput max="10" min="5" id="noOfString" labelname='No Of String' name="noOfString" value={pvArrayModalDetails?.noOfString} type="number" onChange={handleRadioBtn} star={true} icon={<IconInfo />} />
                    <div className='text-[#9FB2B6] text-right pt-1 absolute right-0'>Between 5 and 10</div>
                </div>
            </div>
            <div className='w-[30%] h-full'>
                <table className="w-full mt-1">
                    <thead className="bg-[#0000000F]">
                        <tr className="h-[5vh] text-1.4xl text-black  font-medium">
                            <th className="table-thead ">Name</th>
                            <th className="table-thead">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="table-thead">
                            <td className="pvArray-modal-thead table-thead">V<sub className="supText">mpp</sub> (60<sup className="supText">°</sup>C)</td>
                            <td className="text-center">{moduleDetails.v_mp_ref}</td>
                        </tr >
                        {/* <tr className="table-thead">
                            <td className="pvArray-modal-thead table-thead">V<sub className="supText">mpp</sub> (0<sup className="supText">°</sup>C)</td>
                            <td className="text-center">-</td>
                        </tr> */}
                        <tr className="table-thead">
                            <td className="pvArray-modal-thead table-thead">V<sub className="supText">oc</sub> (0<sup className="supText">°</sup>)</td>
                            <td className="text-center">{moduleDetails.v_oc_ref}</td>
                        </tr>
                        <tr className="table-thead">
                            <td className="pvArray-modal-thead table-thead">I<sub className="supText">mpp</sub> at STC</td>
                            <td className=" text-center">{moduleDetails.i_mp_ref}</td>
                        </tr>
                        <tr className="table-thead">
                            <td className="pvArray-modal-thead table-thead">I<sub className="supText">sc</sub> at STC</td>
                            <td className="text-center">{moduleDetails.i_sc_ref}</td>
                        </tr>
                        {/* <tr className="table-thead table-thead">
                            <td className="pvArray-modal-thead table-thead">Array Power</td>
                            <td className="text-center">-</td>
                        </tr> */}

                    </tbody>
                </table>
            </div>
        </div>
    )
}


export default ElectricalAddPvArrayModal
