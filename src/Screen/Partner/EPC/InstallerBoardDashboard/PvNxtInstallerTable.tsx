import { AgGridReact } from 'ag-grid-react'
import React from 'react'
import { Link } from 'react-router-dom'
const OwnInstallerTable:React.FC<TableProps> = ({data})=>{

    const renderViewList=()=>{
        return (
        <div className="w-fit h-fit flex justify-between items-center">
            <Link to="/Partner/Projects" className="underline hover:scale-105 GenericTableIcons">View</Link>
        </div>
        )
    }

     const colDefs:any = [];
     Object.keys(data[0]).map((el,idx)=>{        
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
        <div className="w-full h-[65vh] ag-theme-alpine" style={{ overflow: 'auto' }}>
        <AgGridReact rowSelection={"multiple"} gridOptions={gridOptions} rowData={data.map(el=> ({...el}))} columnDefs={colDefs} defaultColDef={defaultColDef} animateRows={true} pagination={true}/>
        </div>
        </>
    )
}
export default OwnInstallerTable

interface DataType {
    index:number,
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


