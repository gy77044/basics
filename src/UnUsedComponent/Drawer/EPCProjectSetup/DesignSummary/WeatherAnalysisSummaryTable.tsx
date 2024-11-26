import React from "react";
import { useAppSelector } from "../../../../ReduxTool/store/hooks";

export default function WeatherAnalysisSummaryTable() {
  const {
    corrosivity,
    weatherdatasource,
    dataType,
    city,
    latlng,
    distancefromsite,
    elevation,
    ghi,
    dni,
    gic,
    windspeed,
    snowfall,
    lastupdateOn,
    avgambintTemp,
  } = useAppSelector((state) => state.wheatherslice);
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
            <td className="rheading">Weather Data Source</td>
            <td className="rvalue">{weatherdatasource&&weatherdatasource||"-"}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Corrosion Category</td>
            <td className="rvalue">{corrosivity&&corrosivity||"-"}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Data Type</td>
            <td className="rvalue">{dataType&&(dataType||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">City</td>
            <td className="rvalue">{city&&(city||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Latitude & Longitude</td>
            <td className="rvalue">{latlng&&(latlng||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Distance From Site</td>
            <td className="rvalue">{distancefromsite&&(distancefromsite||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Elevation</td>
            <td className="rvalue">{elevation&&(elevation||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">GHI</td>
            <td className="rvalue">{ghi&&(ghi||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">DNI</td>
            <td className="rvalue">{dni&&(dni||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">GIC</td>
            <td className="rvalue">{gic&&(gic||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Wind Speed</td>
            <td className="rvalue">{windspeed&&(windspeed||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Snowfall</td>
            <td className="rvalue">{snowfall&&(snowfall||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Last Updated On</td>
            <td className="rvalue">{lastupdateOn&&(lastupdateOn||"-")}</td>
          </tr>
          <tr className="trow">
            <td className="rheading">Avg. Ambient Temprature</td>
            <td className="rvalue">{avgambintTemp&&(avgambintTemp||"-")}</td>
          </tr>
        </tbody>
      </table>
      <div className="table-footer">
        <button className="light-sm-btn">Edit Details</button>
      </div>
    </div>
  );
}
