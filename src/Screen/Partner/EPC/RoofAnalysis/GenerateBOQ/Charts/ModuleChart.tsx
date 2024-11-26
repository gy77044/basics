import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

interface Iprops {
  i_l_ref: number
  i_o_ref: number
  r_s: number
  a_ref: number
  r_sh_ref: number
  i_mp_ref: number
  cec_v_mp_ref: number
  cec_i_sc_ref: number
  cec_v_oc_ref: number
}

const ModuleChart: React.FC<Iprops> = (props) => {
  // Define the voltage and current data arrays

  const [limit, setLimit] = useState<{ xLim: any, yLim: any }>({ xLim: 0, yLim: 0 })
  const [axis, setaxis] = useState<{ x: number[], y: number[] }>({ x: [], y: [] })

  const current_at_voltage_cec = (Vmodule: number, IL_ref: number, IO_ref: number, RS: number, A_ref: number, RSH_ref: number, I_mp_ref: number): number => {
    let F: number = 0;
    let Fprime: number = 0;
    let Iold: number = 0.0;
    let Inew: number = I_mp_ref;

    let itn: number = 0;
    let bpoint: number = 1;
    const MAXIT: number = 4000;

    while (bpoint) {
      if (Math.abs(Inew - Iold) > 1.0e-4 && itn < MAXIT) {
        itn += 1;
        Iold = Inew;
        F = IL_ref - Iold - IO_ref * (Math.exp((Vmodule + Iold * RS) / A_ref) - 1.0) - (Vmodule + Iold * RS) / RSH_ref;
        Fprime = -1.0 - IO_ref * (RS / A_ref) * Math.exp((Vmodule + Iold * RS) / A_ref) - (RS / RSH_ref);
        Inew = Math.max(0.0, (Iold - (F / Fprime)));
      }
      else {
        bpoint = 0;
      }
    }
    return Inew;
  }

  const cec_module_plot = () => {
    var x: number[] = [];   // voltage as x
    var y: number[] = [];  // y
    var interval = props.cec_v_mp_ref / 300

    x[0] = 0
    y[0] = props.cec_i_sc_ref

    var i = 1

    var Vcec = 0, Icec = 0

    while (i < 300) {
      Vcec = i * interval
      Icec = current_at_voltage_cec(Vcec, props.i_l_ref, props.i_o_ref, props.r_s, props.a_ref, props.r_sh_ref, props.i_mp_ref)
      x[i] = Vcec
      y[i] = Icec
      i = i + 1
    }

    x[i] = props.cec_v_mp_ref
    y[i] = props.i_mp_ref
    i = i + 1

    interval = (props.cec_v_oc_ref - props.cec_v_mp_ref) / 300
    while (i < 601) {
      Vcec = (props.cec_v_mp_ref) + (i - 300) * interval
      Icec = current_at_voltage_cec(Vcec, props.i_l_ref, props.i_o_ref, props.r_s, props.a_ref, props.r_sh_ref, props.i_mp_ref)
      x[i] = Vcec
      y[i] = Icec
      i = i + 1
    }

    x[i] = props.cec_v_oc_ref
    y[i] = 0

    let xlimit = Math.ceil(props.cec_v_oc_ref)
    let ylimit = (Math.max(...y) + 0.5)

    setLimit({ xLim: xlimit, yLim: ylimit })
    setaxis({ x, y })

    //   xlimit=(math.ceil(props.cec_v_oc_ref))
    // ylim=(max(y)+0.5)
    // plt.plot(x,y, linewidth=2, color='red')
    // plt.xlim(0,xlimit)
    // plt.ylim(0,ylim)
    // plt.xlabel('Module Voltage (Volts)')
    // plt.ylabel('Module Current (Amps)')
    // plt.title('sunPower SPR-X21-335')
    // plt.show(block=True)


  }

  useEffect(() => {
    cec_module_plot()
  }, [])

  // Populate the voltage and current arrays
  // using the same algorithm as in the Python code

  const data = {
    labels: axis.x,
    datasets: [
      {
        label: 'IV Curve',
        data: axis.y,
        fill: false,
        borderColor: "#FF881B",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.8
      }
    ]
  };


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Module Sunpower SPR-X21-335'
      }
    },
    scales: {
      secondX: {
        grid: {
          display: false
        },
        position: 'bottom' as const,
        title: {
          display: true,
          text: `10               20                30                40                50                60                70              80`,
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
          text: `Module Voltage (Volts)`,
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
          text: "Module current (Amps)",
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

  return (
    <div>
      <p className='text-center text-primary-200'>Module</p>
      <div className="h2"></div>
      <div className='module-chart'>
        <Line data={data} options={options as any} />
      </div>
    </div>
  )
};

export default ModuleChart;
