import React, { memo } from "react";
import { TimeSeriesChart } from "./Charts/TimeSeriesChart";
import LossDiagram from "./Charts/LossDiagram";
import { EnergyLoss } from "./Charts/EnergyLoss";
import { ProfileChart } from "./Charts/ProfileChart";
import HeatmapChart from "./Charts/Heatmap";




const TabsRender = () => {
    const [openTab, setOpenTab] = React.useState(1);
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full">
                    <ul
                        className="flex mb-0 list-none flex-wrap pt-1 pb-3 flex-row"
                        role="tablist"
                    >
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-1.3xl font-medium uppercase px-0.8 py-1.2 shadow-default rounded-default block leading-normal " +
                                    (openTab === 1
                                        ? "text-white bg-primary-200" : "text-primary-200 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist"
                            >
                                Profile Chart
                            </a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-1.3xl font-medium uppercase px-0.8 py-1.2 shadow-default rounded-default block leading-normal " +
                                    (openTab === 2
                                        ? "text-white bg-primary-200" : "text-primary-200 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist"
                            >
                                Loss Chart
                            </a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-1.3xl font-medium uppercase px-0.8 py-1.2 shadow-default rounded-default block leading-normal " +
                                    (openTab === 3
                                        ? "text-white bg-primary-200" : "text-primary-200 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(3);
                                }}
                                data-toggle="tab"
                                href="#link3"
                                role="tablist"
                            >
                                Energy Loss
                            </a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-1.3xl font-medium uppercase px-0.8 py-1.2 shadow-default rounded-default block leading-normal " +
                                    (openTab === 4
                                        ? "text-white bg-primary-200" : "text-primary-200 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(4);
                                }}
                                data-toggle="tab"
                                href="#link4"
                                role="tablist"
                            >
                                Timeseries Chart
                            </a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-1.3xl font-medium uppercase px-0.8 py-1.2 shadow-default rounded-default block leading-normal " +
                                    (openTab === 5
                                        ? "text-white bg-primary-200" : "text-primary-200 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(5);
                                }}
                                data-toggle="tab"
                                href="#link5"
                                role="tablist"
                            >
                                Heatmap Chart
                            </a>
                        </li>
                    </ul>
                    <div className="relative flex flex-1 flex-wrap justify-between items-center bg-transparent overflow-auto custom-scrollbar-css h-[40vh]">
                        <div className="px-4 py-2 flex-auto">
                            <div className="tab-content tab-space">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <p>
                                    <ProfileChart /> 
                                    </p>
                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <p>
                                        <LossDiagram />
                                    </p>
                                </div>
                                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                                    <p>
                                        <EnergyLoss />
                                    </p>
                                </div>
                                <div className={openTab === 4 ? "block" : "hidden"} id="link4">
                                    <p>
                                    <TimeSeriesChart />

                                    </p>
                                </div>
                                <div className={openTab === 5 ? "block" : "hidden"} id="link5">
                                    <p>
                                        <HeatmapChart />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
 
};
export default memo(TabsRender)
