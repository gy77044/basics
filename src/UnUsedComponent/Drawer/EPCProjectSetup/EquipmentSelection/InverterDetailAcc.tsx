import React from 'react'

export default function InverterDetailAcc() {
    return (
        <div className='flex justify-center items-center space-x-[3vh]'>
            <div className='flex flex-col space-y-[3vh]'>
            <div className="table-main">
                <div className="table-name">Mechanical Characteristics</div>
                <table className="table">
                    <thead className='thead'>
                        <tr>
                            <th className="hvalue">Name</th>
                            <th className="hvalue">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='trow'>
                            <td className="rheading">IP Rating</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Operating Temp. Range</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Dimensions</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Weight</td>
                            <td className="rvalue">-</td>
                        </tr>
                    </tbody>
                </table>
                {/* <div className="table-footer">
                    <button className="light-sm-btn">
                        Edit Details
                    </button>
                </div> */}
            </div>
            <img className='w-[40vh]' src={require("../../assests/img/EquipmentSelection/InverterDetails.png")} alt="" />
            </div>
            <div className="table-main">
                <div className="table-name">Specification</div>
                <table className="table">
                    <thead className='thead'>
                        <tr>
                            <th className="hvalue">Name</th>
                            <th className="hvalue">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='trow'>
                            <td className="rheading">Maximum Recommended PV Power</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Maximum DC Voltage</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">PV Voltage Range</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Max Input Current</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">No. of MPP Trackers/Strings per MPP Trackers</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Rated AC Output Power</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Max Output Current</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">AC Nominal Voltage</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">AC Grid Frequency</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Power Factor</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">THDI</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Max Efficiency</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Euro Efficiency</td>
                            <td className="rvalue">-</td>
                        </tr>
                    </tbody>
                </table>
                {/* <div className="table-footer">
                    <button className="light-sm-btn">
                        Edit Details
                    </button>
                </div> */}
            </div>
        </div>
    )
}
