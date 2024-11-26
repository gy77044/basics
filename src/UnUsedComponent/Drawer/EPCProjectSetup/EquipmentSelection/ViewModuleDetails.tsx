import {useEffect} from 'react'
import NewAccordion from '../../../../Components/New/Accordion/NewAccordion'
import ModuleDetailAcc from './ModuleDetailAcc'
import * as Papa from "papaparse";

export default function ViewModuleDetails() {

  return (
    <div className="moduledetails-main">
        <div className='acc-main'>
                <NewAccordion accordName={"Module 1 - Jinko | 330 Wp | 28V"} content={""} children={<ModuleDetailAcc />} />
                <NewAccordion accordName={"Module 2 - Jinko | 530 Wp | 28V"} content={""} children={<ModuleDetailAcc />} />
            </div>
    </div>
  )
}
