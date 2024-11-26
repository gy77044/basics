import React from 'react'
import OwnInstallerTable from './OwnInstallerTable'
import { generateRandomData } from '../../../../Utils/commonFunctions';

function PvNxtInstaller() {

  const randomData = generateRandomData(1,['InstallerId','Name','Address','Mobile','Email','RegistrationDate','Qualification','Photo&IDProof','TrainingStatus','Action']);

  
  return (
    <div className="w-full flex justify-center items-center h-[80vh]" >
    {/* <div className="ownLeadBtnsContainer w-full justify-between items center">
        <div className="flex gap-[10px]">
        
        </div>
    </div>
    <div className="w-full pt-[18px]"> */}
        {/* <OwnInstallerTable data={[]}/> */}
        <div className='text-center text-primary-200'>No Data To Show</div>
    {/* </div> */}
  </div>
  )
}

export default PvNxtInstaller