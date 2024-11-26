import React from 'react'

export default function EarthingDesignSummaryTable() {
    return (
        <div className="table-main">
            <div className="table-name">Earthing Design</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Name</th>
                        <th className="hvalue">Details</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">No of DC Earthing Pit</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">No of LA Earthing Pit</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">No of AC Earthing Pit</td>
                        <td className="rvalue">-</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">No of Communication Earthing Pit</td>
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
