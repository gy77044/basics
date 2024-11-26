import React from 'react'
import MMSFoundationTable from '../../CivilMMSDesign/MMSFoundationTable'
import RoofDetailsTable from '../../CivilMMSDesign/RoofDetailsTable'
import PlantTableSummaryTable from './PlantTableSummaryTable'

export default function CivilMMSDesignSummaryTable() {
    return (
        <div className="section-body">
            <MMSFoundationTable />
            <RoofDetailsTable />
            <PlantTableSummaryTable />
        </div>
    )
}
