import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import RegisterNewTrainingModal from './RegisterNewTrainingModal';
import { useAppDispatch, useAppSelector } from '../../../../ReduxTool/store/hooks';
import { setCardTitle } from '../../../../ReduxTool/Slice/Dashboard/DashboardReducer';
import { setModalHeaderFooter } from '../../../../ReduxTool/Slice/CommonReducers/CommonReducers';
import { NewModal } from '../../../../Components/New/Modal/NewModal';
import { IconNoteAdd } from '../../../../assests/icons/MapToolsIcons';
import { getActiveClass, handleTabNavbars } from '../../../../Utils/commonFunctions';

interface DataType{
        TrainingCode:string,
        Name:string
        Description:string,
        AssessmentTestURL:string,
        CreatedOn:string,
        Status:string,
        Action:string
}

const TrainingAndSOPsMain = ()=>{
    const dispatch = useAppDispatch();
    const {activeCard} = useAppSelector(state=>state.dashboard)
    const [toggleModal,setToggleModal] = useState(false)

    const RenderTheTrainingContent = ()=>{
        return (
            <div>
                we need to add Files here
            </div>
        )
    }



    const data:DataType[] = [
        {TrainingCode:"EL-PNT-101",
        Name:"Basics of solar electrical",
        Description:"The training provides basics of solar electrical engineering.",
        AssessmentTestURL:"https://example.com/assessment",
        CreatedOn:"16 Sept, 2023",
        Status:"Active",
        Action:"Edit/Archive"}
    ]

    const colDefs:any = [
        { headerName: "Training Code", field:"TrainingCode", sortable: true,headerClass: 'gridtable-header' },
    { headerName: "Name", field:"Name", sortable: false,headerClass: 'gridtable-header' },
     { headerName: "Description", field:"Description", sortable: true,headerClass: 'gridtable-header' },
     { headerName: "Training Content", sortable: true,headerClass: 'gridtable-header',cellRenderer:RenderTheTrainingContent },
     { headerName: "Assessment Test URL", field:"AssessmentTestURL", sortable: false,headerClass: 'gridtable-header' },
     { headerName: "Created On", field:"CreatedOn", sortable: true,headerClass: 'gridtable-header' },
     { headerName: "Status", field:"Status",sortable: false,headerClass: 'gridtable-header',color:"green" },
     { headerName: "Action",  field:"Action",sortable: false,headerClass: 'gridtable-header'}
     ]

     const gridOptions = {
        rowHeight:60,
        rowClass:"custom_css_agGrid"
      }

      const defaultColDef: any = {
        sortable: true,
        resizable: true,
        filter: true,
        flex: 1,
        minWidth: 120,
      };
    useEffect(()=>{
      dispatch(setCardTitle("Traninig and SOPs"))
    },[])

      const handleOpenModal = (event:React.MouseEvent<HTMLButtonElement>)=>{
               dispatch(setModalHeaderFooter({title:"Register New Training & SOPs",btnTxt:"Save Training",secondaryBtnTxt:""}))
               setToggleModal(true)
      }

      const handleTheModalToggle  = ()=>{
        setToggleModal(false)
      }

    return (
      <>
      {toggleModal && <NewModal modalSize='md' name={"modal name"} btnName='Button Name' onClick={handleTheModalToggle} setIsCLose={()=>setToggleModal(false)} children={<RegisterNewTrainingModal/>} />}
        <div className="main-container">
        <div className="h2"></div>
        <div className="tabs-main">
          <ul className="tabs-content">
            <li className={`tabs ${getActiveClass(activeCard, "Traninig and SOPs", "active-tabs")}`} onClick={() => {handleTabNavbars(dispatch, "Traninig and SOPs")}}>
              Traninig and SOPs
            </li>
          </ul>
            <div className="p-2">
                <button type="button" onClick={handleOpenModal} className="dark-md-btn gap-[0.8vh]"><IconNoteAdd/>Register New Training Set</button>
            </div>
            <div className="w-[100%] flex justify-center">
            <div className="w-[98%] h-[20vh] ag-theme-alpine" style={{ overflow: 'auto' }}>
                <AgGridReact rowSelection={"multiple"} gridOptions={gridOptions} rowData={[]} columnDefs={colDefs} defaultColDef={defaultColDef} animateRows={true} pagination={true}/>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}


export default TrainingAndSOPsMain