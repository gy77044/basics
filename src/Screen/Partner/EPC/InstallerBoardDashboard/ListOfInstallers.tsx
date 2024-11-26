import React, { useState } from 'react'
import {v4 as uuidv4} from "uuid"
import Thumbnail from  "../../../../assests/img/Dashboard/EPC/Thumbnail.png"
import { GoldStarIcon, GreyStarIcon, LocationIcon, MailIcon, TeliPhoneOcon, TimerIcon } from '../../../../assests/icons/Icons'
import "./style.css"
const ListOfInstallers = ()=>{
    const [installersList,setInstallerList] = useState([
        {
            id:uuidv4(),
            installerName:"Chaudhary Solar",
            projectsDone:"100+I&C Works Executed",
            location:"E-186 Sec 63, E Block, Sector 63, Noida,Hazratpur Wajidpur, Uttar Pradesh 201301",
            opens:"10 AM",
            closes:"10 AM",
            rating:"4.6"
        },
        {
            id:uuidv4(),
            installerName:"Chaudhary Solar",
            projectsDone:"100+I&C Works Executed",
            location:"E-186 Sec 63, E Block, Sector 63, Noida,Hazratpur Wajidpur, Uttar Pradesh 201301",
            opens:"10 AM",
            closes:"10 AM",
            rating:"3.5"
        },
        {
            id:uuidv4(),
            installerName:"Chaudhary Solar",
            projectsDone:"100+I&C Works Executed",
            location:"E-186 Sec 63, E Block, Sector 63, Noida,Hazratpur Wajidpur, Uttar Pradesh 201301",
            opens:"10 AM",
            closes:"10 AM",
            rating:"2"
        },
        {
            id:uuidv4(),
            installerName:"Chaudhary Solar",
            projectsDone:"100+I&C Works Executed",
            location:"E-186 Sec 63, E Block, Sector 63, Noida,Hazratpur Wajidpur, Uttar Pradesh 201301",
            opens:"10 AM",
            closes:"10 AM",
            rating:"1"
        },
        {
            id:uuidv4(),
            installerName:"Chaudhary Solar",
            projectsDone:"100+I&C Works Executed",
            location:"E-186 Sec 63, E Block, Sector 63, Noida,Hazratpur Wajidpur, Uttar Pradesh 201301",
            opens:"10 AM",
            closes:"10 AM",
            rating:"1"
        }
    ])


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




    return(
        <>
        {installersList.map(each=>(
            <>
        <div className="installer-assign">
                 <div className="checkbox-container">
                    <input type="checkbox" className="checkbox" name="" value=""/>
                 </div>
                 <div className="image-info-container">
                 <div>
                    <img src={Thumbnail} className="thumbnail" title='thumbnail' alt="thumbnail"/>
                 </div>
                    <div className="information">
                         <div className='installer-name'>{each.installerName}</div>
                         <div className="projects-done">{each.projectsDone}</div> 
                         <div className="location-container">
                            <div>
                           <LocationIcon/>
                            </div>
                           <div className="location">{each.location}</div>
                        </div>    
                        <div className="timing-container">
                            <div><TimerIcon/></div>
                            <div className="time-text">Opens <span className="open-time">{each.opens}</span> Closes <span className="close-time">{each.closes}</span></div>
                        </div> 
                        <div className="rating-container">
                            <div className="rating-text">{each.rating}</div>
                            <div className="stars-container">
                               {getTheStars(each.rating)}
                            </div>
                        </div>             

                    </div>

                 </div>
                <div className="contact-info">
                    <TeliPhoneOcon/>
                    <MailIcon/>
                </div>
        </div>
        <hr className="horizontal-line"/>
        </>
        ))}
        </>
    )
}


export default ListOfInstallers