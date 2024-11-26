
import { useState } from 'react'
import { v4 as uuidv4 } from "uuid"
import { GoldStarIcon, GreyStarIcon, LocationIcon, MailIcon, TeliPhoneOcon, TimerIcon } from '../../../../../assests/icons/Icons'
import Thumbnail from "../../../../../assests/img/Dashboard/EPC/Thumbnail.png"
import "../style.css"
import NewInput from '../../../../../Components/New/Input/NewInput'
import { IconInfo } from '../../../../../assests/icons/DrawerIcons'
import NewAccordion from '../../../../../Components/New/Accordion/NewAccordion'
import { Accordion1 } from '../PvnxtLeads/PvNxtLeads'



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
            <div className="contact-and-remove-container">
                <div className="contact-info">
                    <TeliPhoneOcon/>
                    <MailIcon/>
                </div>
               <div>
                <button type="button" className="light-sm-btn">Remove Installer</button>
               </div>
            </div>
            </div>
        </div>
    )
}

const InstallerAssignemntModal = ()=>{
    return (
        <div className='w-[50vw] space-y-4'> 
            {/* <Accordion1 headName="Project Information" children={OverviewInfo()} open={true}/> */}
           <Accordion1 headName='Accepted Installer' children={<AcceptedInstaller/>} open={true}/>
           <Accordion1 headName='List of Installers' children={<ListOfInstallers/>}/>
        </div>
    )
}

export default InstallerAssignemntModal