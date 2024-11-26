import Papa from "papaparse"
import React, { useState } from 'react'


import { TableCheckBtn } from '../../../../../Components/AllInput/AllInput'
import ListImport from '../../../../../Components/Upload/ListImport'
const PDEPCDocumets = () => {
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedData, setUploadedData] = useState<File | null>(null);
  const headers = ["Name","Details"]
  const csvData = [["customername", "customeraddress", "customermobile", "customeremail",], ["test", "test", "test", "test",], ["test", "test", "test", "test",], ["test", "test", "test", "test"]];
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // console.log(results.data);
        },
      });
    }
  };
  const handleRemoveFile = () => {
    setUploadedFileName('');
  };


  return (
    <div className="w-full">
      <div className="justify-center items-center">
        <ListImport uploadedData={uploadedData} setUploadedData={setUploadedData} acceptType=".csv"/>
        {/* <DragNDrop onFileChange={handleFileChange} uploadTitle={"Drag files here or click here to import items."} subTitle='Supported file types are: .CSV, .DOCX' fileSize={"10MB"} /> */}
      </div>
      <div className="h2"></div>
      <TableCheckBtn tableCaption="Cost of Project" headers={headers} data={[]} />

      {/* <div className="">List of Documents</div>
      <div className="ag-theme-alpine my-1" style={{height:'20vh'}}>
      <AgGridReact rowData={uploadedData} gridOptions={gridOptions} columnDefs={colDefs} defaultColDef={defaultColDef}/>
      </div> */}
      {/* <div className="table-main">
        <div className="Lss-body-sideheading">List of Documents</div>

        <table className="table">
          <thead className="thead">
            <tr className="">
              {tableCols.map(each => {
                return (
                  <th key={each} className="hvalue">{each}</th>
                )
              })}
            </tr>
          </thead>
          {uploadedFileName.length > 0 ? <>
            <tbody>
              <tr className="trow">
                <td className="rvalue">{uploadedFileName}</td>
                <td className="rvalue text-center w-[15vh]">
                  <button type="button"><VisibleIcon /></button>
                  <button type="button" className=' mx-2'><CSVLink data={csvData} filename="template.csv"><DownloadIconDownArrow /></CSVLink></button>
                  <button type="button" onClick={handleRemoveFile}><DeleteIconRed /></button>
                </td>
              </tr>
            </tbody></> : <div className='text-primary-400 text-1.4xl font-medium p-1.4'>No Data Available</div>}
        </table>
      </div> */}
    </div>
  )
}


export default PDEPCDocumets
