import React, { ChangeEvent, useState } from 'react'
import NewInput from '../../../../Components/New/Input/NewInput';
import FileUpload from '../../../../Components/Upload/FileUpload';
import { IconNoteAdd } from '../../../../assests/icons/MapToolsIcons';
import { IconCloudUpload, IconInfo } from '../../../../assests/icons/DrawerIcons';

const CompanyModal=({companyData,handleChanges}:{companyData:any,handleChanges:(e: ChangeEvent<HTMLInputElement>) => void})=> {
  const [selectedInnerOption,setselectedInnerOption]=useState("");
  const addNewRow = () =>{

  }
  return (
    <>
    <div className="h4"></div>
      <div className="flex justify-center items-start space-x-[6vh]">
        <div className="flex flex-col space-y-[4vh] w-[34vh]">
          <NewInput
            id={"companyUID"}
            labelname={"Company Unique ID"}
            name={"companyUID"}
            value={companyData.companyUID}
            type="text"
            onChange={handleChanges}
            star={false}
             icon={<IconInfo />}
            disabled={true}
          />
          <div className="h2"></div>
          <NewInput
            id={"companyEmail"}
            labelname={"Company Email"}
            name={"companyEmail"}
            value={companyData.companyEmail}
            type="text"
            onChange={handleChanges}
            star={true}
             icon={<IconInfo />}
          />
          <div className="h4"></div>
          <NewInput
            id={"noofInstaller"}
            labelname={"No of Installer"}
            name={"noofInstaller"}
            value={companyData.noofInstaller}
            type="number"
            onChange={handleChanges}
            star={true}
             icon={<IconInfo />}
          />
        </div>
        <div className="flex flex-col space-y-[4vh] w-[34vh]">
          <NewInput
            id={"companyName"}
            labelname={"Company Name"}
            name={"companyName"}
            value={companyData.companyName}
            type="text"
            onChange={handleChanges}
            star={true}
             icon={<IconInfo />}
          />
          <div className="h2"></div>
          <NewInput
            id={"companyMobile"}
            labelname={"Company Mobile"}
            name={"companyMobile"}
            value={companyData.companyMobile}
            type="text"
            onChange={handleChanges}
            star={true}
             icon={<IconInfo />}
          />
          {/* <NewInput
            id={"companyRegNo"}
            labelname={"Company Registration Number"}
            name={"companyRegNo"}
            value={companyData.companyRegNo}
            type="text"
            onChange={handleChanges}
            star={true}
             icon={<IconInfo />}
          /> */}
            <div className="h2"></div>
          <div>
            <div className="section-label leading-[2vh]">
              Upload Document
              <span className="text-red-100 font-normal"> *</span>
            </div>
            <div><label htmlFor="uploadCRC" className='light-lg-btn'><IconCloudUpload/>Company Registration Certificate</label><input type="file" className='hidden' id="uploadCRC" accept='.pdf' /></div>
            
            {/* <FileUpload btnLabel="Registration Certificate" acceptType=".pdf" /> */}
          </div>
          {/* <div className={`${selectedInnerOption === "Yes" ? "block" : "hidden"}`}>
            <div className="h1"></div>
            <div className="section-label">
              DIPP Registration Certificate (.jpg | .pdf) upto 100 kb
            </div>
            <div className="h5"></div>

            <FileUpload btnLabel="Document" acceptType=".pdf" />
          </div> */}
        </div>
        <div className="flex flex-col space-y-[4vh] w-[34vh]">
          <NewInput
            id={"contactPersonName"}
            labelname={"Contact Person Name"}
            name={"contactPersonName"}
            value={companyData.contactPersonName}
            type="text"
            onChange={handleChanges}
            star={true}
             icon={<IconInfo />}
          />
          <div className="h2"></div>
          <NewInput
            id={"companyAddress"}
            labelname={"Company Address"}
            name={"companyAddress"}
            value={companyData.companyAddress}
            type="number"
            onChange={handleChanges}
            star={true}
             icon={<IconInfo />}
          />

          <div
            className={`${selectedInnerOption === "Yes" ? "block" : "hidden"}`}
          >
            <div className="h1"></div>
            <div className="section-label">
              DIPP Registration Certificate (.jpg | .pdf) upto 100 kb
            </div>
            <div className="h5"></div>

            {/* <FileUpload btnLabel="Document" acceptType=".pdf" /> */}
          </div>
        </div>
      </div>
      <div className="h2"></div>
      <div className="table-main">
        {/* <div className="table-name">
          <button className="dark-md-btn" onClick={addNewRow}>
            <IconNoteAdd />
            Add New Installer
          </button>
        </div> */}
        <table className="table">
          <thead className="thead">
            <tr>
              <th className="hvalue">Installer ID</th>
              <th className="hvalue">Name</th>
              <th className="hvalue">Address</th>
              <th className="hvalue">Mobile</th>
              <th className="hvalue">Email</th>
              <th className="hvalue">Qualification</th>
              <th className="hvalue">Photo</th>
              <th className="hvalue">ID Proof</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: companyData.noofInstaller }, (_, index) => (
              <tr key={index} className="trow">
                <td className="rheading">-</td>
                <td className="rvalue">-</td>
                <td className="rvalue">-</td>
                <td className="rvalue">-</td>
                <td className="rvalue">-</td>
                <td className="rvalue">
                  <label
                    htmlFor={`uploadDoc-${index}`}
                    className="text-primary-200 underline"
                  >
                    Upload Document
                    <input
                      type="file"
                      className="hidden"
                      id={`uploadDoc-${index}`}
                    />
                  </label>
                </td>
                <td className="rvalue">
                  <label
                    htmlFor={`uploadPhoto-${index}`}
                    className="text-primary-200 underline"
                  >
                    Upload Photo
                  </label>
                  <input
                    type="file"
                    className="hidden"
                    id={`uploadPhoto-${index}`}
                  />
                </td>
                <td className="rvalue">
                  <label
                    htmlFor={`uploadID-${index}`}
                    className="text-primary-200 underline"
                  >
                    Upload ID Proof
                    <input
                      type="file"
                      className="hidden"
                      id={`uploadID-${index}`}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default CompanyModal