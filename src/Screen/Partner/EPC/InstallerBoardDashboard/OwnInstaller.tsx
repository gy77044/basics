import { useState } from 'react';
import { AddIcon } from '../../../../assests/icons/Icons';
import { NewModal } from '../../../../Components/New/Modal/NewModal';
import { setModalHeaderFooter } from '../../../../ReduxTool/Slice/CommonReducers/CommonReducers';
import { useAppDispatch } from '../../../../ReduxTool/store/hooks';
import { generateRandomData } from '../../../../Utils/commonFunctions';
import OwnInstallerTable from './OwnInstallerTable';
import RegisterNewInstallerCompany from './RegisterNewInstallerCompany';
import { Button } from '../../../../Components/AllButton/AllButtons.tsx';

function OwnInstaller() {
  const dispatch = useAppDispatch();
  const [newRegistrationModal,setNewRegistrationModal]=useState(false);
  
  const handleTheRegisterModel = () =>{
    setNewRegistrationModal(prev=>!prev);
    dispatch(setModalHeaderFooter({title:"Register New Installer", btnTxt:"Save Installer",secondaryBtnTxt:""}))
  } 
  const handleTheOverviewModal = () =>{

  }
  const handleOnClick = () =>{

  }




  const randomData = generateRandomData(10,['InstallerId','Name','Address','Mobile','Email','RegistrationDate','Qualification','Photo&IDProof','TrainingStatus','Action']);

  
  return (
      <>
      {newRegistrationModal && <NewModal name="modal name" btnName='button name' onClick={handleTheOverviewModal} children={<RegisterNewInstallerCompany/>} setIsCLose={handleTheRegisterModel}/>}
      <div className="w-full">
        <div className="ownLeadBtnsContainer w-full justify-between items center">
              <Button className='btn btn-md-primary' type='button' onClick={handleTheRegisterModel} name="Register New Installer"/>
        </div>
        <div className="w-full pt-[18px]">
            {randomData.length && <OwnInstallerTable data={randomData}/>}
        </div>
      </div>
      </>
  )
}

export default OwnInstaller