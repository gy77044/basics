
import {Chart as ChartJS,LineElement,CategoryScale,LinearScale,PointElement,Title,Tooltip,Legend} from 'chart.js';
import datas from './ProfileData.json';
import { Line } from 'react-chartjs-2';
import { useAppSelector } from '../../../../../../ReduxTool/store/hooks';
export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Profile Chart',
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
        display: true,
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
        text: "System power generated (in kW)",
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
export function ProfileChart() {
  const {generationSam} = useAppSelector(state=>state.EPCDetails.roofAnalysis);
  if(!Object.keys(generationSam).length){
    console.log('genartion api for sam did not worked!!')
    return <></>
  }
  if(!generationSam || generationSam === undefined) return <></>
  const monthlyTotalHours = sliceIntoChunks12Months(generationSam['hourly data']);

let yearTotalarr: any[] = [];

monthlyTotalHours.forEach(monthElem => {
  const sumArray = [];
  var avgArray: any = [];
  let subArray = sliceIntoChunks(monthElem, 24);
  let subLenth = subArray.length;
  let index = 0;
  let finalArr = []
  while (subLenth) {
    let tempsum = 0;
    subArray.forEach(element => {
      if (element[index] != undefined) tempsum = tempsum + element[index];
    });
    index = index + 1;
    finalArr.push(tempsum);
    subLenth--;
  }
  yearTotalarr.push(finalArr);
});

function sliceIntoChunks(arr: string | any[], chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr?.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

function sliceIntoChunks12Months(arr: string | any[]) {
  
  const res = [];
  let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let counter = 0;
  for (let index = 0; index < days.length; index++) {
    const chunk = arr?.slice(counter, counter + (days[index] * 24));
    counter = counter + (days[index] * 24);
    res.push(chunk);
  }
  return res;
}
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const d = getDataArr(yearTotalarr);

function getDataArr(yearTotalarr: any[]) {
  let dataObj: any[] = []
  yearTotalarr.forEach((element, i) => {
    dataObj.push({
      labels,
      datasets: [{
        label: month[i],
        data: element,
        fill: true,
        backgroundColor: "#113f4a",
        borderColor: "#113f4a",
        borderWidth: 4,
        pointRadius: 0,
        tension: 0.4,
      },],
    })
  });
  return dataObj;
}
  return (
    <div className=''>
      <p className='text-center'>Hourly predicted energy - 12 months</p>
      <div className="h2"></div>
      <div className='flex flex-wrap flex-1 justify-between items-center w-[130vh]'>
        {
          d.map(data => (
            <div className='profile-chart bg-white shadow-default border-[0.1vh] border-yellow-400 p-2 m-2'>
              < Line options={options as any} data={data} />
            </div>
          ))
        }
      </div>
    </div>
  );
}