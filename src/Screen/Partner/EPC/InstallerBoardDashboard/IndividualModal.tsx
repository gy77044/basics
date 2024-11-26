import { ChangeEvent, useState } from "react";
import DragNDrop from "../../../../Components/Upload/DragNDrop";
import NewInput from "../../../../Components/New/Input/NewInput";
import { IconInfo } from "../../../../assests/icons/DrawerIcons";
import { newgeneratedId } from "../../../../Utils/commonFunctions";
import Papa from "papaparse"
import { LeadType } from "../../../../ReduxTool/Slice/Partner/EPC";

const IndividualModal = () => {
  const companyInstallerTypeRadioList = [
    {
      name: "Company",
      lablename: "Company",
    },
    {
      name: "Individual",
      lablename: "Individual",
    },
  ];
  const [selectedInnerOption, setSelectedInnerOption] = useState<string>("");

  const handleInnerRadioChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setSelectedInnerOption(name);
  };
  const [individualData, setIndividualData] = useState({
    InstallerUID: newgeneratedId(),
    InstallerMobile: "",
    InstallerName: "",
    InstallerAddress: "",
    InstallerEmail: "",
  });

  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedData, setUploadedData] = useState<LeadType[]>([]);

  const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "InstallerName") {
      const updatedId = newgeneratedId(value);
      setIndividualData({
        ...individualData,
        [name]: value,
        InstallerUID: updatedId,
      });
    } else {
      setIndividualData({ ...individualData, [name]: value });
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log(results.data);
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
      <div className="h4"></div>
      <div className="flex justify-center items-start space-x-[3vh]">
        <div className="flex flex-col space-y-[4vh]">
          <NewInput
            id={"InstallerUID"}
            labelname={"Installer Unique ID"}
            name={"InstallerUID"}
            value={individualData.InstallerUID}
            type="text"
            onChange={handleChanges}
            star={false}
            icon={<IconInfo />}
            disabled={true}
          />
          <div className="h2"></div>
          <NewInput
            id={"InstallerMobile"}
            labelname={"Installer Mobile"}
            name={"InstallerMobile"}
            value={individualData.InstallerMobile}
            type="number"
            onChange={handleChanges}
            star={true}
            icon={<IconInfo />}
          />
          {/* <div className="h4"></div> */}
        <div className="relative">
          <span className={`select-label bg-red-100 `} >Upload Document  <span className="text-red-100 font-normal">*</span></span>
        </div>
        <DragNDrop  onFileChange={handleFileChange} uploadTitle={"Drag photo here or click here to import items."} subTitle='Supported file types are: PDF, PNG & JPG' fileSize={"1MB"} />
        </div>
        <div className="flex flex-col space-y-[4vh]">
          <NewInput
            id={"InstallerName"}
            labelname={"Installer Name"}
            name={"InstallerName"}
            value={individualData.InstallerName}
            type="text"
            onChange={handleChanges}
            star={true}
            icon={<IconInfo />}
          />
          <div className="h3"></div>
          <NewInput
            id={"InstallerAddress"}
            labelname={"Installer Address"}
            name={"InstallerAddress"}
            value={individualData.InstallerAddress}
            type="text"
            onChange={handleChanges}
            star={true}
            icon={<IconInfo />}
          />
          <div className="h3"></div>
          <DragNDrop  onFileChange={handleFileChange} uploadTitle={"Drag id proof here or click here to import items."} subTitle='Supported file types are: PDF, PNG & JPG' fileSize={"1MB"} />
        </div>
        <div className="flex flex-col space-y-[4vh]">
          <NewInput
            id={"InstallerEmail"}
            labelname={"Installer Email"}
            name={"InstallerEmail"}
            value={individualData.InstallerEmail}
            type="email"
            onChange={handleChanges}
            star={true}
            icon={<IconInfo />}
          />
          <div className="h4"></div>
          <div className="h5"></div>
          <div className="h5"></div>
          <DragNDrop  onFileChange={handleFileChange} uploadTitle={"Drag highest qualification or click here to import items."} subTitle='Supported file types are: PDF, PNG & JPG' fileSize={"1MB"} />
        </div>
      </div>
    </>
  );
};

export default IndividualModal;
