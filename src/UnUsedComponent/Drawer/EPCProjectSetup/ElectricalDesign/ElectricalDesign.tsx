import React, { ChangeEvent, useEffect, useState } from 'react'
import NewSelect from '../../../../Components/New/Select/NewSelect'
import { IconInfo } from '../../../../assests/icons/DrawerIcons';
import { useAppDispatch, useAppSelector } from '../../../../ReduxTool/store/hooks';
import { setIsOpenSelect } from '../../../../ReduxTool/Slice/Card/CardReducer';
import DCCableDesignTable from './DCCableDesignTable';
import LADesignTable from './LADesignTable';
import ACCableDesignTable from './ACCableDesignTable';
import NewInput from '../../../../Components/New/Input/NewInput';

export default function ElectricalDesign() {
    const isOpenSelect = useAppSelector((state => state.card.isOpenSelect))
    const dispatch = useAppDispatch();

    const [prjData, setPrjDate] = useState({ newDaa: "", })
    const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPrjDate({ ...prjData, [name]: value })
    }

    return (
        <div className="body-main">
            {/* DC Cable Design Details */}
            <div className="drawer-main">
                <div className="drawer-section">
                    DC Cable Design
                </div>
                <div className="section-body">
                    <DCCableDesignTable />
                </div>
            </div>

            {/* AC Cable Design Details */}
            <div className="drawer-main">
                <div className="drawer-section">
                    AC Cable Design
                </div>
                <div className="section-body">
                    <ACCableDesignTable />
                </div>
            </div>

            {/* LA Design Details */}
            <div className="drawer-main">
                <div className="drawer-section">
                    LA Design
                </div>
                <div className="section-body">
                    <LADesignTable />
                </div>
            </div>

            {/* Earthing Design Details */}
            <div className="drawer-main">
                <div className="drawer-section">
                    Earthing Design
                </div>
                <div className="section-body">
                    <NewInput labelname={"No of DC Earthing Pit"} name={"noofaacbpanels"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />
                    <div className='section-btn'>
                        <NewInput labelname={"No of LA Earthing Pit"} name={"noofaacbpanels"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />
                        <div className='table-footer'>
                            <button className='light-sm-btn'>DC & LA Earthing Details</button>
                        </div>
                    </div>
                    <div className='section-btn'>
                        <NewInput labelname={"No of AC Earthing Pit"} name={"noofaacbpanels"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />
                        <div className='table-footer'>
                            <button className='light-sm-btn'>AC Earthing Details</button>
                        </div>
                    </div>
                    <div className='section-btn'>
                        <NewInput labelname={"No of Communication Earthing Pit"} name={"noofaacbpanels"} value={prjData.newDaa} type={"text"} onChange={handleChanges} star={true} icon={<IconInfo />} />
                        <div className='table-footer'>
                            <button className='light-sm-btn'>Communication Earthing Details</button>
                        </div>
                    </div>
                </div>
                
            </div>

        </div>
    )
}
