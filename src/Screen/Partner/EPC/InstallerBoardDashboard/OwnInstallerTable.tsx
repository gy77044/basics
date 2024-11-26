import { AgGridReact } from 'ag-grid-react'
import React, { useState } from 'react'
import { NewModal } from '../../../../Components/New/Modal/NewModal'
import { setModalHeaderFooter } from '../../../../ReduxTool/Slice/CommonReducers/CommonReducers'
import { useAppDispatch } from '../../../../ReduxTool/store/hooks'
import RegisterNewInstallerCompany from './RegisterNewInstallerCompany'
const OwnInstallerTable:React.FC<TableProps> = ({data})=>{
    const dispatch = useAppDispatch()

    const [toggleBOQIModal,setToggleBOQIModal] = useState(false)


     const handleTheBOQModal = ()=>{
              setToggleBOQIModal(prev=>!prev)
     }

     const OpenTheBOQModal = ()=>{
        setToggleBOQIModal(true)
        dispatch(setModalHeaderFooter({title:"Update Installer",btnTxt: "Archive",secondaryBtnTxt:"Update" }))
}




    const renderViewList=()=>{
        return (
        <div className="w-fit h-fit flex justify-between items-center">
            {/* <Link to="#" className="underline hover:scale-105 GenericTableIcons">View</Link> */}
            <div className="underline hover:scale-105 GenericTableIcons">
                <button type="button" onClick={OpenTheBOQModal}>Edit/Archive</button>
            </div>
        </div>
        )
    }

     const colDefs:any = [];
    //  Object.keys(data[0])
     ['InstallerId','Name','Address','Mobile','Email','RegistrationDate','Qualification','Photo&IDProof','TrainingStatus','Action'].map((el,idx)=>{        
        if(idx == 0){
            colDefs.push({ headerName: el, field:el, sortable: true,headerClass: 'gridtable-header',maxWidth:90 })
        }else if(el === 'Action'){
            colDefs.push({ headerName: el, field:el, sortable: true,headerClass: 'gridtable-header',cellRenderer:renderViewList})
        }else{
            colDefs.push({ headerName: el, field:el, sortable: true,headerClass: 'gridtable-header'})
        }
    })
     
     const defaultColDef: any = {
        sortable: true,
        resizable: true,
        filter: true,
        flex: 1,
        minWidth: 120,
      };
 
      const gridOptions = {
        rowHeight:60,
        rowClass:"custom_css_agGrid"
      }
 
     
 
    return (
        <>
        {toggleBOQIModal && <NewModal onClick={handleTheBOQModal} setIsCLose={handleTheBOQModal} name="" btnName=''  children={<RegisterNewInstallerCompany/>} /> }
        <div className="w-full h-[65vh] ag-theme-alpine" style={{ overflow: 'auto' }}>
        {data.length && <AgGridReact rowSelection={"multiple"} gridOptions={gridOptions} rowData={[]} columnDefs={colDefs} defaultColDef={defaultColDef} animateRows={true} pagination={true}/>}
        </div>
        </>
    )
}
export default OwnInstallerTable

interface DataType {
    sno:number,
    CustomerID: string,
    CustomerName: string,
    Address: string,
    Mobile: string,
    Email: string,
    ConsumerType: string,
    LeadType: string,
    status:string,
    }
 
    interface TableProps{
        data:DataType[]
    }


