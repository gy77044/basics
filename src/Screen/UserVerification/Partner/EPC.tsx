import { AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { toast } from "react-toastify";
import { Input, InputRadio, InputUpload } from "../../../Components/AllInput/AllInput";
import MultiSelectPicker from "../../../Components/New/Select/MultiSelectPicker";
import { Option } from "../../../Components/Select/SelectType";
import { setepcid } from "../../../ReduxTool/Slice/Auth/AuthReducer";
import { setEpcFormData, setVerificationDetailsError } from "../../../ReduxTool/Slice/Auth/UserVerifyReducer";
import { EPCResponseTy, documentUserTy, } from "../../../ReduxTool/Slice/Auth/types";
import { FileData } from "../../../ReduxTool/Slice/Dashboard/dashboardTypes";
import { getDistrictListByStateID, getStateListByCountryID, setDistrictNameByStateID, } from "../../../ReduxTool/Slice/GeneralSlice/CountrySlice";
import { stateNameResponseTy } from "../../../ReduxTool/Slice/GeneralSlice/type";
import { useAppDispatch, useAppSelector } from "../../../ReduxTool/store/hooks";
import { APIResponse, TinputType, USER_TYPE_PARTNER } from "../../../Utils/Const";
import { baseURL, requestUrl } from "../../../Utils/baseUrls";
import { downloadFileFromApi, filterKeyIncludeArr, filterMultiListIncludeByArrList, getElementByIndex, getNameFromString, newgeneratedId, toTitleCase, useDebounce } from "../../../Utils/commonFunctions";
import { EPCFormType, EPCVerificationFormErrorTy } from "../UserTypeList";
import { specialCharRegex } from "../../../Utils/Regex";
export type epcDetailsType = {name: string, label: string, value?: string, error?: string | null, type: TinputType};
const epcTypeRadioList = [{ label: "Yes", value: "Yes" },{ label: "No", value: "No" },];
interface OptionType {value: string;label: string;};
const EPC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { statesList, districtsList } = useAppSelector((state) => state.CountrySlice);
  const { epcData,error } = useAppSelector((state) => state.UserVerifyReducer);
  const [selectedInnerOption, setSelectedInnerOption] = useState<string>("");
  const [registrationDoc, setRegistrationDoc] = useState<FileData[]>([]);
  const [startupDoc, setStartupDoc] = useState<FileData[]>([]);
  const getUserDetails = async (stateListRes: stateNameResponseTy[]) => {
    try {
      const { data }: AxiosResponse<APIResponse<EPCResponseTy>> = await baseURL.get(`${requestUrl.epcUserDetail}/${user.userid}`);
      const { data: docData }: AxiosResponse<APIResponse<documentUserTy[]>> = await baseURL.get(`${requestUrl.getUserDocument}/${user.userid}`);
      if (data.code == "200") {
        let registration = getElementByIndex(filterKeyIncludeArr(docData.responseData, "doctype", 0),0) as any;
        let startup = getElementByIndex(filterKeyIncludeArr(docData.responseData, "doctype", 1),0) as any;
        setRegistrationDoc([{name: getNameFromString(registration.docpath, /[/\\]/, 3),icon: "PDF",file: "registrationDoc",},]);
        if (startup) {
          setStartupDoc([{name: getNameFromString(startup.docpath, /[/\\]/, 3),icon: "PDF",file: "startupDoc",}]);
        }
        let resData = data.responseData,stateList = filterMultiListIncludeByArrList(stateListRes,"stateid",resData.serviceablestate);
        let { payload } = await dispatch(getDistrictListByStateID(resData.serviceablestate));
        let districtList = filterMultiListIncludeByArrList(payload,"districtid",resData.serviceabledistricts);
        let obj: EPCFormType = {
          ...epcData,
          userid: resData.userid[0],
          companyName: resData.companyname,
          companyId: resData.companyid,
          companyAddress: resData.companyaddress,
          cityname: districtList.map((el: any) => ({label: el.district,value: el.districtid})),
          statename: stateList.map((el: any) => ({label: el.state,value: el.stateid})),
          registrationNumber: resData.registrationnumber.toString(),
          isstartup: resData.isstartup,
          dippDoc:startup?.docpath??"",
          registrationDoc: registration?.docpath ?? "",
        };
        setSelectedInnerOption(obj.isstartup ? "Yes" : "No");
        dispatch(setEpcFormData(obj));
        dispatch(setepcid(resData.epcid));
      }
    } catch (error: any) {
      toast.error(error.response?.data.message ?? "There was an issue. Please try again later.");
    }
  };
  const bindUserDetails = async () => {
    let data = { ...epcData, userid: user.userid };
    let { payload } = await dispatch(getStateListByCountryID(user.countryid));
    if (user && user.usertype_map && user.usertype_map.usertype_mstr?.usertype === USER_TYPE_PARTNER && payload.length) {
      getUserDetails(payload);
    } else {
      dispatch(setEpcFormData(data));
    }
  };
  useEffect(() => {
    bindUserDetails();
  }, []);

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "companyName" && value && value.length > 60) {
      return;
    }
    if (name === "companyAddress" && value && value.length > 120) {
      return;
    }
    
    if(name === "registrationNumber" && specialCharRegex.test(value)){
      return;
    }
    if (name === "registrationNumber" && value && value.length > 20) {
      return;
    }
    if (name === "companyName") {
      const updatedId = newgeneratedId(value);
      const obj = { ...epcData, [name]: value, companyId: updatedId };
      dispatch(setEpcFormData(obj));
    } else {
      let obj = { ...epcData, [name]: value };
      dispatch(setEpcFormData(obj));
    }
    updateErrorFields(name);
  };
  const handleInnerRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedInnerOption(name);
    setStartupDoc(prev=>([]))
    updateErrorFields("dippDoc");
    dispatch(setEpcFormData({ ...epcData, isstartup: name === "Yes" ? true : false,dippDoc:""}))
  };

  const fetchDistricts = (option: SingleValue<OptionType[]>, name: string) => {
    if (option?.length) {
      const filteredoption = new Set(option.filter((item: Option) => !item.label.startsWith("Select All")).map(el=>el.value));
      dispatch(getDistrictListByStateID(Array.from(filteredoption)));
    } else {
      dispatch(setEpcFormData({ ...epcData, [name]: [], cityname: [] }));
      dispatch(setDistrictNameByStateID([]));
    }
  };

  const debounceDistrictList = useDebounce(fetchDistricts, 1000);

  const handleChange = (option: SingleValue<OptionType[]>, name: string) => {
    name === "statename" && debounceDistrictList(option, name);
    dispatch(setEpcFormData({ ...epcData, [name]: option }));
    updateErrorFields(name)
  };
  const handlePreviewClick = (file: File | string) => {
    let doctype = 0,filename = registrationDoc[0].name;
    if (file !== "registrationDoc") {
      doctype = 1;
      filename = startupDoc[0].name;
    }
    downloadFileFromApi(`${requestUrl.downloadUserDoc}/${user.userid}/${doctype}`,filename);
    // 
    // updateErrorFields()
  };
  const updateErrorFields = async(updateErrorFields:any) => {
    const updatedErrors = {...error};
    delete updatedErrors[updateErrorFields as keyof object];
    dispatch(setVerificationDetailsError(updatedErrors));
  };
  return (
    <>
      <div className="main-section1" style={{margin:'inherit',width:'auto'}}>
        <p className="heading-sm-semibold pt-4">Company Details <span className="text-rose-400 text-lg pl-0.5">*</span></p>
        <div className="grid grid-cols-3 gap-x-4">
          <Input error={error.companyName} id={"companyName"} label={"Company Name"} name={"companyName"} value={epcData.companyName} type="text" onChange={handleChanges} />
          <Input error={error.companyAddress} id={"companyAddress"} label={"Company Address"} name={"companyAddress"} value={epcData.companyAddress} type="text" onChange={handleChanges} />
          <Input error={error.registrationNumber} id={"registrationNumber"} label={"Company Registration Number"} name={"registrationNumber"} value={epcData.registrationNumber} type="text" onChange={handleChanges} />
          <InputUpload error={error.registrationDoc} isSingle={true} handlePreviewClick={handlePreviewClick} btnLabel="Document (pdf, 10MB)" filenames={registrationDoc} setFileNames={setRegistrationDoc} acceptType=".pdf" uploaded={epcData} name={"registrationDoc"} label="Company Registration Certificate(Max. 10MB)" />
          <InputRadio header="Are you a startup?" value={selectedInnerOption} options={epcTypeRadioList} name="businessType" className="gapInBtn" onChange={handleInnerRadioChange}/>
          <div className={`${selectedInnerOption === "Yes" ? "block" : "hidden"}`}>
            <InputUpload isSingle={true} error={error.dippDoc} handlePreviewClick={handlePreviewClick} btnLabel="Document (pdf, 10MB)" filenames={startupDoc} setFileNames={setStartupDoc} acceptType=".pdf" uploaded={epcData} name={"dippDoc"} label="Start-up Recognition Document(Max. 10MB)" />
          </div>
          <div className="col-span-3" style={{maxWidth:"1134px"}}>
          <MultiSelectPicker error={error.statename} isMulti={true} options={statesList.map((el: any) => ({ label: el.state, value: el.stateid, }))} labelname="Select Service State" onChange={(e: any) => handleChange(e, "statename")} value={epcData.statename} />
          </div>
          <div className="col-span-3" style={{maxWidth:"1134px"}}>
            <MultiSelectPicker error={error.cityname} isMulti={true} options={districtsList.map((el: any) => ({ label: el.district, value: el.districtid, state: getElementByIndex(filterKeyIncludeArr(statesList, "stateid", el.stateid), 0, "state"), }))} groupBy={"state"} labelname="Select Service District" onChange={(e: any) => handleChange(e, "cityname")} value={epcData.cityname} />
          </div>
        </div>
        <p className="heading-sm-semibold pt-4">User Details</p>
        <div className="grid grid-cols-3 gap-x-4">
          <Input id={"userName"} label={"User Name"} name={"userName"} value={user && toTitleCase(user.fname + " " + user.lname)} type="text" onChange={handleChanges} disabled={true} />
          <Input id={"userMobile"} label={"User Mobile"} name={"userMobile"} value={user && user.mobile as string} type="text" onChange={handleChanges} disabled={true} />
          <Input id={"userEmail"} label={"User Email"} name={"userEmail"} value={user && (user.emailid as string)} type="email" onChange={handleChanges} disabled={true} />
        </div>
      </div>
    </>
  );
};

export default EPC;
