import React from 'react'
import ModuleDetailsSummaryTable from './ModuleDetailsSummaryTable'
import PlaceInverterTable from '../../EquipmentSelection/PlaceInverterTable'
import ACCBSummaryTable from './ACCBSummaryTable'
import ExtensionPanelSummaryTable from './ExtensionPanelSummaryTable'

export default function EquipmentSelectionSummaryTable() {
    return (
        <div className="section-body">
            <ModuleDetailsSummaryTable />
            <div className="table-main">
                <div className=''>
                    <PlaceInverterTable />
                </div>
                <div className="table-footer">
                    <button className="light-sm-btn">
                        Edit Details
                    </button>
                </div>
            </div>
            <ACCBSummaryTable />
            <ExtensionPanelSummaryTable />
        </div>
    )
}
