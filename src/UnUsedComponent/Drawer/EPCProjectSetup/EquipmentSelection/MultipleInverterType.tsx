import NewAccordion from '../../../../Components/New/Accordion/NewAccordion'
import InverterDetailAcc from './InverterDetailAcc'

export default function MultipleInverterType() {
  return (
    <div className="moduledetails-main">
      <div className='acc-main'>
        <NewAccordion accordName={"Inverter 1 - Growatt | 2.0 kW | 50-500 V"} content={""} children={<InverterDetailAcc />} />
        <NewAccordion accordName={"Inverter 2 - Growatt | 5.0 kW | 50-500 V"} content={""} children={<InverterDetailAcc />} />
      </div> 
    </div>
  )
}
