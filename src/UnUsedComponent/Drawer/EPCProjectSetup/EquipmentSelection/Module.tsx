import { useState } from 'react';
import { setModuleOpen } from '../../../../ReduxTool/Slice/EquipmentSelection/SelectionReducer';
import { useAppDispatch, useAppSelector } from '../../../../ReduxTool/store/hooks';

const Module = () => {
  const dispatch = useAppDispatch()
  const showModuleBox = useAppSelector(state=>state.equipment.showModuleBox)
 
  const [wordEntered, setWordEntered] = useState("Select an option");
  const [wordEntered2, setWordEntered2] = useState("Select an option");

  const nameoptions = ["JKM-530M-72HL4-V Tiger Pro 72HC",
    "JKM-555N-72HL4-V Tiger  Neo N-Type",
    "JKM-585M-7RL4-V Tiger Pro TR 78M",
    "JKM-190M-72",
    "JKM-270PP-60 (5BB) Eagle 60P",
    "JKM-310M-60 (5BB) PERC Eagle",
    "JKM-345M-72 (5BB) Eagle",
  ];

  const manufactureoptions = ["Ahead Renewable Energy ltd.",
    "Alternative Energiesysteme Holleis KG",
    "Anchor Electricals Pvt. Ltd.",
    "ANJI Technology Co. Ltd.",
    "JinkoSolar Holding Co. Ltd.",
    "Soventix Canada Inc.",
    "Adani Solar",
    "Surya Solar"];

    // useEffect(()=>{
   
        
    //     if(wordEntered&&wordEntered2){
    //       dispatch()
    //     }
      
      
    // },[wordEntered, wordEntered2])

  return (
    <>
      <div className="flex justify-center items-center text-brown-100 text-1.8xl font-semibold ">
        <div className="drawer-heading">Module</div>
        {/* <div className="">Module</div>
        <IconInfo /> */}
      </div>
      <div className="h2"></div>
      <div className="w-full border-b-[0.1vh] border-primary-700/40" />
      <div className="h2"></div>
      {/* <DataInput opt="mod" labelname="Manufacturer" data={manufactureoptions} wordEntered={wordEntered} setWordEntered={setWordEntered}/>
      <div className="h2"></div>
      <DataInput opt="mod" labelname="Name" data={nameoptions} wordEntered={wordEntered2} setWordEntered={setWordEntered2} />    
      <div className="h2"></div> */}
      <button className="light-sm-btn float-right" onClick={()=>dispatch(setModuleOpen(!showModuleBox))} > {showModuleBox?"Close":"Show"}</button>
      <div className="h6"></div>
    </>
  )
}

export default Module
