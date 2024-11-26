import React, { useState } from 'react'
import DragNDrop from '../../../../Components/Upload/DragNDrop'
import { IconInfo } from '../../../../assests/icons/DrawerIcons'
import NewInput from '../../../../Components/New/Input/NewInput'


const  RegisterNewTrainingModal=()=> {
    const [registerDetails,setRegisterDetails] = useState({
        trainingCode:"",trainingName:"",description:"",assessmentTestUrl:""
    })

    const handleTrainingDetails=(event:React.ChangeEvent<HTMLInputElement>)=>{
        const {name} = event.target
            setRegisterDetails(prev=>({...prev,[name]:event.target.value}))
    }

  return (
    <>
    <div className="h2"></div>
    <div className="flex gap-[2vh]">
        <div className="flex-1">
            <DragNDrop/>
        </div>
        <div className="flex-1">
          <NewInput icon={<IconInfo/>} star={true} id="TrainingCode" labelname='Training Code' name="trainingCode" value={registerDetails.trainingCode} type="text" onChange={handleTrainingDetails} />
          <div className="h2"></div>
          <NewInput icon={<IconInfo/>} star={true} id="trainingName" labelname='Training Name' name="trainingName" value={registerDetails.trainingName} type="text" onChange={handleTrainingDetails} />
          <div className="h2"></div>
          <NewInput icon={<IconInfo/>} star={true} id="description" labelname='Description' name="description" value={registerDetails.description} type="text" onChange={handleTrainingDetails} />
          <div className="h2"></div>
          <NewInput icon={<IconInfo/>} star={true} id="assessmentTestUrl" labelname='Assessment Test URL' name="assessmentTestUrl" value={registerDetails.assessmentTestUrl} type="text" onChange={handleTrainingDetails} />
          <div className="h2"></div>
        </div>
    </div>
    </>
  )
}


export default RegisterNewTrainingModal