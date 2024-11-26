import React from 'react'

export default function ObstructionAreaTable() {
    return (
        <div className="table-main">
            <div className="table-name">Obstruction Area</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Name</th>
                        <th className="hvalue">LxWxH</th>
                        <th className="hvalue">Offset</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">Roof Entrance</td>
                        <td className="rvalue">4x4x4 m</td>
                        <td className="rvalue">4 m</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Water Storage Tank</td>
                        <td className="rvalue">1x1x1</td>
                        <td className="rvalue">1m</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Extended Columns</td>
                        <td className="rvalue">1x1x1</td>
                        <td className="rvalue">1 m</td>
                    </tr>
                    <tr className='trow'>
                        <td className="rheading">Nearby Trees</td>
                        <td className="rvalue">4x4x4 m </td>
                        <td className="rvalue">4 m</td>
                    </tr>
                </tbody>
            </table>         
        </div>
    )
}
