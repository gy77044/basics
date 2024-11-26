import { TableMoreIcon } from "../../../../../../assests/icons/Icons";

export default function AddACCBTable() {
  return (
    <div className="table-main">
      <div className="table-name">ACCB Details</div>
      <table className="table">
        <thead className="thead">
          <tr>
            <th className="hvalue">Name</th>
            <th className="hvalue">Details</th>
            <th className="hvalue">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="trow">
            <td className="rheading">ACCB 1</td>
            <td className="rvalue ">Incomer 2 | Outgoing 2</td>
            <td className="rvalue ">
              <TableMoreIcon />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="table-footer">
        <button
          className="light-sm-btn"
          // onClick={() => dispatch(toggleTheNoOfOrientationModal(true))}
        >
          Add ACCB
        </button>
      </div>
    </div>
  );
}
