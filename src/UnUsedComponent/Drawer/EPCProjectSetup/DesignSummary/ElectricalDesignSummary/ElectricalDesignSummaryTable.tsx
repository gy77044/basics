import React from 'react'
import DCCableDesignTable from '../../ElectricalDesign/DCCableDesignTable'
import ACCableDesignTable from '../../ElectricalDesign/ACCableDesignTable'
import LADesignTable from '../../ElectricalDesign/LADesignTable'
import EarthingDesignSummaryTable from './EarthingDesignSummaryTable'

export default function ElectricalDesignSummaryTable() {
    return (
        <div className="section-body">
            <DCCableDesignTable />
            <ACCableDesignTable />
            <LADesignTable />
            <EarthingDesignSummaryTable />
        </div>
    )
}
