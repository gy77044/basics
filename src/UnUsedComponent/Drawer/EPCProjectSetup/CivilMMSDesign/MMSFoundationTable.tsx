import React from 'react'

export default function MMSFoundationTable() {
    return (
        <div className="table-main">
            <div className="table-name">MMS Foundation</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Name</th>
                        <th className="hvalue">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">Concrete Ballast (LxWxH)</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Adhesive - FOSROC Nitobond</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">SS 14 mm Anchor Bolt</td>
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
