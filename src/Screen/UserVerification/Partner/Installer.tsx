// import { AxiosResponse } from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import NewRadioButton from "../../../Components/New/RadioButton/NewRadioButton";
// import { baseURL, requestUrl } from "../../../Utils/baseUrls";
// import { useAppSelector } from "../../../ReduxTool/store/hooks";
// import Company from "../../Partner/EPC/ProjectDashboard/Company";
// import Individuals from "../../Partner/EPC/ProjectDashboard/Individuals";

// export interface SupUserTypeOpt {
//   pksupid: string;
//   type: string;
//   createdat: string;
//   usersubtypeid: string;
// }

// export default function InstallerLogin() {
//   const BussinessTypeRadioList = [
//     {
//       name: "Company",
//       lablename: "Company",
//       Content: Company,
//     },

//     {
//       name: "Installer Individual",
//       lablename: "Installer Individual",
//       Content: Individuals,
//     },
//   ];

//   const [selectedInnerOption, setSelectedInnerOption] =
//     useState<string>("Company");

//   const [supuserTypeOption, setsupUserTypeOption] = useState<SupUserTypeOpt[]>(
//     []
//   );
//   const usersubtypeid = useAppSelector(state=>state.dashboard.usertypeid)

//   const handleInnerRadioChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = event.target;
//     setSelectedInnerOption(name);
//   };

//   useEffect(() => {
//     if(usersubtypeid){
//       baseURL
//         .get(`${requestUrl.getsupuserType}/${usersubtypeid}`)
//         .then((res: AxiosResponse) => {
//           if (res.data.code === "200") {
//             setsupUserTypeOption(res.data.responseData);
//           }
//         })
//         .catch((e) => {
//           return toast.error(e);
//         });
//     }
//   }, [usersubtypeid]);

//   return (
//     <div className="">
//       <div className="radio-main">
//         <div className="section-label">
//           Installer Type
//           <span className="text-red-100 font-normal">*</span>
//         </div>
//         <div className="radio-body">
//           {supuserTypeOption.map((item) => {
//             return (
//               <div className="pb-2" key={item.type}>
//                 <NewRadioButton
//                   name={item.type}
//                   labelname={item.type}
//                   onClick={handleInnerRadioChange}
//                   selectedOption={selectedInnerOption}
//                 />
//               </div>
//             );
//           })}
//         </div>
//         {selectedInnerOption && (
//           <div>
//             {BussinessTypeRadioList.filter(
//               (item) => selectedInnerOption === item.name
//             ).map((itm) => {
//               return (
//                 <>
//                   <div key={itm.name} className="text-black">
//                     {<itm.Content />}
//                   </div>
//                 </>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React from 'react'

const Installer = () => {
  return (
    <div className='flex justify-center items-center text-2xl text-primary-500 font-medium  py-2 border-[0.2vh] border-primary-800 h-[30vh]'>
      Coming soon!
    </div>
  )
}

export default Installer
