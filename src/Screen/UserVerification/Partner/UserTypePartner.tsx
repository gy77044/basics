import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NewRadioButton from "../../../Components/New/RadioButton/NewRadioButton";
import { setusersubtype } from "../../../ReduxTool/Slice/Auth/UserVerifyReducer";
import { SubUserTypeOpt } from "../../../ReduxTool/Slice/Dashboard/dashboardTypes";
import { useAppDispatch, useAppSelector } from "../../../ReduxTool/store/hooks";
import { baseURL, requestUrl } from "../../../Utils/baseUrls";
import EPC from "./EPC";
import FinanceAgency from "./FinanceAgency";
import InstallerLogin from "./Installer";
import { InputRadio } from "../../../Components/AllInput/AllInput";
import { filterKeyIncludeArr, getElementByIndex } from "../../../Utils/commonFunctions";
const BussinessTypeRadioList = [
  { name: "EPC", lablename: "EPC", Content: EPC },
  {
    name: "Finance Agency",
    lablename: "Finance Agency",
    Content: FinanceAgency,
  },
  { name: "Installer", lablename: "Installer", Content: InstallerLogin },
];
export default function UserTypePartner() {
  const dispatch = useAppDispatch();
  const { usertype } = useAppSelector((state) => state.UserVerifyReducer);
  const [selectedInnerOption, setSelectedInnerOption] = useState<string>(""); // Default selection
  const [subuserTypeOption, setsubUserTypeOption] = useState<SubUserTypeOpt[]>(
    []
  );

  useEffect(() => {
    if (usertype.usertypeid) {
      fetchData();
    }
  }, [usertype.usertypeid]);

  const fetchData = async () => {
    try {
      const response = await baseURL.get(
        `${requestUrl.getsubuserType}/${usertype.usertypeid}`
      );
      if (response.data.code === "200") {
        response.data.responseData.sort((a: any, b: any) => {
          if (a.type < b.type) {
            return -1;
          }
          if (a.type > b.type) {
            return 1;
          }
          return 0;
        });
        setsubUserTypeOption(response.data.responseData);
        if (response.data.responseData && response.data.responseData.length) {
          response.data.responseData.forEach((item: SubUserTypeOpt) => {
            if (item.type === "EPC") {
              setSelectedInnerOption(item.type);
              dispatch(setusersubtype(item));
            }
          });
        }
      }
    } catch (error: any) {
      toast.error(error);
    }
  };
  const handleInnerRadioChange = (e: any) => {
    const { name, value } = e.target;
    setSelectedInnerOption(name);
    dispatch(setusersubtype(getElementByIndex(filterKeyIncludeArr(subuserTypeOption,"type",name),0)));
  };

  return (
    <>
      <InputRadio header="Business Type" className="pt-0" value={selectedInnerOption} options={subuserTypeOption.map((el) => ({label: el.type,value: el.subusertypeid,}))} name="businessType" onChange={handleInnerRadioChange}/>
      {selectedInnerOption && BussinessTypeRadioList.filter((item) => selectedInnerOption === item.name).map((itm) => <itm.Content />)}
    </>
  );
}
