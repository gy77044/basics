import { IconPig, IconSheild } from "../../../../assests/icons/EPCIcons/LandingPage";
import Slider from "../../../../Components/Slider/Slider";
import EpcFinanceCard from "./EpcFinanceCard";
import EPCPanelCard from "./EPCPanelCard";
import leadImg from "../../../../assests/img/Dashboard/EPC/leadImg.png"
import installImg from "../../../../assests/img/Dashboard/EPC/installImg.png"
import fisrtINstaller from "../../../../assests/img/Dashboard/EPC/fisrtINstaller.png"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../ReduxTool/store/hooks";
import { baseURL, requestUrl } from "../../../../Utils/baseUrls";
import { changefirstTimeuserScreen, changehasSceenStatus } from "../../../../ReduxTool/Slice/Auth/AuthReducer";

 
export default function EPCDashBoardLandingPage() {
  const {user} = useAppSelector(state=>state.auth);
  const dispatch = useAppDispatch();
  useEffect(()=>{
    if ((user.hassceenlandingpage === null || user.hassceenlandingpage === false) && user.userid) {
      updateLandingScreenStatus();
    }
  },[]);
  const updateLandingScreenStatus = async() => {
    try{
      const {data} = await baseURL.put(`${requestUrl.auth}/hasscene/${user.userid}`);
      if (data.status === 200) {
        dispatch(changefirstTimeuserScreen(changehasSceenStatus(user.userid, true)))
      }
    }catch(err){
      console.log(err);
    }
  }
  return (
    <>
        <Slider />
        <div className="h-[57vh] flex flex-col pt-2 gap-6 overflow-auto">
          <div className="flex flex-col w-[96%] gap-4 m-auto flex-1 justify-between">
            <div className="text-primary-200 font-medium relative">Value Pools
              <span className="absolute -bottom-1 left-0 w-[6vh] border-b-[0.4vh] border-yellow-100"></span>
            </div>
            <p className="text-primary-400 font-medium ">An in-depth financial analysis of your solar energy potential, encompassing investment costs.</p>          
            <div className="flex items-center justify-between gap-8">
              <EpcFinanceCard icon={<IconSheild />} name={""} content={"Automation of routine tasks help reduce manual labour and the risk of human error."} header={"Operational Efficiency"} bgCss={"blue"} borderCss={"border-primary-800"}/>
              <EpcFinanceCard icon={<IconPig />} name={""} content={"Real-time updates and analytics allow for better monitoring of project progress, leading to timely interventions and adjustments."} header={"Improved Lead Tracking"} bgCss={"green"} borderCss={"border-primary-800"}/>
              <EpcFinanceCard icon={<IconSheild />} name={""} content={"Proactive decisions based on data analysis help you increase cost savings on every lead. "} header={"Data driven decision making"} bgCss={"blue"} borderCss={"border-primary-800"}/>
              <EpcFinanceCard icon={<IconPig />} name={""} content={"Realize the power of precision with pvNXT's accurate generation analysis tool for optimal solar power performance."} header={"Accurate Generation Analysis"} bgCss={"green"} borderCss={"border-primary-800"} />
              <EpcFinanceCard icon={<IconSheild />} name={""} content={"Unlock seamless teamwork and project synergy with our web-based tool. Share and get the work done sooner. "} header={"Enhanced Collaboration"} bgCss={"blue"} borderCss={"border-primary-800"} />
            </div>
          </div>
          <div className="bg-[#f5f7f7] flex-1 pt-2">
          <div className="flex flex-col justify-between w-[96%] m-auto" >
          <div className="text-primary-200 font-medium relative">Our Process
              <span className="absolute -bottom-1 left-0  w-[6vh] border-b-[0.4vh] border-yellow-100"></span>
          </div>
          <div className="flex gap-8 pt-2 flex-1">              
              <EPCPanelCard name={"For Lead Management"} btnName={"Lead Board"} boardContent={"Efficiently manage solar leads, driving renewable energy adoption with streamlined processes and enhanced outreach."} pageRoute="/Partner/LeadBoards" boardImg={leadImg}/>
              <EPCPanelCard name={"For Installer Management"} btnName={"Installer Board"} boardContent={"Empower your energy independence with seamless Solar application installer management. Efficiency meets sustainability effortlessly."} pageRoute="" boardImg={fisrtINstaller}/>
              <EPCPanelCard name={"For Training Management"} btnName={"Training & SOP"} boardContent={"Unlock solar potential with streamlined training & SOP management. Shine brighter with precision and proficiency."} pageRoute="" boardImg={installImg}/>  
            </div>
          </div>
        </div>
      </div>
    </>
  );
}