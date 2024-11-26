import React from 'react'

export default function RoofAreaTable() {
    return (
        <div className="table-main">
            <div className="table-name">Roof Area</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Name</th>
                        <th className="hvalue">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">Building Height</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Total Roof Area</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Obstruction Area</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Usable Area</td>
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
