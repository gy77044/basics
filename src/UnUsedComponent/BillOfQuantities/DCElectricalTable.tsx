import React from 'react'
import CustomerInformation from '../../Screen/Partner/EPC/LeadBoard/PvnxtLeads/QuoteNow/CustomerInformation'
import { dcielectricalTableDataInEPC, settingTableDataInEPC } from '../../Screen/Partner/EPC/LeadBoard/PvnxtLeads/QuoteNow/EPCList'
import DCELectricalInfoTable from './DCELectricalInfoTable'

const DCElectricalTable = () => {
  return (
    <div>
        <div className="h2"></div>
      <DCELectricalInfoTable
        data={dcielectricalTableDataInEPC}
        sno={true}
      />
      
    </div>
  )
}

export default DCElectricalTable
