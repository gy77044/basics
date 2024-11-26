import { useState } from 'react';
import NewRadioButton from '../../../../Components/New/RadioButton/NewRadioButton';

export default function MiscellaneousDesign() {

    const WalkwayRadioList = [
        { labelName: "Yes", name: "Yes" },
        { labelName: "No", name: "No" },

    ];

    const LifelineRadioList = [
        { labelName: "Yes", name: "Yes" },
        { labelName: "No", name: "No" },

    ];

    const FireRadioList = [
        { labelName: "Yes", name: "Yes" },
        { labelName: "No", name: "No" },

    ];

    const MonitoringRadioList = [
        { labelName: "Yes", name: "Yes" },
        { labelName: "No", name: "No" },

    ];

    const ModuleCleaningRadioList = [
        { labelName: "Yes", name: "Yes" },
        { labelName: "No", name: "No" },

    ];

    const [miscellaneousDesignDetails,setMiscellaneousDesign] = useState({
        walkway:"No",lifeLine:"No",fireFlighting:"No",monitoring:"No",moduleCleaning:"No"
    })

    const handleTheMiscellaneousDesignRadio = (event:any,name:string)=>{
      
        setMiscellaneousDesign(prev=>({...prev,[name]:event.target.value}))
    }

    return (
        <div className="body-main">
            {/* Safety Infrastructure */}
            <div className="drawer-main">
                <div className="drawer-section">
                    Safety Infrastructure
                </div>
                <div className="section-body">
                    <div className='radio-main'>
                        <div className='section-label'>
                            Do you need walkway on the roof ? <span className="text-red-100 font-normal">*</span>
                        </div>
                        <div className='radio-body'>
                            {
                                WalkwayRadioList.map((item,i) => {
                                    return (<>
                                        <NewRadioButton   value={item.name} key={i} name={"walkway"} labelname={item.labelName} selectedOption={miscellaneousDesignDetails.walkway} onClick={(e:any)=>handleTheMiscellaneousDesignRadio(e,"walkway")}/>
                                    </>)
                                })
                            }
                        </div>
                    </div>
                    <div className='radio-main'>
                        <div className='section-label'>
                            Do you need lifeline on the roof ? <span className="text-red-100 font-normal">*</span>
                        </div>
                        <div className='radio-body'>
                            {
                                LifelineRadioList.map((item,i) => {
                                    return (<>
                                        <NewRadioButton   value={item.name} key={i} selectedOption={miscellaneousDesignDetails.lifeLine} onClick={(e:any)=>handleTheMiscellaneousDesignRadio(e,"lifeLine")} name={"lifeLine"} labelname={item.labelName} />

                                    </>)
                                })
                            }
                        </div>
                    </div>
                    <div className='radio-main'>
                        <div className='section-label'>
                            Do you need fire fighting system ? <span className="text-red-100 font-normal">*</span>
                        </div>
                        <div className='radio-body'>
                            {
                                FireRadioList.map((item, i) => {
                                    return (<>
                                        <NewRadioButton   value={item.name}  key={i} selectedOption={miscellaneousDesignDetails.fireFlighting} onClick={(e:any)=>handleTheMiscellaneousDesignRadio(e,"fireFlighting")} name={"fireFlighting"} labelname={item.labelName} />

                                    </>)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Monitoring System */}
            <div className="drawer-main">
                <div className="drawer-section">
                    Monitoring System
                </div>
                <div className="section-body">
                    <div className='radio-main'>
                        <div className='section-label'>
                            Do you need monitoring system ? <span className="text-red-100 font-normal">*</span>
                        </div>
                        <div className='radio-body'>
                            {
                                MonitoringRadioList.map((item,i) => {
                                    return (<>
                                        <NewRadioButton   value={item.name} selectedOption={miscellaneousDesignDetails.monitoring} onClick={(e:any)=>handleTheMiscellaneousDesignRadio(e,"monitoring")} key={i} name={"monitoring"} labelname={item.labelName} />

                                    </>)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Module Cleaning System */}
            <div className="drawer-main">
                <div className="drawer-section">
                    Module Cleaning System
                </div>
                <div className="section-body">
                    <div className='radio-main'>
                        <div className='section-label'>
                            Do you need module cleaning system ? <span className="text-red-100 font-normal">
                                *
                            </span>
                        </div>
                        <div className='radio-body'>
                            {
                                ModuleCleaningRadioList.map((item,i) => {
                                    return (<>
                                        <NewRadioButton value={item.name} selectedOption={miscellaneousDesignDetails.moduleCleaning} onClick={(e:any)=>handleTheMiscellaneousDesignRadio(e,'moduleCleaning')} key={i} name={"moduleCleaning"} labelname={item.labelName} />

                                    </>)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
