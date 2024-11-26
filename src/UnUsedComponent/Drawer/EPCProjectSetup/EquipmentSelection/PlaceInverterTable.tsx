import React from 'react'

export default function PlaceInverterTable() {
    return (
        <div className="table-main">
            <div className="table-name">Inverter Placement</div>
            <table className="table">
                <thead className='thead'>
                    <tr>
                        <th className="hvalue">Name</th>
                        <th className="hvalue">Module Type</th>
                        <th className="hvalue">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='trow'>
                        <td className="rheading">Inverter 1 - Sungrow | 10.0 kW | 50-500 V</td>
                        <td className="rvalue">Module 1 - Jinko | 500 Wp | 28 V</td>
                        <td className="rvalue"><button className='light-sm-btn'>Place Inverter</button></td>
                    </tr>
                    {/* <tr className='trow'>
                    <td className="rheading">Inverter 2 - Growatt | 5.0 kW | 50-500 V</td>
                        <td className="rvalue">Module 2 - Jinko | 530 Wp | 28 V</td>
                        <td className="rvalue"><button className='light-sm-btn'>Place Inverter</button></td>
                    </tr> */}
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
