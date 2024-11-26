import React from "react";
import IconMemership from "../../../../../../assests/icons/EPCIcons/IconMemership";
import { dcPowerBasedOnSanctionload } from "../../../../../../Utils/commonFunctions";

export interface CIListItem {
  name: string;
  value: string | Element | JSX.Element;
  key?: string;
  btnText?: string;
}

interface CustomerInformationProps {
  data: CIListItem[];
  headingName?: string;
  sno?: boolean;
  
}

const CustomerInformation: React.FC<CustomerInformationProps> = ({
  data,
  headingName,
  sno,
}) => {
  return (
    <div className="table-main">
      <div className="table-name  font-medium text-primary-200 ">{headingName && headingName}</div>
      <table className="table">
        <thead className="thead">
          <tr>
            {sno && <th className="hvalue">S.No</th>}
            <th className="hvalue">Name</th>
            <th className="hvalue">Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr className="trow" key={index}>
              {sno && <td className="rheading">{index + 1}</td>}
              <td className="rheading">{item.name}</td>
              <td className="rvalue">
                {item.btnText ? (
                  <div className="group flex justify-between items-center w-full border-none">
                    {item.value as string}{" "}
                    <button className="dark-sm-btn gap-1 p-1.4">
                      <IconMemership />
                      {item.btnText}
                    </button>
                  </div>
                ) : (
                  item.value as string | JSX.Element
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerInformation;
