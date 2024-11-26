import { ChangeEvent, useState } from "react";
import CompanyModal from "./CompanyModal";
import IndividualModal from "./IndividualModal";
import NewRadioButton from "../../../../Components/New/RadioButton/NewRadioButton";
import { newgeneratedId } from "../../../../Utils/commonFunctions";
const companyInstallerTypeRadioList = [{name: "Company",lablename: "Company"},{name: "Individual",lablename: "Individual"}];

const RegisterNewInstallerCompany = () => {
  const [selectedInnerOption, setSelectedInnerOption] = useState<string>("Company");

  const handleInnerRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedInnerOption(name);
  };

  const [companyData, setCompanyData] = useState({
    companyUID: newgeneratedId(),
    companyEmail: "",
    noofInstaller: 1,
    companyName: "",
    companyRegNo: "",
    companyMobile: "",
    contactPersonName: "",
    companyAddress: "",
  });

  // type cData = typeof companyData

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "companyName") {
      const updatedId = newgeneratedId(value);
      setCompanyData({ ...companyData, [name]: value, companyUID: updatedId });
    } else {
      setCompanyData({ ...companyData, [name]: value });
    }
  };

  const addNewRow = () => {
    setCompanyData({
      ...companyData,
      noofInstaller: companyData.noofInstaller + 1,
    });
  };
  
  return (
    <>
      <div className="radio-main">
        <div className="section-label">
          Installer Type
          <span className="text-red-100 font-normal">*</span>
        </div>
        <div className="radio-body">
          {companyInstallerTypeRadioList.map((itm) => (
            <NewRadioButton   value={itm.name} name={itm.name} labelname={itm.lablename} onClick={handleInnerRadioChange} selectedOption={selectedInnerOption}/>
          ))}
        </div>
      </div>
      {
        selectedInnerOption === "Company" ? <CompanyModal companyData={companyData} handleChanges={handleChanges}/> : <IndividualModal/>
      }
    </>
  );
};

export default RegisterNewInstallerCompany;
