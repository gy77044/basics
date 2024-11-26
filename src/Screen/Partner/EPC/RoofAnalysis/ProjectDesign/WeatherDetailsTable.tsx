import React, { useState } from "react";

export default function WeatherDetailsTable() {
  const [tableData, setTableData] = useState({
    dataType: "Synthetic Monthly",
    city: "Mumbai",
    latlng: "19.1066,72.8836",
    distancefromsite: "48",
    elevation: "14",
    ghi: 1989,
    dni: 0,
    gic: 200,
    windspeed: 10,
    snowfall: "-",
    lastupdateOn: "4 Aug, 2023",
    avgambintTemp: 26.73,
  });
  return (
    <div className="table-main">
      <div className="table-name">Weather Details</div>
      <table className="table">
        <thead className="thead">
          <tr>
            <th className="hvalue">Name</th>
            <th className="hvalue">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr className="trow">
            <td className="rheading">Data Type</td>
            <td className="rvalue">{tableData.dataType}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">City</td>
            <td className="rvalue">{tableData.city}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Latitude & Longitude</td>
            <td className="rvalue">{tableData.latlng}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Distance From Site</td>
            <td className="rvalue">{tableData.distancefromsite} km</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Elevation</td>
            <td className="rvalue">{tableData.elevation}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">GHI</td>
            <td className="rvalue">{tableData.ghi} kWh/m<sup>2</sup></td>
          </tr>
          <tr className="trow">
            <td className="rheading">DNI</td>
            <td className="rvalue">{tableData.dni} kWh/m<sup>2</sup></td>
          </tr>
          <tr className="trow">
            <td className="rheading">GIC</td>
            <td className="rvalue">{tableData.gic} kWh/m<sup>2</sup></td>
          </tr>
          <tr className="trow">
            <td className="rheading">Wind Speed</td>
            <td className="rvalue">{tableData.windspeed} m/s</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Snowfall</td>
            <td className="rvalue">{tableData.snowfall}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Last Updated On</td>
            <td className="rvalue">{tableData.lastupdateOn}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Avg. Ambient Temprature</td>
            <td className="rvalue">{tableData.avgambintTemp}</td>
          </tr>
        </tbody>
      </table>
      {/* <div className="table-footer">
                <button className="light-sm-btn">
                    Add Obstruction
                </button>
            </div> */}
    </div>
  );
}
