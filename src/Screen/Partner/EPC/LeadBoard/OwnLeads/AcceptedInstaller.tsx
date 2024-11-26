import React, { useState } from 'react'
import NewInput from '../../../../../Components/New/Input/NewInput'
import {v4 as uuidv4} from "uuid" 
import { IconInfo } from '../../../../../assests/icons/DrawerIcons'
import Thumbnail from "../../../../assests/img/Dashboard/EPC/Thumbnail.png"
import { GoldStarIcon, GreyStarIcon, LocationIcon, TimerIcon } from '../../../../../assests/icons/Icons'

const AcceptedInstaller = ()=>{

    const cardDetails =  {
        id:uuidv4(),
        installerName:"Chaudhary Solar",
        projectsDone:"100+I&C Works Executed",
        location:"E-186 Sec 63, E Block, Sector 63, Noida,Hazratpur Wajidpur, Uttar Pradesh 201301",
        opens:"10 AM",
        closes:"10 AM",
        rating:"4.0"
    }

    const [acceptedInstallerDetails,setAcceptedInstallerDetails] = useState({totalEstimatedTime:"",totalCostOfProject:""})

    const getTheStars = (rating:string)=>{
        const totalStars = 5
        const stars = []

        for (let i=0;i<totalStars;i++){
           if (i<parseInt(rating)){
               stars.push(  <GoldStarIcon/>)
           }
           else{
               stars.push( <GreyStarIcon/>)
           }
        }
        return stars
}



    const handleTheAcceptedInstaller=(e:any)=>{
        const {name} = e.target
        setAcceptedInstallerDetails(prev=>({...prev,[name]:e.target.value}))
    }





    return (
        <div className="accept-container">
            <div className="accept-input-container">
                <NewInput icon={<IconInfo/>} value={acceptedInstallerDetails.totalEstimatedTime} type="date" id="totalEstimatedTime" name="totalEstimatedTime" labelname='Total Estimated Time' star={true} onChange={handleTheAcceptedInstaller}  />
                <NewInput icon={<IconInfo/>} value={acceptedInstallerDetails.totalCostOfProject} type="text" id="totalCostOfProject" name="totalCostOfProject" labelname='Total I&C Cost of Project (in Rs.)' star={true} onChange={handleTheAcceptedInstaller}  />
            </div>
            <div className="card-container">
                <div className="image-info-container">
                    <div>
                        <img src={Thumbnail} alt="thumbnail" title='thumbnail' className="thumbnail" />
                    </div> 
                    <div className="information">
                       <div className="installer-name">{cardDetails.installerName}</div>
                       <div className="projects-done">{cardDetails.projectsDone}</div>
                       <div className='location-container'>
                            <LocationIcon/>
                            <div className="location">{cardDetails.location}</div>
                       </div>
                       <div className="timing-container">
                           <TimerIcon/>
                           <div className='time-text'>Opens <span className='open-time'>{cardDetails.opens}</span>Closes <span className="close-time">{cardDetails.closes}</span></div>
                       </div>
                       <div className="rating-container">
                        <div className="rating-text">{cardDetails.rating}</div>
                         <div className="stars-container">
                            {getTheStars(cardDetails.rating)}
                         </div>
                       </div>
                    </div>
                </div>
            </div>
            <div className="contact-and-remove-container">
                <div className="contact-info">
                </div>
            </div>
        </div>
    )
}


export default AcceptedInstaller