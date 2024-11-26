import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NewModal } from "../../../../Components/New/Modal/NewModal";
import ComingSoon from "../../../../Components/ComingSoon/ComingSoon";
const EPCPanelCard = ({name,btnName,pageRoute,boardContent,boardImg}:{name:string,btnName:string,pageRoute:string, boardContent:string,boardImg: string}) => {
  const [isClose,setIsCLose]=useState(false);
  const sesetIsCLose = (e:any)=>{
    e.preventDefault()
      setIsCLose(prev => !prev)
  }
  return (
    <div className="flex w-fit border-[0.2vh] border-grey-700">
      <div className="flex-1"><img className="w-full h-full" src={boardImg} alt="" /></div>
      <div className="flex-1 p-2 border-l-[0.1vh] border-grey-700">
        <div className="flex flex-col gap-2 justify-evenly h-full">
          <div className="text-primary-200 font-semibold ">{name}</div>
          <div className="text-1.4xl font-normal text-primary-400 leading-[1.5vh]">{ boardContent}</div>
           {pageRoute ? 
           <Link to={pageRoute}>
            <button className="dark-lg-btn">{btnName}</button></Link> 
            :  
            <button className="dark-lg-btn" onClick={sesetIsCLose}>{btnName}</button>} 
          {isClose && <NewModal btnName="" children={<ComingSoon />} setIsCLose={setIsCLose} name="" onClick={sesetIsCLose}/>} 
        </div>
      </div>
    </div>
  );
};
export default EPCPanelCard;