import React from 'react'
import RoofDetailsTable from '../CivilMMSDesign/RoofDetailsTable'
import RoofAreaTable from '../Roof&ObstructionAnalysis/RoofAreaTable'
import ObstructionAreaTable from '../../../../Screen/Partner/EPC/RoofAnalysis/ProjectDesign/ObstructionAreaTable'

export default function RoofObstructionAnalysisSummaryTable() {
    return (
        <div className="section-body">
            <div className="table-main">
                <div className=''>
                    <RoofDetailsTable />
                </div>
                <div className="table-footer">
                    <button className="light-sm-btn">
                        Edit Details
                    </button>
                </div>
            </div>
            <RoofAreaTable />
            <ObstructionAreaTable />
        </div>
    )
}
