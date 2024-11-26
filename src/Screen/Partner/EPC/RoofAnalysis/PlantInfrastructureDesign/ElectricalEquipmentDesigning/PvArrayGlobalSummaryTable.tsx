import { memo } from "react";

const PvArrayGlobalSummaryTable = () => {
  return (
    <div className="table-main">
      <div className="table-name">PV Array Details</div>
      <table className="table">
        <thead className="thead">
          <tr>
            <th className="hvalue">Name</th>
            <th className="hvalue">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr className="trow">
            <td className="rheading">Total DC Power</td>
            <td className="rvalue ">-</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Total AC Power</td>
            <td className="rvalue ">-</td>
          </tr>
          <tr className="trow">
            <td className="rheading">No. of Modules</td>
            <td className="rvalue ">-</td>
          </tr>
          <tr className="trow">
            <td className="rheading">No. of Inverters</td>
            <td className="rvalue ">-</td>
          </tr>
          <tr className="trow">
            <td className="rheading">DC:AC Ratio</td>
            <td className="rvalue ">-</td>
          </tr>
        </tbody>
      </table>
      {/* <div className="table-footer">
        <button
          className="light-sm-btn"
          // onClick={() => dispatch(toggleTheNoOfOrientationModal(true))}
        >
          Add/Update Obstruction
        </button>
      </div> */}
    </div>
  );
};
export default memo(PvArrayGlobalSummaryTable);
