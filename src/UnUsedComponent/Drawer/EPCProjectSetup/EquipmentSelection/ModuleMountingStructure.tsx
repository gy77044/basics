import React, { ChangeEvent, useState } from 'react'
import { IconInfo } from '../../../../assests/icons/DrawerIcons'
import { useAppDispatch, useAppSelector } from '../../../../ReduxTool/store/hooks'
import { setMMS } from '../../../../ReduxTool/Slice/EquipmentSelection/ModuleMountStructure/MMSReducer'
import CustomInput from '../../../../Components/Input/CustomInput'

const ModuleMountingStructure = () => {
  const dispatch =useAppDispatch()
  const prevMountVal = useAppSelector(state=>state.mmsReducer.mmsTab)
  const {minRoofEdgeDistance:ed, moduleOrientation:mo, modulesSSD:mssd } = useAppSelector(state=>state.mmsReducer.mmsTab)
  
  // const [mmsData, setMMSData] = useState({ moduleOrientation: "Landscape", minRoofEdgeDistance: "1", modulesSSD: "10" })
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    dispatch(setMMS({...prevMountVal, [name]:value}))
  }
  return (<>
    <div className="flex justify-center items-center text-brown-100 text-1.8xl font-semibold">
      <div  className="drawer-heading">Module Mounting Structure</div>
      {/* <IconInfo /> */}
    </div>
    <div className="h2"></div>
    <div className="w-full border-b-[0.1vh] border-primary-700/40" />
    <div className="h2"></div>
    <CustomInput labelname={"Module Orientation"} name="moduleOrientation" value={mo} type="text" onChange={handleChange} />
    <div className="h2"></div>
    <CustomInput labelname={"Minimum Roof Edge Distance (m)"} name="minRoofEdgeDistance" value={ed} type="number" onChange={handleChange} />
    <div className="h2"></div>
    <CustomInput labelname={"Distance B/W Modules Short Side *"} name="modulesSSD" value={mssd} type="number" onChange={handleChange} />
  </>
  )
}

export default ModuleMountingStructure
