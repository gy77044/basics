import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { EPCSignupReVerifictionPage } from ".";
import { Button } from "../../Components/AllButton/AllButtons.tsx";
import { InputRadio } from "../../Components/AllInput/AllInput";
import { startReverification } from "../../ReduxTool/Slice/Auth/AuthReducer";
import { setusertype, setVerificationDetailsError } from "../../ReduxTool/Slice/Auth/UserVerifyReducer";
import { userTypeMap } from "../../ReduxTool/Slice/Auth/types";
import { UserTypeOpt } from "../../ReduxTool/Slice/Dashboard/dashboardTypes";
import { setShowInfoModal } from "../../ReduxTool/Slice/Map/MapReducer";
import { useAppDispatch, useAppSelector } from "../../ReduxTool/store/hooks";
import { routeURL } from "../../Utils/AuthRedirections";
import { APIResponse, USER_TYPE_PARTNER } from "../../Utils/Const";
import { baseURL, requestUrl } from "../../Utils/baseUrls";
import { IconClose } from "../../assests/icons/ModalIcons";
import { handleProceed, loginwithuseridAndpkMasterid } from "../User/UserApi";
import { EPCFormType, EPCVerificationFormErrorTy, UserTypeRadioList } from "./UserTypeList";
import { isTruthy } from "../../Utils/commonFunctions";

const UserVerification = () => {
  const dispatch = useAppDispatch(), navigate = useNavigate();
  const { user, reverification } = useAppSelector((state) => state.auth);
  const {error,epcData} = useAppSelector(state=>state.UserVerifyReducer);
  const isNotify = useAppSelector((state) => state.mapref.isNotify);

  useEffect(() => {
    if (user && user.usertypemapid) {
      if (!user?.userid) return;
    } else if (user && user.usertypemapid === null) {
      dispatch(startReverification(true));
    }
    if (user && user.usertypemapid && user.isapproved) {
      localStorage.setItem("userType",user.usertype_map?.usertype_mstr?.usertype!);
      routeURL(navigate);
    }
  }, [user.userid]);

  useEffect(() => {
    if (isNotify) {
      document.addEventListener("mousedown", handleCloseTrail);
    }
  }, [isNotify]);

  const handleCloseTrail = () => {
    dispatch(setShowInfoModal(false));
  };

  return (
    <>
      {reverification && !user.isapproved && <SelectUserTypeModal />}
      {user.usertypemapid && user.isapproved === false && (
        <EPCSignupReVerifictionPage
          title={`Congratulations! ${user.fname} ${user.lname}`}
        />
      )}
      {user.usertypemapid && user.isapproved === null && (
        <EPCSignupReVerifictionPage
          showbtn={true}
          title={"Verification Failed"}
        />
      )}
    </>
  );
};

export default UserVerification;

const SelectUserTypeModal = () => {
  const dispatch = useAppDispatch(),
    navigate = useNavigate();
  const [userTypeOption, setUserTypeOption] = useState<UserTypeOpt[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const { epcData, usersubtype, usertype, error } = useAppSelector((state) => state.UserVerifyReducer);
  const customid = "new-toast";

  //validateForm
  const validateForm = () => {
    let isValid = true;
    const errors= {} as EPCVerificationFormErrorTy;
    const validations:Array<{ field: keyof EPCVerificationFormErrorTy; message: string; condition?: boolean }> = [
      { field: "companyName", message: "Company Name is Required" },
      { field: "companyAddress", message: "Company Address is Required" },
      { field: "registrationNumber", message: "Registration Number is Required" },
      { field: "registrationDoc", message: "Company Registration Certificate is Required" },
      { field: "statename", message: "Service State is Required" },
      { field: "cityname", message: "Service District is Required" },
    ];
    if(epcData.isstartup){
      validations.push({ field: "dippDoc", message: "Recognition Document is Required" })
    };
    for (const { field, message } of validations) {
      const fieldValue = epcData[field];
      if (Array.isArray(fieldValue) ? fieldValue.length === 0 : (!epcData[field] && !isTruthy(epcData[field]))) {
        errors[field] = message;
        isValid = false;
      }
    };
    !isValid && dispatch(setVerificationDetailsError(errors));
    return isValid;
  };

  useEffect(() => {
    getuserTypeList();
  }, []);

  //usertype change handler
  const handleRadioChange = (e: any) => {
    let { name, value } = e.target;
    dispatch(setusertype(value));
  };

  const handleChange = () => { };

  const handleSubmit = () => {
    let body = { usertypeid: usertype.usertypeid } as any, usertypemapid = user.usertypemapid;
    if (usertype.usertype === "Consumer") {
      console.warn('user type is consumer.')
      return
    } else {
      if (usersubtype.type !== "EPC") {
        toast.warning("Comming Soon!", { toastId: customid });
        return;
      };
      if (!validateForm()) {
        return;
      };

      body["subusertypeid"] = usersubtype.subusertypeid;
      const formData = new FormData();
      formData.append("userid", epcData.userid);
      formData.append("companyid", epcData.companyId);
      formData.append("companyname", epcData.companyName);
      formData.append("companyaddress", epcData.companyAddress);
      formData.append("registrationnumber", epcData.registrationNumber.toString());
      formData.append("isstartup", epcData.isstartup.toString());
      epcData.statename.map((el: any) => {
        if (!el.label.startsWith("Select All")) {
          formData.append("serviceablestate", el.value);
        }
      });
      epcData.cityname.map(el => {
        if (!el.label.startsWith("Select All")) {
          formData.append("serviceabledistricts", el.value);
        }
      });
      formData.append("registrationdoc", typeof (epcData.registrationDoc) !== "string" ? epcData.registrationDoc : "null");
      epcData.isstartup && formData.append("dippdoc", typeof (epcData.dippDoc) !== "string" ? epcData.dippDoc : "null");
      usertypemapid ? loginwithuseridAndpkMasterid(usertypemapid, "", body, dispatch, navigate, formData, user.epcid!) : handleProceed(body, user.userid, dispatch, navigate, formData);
    }
  };

  const getuserTypeList = async () => {
    try {
      const { data }: AxiosResponse<APIResponse<userTypeMap[]>> =
        await baseURL.get(requestUrl.getuserType);
      if (data.code === "200") {
        setUserTypeOption(data.responseData);
        data.responseData.forEach((item: { usertype: string; usertypeid: string; createdat: string; }) => {
          if (item.usertype.toLowerCase() === USER_TYPE_PARTNER.toLowerCase()) {
            dispatch(setusertype(item));
          }
        }
        );
        if (user && user.usertype_map && user.usertype_map.usertype_mstr?.usertype === USER_TYPE_PARTNER) {
          dispatch(setusertype(user.usertype_map.usertype_mstr));
        }
      };
    } catch (err: any) {
      toast.error(err.response?.data.message ?? "There was an issue. Please try again later.", { toastId: customid, });
    }
  };

  const closeVerificationModal=()=>{
    dispatch(setVerificationDetailsError({} as EPCVerificationFormErrorTy))
    dispatch(startReverification(false))
  }
  
  return (
    <div className="modal-backdrop1">
      <div className="main-modal2 w-[1052px]">
        <div className="modal-header1">
          <h3 className="heading-md-semibold flex-1">Company Verification</h3>
          {user.usertypemapid && <button type="button" onClick={closeVerificationModal}><IconClose /></button>}
        </div>
        <div className="modal-body2 custom-scrollbar-css">
          <InputRadio className="pt-0" header="User Type" options={userTypeOption.filter((el) => el.usertype.toLowerCase() === (USER_TYPE_PARTNER).toLowerCase()).map((el) => ({ label: el.usertype, value: el.usertypeid }))} name="userType" onChange={handleRadioChange} value={USER_TYPE_PARTNER} />
          {usertype && UserTypeRadioList.filter((itm) => usertype.usertype === itm.name).map((itm) => <itm.Content />)}
        </div>
        <div className="modal-footer1">
          <Button className="btn btn-md-primary" id="butverify" name="Proceed" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};
