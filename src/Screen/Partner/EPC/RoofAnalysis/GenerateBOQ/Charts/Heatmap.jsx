import HeatMap from "react-heatmap-grid";
import datas from "./ProfileData.json";

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}
const hoursplitArr = sliceIntoChunks(datas, 24);
let final = [];
let indexVal = 0;
for (let i = 0; i < 24; i++) {
  let t = [];
  hoursplitArr.forEach((element) => {
    t.push(Math.abs(element[indexVal]));
  });
  indexVal = indexVal + 1;
  final.push(t);
}
const yLabels = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

const xLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
/* const xLabels = new Array(365).fill(0).map((_, i) => `${i}`); */

const xLabelsVisibility = new Array(365)
  .fill(0)
  .map((_, i) => (i % 2 === 0 ? true : true));

export default function HeatmapChart() {
  return (
    <div>
      <p className="text-center">HeatMap</p>
      <div className="h2"></div>
      <div className="heatmap flex justify-center items-center">
        <div
          className="heatmap-chart"
          style={{
            fontSize: "10px",
          }}
        >
          {" "}
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            xLabelsLocation={"bottom"}
            xLabelsVisibility={xLabelsVisibility}
            xLabelWidth={5}
            data={final}
            squares
            height={50}
            onClick={(x, y) => alert(`Clicked ${x}, ${y}`)}
            cellStyle={(background, value, min, max, data, x, y) => ({
              background: `rgb(17, 63, 74, ${1 - (max - value) / (max - min)})`,
              fontSize: "10px",
              color: "#444",
            })}
            //cellRender={value => value && <div>{value}</div>}
          />{" "}
        </div>
        <div className=""></div>
      </div>
    </div>
  );
}
