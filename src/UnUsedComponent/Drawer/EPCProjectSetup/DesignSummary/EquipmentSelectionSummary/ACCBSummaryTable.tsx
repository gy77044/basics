import React from 'react'

export default function ACCBSummaryTable() {
    return (
        <div className="table-main">
            <div className="table-name">AACB Details</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Name</th>
                        <th className="hvalue">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">No of Metering Point</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">No of ACCB</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">ACCB 1</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">ACCB 2</td>
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
