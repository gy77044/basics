import React, { ChangeEvent, useId, useState } from 'react'
import { toast } from 'react-toastify'
import { IconInfo } from '../../assests/icons/DrawerIcons'
import NewInput from '../../Components/New/Input/NewInput'
import { addOrientationType, setRoofAnalysisDetails } from '../../ReduxTool/Slice/Partner/EPC'
import { toggleTheNoOfOrientationModal } from '../../ReduxTool/Slice/WeatherAnalysis/WeatherAnalysisReducer'
import { useAppDispatch, useAppSelector } from '../../ReduxTool/store/hooks'

const RoofOrientationModel = ({ addOrientation,setAddOrientation,isEdit}: {addOrientation:addOrientationType,setAddOrientation:(prev:any)=>void,isEdit:boolean }) => {
    const { formDetails } = useAppSelector(state => state.EPCDetails.roofAnalysis);
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setAddOrientation((prev:any)=>({...prev,[name]:value}));
    };

    const roofType = [
        { id: "BIPV", type: "BIPV Roof" },
        { id: "Tile", type: "Tile Roof" },
        { id: "Metal", type: "Metal Roof" },
        { id: "RCC", type: "RCC Roof" },
        { id: "Carpark", type: "Carpark Roof" }
    ]

    return (
        <>
            <div className="w-[50%]">
                <NewInput id={"orientation"} disabled={true} labelname={"No. of Orientation"} name={"orientation"} value={1} type={"number"} onChange={handleChange} star={true} icon={<IconInfo />} />
            </div>
            <div className="text-primary-200 text-1.4xl leading-[16.41px] font-semibold">Orientation Details</div>
            <div className="table-main">
                <table className="table">
                    <thead className="thead">
                        <tr className="text-black">
                            <th className="hvalue">Name</th>
                            <th className="hvalue">Roof Type</th>
                            <th className="hvalue">{`Tilt Angle (°)`}</th>
                            <th className="hvalue">{`Azimuth Angle (°)`}</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        <tr className='trow'>
                            <td className="rheading">{addOrientation?.orientation ? addOrientation?.orientation : 'Orientation 1'}</td>
                            <td className="rvalue">
                                <select disabled={isEdit} name='projectType' value={addOrientation?.projectType} className="orientation-select w-[160px] focus:outline-none text-primary-400" onChange={handleChange}>
                                    <option value="select" className="w-[160px]">Select an option ..</option>
                                    {roofType.map(each => {
                                        return (
                                            <option key={each.id} className="w-[160px]">{each.type}</option>
                                        )
                                    })}
                                </select>
                            </td>
                            <td className="rheading">
                                <input disabled={isEdit} type="number" name='tiltAngle' onChange={handleChange} value={addOrientation?.tiltAngle} className="text-primary-400 outline-none focus:outline font-normal" />
                            </td>
                            <td className="rheading">
                                <input type="number" disabled={isEdit} name='azimuthAngle' onChange={handleChange} value={addOrientation?.azimuthAngle} className="text-primary-400 outline-none focus:outline font-normal" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}


export default RoofOrientationModel