import React from 'react'

export default function PlantTableSummaryTable() {
    return (
        <div className="table-main">
            <div className="table-name">Plant & Table Details</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Name</th>
                        <th className="hvalue">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">Module Orientation</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Roof Tilt Angle (deg)</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">MMS Tilt Angle (deg)</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Base Height (m)</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Rows Per Table</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">String Size (Module in series)</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Structure To Structure Gap (m)</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Module To Module Gap (m)</td>
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
