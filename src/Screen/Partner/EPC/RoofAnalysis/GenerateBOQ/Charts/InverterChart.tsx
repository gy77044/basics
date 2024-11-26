import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';

interface Iprops {
  vdco: number,
  pdco: number
  pso: number,
  paco: number,
  mppt_low: number,
  mppt_hi: number,
  c0: number,
  c1: number,
  c2: number,
  c3: number,
  pnt: number,
  v_dc: number
}


export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
      text: 'Inverter Chart',
    },
  },
  scales: {
    secondX: {
      grid: {
        display: false
      },
      position: 'bottom' as const,
      title: {
        display: true,
        text: `10             20              30              40              50              60              70            80            90            100`,
        color: "#4F504C",
        font: {
          size: 12,
          weight: "500",
        }
      },
      ticks: {
        display: false,
      },
      /* text: "Module Voltage (Volts)", */
    },

    x: {
      stacked: true,
      beginAtZero: true,
      min: 0,
      grid: {
        display: false
      },
      title: {
        display: true,
        text: `% of Rated Output Power`,
        color: "#4F504C",
        font: {
          size: 12,
          weight: "500",
        }
      },
      ticks: {
        display: false,
      },
    },


    y: {
      stacked: true,
      reverse: false,
      beginAtZero: true,
      offset: true,
      min: 60,
      max: 100,
      grid: {
        color: "#b7c5c8",
        borderDash: [20, 10],
        borderColor: "#4F504C",
        tickColor: "#4F504C"
      },
      title: {
        display: true,
        text: "Efficiency (in %)",
        color: "#4F504C",
        font: {
          size: 12,
          weight: "500"
        }
      },
    }
  }
};

/* const labels = [0, 20, 40, 60, 80, 100]; */

const InverterChart: React.FC<Iprops> = (props) => {

  // const inverterInfo = useAppSelector(state => state.selection.inverter)
  // const invPower = useAppSelector(state => state.selection.power)

  const [state, setState] = useState<{ xVal: number[], YVal: number[] }>({ xVal: [], YVal: [] })

  var bolShowmppt_low = (props.mppt_low != 0)
  var bolShowmppt_hi = (props.mppt_hi != 0)

  const plot_inverter_curve = (indexval: number) => {


    if (indexval == 0) {
      bolShowmppt_low = false;
      bolShowmppt_hi = false
    }
    else if (indexval == 1) {
      bolShowmppt_low = true;
      bolShowmppt_hi = false
    }
    else if (indexval == 2) {
      bolShowmppt_low = false;
      bolShowmppt_hi = true
    }

    //assign initial values
    var i = 0
    var pdc = 0
    var pac = 0

    //arrays in which to store points
    var array_size: number[] = []
    var array_size1: number[] = []
    var array_size_xlow: number[] = []
    var array_size_xhi: number[] = []
    var array_size1_ylow: number[] = []
    var array_size1_yhi: number[] = []

    var x = (array_size)
    var xlow = (array_size_xlow)
    var xhi = (array_size_xhi)
    var y = (array_size1)
    var ylow = (array_size1_yhi)
    var yhi = (array_size1_ylow)


    x[i] =
      y[i] = 0
    if (bolShowmppt_low) {
      xlow[i] = pdc
      ylow[i] = 0
    }
    if (bolShowmppt_hi) {
      xhi[i] = pdc
      yhi[i] = 0

    }

    i = i + 1

    //INTERMEDIATE POINTS
    while (i < 200) {
      pdc = props.pdco * i / 200
      // #increment in 200 even partitions
      pac = snlinverter(pdc, props.vdco, props.vdco, props.pdco, props.pso, props.paco, props.c0, props.c1, props.c2, props.c3)
      //# pac = snlinverter(pdc,vdco,vdco,pdco,pso,paco,c0,c1,c2,c3)
      x[i] = (pdc / props.pdco * 100)                 // # percentage of rated power
      y[i] = (pac / pdc * 100)                    // # efficiency
      if (bolShowmppt_low) {
        pac = snlinverter(pdc, props.mppt_low, props.vdco, props.pdco, props.pso, props.paco, props.c0, props.c1, props.c2, props.c3)
        xlow[i] = (pdc / props.pdco * 100)              //# percentage of rated power
        ylow[i] = (pac / pdc * 100)                   //# efficiency

      }



      if (bolShowmppt_hi) {

        pac = snlinverter(pdc, props.mppt_hi, props.vdco, props.pdco, props.pso, props.paco, props.c0, props.c1, props.c2, props.c3)
        xhi[i] = (pdc / props.pdco * 100)              // # percentage of rated power
        yhi[i] = (pac / pdc * 100)                   // # efficiency 
      }
      i = i + 1
    }

    pdc = props.pdco
    pac = snlinverter(pdc, props.vdco, props.vdco, props.pdco, props.pso, props.paco, props.c0, props.c1, props.c2, props.c3)
    x[i] = (pdc / props.pdco * 100)
    y[i] = (pac / pdc * 100)
    pac = snlinverter(pdc, props.mppt_low, props.vdco, props.pdco, props.pso, props.paco, props.c0, props.c1, props.c2, props.c3)
    if (bolShowmppt_low) {
      xlow[i] = (pdc / props.pdco * 100)
      ylow[i] = (pac / pdc * 100)
    }

    if (bolShowmppt_hi) {
      pac = snlinverter(pdc, props.mppt_hi, props.vdco, props.pdco, props.pso, props.paco, props.c0, props.c1, props.c2, props.c3)
      xhi[i] = (pdc / props.pdco * 100)
      yhi[i] = (pac / pdc * 100)
    }

    return { xlow, ylow, xhi, yhi, x, y }

  }

  const snlinverter = (pdc: number, vdco: number, vdco1: number, pdco: number, pso: number, paco: number, c0: number, c1: number, c2: number, c3: number) => {

    const A = pdco * (1 + c1 * (props.v_dc - vdco))
    const B = pso * (1 + c2 * (props.v_dc - vdco))
    const C = c0 * (1 + c3 * (props.v_dc - vdco))

    var ac_power = (paco / (A - B) - C * (A - B)) * (pdc - B) + C * ((pdc - B) ** 2)
    ac_power = Math.min(paco, ac_power)

    ac_power = pdc < pso ? -1.0 * Math.abs(props.pnt) : ac_power

    // console.log("pdc", pdc, ac_power)
    // ac_power = pdc
    return ac_power
  }


  const a: any = plot_inverter_curve(0);
  const b: any = plot_inverter_curve(1);
  const c: any = plot_inverter_curve(2);
  const labels = a.x;
  const data = {
    labels,
    datasets: [
      {
        label: 'Vdco',
        data: a.y,
        borderColor: '#7367F0',
        backgroundColor: '#7367F0',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
      },
      
    ],
  };


  return (
    <div>
      <div className="h4"></div>
      <p className='text-center text-primary-200'>Inverter Efficiency Curve</p>
      <div className="h2"></div>
      <div className='inverter-chart'>
        <Line data={data} options={options as any} />
      </div>
    </div>
  )
};

export default InverterChart;
