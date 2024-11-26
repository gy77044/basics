import React from 'react'

export default function LADesignTable() {
    return (
        <div className="table-main">
            <div className="table-name">Placement of LA</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Lighthing Arrestor 1</th>
                        <th className="hvalue">-</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">1.5%</td>
                        <td className="rvalue">-</td>
                    </tr>
                </tbody>
            </table>
            <div className="table-footer">
                <button className="light-sm-btn">
                    Place LA
                </button>
            </div>
        </div>
    )
}
