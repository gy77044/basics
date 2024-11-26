
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


import lossPercent from "./LossInPercent.json";
import { memo } from 'react';

// Register the necessary Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Loss Chart',
    },
  },
  indexAxis: 'y' as const,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false
      },
      ticks: {
        display: true,
        maxRotation: 50,
        minRotation: 30,
        padding: 10,
        autoSkip: false,
        fontSize: 10
      },
    },

    y: {
      stacked: true,
      reverse: false,
      grid: {
        color: "#b7c5c8",
        borderDash: [20, 10],
        borderColor: "#4F504C",
        tickColor: "#4F504C"
      },
      title: {
        display: true,
        text: "Energy losses (in kW)",
        color: "#4F504C",
        font: {
          size: 12,
          weight: "500"
        }
      },
    }
  }
};



const lossArr = lossPercent.map(val => {
  return Math.abs(val)
})

var efficeincy1: number[] = []
var efficeincy2: number[] = []
var efficeincy3: number[] = []
var efficeincy4: number[] = []
var actualLoss1: number[] = []
var actualLoss2: number[] = []
var actualLoss3: number[] = []
var actualLoss4: number[] = []
var fixedData: number = 100

lossArr.forEach((val, i) => {
  if (i < 4) {
    let totalEfficiency = fixedData - (fixedData * (lossArr[i] / 100))
    actualLoss1.push(fixedData * (lossArr[i] / 100))
    efficeincy1.push(totalEfficiency)
    fixedData = totalEfficiency
  }
  if (i >= 4 && i < 8) {
    let totalEfficiency = fixedData - (fixedData * (lossArr[i] / 100))
    actualLoss2.push(fixedData * (lossArr[i] / 100))
    efficeincy2.push(totalEfficiency)
    fixedData = totalEfficiency

  }
  if (i >= 8 && i < 12) {
    let totalEfficiency = fixedData - (fixedData * (lossArr[i] / 100))
    actualLoss3.push(fixedData * (lossArr[i] / 100))
    efficeincy3.push(totalEfficiency)
    fixedData = totalEfficiency

  }
  if (i >= 12 && i <= lossArr.length) {
    const totalEfficiency = fixedData - (fixedData * (lossArr[i] / 100))
    actualLoss4.push(fixedData * (lossArr[i] / 100))
    efficeincy4.push(totalEfficiency)
    fixedData = totalEfficiency

  }
  
})


export const data = {

  labels: ['Irradiance Loss', 'DC Loss', 'AC Loss', 'Other'],
  datasets: [
    {
      label: 'Irradiance Efficeincy',
      data: [efficeincy1[0], efficeincy2[0], efficeincy3[0], efficeincy4[0]],
      borderColor: '#113F4A',
      backgroundColor: '#113F4A',
      stack: 'Stack 0',
    },
    {
      label: 'Irradiance Loss',
      data: [actualLoss1[0], actualLoss2[0], actualLoss3[0], actualLoss4[0]],
      borderColor: '#999999',
      backgroundColor: '#999999',
      stack: 'Stack 0',
    },
    {
      label: 'DC Efficiency',
      data: [efficeincy1[1], efficeincy2[1], efficeincy3[1], efficeincy4[1]],
      borderColor: '#113F4A',
      backgroundColor: '#113F4A',
      stack: 'Stack 1',
    },
    {
      label: 'DC Loss',
      data: [actualLoss1[1], actualLoss2[1], actualLoss3[1], actualLoss4[1]],
      borderColor: '#999999',
      backgroundColor: '#999999',
      stack: 'Stack 1',
    },
    {
      label: 'AC Efficiency',
      data: [efficeincy1[2], efficeincy2[2], efficeincy3[2], efficeincy4[2]],
      borderColor: '#113F4A',
      backgroundColor: '#113F4A',
      stack: 'Stack 2',
    },
    {
      label: 'AC Loss',
      data: [actualLoss1[2], actualLoss2[2], actualLoss3[2], actualLoss4[2]],
      borderColor: '#999999',
      backgroundColor: '#999999',
      stack: 'Stack 2',
    },
    {
      label: 'Other Efficiency',
      data: [efficeincy1[3], efficeincy2[3], efficeincy3[3], efficeincy4[3]],
      borderColor: '#113F4A',
      backgroundColor: '#113F4A',
      stack: 'Stack 3',
    },
    {
      label: 'Other Loss',
      data: [actualLoss1[3], actualLoss2[3], actualLoss3[3], actualLoss4[3]],
      borderColor: '#999999',
      backgroundColor: '#999999',
      stack: 'Stack 3',
    },

  ],
};


export const Maxdata = 10017
const LossDiagram = ({ Maxdata }: any) => {
  return (
    <div>
      <p className='text-center'>Loss</p>
      <div className="h2"></div>
      <div className='loss-chart'>
        <Bar options={options as any} data={data} />
      </div>
    </div>
  )

}

export default memo(LossDiagram);



