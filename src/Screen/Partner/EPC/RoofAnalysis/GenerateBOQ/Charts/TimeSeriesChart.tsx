import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import datas from './ProfileData.json';
import { useAppSelector } from '../../../../../../ReduxTool/store/hooks';
 
const monthlyTotalHours = datas.slice(0, 8760).map((val) => { return val });
 
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
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
      text: 'Timeseries Chart',
    },
  },
  scales: {   
    x: {
      stacked: true,
      beginAtZero: true,
      min: 0,
      grid: {
        display: false
      },
      ticks: {
        display: false,
      },
    },
 
    y: {
      stacked: true,
      beginAtZero: true,
      min: 0,
      grid: {
        color: "#b7c5c8",
        borderDash: [20, 10],
        borderColor: "#4F504C",
        tickColor: "#4F504C"
      },
      title: {
        display: true,
        text: "System Generated (kW)",
        color: "#4F504C",
        font: {
          size: 12,
          weight: "500"
        }
      },
      ticks: {
        display: true,
      },
 
    }
  }
};
 
export function getLabels(datas: number[]) {
  return datas
}
 
// export const labels = monthlyTotalHours;
 
export function TimeSeriesChart() {
  const monthlyTotalHours = useAppSelector(state => state.pvTable.graphData)
  console.log("monthlyTotalHours",monthlyTotalHours)
  
 
  const HoursData = monthlyTotalHours.slice(0, 8760).map((val) => val);
 
  const labels = getLabels(HoursData)
 
  const data = {
    labels,
    datasets: [{
      label: 'Prdeicted Enegry',
      data: HoursData,
      fill: true,
      backgroundColor: "#113f4a",
      borderColor: "#113f4a",
      borderWidth: 1,
      pointRadius: 0,
      tension: 0.4
    },]
 
  }
 
  return (
    <div>
      <p className='text-center'>Monthly generation profile</p>
      <div className="h2"></div>
      <div className='time-chart'>
        <Line options={options as any} data={data} />
      </div>
    </div>
  )
}



// import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip, PointElement, LineController } from 'chart.js';
// import { Chart, Line } from 'react-chartjs-2';
// import datas from './ProfileData.json';
// import { useAppSelector } from '../../../../../../ReduxTool/store/hooks';
// import { useRef } from 'react';

// // Register all necessary elements
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineController);

// const monthlyTotalHours = datas.slice(0, 8760).map((val) => { return val });

// export const options = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: 'top' as const,
//     },
//     title: {
//       display: false,
//       text: 'Timeseries Chart',
//     },
//   },
//   // scales configuration (optional)
// };

// export function getLabels(datas: number[]) {
//   return datas;
// }

// export function TimeSeriesChart() {
//   const monthlyTotalHours = useAppSelector(state => state.pvTable.graphData);

//   const HoursData = monthlyTotalHours.slice(0, 8760).map((val) => val);

//   const labels = getLabels(HoursData);

//   const data = {
//     labels,
//     datasets: [{
//       label: 'Predicted Energy',
//       data: HoursData,
//       fill: true,
//       backgroundColor: "#113f4a",
//       borderColor: "#113f4a",
//       borderWidth: 1,
//       pointRadius: 0,
//       tension: 0.4
//     }]
//   };

//   const data_ = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//     datasets: [
//       {
//         label: "First dataset",
//         data: [33, 53, 85, 41, 44, 65],
//         fill: true,
//         backgroundColor: "rgba(75,192,192,0.2)",
//         borderColor: "rgba(75,192,192,1)"
//       },
//       {
//         label: "Second dataset",
//         data: [33, 25, 35, 51, 54, 76],
//         fill: false,
//         borderColor: "#742774"
//       }
//     ]
//   };

//   const ref = useRef();

//   const data_1 = {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//     datasets: [
//       {
//         label: 'First dataset',
//         data: [33, 53, 85, 41, 44, 65],
//         fill: true,
//         backgroundColor: 'rgba(75,192,192,0.2)',
//         borderColor: 'rgba(75,192,192,1)'
//       },
//       {
//         label: 'Second dataset',
//         data: [33, 25, 35, 51, 54, 76],
//         fill: false,
//         borderColor: '#742774',
//       },
//     ],
//   };
  


//   return (
//     <div>
//       <p className='text-center'>Monthly generation profile</p>
//       <div className="h2"></div>
//       <div className='time-chart'>
//         <Line data={data_}  />
//       </div>
//     </div>
//   );
// }
