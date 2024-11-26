import Papa from "papaparse";
import React, { useState } from 'react';
import { TableCheckBtn } from '../../../../../Components/AllInput/AllInput';
import { LeadType } from '../../../../../ReduxTool/Slice/Partner/EPC';
export default function CustomerDocuments() {
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const [uploadedData, setUploadedData] = useState<LeadType[]>([]);
    const headers = ["Name","Details"]

    const csvData = [
       ["customername", "customeraddress", "customermobile","customeremail", ],
       ["test", "test", "test", "test",],
       ["test", "test","test", "test",],
       ["test", "test", "test", "test"]
     ];
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       const file = event.target.files?.[0];
       if (file) {
         setUploadedFileName(file.name);
         Papa.parse(file, {
           header: true,
           complete: (results) => {
            //  console.log(results.data);
           },
         });
       }
     };
    const handleRemoveFile = () => {
       setUploadedFileName('');
       // setUploadedData([]);
     };
  
  return (
    <>
     <TableCheckBtn tableCaption="Project Overview" headers={headers} data={[]} />
    </>
  )
}
