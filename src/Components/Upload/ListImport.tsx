import React, { useState } from 'react';
import { CSVLink } from "react-csv";
import { uploadLeadsCsvData } from '../../Utils/Const';
import { IconClose } from '../../assests/icons/ModalIcons';
import DragNDrop from './DragNDrop';
import { BulkupLoadIcon } from '../../assests/icons/Icons';
import { toast } from 'react-toastify';
const ListImport = ({ uploadedData, setUploadedData, acceptType }: { uploadedData: File | null, setUploadedData: React.Dispatch<React.SetStateAction<File | null>>, acceptType: string }) => {
  const [uploadedFileName, setUploadedFileName] = useState<string>('');


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // uploaded=file
        const fileExtension = "." + file.name.split(".").slice(1).join(".").toLowerCase().trim();
        if (fileExtension !== acceptType) {
          return toast.error("File not valid.");
        }
        else {
          setUploadedFileName(files[0].name!);
          setUploadedData(files[0]);
        }
      }
    }
  }



  const handleRemoveFile = () => {
    setUploadedFileName('');
    setUploadedData(null);
  };

  return (
    <>
      <div className="bg-gray-50 text-center px-auto rounded  flex flex-col items-center justify-center cursor-pointer border-[0.2vh] border-gray-400 border-dashed mx-auto font-[sans-serif] w-full">
        <div className="py-6">
          <BulkupLoadIcon />
          <h4 className="text-base font-semibold text-gray-600">Drag and drop files here</h4>
        </div>
        <hr className="w-full border-gray-400 my-2" />
        <div className="py-6">
          <input type="file" id='uploadFile1' accept={acceptType} onChange={handleFileChange} className="hidden" />
          <label htmlFor="uploadFile1"
            className="block px-6 py-2.5 rounded text-gray-600 text-sm tracking-wider font-semibold border-none outline-none cursor-pointer bg-gray-200 hover:bg-gray-100">Browse
            Files</label>
          {uploadedFileName && <div className='px-6 py-2.5 rounded text-gray-600 text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-100 flex items-center gap-2 cursor-default'><span>{uploadedFileName}</span><button onClick={handleRemoveFile} type="button"><IconClose /></button></div>}
          <p className="text-xs text-gray-400 mt-4">{`${acceptType} Allowed.`}</p>
        </div>
        
      </div>

      {/* <div className='overflow-hidden'>
      <div><DragNDrop onFileChange={handleFileChange} uploadTitle={"Drag files here or click here to import items."} subTitle='Supported file types are: .CSV, .DOCX' fileSize={"10MB"} acceptfile=".csv,.docx" /></div>
      {uploadedFileName && (
        <div className="mt-2 flex justify-center items-center text-primary-200 bg-primary-700/40 p-1 rounded-default w-fit">
          <div className="font-semibold text-1.4xl leading-[2.8vh] t">{uploadedFileName}</div>
          <button className="ml-2 text-red-500 hover:text-red-700" onClick={handleRemoveFile}>
            <IconClose />
          </button>
        </div>
      )}
      <div className="h2"></div>
      <div className='text-1.6xl leading-[3.2vh] font-medium text-yellow-100 '>Note :-</div>
      <ul className='space-y-[1vh]'>
        <li className='text-1.6xl leading-[1.2vh] font-medium text-primary-200/80 text-wrap'>• For an example of a properly formatted CSV file, download one of our CSV templates. </li>
        <li className='text-1.6xl leading-[1.2vh] font-medium text-primary-200/80'>• Please download csv template <CSVLink data={uploadLeadsCsvData} filename="pvNXT_Template.csv"><span className='text-blue-200 line-btn'>here</span></CSVLink></li>
      </ul>
    </div> */}
     <div className="h2"></div>
      <div className='label-box1 '>Note :-</div>
      <ul className='space-y-[1vh]'>
        <li className='label-box1'>• For an example of a properly formatted CSV file, download one of our CSV templates. </li>
        <li className='label-box1'>• Please download csv template <CSVLink data={uploadLeadsCsvData} filename="pvNXT_Template.csv"><span className='text-blue-300 line-btn underline'>here</span></CSVLink></li>
      </ul>
    </>

  )
}

export default ListImport