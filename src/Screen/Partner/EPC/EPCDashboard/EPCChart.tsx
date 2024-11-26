import "chart.js/auto";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { IconInfo } from "../../../../assests/icons/DrawerIcons";
import { setCardTitle } from "../../../../ReduxTool/Slice/Dashboard/DashboardReducer";
import { useAppDispatch } from "../../../../ReduxTool/store/hooks";

interface EPCChartProps { cardName: string; labels: string[]; active: boolean; data: number[]; colors: string[]; dataNotFound?:boolean; setLeadName: React.Dispatch<React.SetStateAction<string>>}

const EPCChart: React.FC<EPCChartProps> = ({ cardName, labels, data, colors,setLeadName,active=false,dataNotFound }) => {
  const dispatch = useAppDispatch()  
  const adjustedColors = colors.slice(0, labels.length);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: adjustedColors,
        borderColor: adjustedColors,
      },
    ],
  };

  // Determine legend position based on number of labels
  // let legendPosition: "bottom" | "bottom" = "bottom";
  // if (labels.length > 3) {
  //   legendPosition = "bottom";
  // }

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as 'bottom',
        align: 'center' as 'center',
        padding:10,
        labels: {
          font: {
            size: 10,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
      style: {
        border:"1px solid #4F504C",
      },
    },
    // onClick: (event: any, elements: any) => {
    //   // dispatch(setAccord(""))
    //   // handleTabNavbars(dispatch,cardName)
    //   dispatch(setCardTitle(cardName))
    //   if (elements.length > 0) {
    //     const chartElement = elements[0];
    //     const datasetIndex = chartElement.datasetIndex;
    //     const index = chartElement.index;
    //     const label = chartData.labels[index];
    //     setLeadName(label)
    //   }else{
    //     setLeadName("All")
    //   }
    // },
  };

  const textCenter = {
    id: "textCenter",
    beforeDatasetDraw: (chart: any, args: any, pluginOption: any) => {
      const { ctx, data } = chart;
      ctx.save();
      ctx.font = "bolder 18px sans-serif";
      ctx.fillStyle = "#4F504C";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
      ctx.fillText(
        total,
        chart.getDatasetMeta(0).data[0].x,
        chart.getDatasetMeta(0).data[0].y
      );
    },
  };

  const textOnArc = {
    id: "textOnArc",
    afterDatasetDraw: (chart: any, args: any, pluginOptions: any) => {
      const { ctx, chartArea: { top, bottom, left, right } } = chart;
      ctx.save();
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const meta = chart.getDatasetMeta(0);
      meta.data.forEach((dataPoint: any, index: number) => {
        const { x, y } = dataPoint.tooltipPosition();
        ctx.fillText(data[index], x, y);
      });
      ctx.restore();
    },
  };

  return (
    <div className={`cursor-pointer w-[40vh] min-w-[30vh] h-[380px] overflew-auto border-[0.2vh] border-t-[0.8vh] ${active ? "bg-primary-900/100" : ""} border-primary-900/100 ${active ? "border-t-primary-200" : "hover:border-t-primary-200"}  shadow-default rounded-default transition delay-150 duration-100 ease-in-out`}>
      <div className="flex justify-between items-center text-2xl leading-[2.4vh] font-semibold text-primary-200 px-2 pt-2 pb-1">
        <div>{cardName}</div>
        <div>
          <IconInfo />
        </div>
      </div>
      {dataNotFound ?<div className="h-[90%] w-[90%] m-auto"><Doughnut data={chartData} options={options} plugins={[textCenter, textOnArc]} style={{padding:'10px'}}/></div>:<div className="text-center text-primary-200 flex justify-center items-center h-[70%]">No Data Found!</div> }
    </div>
  );
};

export default EPCChart;
