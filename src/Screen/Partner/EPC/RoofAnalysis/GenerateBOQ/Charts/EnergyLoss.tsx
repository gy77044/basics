

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
import datas from './Eneryloss.json';


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
            position: 'left' as const,
            display: false,
        },
        title: {
            display: false,
            text: 'Energy Losses',
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

const labels = ['poa_front_side_shadding_loss',
    'poa_front_side_soiling_loss',
    'poa_front_side_irrtion_loss',
    'dc_module_deviation_from_stc',
    'dc_inverter_MPPT_cliping_loss',
    'dc_mismatch_loss',
    'dc_diodes_connection_loss',
    'dc_wiring_loss',
    'dc_tracking_loss',
    'dc_nameplate_loss',
    'dc_power_optimizer_loss',
    'dc_performance_adjustment_loss',
    'ac_inverter_power_clipping_loss',
    'ac_inverter_power_consumption_loss',
    'ac_inverter_night_tare_loss',
    'ac_inverter_efficiency_loss',
    'ac_wiring_loss',
    'transformer_loss_percentage',
    'ac_performance_adjustment_loss'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Monthly',
            data: datas.map((val) => { return (val) }),
            backgroundColor: '#0c2d35',
        },
    ],
};

export function EnergyLoss() {
    return (
        <div>
            <p className='text-center'>Energy Loss</p>
            <div className="h2"></div>
            <div className='energy-chart'>
                <Bar options={options as any} data={data} />
            </div>
        </div>


    )

}