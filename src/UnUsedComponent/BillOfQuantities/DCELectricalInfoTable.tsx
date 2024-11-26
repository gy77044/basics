// import React from "react";

// interface DCElectricalListItem {
//   name: string;
//   value: string[];
//   btnText?: string;
// }

// interface DCElectricalTableProps {
//   data: DCElectricalListItem[];
//   headingName?: string;
//   sno?: boolean;
// }

// const DCELectricalInfoTable: React.FC<DCElectricalTableProps> = ({
//   data,
//   headingName,
//   sno,
// }) => {
//   return (
//     <div className="table-main">
//       <div className="table-name">{headingName && headingName}</div>
//       <table className="table">
//         <thead className="thead">
//           <tr>
//             {sno && <th className="hvalue">S.No</th>}
//             <th className="hvalue">Equipment Name</th>
//             <th className="hvalue">UOM</th>
//             <th className="hvalue">Quantity</th>
//             <th className="hvalue">Proposed Make</th>
//             <th className="hvalue">Specification</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr  className="trow bg-grey-600">DC Cables</tr>
//           {data.map((item, index) => (
//             <>
//               <tr className="trow" key={index}>
//                 {sno && <td className="rheading">{index + 1}</td>}
//                 <td className="rheading">{item.value[0]}</td>
//                 <td className="rvalue">{item.value[1]}</td>
//                 <td className="rvalue">{item.value[2]}</td>
//                 <td className="rvalue">{item.value[3]}</td>
//                 <td className="rvalue">{item.value[4]}</td>
//               </tr>
//             </>
//           ))}
//           <tr className="trow bg-grey-600">DC Earthing</tr>
//           {data.map((item, index) => (
//             <>
//               <tr className="trow" key={index}>
//                 {sno && <td className="rheading">{index + 1}</td>}
//                 <td className="rheading">{item.value[0]}</td>
//                 <td className="rvalue">{item.value[1]}</td>
//                 <td className="rvalue">{item.value[2]}</td>
//                 <td className="rvalue">{item.value[3]}</td>
//                 <td className="rvalue">{item.value[4]}</td>
//               </tr>
//             </>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default DCELectricalInfoTable;



import React from "react";

interface DCElectricalListItem {
  name: string;
  value: string[];
  btnText?: string;
}

interface DCElectricalTableProps {
  data: DCElectricalListItem[];
  headingName?: string;
  sno?: boolean;
}

const DCELectricalInfoTable: React.FC<DCElectricalTableProps> = ({
  data,
  headingName,
  sno,
}) => {
  return (
    <div className="table-main">
      <div className="table-name">{headingName && headingName}</div>
      <table className="table">
        <thead className="thead">
          <tr>
            {sno && <th className="hvalue">S.No</th>}
            <th className="hvalue">Equipment Name</th>
            <th className="hvalue">UOM</th>
            <th className="hvalue">Quantity</th>
            <th className="hvalue">Proposed Make</th>
            <th className="hvalue">Specification</th>
          </tr>
        </thead>
        <tbody>
          <tr className="trow bg-grey-600">
            <td colSpan={sno ? 6 : 5} className="trow-center">
            <div className="flex items-center justify-center text-1.6xl py-1.6 font-normal">
              DC Cables
              </div>
            </td>
          </tr>
          {data.map((item, index) => (
            <tr className="trow" key={index}>
              {sno && <td className="rheading">{index + 1}</td>}
              <td className="rheading">{item.value[0]}</td>
              <td className="rvalue">{item.value[1]}</td>
              <td className="rvalue">{item.value[2]}</td>
              <td className="rvalue">{item.value[3]}</td>
              <td className="rvalue">{item.value[4]}</td>
            </tr>
          ))}
          <tr className="trow bg-grey-600">
            <td colSpan={sno ? 6 : 5} className="trow-center">
            <div className="flex items-center justify-center text-1.6xl py-1.6 font-normal">  DC Earthing</div>
            </td>
          </tr>
          {data.map((item, index) => (
            <tr className="trow" key={index}>
              {sno && <td className="rheading">{index + 1}</td>}
              <td className="rheading">{item.value[0]}</td>
              <td className="rvalue">{item.value[1]}</td>
              <td className="rvalue">{item.value[2]}</td>
              <td className="rvalue">{item.value[3]}</td>
              <td className="rvalue">{item.value[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DCELectricalInfoTable;
