// import { ChangeEvent, useState } from "react";
// import NewInput from "../../../Components/New/Input/NewInput";
// import FileUpload from "../../../Components/Upload/FileUpload";
// import { useAppSelector } from "../../../ReduxTool/store/hooks";
// import { newgeneratedId } from "../../../Utils/commonFunctions";

// const FinanceAgency = () => {
//   const financeTypeRadioList = [
//     {name: "Yes",lablename: "Yes"},
//     {name: "No",lablename: "No"},
//   ];

//   const user = useAppSelector((state) => state.auth.user);
//   const [financeData, setFinanceData] = useState({ financeUID: newgeneratedId(), companyAddress: "", companyName: "", companyRegNo: ""});

//   const handleChanges = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if(name==="companyName"){
//       const updatedId = newgeneratedId(value);
//       setFinanceData({ ...financeData, [name]: value, financeUID: updatedId  });
//     }else{
//       setFinanceData({ ...financeData, [name]: value });
//     }
//   };

//   const [selectedInnerOption, setSelectedInnerOption] = useState<string>("");

//   const handleInnerRadioChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = event.target;
//     setSelectedInnerOption(name);
//   };

//   return (
//     <>
//       <div className="table-main">
//         <div className="table-name">Company Details</div>
//         <div className="tableContainer">
//           <div className="flex flex-col space-y-[4vh] w-[34vh]">
//             <NewInput id={"financeUID"} labelname={"Finance Unique ID"} name={"financeUID"} value={financeData.financeUID} type="text" onChange={handleChanges} star={false} disabled={true}
//             />
//             <NewInput id={"companyAddress"} labelname={"Company Address"} name={"companyAddress"} value={financeData.companyAddress} type="text" onChange={handleChanges} star={true}
//             />

//             <div>
//               <div className="section-label leading-[2vh] ">
//               Company Registration Certificate
//                 <span className="text-red-100 font-normal">*</span>
//               </div>
//               <div className="h2"></div>
//                <FileUpload btnLabel="Document (jpg | pdf 100 kb)" acceptType=".pdf" />
//             </div>
//           </div>
//           <div className="flex flex-col space-y-[4vh] w-[34vh]">
//             <NewInput id={"companyName"} labelname={"Company Name"} name={"companyName"} value={financeData.companyName} type="text" onChange={handleChanges} star={true}
//             />
//             <NewInput id={"companyRegNo"} labelname={"Company Registration Number"} name={"companyRegNo"} value={financeData.companyRegNo} type="number" onChange={handleChanges} star={true}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="h4"></div>
//       <div className="table-main">
//         <div className="table-name">User Details</div>
//         <div className="tableContainer">
//           <div className="flex flex-col space-y-[4vh] w-[34vh]">
//             <NewInput id={"userName"} labelname={"User Name"} name={"userName"} value={user&& user.fname + " " +user.lname} type="text" onChange={handleChanges} star={false} disabled={true}
//             />
//             <NewInput id={"userMobile"} labelname={"User Mobile"} name={"userMobile"} value={user&&user.mobile as string} type="text" onChange={handleChanges} star={false} disabled={true}
//             />
//           </div>
//           <div className="flex flex-col space-y-[4vh] w-[34vh]">
//             <NewInput id={"userEmail"} labelname={"User Email"} name={"userEmail"} value={user&& user.emailid as string} type="email" onChange={handleChanges} star={false} disabled={true}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FinanceAgency;


import React from 'react'

const FinanceAgency = () => {
  return (
    <div className='flex justify-center items-center text-2xl text-primary-500 font-medium  py-2 border-[0.2vh] border-primary-800 h-[30vh]'>
     Coming soon!
    </div> 
  )
}

export default FinanceAgency
