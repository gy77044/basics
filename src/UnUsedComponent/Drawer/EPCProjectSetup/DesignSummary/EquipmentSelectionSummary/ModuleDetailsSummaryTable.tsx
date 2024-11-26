import React from 'react'
import { useAppSelector } from '../../../../../ReduxTool/store/hooks'

export default function ModuleDetailsSummaryTable() {
    // const {} = useAppSelector(state=>state.roofInfo)
    return (
        <div className="table-main">
            <div className="table-name">Module Details</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Name</th>
                        <th className="hvalue">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">Module Configuration Type</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Manufacturer</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Name</td>
                        <td className="rvalue">-</td>
                    </tr>
                </tbody>
            </table>
            <div className="table-footer">
                <button className="light-sm-btn">
                    Edit Details
                </button>
            </div>
        </div>
    )
}
