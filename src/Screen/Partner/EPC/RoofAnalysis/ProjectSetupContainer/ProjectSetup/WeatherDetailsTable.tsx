import { useAppSelector } from '../../../../../../ReduxTool/store/hooks';

export default function WeatherDetailsTable() {
    const { roofAnalysis: {dataSource} } = useAppSelector(state => state.EPCDetails)    
    return (
        <div className='rounded-lg border border-gray-200 bg-gray-100 p-4'>
        <div className="overflow-x-auto">
            {/* <div className="table-name">Project Details</div> */}
            <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className='text-left'>
                    <tr>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
                        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Details</th>
                    </tr>
                </thead>
                <tbody>
                     <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Data Type</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 ">Synthetic Monthly</td>
                    </tr>
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Avg. Ambient Temprature</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource?.avgtemp?.toFixed(4)??"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">City</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 ">{dataSource?.city??"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Latitude & Longitude</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource?.latitude?.toFixed(4)??"-"} & {dataSource?.longitude?.toFixed(4)??"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Distance From Site</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource.distancefromsite?dataSource.distancefromsite?.toFixed(4)+" km":"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Elevation</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource?.elevation??"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">GHI</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource.avgGHI?<>{dataSource.avgGHI?.toFixed(4)??"0"} kWh/m <sup>2</sup></>:"-"}</td>
                    </tr>
                    {/* <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Last Updated On</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource.lastupdatedon?moment(dataSource?.lastupdatedon).format("DD-MM-YYYY HH:mm"):"-"}</td>
                    </tr> */}
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">DNI</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource.avgDNI?<>{dataSource?.avgDNI?.toFixed(4)??"0"} kWh/m<sup>2</sup></>:"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">GIC</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource?.gic??"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Wind Speed</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource.windspeed?<>{dataSource?.windspeed?.toFixed(4)??"0"} m/s</>:"-"}</td>
                    </tr>
                    <tr className='trow'>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Snowfall</td>
                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{dataSource?.snow??"-"}</td>
                    </tr>
                </tbody>
            </table>
            {/* <div className="table-footer">
                <button className="light-sm-btn">
                    Add Obstruction
                </button>
            </div> */}
        </div>
        </div>
    )
}
