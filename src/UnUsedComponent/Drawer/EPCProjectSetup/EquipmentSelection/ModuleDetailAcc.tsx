import React from 'react'

export default function ModuleDetailAcc() {
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
                                <td className="rheading">Cell Type</td>
                                <td className="rvalue">-</td>
                            </tr>
                            <tr className='trow'>
                                <td className="rheading">No. of Cells</td>
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
                <img className='w-[30vh]' src={require("../../assests/img/EquipmentSelection/ModuleDetails.png")} alt="" />
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
                            <td className="rheading">Module Type</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Maximum Power</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Maximum Power Voltage</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Open-circuit Voltage</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Short-circuit Current</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Module Efficiency STC</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Operating Temperature</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Max system voltage</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Max series fuse rating</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Power tolerance</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Temperature coefficients of Pmax</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Temperature coefficients of Voc</td>
                            <td className="rvalue">-</td>
                        </tr>
                        <tr className='trow'>
                            <td className="rheading">Temperature coefficients of Isc</td>
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
