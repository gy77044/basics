import { AxiosResponse } from "axios";
import parsePhoneNumberFromString from "libphonenumber-js";
import React, { useState } from "react";
import { ParsedCountry, PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { toast } from 'react-toastify';
import { Button } from "../../../../../Components/AllButton/AllButtons.tsx";
import { Input } from "../../../../../Components/AllInput/AllInput";
import FormModal from '../../../../../Components/New/Modal/FormModal';
import ListImport from '../../../../../Components/Upload/ListImport';
import { setModalHeaderFooter } from "../../../../../ReduxTool/Slice/CommonReducers/CommonReducers";
import { OwnleadT } from '../../../../../ReduxTool/Slice/Partner/EPC';
import { useAppDispatch, useAppSelector } from "../../../../../ReduxTool/store/hooks";
import { APIResponse, isValidName } from '../../../../../Utils/Const';
import { validEmail } from '../../../../../Utils/Regex';
import { baseURL, requestUrl } from '../../../../../Utils/baseUrls';
import LeadProjectsTable from '../LeadProjectsTable';


const OwnLeads = () => {
  const [uploadedData, setUploadedData] = useState<File | null>(null);
  const {
    user: { userid, epcid },
  } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch()
  const [modal, setModal] = useState({
    InstallerAssignemnt: false,
    saveLead: false,
    bulkUpload: false,
    document: false,
    overview: false,
  });
  const formInitialValues = {
    projectCost: "",
    projectid: "",
    projectName: "",
    RoofAnalysisCompleted: false,
    userid: "",
    createddt: "",
    projecttype: "",
    emailid: "",
    address: "",
    mobile: "",
    country: {} as ParsedCountry,
    fname: "",
    lname: "",
    mobileValid: false,
  };
  const [customerDetails, setCustomerDetails] =
    useState<OwnleadT>(formInitialValues);
  const [isGridUpdate, setIsGridUpdate] = useState(0);
  const [error,setError] = useState({}as any)

  const handleInputField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
  
    if (name === "mobile" && value.length > 10) {
      return
    }
    else if (value===""){
      setCustomerDetails(prev => ({ ...prev, [name]: event.target.value }))
    }
    else if (name==="fname" || name==="lname"){
      isValidName(value) && setCustomerDetails(prev => ({ ...prev, [name]: event.target.value }))

    }
    else {
      setCustomerDetails(prev => ({ ...prev, [name]: event.target.value }))
    }

    if(error){
      setError((prev:any)=>({...prev,[name]:null}));
    }
  };

  const isPhoneNumberValid = async (phoneNumber: any, countryCode: any) => {
    try {
      const parsedNumber = parsePhoneNumberFromString(phoneNumber, countryCode);
      return parsedNumber ? parsedNumber.isValid() : false;
    } catch (error) {
      return false; // Handle parsing errors
    }
  };

  const validateNewLeadForm = () => {
    let isValid = true;
    const errors: Record<string, string> = {};
    const validations = [
        { field: "fname", condition: !customerDetails.fname, message: "First name is Required" },
        { field: "lname", condition: !customerDetails.lname, message: "Last name is Required" },
        { field: "emailid", condition: !customerDetails.emailid, message: "Email id is Required" },
        { field: "mobile", condition: !customerDetails.mobile.replace(`+${customerDetails.country?.dialCode}`,"") || !customerDetails.mobileValid, message: !customerDetails.mobile.replace(`+${customerDetails.country?.dialCode}`,"")?"Mobile No. is Required":"Mobile No. is Not Valid" },
        { field: "address", condition: !customerDetails.address, message: "Address is Required" },
    ]

    for (const { field, condition, message } of validations) {
      if (condition) {
        errors[field] = message;
        isValid = false;
      }
    }
    if (Object.keys(errors).length > 0) {
      setError(errors);
    };
    return isValid;
  };


  const handleAddNewLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateNewLeadForm()) {
      try {
        const reqBody = {
          fname: customerDetails.fname,
          lname: customerDetails.lname,
          customeraddress: customerDetails.address,
          customermobile: customerDetails.mobile.replace(
            `+${customerDetails.country?.dialCode}`,
            ""
          ),
          customeremail: customerDetails.emailid,
        };
        const { data }: AxiosResponse<APIResponse<any>> = await baseURL.post(
          requestUrl.saveEPCLeads + epcid,
          reqBody
        );
        if (data.code === "200") {
          customerDetails.userid = userid;
          toast.success(data.message);
          setCustomerDetails(formInitialValues);
          setIsGridUpdate((prev) => prev + 1);
          setModal((prev) => ({ ...prev, ["saveLead"]: false }));
        } else {
          toast.error(data.message);
        }
      } catch (err: any) {
        toast.error(
          err.response?.data.message ??
          "There was an issue. Please try again later."
        );
      }
    }
  };
  /*********************Handle Modals Controller *********************************/
  const modalHandler = (modalType: string) => {
    if (modalType==="saveLead"){
      setCustomerDetails({ projectCost: "",projectid: "",projectName: "",RoofAnalysisCompleted: false,userid: "",createddt: "",projecttype: "",emailid: "",address: "",mobile: "",country: {} as ParsedCountry,fname: "",lname: "",mobileValid: false,})
    }
    setModal((prev) => ({
      ...prev,
      [modalType]: !prev[modalType as keyof object],
    }));
    let modalHeaderFooter = {title:"",btnTxt:"",secondaryBtnTxt:""}
    switch(modalType){
      case "saveLead":
        modalHeaderFooter ={title:"Register New Lead",btnTxt:"Save Lead",secondaryBtnTxt:""}
        break;
      case "bulkUpload":
        modalHeaderFooter ={title:"Upload Bulk List",btnTxt:"Import List",secondaryBtnTxt:""}
          break;
      default:
        break  
    }
    setError({});

    dispatch(setModalHeaderFooter(modalHeaderFooter));
  };
  const uploadBulkLeads = async (e:any) => {
    e.preventDefault();
    if (!uploadedData) {
      toast.error("CSS File is Required.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("files", uploadedData as File);
      const { data }: AxiosResponse<APIResponse<string>> = await baseURL.post(
        requestUrl.uploadBuldOwnLead + epcid,
        formData
      );
      if (data.code === "200") {
        setModal((prev) => ({ ...prev, ["bulkUpload"]: false }));
        toast.success(data.message);
        setIsGridUpdate((prev) => prev + 1);
      }
    } catch (err: any) {
      toast.error(
        err.response?.data.message ??
        "There was an issue. Please try again later."
      );
    }
  };

  const handleMobileNumber = async (value: string, country: ParsedCountry) => {
    const isValid = await isPhoneNumberValid(value, country.dialCode);
    setCustomerDetails({
      ...customerDetails,
      mobile: value,
      country: country,
      mobileValid: isValid,
    });
    if (error){
      setError((prev:any)=>({...prev,mobile:null}));
    }
  };


  const NewRegistrationForm = () => (
    <>
      <div className="form-container">
        <Input isRequired error={error.fname} id={"fname"} label={"First Name"} name={"fname"} value={customerDetails.fname} type="text" onChange={handleInputField} />
        <Input isRequired error={error.lname} id={"lname"} label={"Last Name"} name={"lname"} value={customerDetails.lname} type="text" onChange={handleInputField} />
        <Input isRequired error={error.emailid} id={"emailid"} label={"Email"} name={"emailid"} value={customerDetails.emailid} type="email" onChange={handleInputField} />
        <div className="main-box1 group relative">
          <label htmlFor="input11" className={`label-box1 ${error.mobile && "label-error"}`}>Mobile <span className="text-rose-400 text-lg pl-0.5">* </span></label>
          <PhoneInput defaultCountry="in" name="mobile" required={true} value={customerDetails.mobile} forceDialCode={true} inputProps={{ name: "phone", required: true, autoComplete: 'off' }} onChange={(phone, { country }) => handleMobileNumber(phone, country)} placeholder="mobile" className={`signupmobile ${error.mobile?'error':''} w-full`} />
          {error.mobile && <span className={`helper-box1 opacity-100 ${error.mobile ? "text-rose-400" : ""}`}>{error.mobile}</span>}

        </div>
      </div>
        <div className="w-full">
        <Input isRequired  error={error.address} id={"address"} label={"Project Address"} name={"address"} value={customerDetails.address} type="text" onChange={handleInputField} />
        </div>
    </>
  );

  return (
    <>
      {modal.saveLead && <FormModal overflow={false} modalSize="md" name="saveLead" btnTitle="Save Lead" headerTitle={"Register New Lead"} onSubmit={handleAddNewLead} children={NewRegistrationForm()} closeModal={() => modalHandler("saveLead")}/>}
      {modal.bulkUpload && <FormModal modalSize="lg" name="bulkUpLoad" btnTitle="Import List" headerTitle="Upload Bulk List" onSubmit={uploadBulkLeads} className="bulkupload" children={<ListImport uploadedData={uploadedData} setUploadedData={setUploadedData} acceptType=".csv"/>} closeModal={() => modalHandler("bulkUpload")}/>}
      <div className="xl:w-full px-8 py-8">
      <div className="flex-start mb-4">
        <Button className="btn btn-sm-primary" onClick={() => modalHandler("saveLead")} name="Register New Lead" />
        <Button className="btn btn-sm-outlineprimary" onClick={() => modalHandler("bulkUpload")} name="Bulk Upload" />
      </div>
        <LeadProjectsTable leadsType="ownLeads" isGridUpdate={isGridUpdate} />
      </div>
    </>
  );
};

export default OwnLeads;
