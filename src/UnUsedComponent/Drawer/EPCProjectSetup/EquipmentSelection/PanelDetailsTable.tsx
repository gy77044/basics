import React from 'react'

export default function PanelDetailsTable() {
    return (
        <div className="table-main">
            <div className="table-name">Panel Details</div>
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
                </tbody>
            </table>
            {/* <div className="table-footer">
                <button className="light-sm-btn">
                    View
                </button>
            </div> */}
        </div>
    )
}
