import React from 'react'
import { useAppSelector } from '../../../../ReduxTool/store/hooks'

export default function RoofDetailsTable() {
    const {roofType,
    structureType,
    roofPVCoverage} = useAppSelector(state=> state.roofandobstructionslice)
    return (
        <div className="table-main">
            <div className="table-name">Roof Details</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Name</th>
                        <th className="hvalue">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">Roof Type</td>
                        <td className="rvalue">{roofType&&roofType||"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Structure Type</td>
                        <td className="rvalue">{structureType&&structureType||"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Roof PV Coverage</td>
                        <td className="rvalue">{roofPVCoverage&&roofPVCoverage||"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Azimuth Angle</td>
                        <td className="rvalue">-</td>
                    </tr>
                </tbody>
            </table>
            {/* <div className="table-footer">
                <button className="light-sm-btn">
                    Add Obstruction
                </button>
            </div> */}
        </div>
    )
}
