import React from "react";
import { IconTableDelete } from "../../../../../../assests/icons/EPCIcons/Icons";
import { TObstruction } from "../../../../../../ReduxTool/Slice/Partner/EPC/type";

type ListType = {
    type: string
    height?: number
    area: number
    offset: string,
    name: string
    removeObject: (name: string) => void;
    rowClick: () => void;
}

const TableRowList:React.FC<ListType>  = ({ name, offset, area, type, removeObject, rowClick }) => {
  return (
    <tr className="trow" onClick={rowClick}>
      <td className="rheading">{type}</td>
      <td className="rvalue">{area} sq. m</td>
      <td className="rvalue">
        <div className="rvalue-icon">
          {offset} m
          <IconTableDelete onClick={() => removeObject(name)} />
        </div>
      </td>
    </tr>
  );
};

export default TableRowList;
