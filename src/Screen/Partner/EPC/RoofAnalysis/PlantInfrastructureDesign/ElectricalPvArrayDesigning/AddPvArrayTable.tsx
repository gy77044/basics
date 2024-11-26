import { TableMoreIcon } from "../../../../../../assests/icons/Icons";

export default function AddPvArrayTable() {
  return (
    <div className="table-main">
      <div className="table-name">PV Array Details</div>
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
            <td className="rheading">Array 1</td>
            <td className="rvalue ">Orientation 1 | Series 20 | Strings 10</td>
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
          Add PV Array
        </button>
      </div>
    </div>
  );
}
