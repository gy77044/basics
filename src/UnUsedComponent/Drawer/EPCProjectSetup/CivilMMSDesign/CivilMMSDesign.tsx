import React, { ChangeEvent, useEffect, useState } from 'react'
import NewSelect from '../../../../Components/New/Select/NewSelect'
import { IconInfo } from '../../../../assests/icons/DrawerIcons';
import { useAppDispatch, useAppSelector } from '../../../../ReduxTool/store/hooks';
import { setIsOpenSelect } from '../../../../ReduxTool/Slice/Card/CardReducer';
import MMSFoundationTable from './MMSFoundationTable';
import RoofDetailsTable from './RoofDetailsTable';
import NewInput from '../../../../Components/New/Input/NewInput';
import NewRadioButton from '../../../../Components/New/RadioButton/NewRadioButton';

export default function CivilMMSDesign() {
    const isOpenSelect = useAppSelector((state => state.card.isOpenSelect))
    const dispatch = useAppDispatch();

    const [prjData, setPrjDate] = useState({ newDaa: "", })
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPrjDate({ ...prjData, [name]: value })
    }

    const handleChanges = () => { }

    const [civilMMSDetails,setCivilMMSDetails] = useState({invertorToBeWall:"No",ACCBToBeWall:"No"})

    const InverterWallMountedRadioList = [
        { labelName: "Yes", name: "Yes" },
        { labelName: "No", name: "No" },

    ];

    const ACCBWallMountedRadioList = [
        { labelName: "Yes", name: "Yes" },
        { labelName: "No", name: "No" },

    ];

    const [moduleOrientation, setmoduleOrientation] = useState("")
    const ModuleOrientation = [
        "Portrait",
        "Landscape",
    ];

    const [rowsPerTable, setrowsPerTable] = useState("")
    const RowsPerTable = [
        "2",
        "3",
        "4",
        "5",
        "6",
    ];

    const handleTheCivilDesignRadio=(event:any,name:string)=>{
             setCivilMMSDetails(prev=>({...prev,[name]:event.target.value}))
    }

    return (
        <div className="body-main">
            {/* Civil Work */}
            <div className="drawer-main">
                <div className="drawer-section">
                    Civil Work
                </div>
                <div className="section-body">
                    <div className='radio-main'>
                        <div className='section-label'>
                            Do you want inverter to be wall mounted ? <span className="text-red-100 font-normal">*</span>
                        </div>
                        <div className='radio-body'>
                            {
                                InverterWallMountedRadioList.map((item, i) => {
                                    return (<>
                                        <NewRadioButton   value={item.name}  key={i} name={"invertorToBeWall"} onClick={(e:any)=>handleTheCivilDesignRadio(e,"invertorToBeWall")} selectedOption={civilMMSDetails.invertorToBeWall} labelname={item.labelName} />

                                    </>)
                                })
                            }
                        </div>
                    </div>
                    <div className='radio-main'>
                        <div className='section-label'>
                            Do you want ACCB to be wall mounted ?
                            <span className="text-red-100 font-normal">
                                *
                            </span>
                        </div>
                        <div className='radio-body'>
                            {
                                ACCBWallMountedRadioList.map((item, i) => {
                                    return (<>
                                        <NewRadioButton   value={item.name} key={i} name={"ACCBToBeWall"} onClick={(e:any)=>handleTheCivilDesignRadio(e,"ACCBToBeWall")} selectedOption={civilMMSDetails.ACCBToBeWall} labelname={item.labelName} />

                                    </>)
                                })
                            }
                        </div>
                    </div>
                    <MMSFoundationTable />
                </div>
            </div>

            {/* Plant Details */}
            <div className="drawer-main">
                <div className="drawer-section">
                    Plant Details
                </div>
                <div className="section-body">
                    <RoofDetailsTable />
                    <NewSelect labelname="Module Orientation" isUpload={false}
                        data={ModuleOrientation} wordEntered={moduleOrientation} setWordEntered={setmoduleOrientation}
                        value={"Select an option .."} onChange={handleChanges} star={true} icon={<IconInfo />}
                    />
                    <NewInput labelname={"Roof Tilt Angle (deg)"} name={"noofaacbpanels"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />
                    <NewInput labelname={"MMS Tilt Angle (deg)"} name={"noofaacbpanels"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />
                    <NewInput labelname={"Base Height (m)"} name={"noofaacbpanels"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />
                </div>
            </div>

            {/* Table Details */}
            <div className="drawer-main">
                <div className="drawer-section">
                    Table Details
                </div>
                <div className="section-body">
                    <NewSelect labelname="Rows Per Table" isUpload={false}
                        data={RowsPerTable} wordEntered={rowsPerTable} setWordEntered={setrowsPerTable}
                        value={"Select an option .."} onChange={handleChanges} star={true} icon={<IconInfo />}
                    />
                    <NewInput labelname={"String Size (Module in series)"} name={"stringsize"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />
                    <NewInput labelname={"Structure To Structure Gap (m)"} name={"strtostrgap"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />
                    <NewInput labelname={"Module To Module Gap (m)"} name={"modtomodgap"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />

                </div>
            </div>

        </div>
    )
}
