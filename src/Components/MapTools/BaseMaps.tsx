import React, { useEffect, useState } from 'react'
import globalLayers, { basemapNames } from '../../Utils/EPCMaps/Maps/GlobaLMap'
import { setMapToolsTitle } from '../../ReduxTool/Slice/MapTools/MapToolsReducer'
import { useAppDispatch } from '../../ReduxTool/store/hooks'
import { BaseMapList } from './BaseMapList'

const BaseMaps = () => {
  const [activ, setActiv] = useState("")
  const dispatch = useAppDispatch()
  const handleChnage = (ele: string) => {
    globalLayers.setBaselayer(ele)
    setActiv(ele)
    dispatch(setMapToolsTitle(""))
  }

  return (
    <>
      <div className='flex flex-col justify-start h-[40vh] '>
        {basemapNames.map((ele, i) => {
          return (
            <>
              <div onClick={() => handleChnage(ele)} key={i} id={ele} className={`flex w-full text-primary-100 items-center hover:text-white hover:bg-custom-primary-default p-1 ${activ === ele ? "bg-custom-primary-default text-white" : ""}`}>
                <img className='w-[3vh] h-[3vh] rounded-full hover:border-[0.2vh] hover:border-primary-200 cursor-pointer mr-1' src={(BaseMapList[ele as keyof object] as any).image} alt="" />
                <div className='text-capitalize cursor-pointer text-1.6xl'>{(BaseMapList[ele as keyof object] as any).name}</div>
              </div>
            </>
          )
        })}
      </div>
    </>
  )
}

export default BaseMaps
