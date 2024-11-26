import React, { useEffect } from 'react'
import OwnInstaller from './OwnInstaller';
import PvNxtInstaller from './PvNxtInstaller';
import { useAppDispatch, useAppSelector } from '../../../../ReduxTool/store/hooks';
import { getActiveClass, handleTabNavbars } from '../../../../Utils/commonFunctions';


const InstallerBoardDashboard = () => {
  const dispatch = useAppDispatch();
  const { activeCard } = useAppSelector(state => state.dashboard)
  useEffect(()=>{
    handleTabNavbars(dispatch, "Own Installer")
  },[])
  
 
  return (
    <div className="xl:w-full px-8 py-4">
      <div className="border-b border-gray-200">
        <ul className="-mb-px flex gap-6">
          <li className={`cursor-pointer ${getActiveClass(activeCard, "Own Installer", "tab-active")}`} onClick={() => {handleTabNavbars(dispatch, "Own Installer")}}>
            Own Installer
          </li>
          <li className={`cursor-pointer ${getActiveClass(activeCard, "PvNxt Installer", "tab-active")}`} onClick={() => {handleTabNavbars(dispatch, "PvNxt Installer") }}>
            PvNxt Installer
          </li>
        </ul>
        </div>
          <div className={`tabs-inactivebody ${getActiveClass(activeCard, "Own Installer", "tabs-activebody")} overflow-auto custom-scrollbar-css`}>
              <OwnInstaller />
          </div>
          <div className={`tabs-inactivebody ${getActiveClass(activeCard, "PvNxt Installer", "tabs-activebody")} overflow-auto custom-scrollbar-css`}>
              <PvNxtInstaller/>
          </div>
    </div>
  )
}

export default InstallerBoardDashboard