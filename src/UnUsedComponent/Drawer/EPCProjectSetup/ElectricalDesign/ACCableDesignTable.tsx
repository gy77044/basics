import React from 'react'

export default function ACCableDesignTable() {
    return (
        <div className="table-main">
            <div className="table-name">AC Cable Design</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Loss Fraction at STC</th>
                        <th className="hvalue">Cable Particulars</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">1.5%</td>
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
