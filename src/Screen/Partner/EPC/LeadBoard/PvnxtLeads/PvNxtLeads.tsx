import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { IconAccordion1, IconAccordion2 } from '../../../../../assests/icons/Icons';
import { setMapToolActive } from '../../../../../ReduxTool/Slice/Map/MapReducer';
import { useAppDispatch, useAppSelector } from '../../../../../ReduxTool/store/hooks';
import { getActiveClass } from '../../../../../Utils/commonFunctions';
import LeadProjectsTable from '../LeadProjectsTable';
import RFPBidTableByAgGrid from './RFPBiddingLeads';
import Subscribed from './SubscribedLeads';
import { useLocation } from 'react-router-dom';
export const RFP_Submission_TAB = "RFP Submission";
export const RFP_Project_Management = "RFP Project Management";
export const Lead_Subscription_TAB = "Lead Subscription";
const PvNxtLeads = () => {
  const { user: { userid } } = useAppSelector(state => state.auth),{ state:defaultTabs } = useLocation();
  const [activeTab, setActiveTab] = useState("RFP Submission")
  const handleTheTab = (tabname: string) => {setActiveTab(tabname)}
  useEffect(()=> {if(defaultTabs) setActiveTab(defaultTabs)},[])
  let tabsComponent = [
    { tab: RFP_Submission_TAB, Component: <RFPBidTableByAgGrid /> },
    { tab: RFP_Project_Management, Component: <LeadProjectsTable leadsType='bidWonLeads' /> },
    { tab: Lead_Subscription_TAB, Component: <Subscribed activeTab={activeTab}/> },
  ];

  return (
    <>
    <div className="xl:w-full px-8 py-4">
        <div className="border-b border-gray-200">
          <ul className="-mb-px flex gap-6">
            {tabsComponent.map((item, index) => (
              <li className={`cursor-pointer ${getActiveClass(activeTab, item.tab, "tab-active")}`} key={index} onClick={() => { handleTheTab( item.tab) }}>
                {item.tab}
              </li>
            ))}
          </ul>
        </div>
        {tabsComponent.map((item, index) => <div className={`tabs-inactivebody ${getActiveClass(activeTab, item.tab, "tabs-activebody")} overflow-auto custom-scrollbar-css`} key={index}>{item.Component}</div>)}
      </div>
    </>
  )
}

export default PvNxtLeads

interface IAccordion {
  headName: string,
  attribute?: string
  open?: boolean | undefined
}

interface IAccordion2 {
  headName: string,
  attribute?: string
  open?: boolean | undefined
  mainRef: React.RefObject<HTMLDivElement>
}


export const Accordion1: React.FC<PropsWithChildren<IAccordion>> = ({ headName, children, attribute, open }) => {
  return (
    <>
      <details className="acc-details1 group" open={open}>
        <summary className="acc-summary1">
          <h2 className="heading-sm pb-2">
            {headName}
          </h2>
          <span className="acc-icon1">
            <IconAccordion1 />
          </span>
        </summary>
        <div className="acc-body1">
          {children}
        </div>
      </details>
    </>

  )
}
export const Accordion2: React.FC<PropsWithChildren<IAccordion2>> = ({mainRef, headName, children, attribute, open }) => {
  const { maptoolactivename } = useAppSelector(state => state.mapref)
 
  const childRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch();
  const handleSwicthingTabs = () => {
    console.log(mainRef,childRef)
    if(headName === maptoolactivename){
      dispatch(setMapToolActive(''))
    } else {
      dispatch(setMapToolActive(headName as any))
    }
  }


  const outsideHandler = (e:MouseEvent) =>{
  if(mainRef.current&&childRef.current&&!mainRef.current.contains(e.target as Node)&&!childRef.current.contains(e.target as Node)){
    dispatch(setMapToolActive(''))
  }
  }
  useEffect(()=>{
document.addEventListener("mousedown",outsideHandler);
return () =>{
  document.removeEventListener("mousedown",outsideHandler)
}
  },[])


  return (
    <>
      <div className="acc-details2 group"  >
        <summary className="acc-summary2">
          <h2 className="para-sm"> {headName} </h2>
          <span className={`acc-icon2 cursor-pointer  hover:bg-gray-300   ${headName === maptoolactivename?"rotate-45 bg-gray-300":""}`} onClick={() => handleSwicthingTabs()}><IconAccordion2 /></span>
        </summary>
        <div ref={childRef} className="acc-body2 mt-0" style={{ display: headName === maptoolactivename ? 'block' : 'hidden', height: headName === maptoolactivename ? '40vh' : '0vh' }}>{children}</div>
      </div>
    </>

  )
}