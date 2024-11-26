import { saveAs } from 'file-saver'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import * as XLSX from 'xlsx'
import { IconEdit } from '../../../../../assests/icons/DrawerIcons'
import { IconSave, IconSim } from '../../../../../assests/icons/MapToolsIcons'
import logoimage from "../../../../../assests/img/Dashboard/EPC/terranxt_logo 1.png"
import { SubTable, TableCheckBtn } from '../../../../../Components/AllInput/AllInput'
import RingLoader from '../../../../../Components/Loaders/RingLoader'
import { getScreenShot } from '../../../../../lib/ScreenShot/getScreenShot'
import { ProjectTy } from '../../../../../ReduxTool/Slice/Auth/types'
import { BOQEPCDetails, fetchCountryDetails, miscellaneousdetailsTy, setSelectedProject } from '../../../../../ReduxTool/Slice/Partner/EPC'
import { useAppSelector } from '../../../../../ReduxTool/store/hooks'
import { baseURL, requestUrl } from '../../../../../Utils/baseUrls'
import { calculateRatio, dcPowerBasedOnSanctionload, downloadPDFFile, fetchCompleteAddressStr, getfilterObjKeysByArr, getInverterQuantity, getStateAbbreviations, toTitleCase } from '../../../../../Utils/commonFunctions'
import { fetchCompleteAddress } from '../../../../../Utils/EPCMaps/Maps/LazyloadMap'
import { Accordion1 } from '../../LeadBoard/PvnxtLeads/PvNxtLeads'
import ChartTabs from './ChartsTabs'
const GenerateBOQI: React.FC<any> = () => {
    const dispatch = useDispatch()
    const { roofDetails, roofDesign, roofDetailsIndx, moduleDetails, moduleInverterDetails, formDetails: { miscellaneousdesign: { generationModelType, needLifeline, needWalkWay, needMonitoringSys, needModuleCleaning, needFirefightingSys }, projectsetup }, selectedProject, generationPvNxt, generationSam } = useAppSelector(state => state.EPCDetails.roofAnalysis);
    const { user, userid, epcuserid, epCuser } = useAppSelector((state) => state.EPCDetails.roofAnalysis.selectedProject) as ProjectTy
    const [isEditing, setIsEditing] = useState(false);
    const { accbTableList } = useAppSelector((state) => state.electricalEquipmentDesigningSlice);
    const { auth } = useAppSelector((state) => state)
    const [epcUser, setEpcUser] = useState<BOQEPCDetails>({ name: "loading...", companyname: "loading...", registrationNo: "loading...", serviceState: "loading...", email: "loading...", mobile: "" })
    const [isloading, setisLoading] = useState<boolean>(false)
    const [consumerCountryCode, setConsumerCountryCode] = useState<string>("")
    const formattedData = (item: miscellaneousdetailsTy) => ({
        Particular: item.Particular,
        Quantity: item.Quantity,
        UOM: item.UOM,
        "Proposed Make": item['Proposed Make'],
        Specification: item.Specification

    })
    const formattedDataTable = (item: miscellaneousdetailsTy, i: number) => ({
        "S.No": i + 1,
        "Equipment Name": item.Particular,
        Quantity: item.Quantity,
        UOM: item.UOM,
        "Proposed Make": item['Proposed Make'],
        Specification: item.Specification

    })
    // console.log("epc user",epcUser)
    useEffect(() => {
        const fetchEpcDetails = async () => {
            try {
                const { data } = await baseURL.get(`${requestUrl.saveEPC}/${auth.user.epcid}`)
                if (data.code === "200") {
                    setEpcUser({ name: `${auth.user.fname} ${auth.user.lname}`, companyname: data.responseData.companyname, registrationNo: data.responseData.registrationnumber, serviceState: getStateAbbreviations(data.responseData.serviceablestate.map((each: any) => each.state)), email: `${auth.user.emailid}`, mobile: auth.user.mobile !== null ? `${auth.user.country_mstr?.countrycode}${auth.user.mobile}` : "" })
                }
            }
            catch (error) {
                console.log("err", error)
            }
        }
        if (auth.user.epcid) {
            fetchEpcDetails()
        } else {
            setEpcUser({ name: "Team Terranxt", companyname: "Terranxt Pvt Ltd", registrationNo: "U74999HR2020PTC089683", serviceState: "Worldwide", email: "admin@terranxt.com", mobile: "+919719499553", })
        }
        // fetch country code 
        const fetchCountryCode = async () => {
            try {
                let countryid = userid ? user.countryid : epCuser.countryid;
                if (!countryid) { throw new Error("country id not found") }
                const countrydetails = await fetchCountryDetails(countryid)
                if (countrydetails) {
                    setConsumerCountryCode(countrydetails.countrycode)
                }
            }
            catch (err) {
                console.log("err", err)
            }
        }
        fetchCountryCode();
    }, [])

    const EpcDetails = [
        { name: "EPC Contact Person Name", details: `${epcUser.name}` },
        { name: "Company Name", details: epcUser.companyname },
        { name: "Service Area", details: epcUser.serviceState },
        { name: "Registration Number", details: epcUser.registrationNo },
        { name: "Mobile", details: `${epcUser.mobile}` }
    ]
    const consumerDetails = [
        { name: "Project Name", details: (selectedProject as ProjectTy).projectname },
        { name: "Consumer Name", details: `${toTitleCase(userid ? user?.fname : epCuser?.fname)} ${(user?.lname || epCuser?.lname) !== null ? toTitleCase(userid ? user?.lname : epCuser?.lname) : ""}` },
        { name: "Project Address", details: ` ${toTitleCase((selectedProject as ProjectTy)?.address ? (selectedProject as ProjectTy)?.address : userid ? user?.address : epCuser?.address ?? '-')}` },
        { name: "Email", details: `${toTitleCase(userid ? user?.emailid : epCuser?.emailid || '--')}` },
        { name: "Mobile", details: `${consumerCountryCode}${userid ? user?.mobile : epCuser?.mobile || '--'}` },
    ]

    const BOQIData = [
        { name: "Yearly Generation", pvNXT: generationModelType.pvNXT ? `${(generationPvNxt && generationPvNxt?.pv_combined_out && generationPvNxt?.pv_combined_out.sum) ? (generationPvNxt?.pv_combined_out.sum)?.toFixed(3) + ' Units' : '-'}` : '', SAM: generationModelType.SAM ? (generationSam && generationSam['annual energy=']) ? `${(generationSam && generationSam['annual energy='] && generationSam['annual energy=']?.length) ? generationSam['annual energy='][0].toFixed(3) + ' Units' : '-'}` : '-' : '', },
        { name: "Specific Production", pvNXT: generationModelType.pvNXT?"-":"", SAM:generationModelType.SAM?"-":"" },
        // { name: "Performance Ratio", pvNXT: generationModelType.pvNXT ? Object.keys(generationSam).length > 0 ? generationSam["Performance ratio in Year 1"][0]?.toFixed(4) : "-" : "", SAM: generationModelType.SAM?Object.keys(generationSam).length > 0 ? generationSam["Performance ratio in Year 1"][0]?.toFixed(4) : "-":""},
        { name: "Project DC Capacity", pvNXT: generationModelType.pvNXT? Object.keys(generationPvNxt).length>0 ? generationPvNxt["DC Capacity Factor in 1 year"]?.sum:"-":"", SAM: generationModelType.SAM?Object.keys(generationSam).length > 0 ? generationSam['DC capacity factor in Year 1'][0]?.toFixed(4): "-" : "" },
        { name: "DC:AC", pvNXT: generationModelType.pvNXT?Object.keys(generationPvNxt).length>0 ? generationPvNxt["AC DC Ratio"]?.sum:"-":""/*calculateRatio(parseFloat(selectedProject?.sanctionload?.toString()), parseFloat(dcPowerBasedOnSanctionload(parseFloat(selectedProject?.sanctionload?.toString()))))*/, SAM: generationModelType.SAM?Object.keys(generationSam).length > 0 ? generationSam['ACDC Ratio'][0] || "-": "-":""},
        { name: "Price Submitted", pvNXT: (selectedProject as ProjectTy).projectcost !== "" ? (selectedProject as ProjectTy).projectcost : "-", SAM: "" }
    ];

    const projectDetails = [
        { Name: "Yearly Generation", pvNXT: generationModelType?.pvNXT ? `${(generationPvNxt && generationPvNxt?.pv_combined_out && generationPvNxt?.pv_combined_out.sum) ? (generationPvNxt?.pv_combined_out.sum)?.toFixed(3) + ' Units' : '-'}` : '', SAM: generationModelType.SAM ? `${(generationSam && generationSam['annual energy='] && generationSam['annual energy=']?.length) ? generationSam['annual energy='][0].toFixed(3) + ' Units' : '-'}` : '-', },
        { Name: "Specific Production", pvNXT: "-", SAM: "" },
        // { Name: "Performance Ratio", pvNXT: Object.keys(generationSam).length > 0 ? generationSam["Performance ratio in Year 1"][0]?.toFixed(4) : "-", SAM: ""/*`${(performanceRatio! * 100).toFixed(2)} %`,SAM:`${(performanceRatio! * 100).toFixed(2)} %` }*/ },
        { Name: "Project DC Capacity", pvNXT: selectedProject.sanctionload + " kWp", SAM: "" },
        { label: "DC:AC", value: calculateRatio(parseFloat(selectedProject?.sanctionload?.toString()), parseFloat(dcPowerBasedOnSanctionload(parseFloat(selectedProject?.sanctionload?.toString())))) },
        { Name: "Price Submitted", pvNXT: (selectedProject as ProjectTy).projectcost !== "" ? (selectedProject as ProjectTy).projectcost : "-", SAM: "" }
    ]

    const DCCables = [{ "S.No": 1, "Equipment Name": "Modules to Inverter", "UOM": "m", "Quantity": roofDetails[roofDetailsIndx!]?.electricalDetails?.moduletoinverterdistance, "Proposed Make": "Finolex", "Specification": roofDetails[roofDetailsIndx!]?.electricalDetails?.cablebtwmoduleandinverter?.label }];
    const DCEarthing = [{ "S.No": 1, "Equipment Name": "DC Earthing & LA Earthing", "UOM": "Set", "Quantity": "-", "Proposed Make": "-", "Specification": "-" }];
    const ACCables = [
        { "S.No": 1, "Equipment Name": "Inverter to ACCB", "UOM": "m", "Quantity": roofDetails[roofDetailsIndx!]?.electricalDetails.invertertoaccbdistance, "Proposed Make": "Finolex", "Specification": roofDetails[roofDetailsIndx!]?.electricalDetails.cablebtwaccbandtp?.label/*getElementByIndex(filterKeyIncludeArr(cableBtwACCBAndTP,"accableid",lossCalculation?.cablebtwaccbandtp),0,"mfgname")??"-"*/ },
        { "S.No": 2, "Equipment Name": "ACCB to Termination Point", "UOM": "m", "Quantity": roofDetails[roofDetailsIndx!]?.electricalDetails.invertertoaccbdistance, "Proposed Make": "-", "Specification": roofDetails[roofDetailsIndx!]?.electricalDetails.cablebtwaccbandtp?.label },
    ];
    const mouleTb = [
        { "S.No": 1, "Equipment Name": moduleDetails?.name ?? "-", "UOM": "kWp", "Quantity": roofDesign?.totalModules ?? "-", "Proposed Make": moduleDetails?.manufacturer ?? "-", "Specification": `${moduleDetails?.stname ?? "-"}/${(moduleDetails?.i_mp_ref ?? 0) + (moduleDetails?.v_mp_ref ?? 0)} Wp/, ${moduleDetails?.ptc ?? "-"}Cell, ${moduleDetails?.manufacturer ?? "-"}; ${moduleDetails?.technology ?? "-"},. Positive Power Tolerances: ${moduleDetails?.version ?? "-"}` },
        { "S.No": 2, "Equipment Name": moduleInverterDetails?.name ?? "-", "UOM": moduleInverterDetails?.name ? "kW" : "-", "Quantity": getInverterQuantity(parseFloat(roofDetails[roofDetailsIndx!]?.structureDetails?.sanctionload ?? 0), moduleInverterDetails?.paco ?? 0), "Proposed Make": (selectedProject as ProjectTy).pvinverter?.name, "Specification": moduleInverterDetails?.stname ?? "-" /*Al conductor, XLPEinsulated, armoured, 1100V`*/ },
        { "S.No": 3, "Equipment Name": "AC Combiner Box (ACCB)", "UOM": "Nos", "Quantity": "-", "Proposed Make": "-", "Specification": accbTableList.length > 0 ? `${accbTableList[0]?.ACCBName} ${accbTableList[0]?.SPDType} , ${accbTableList[0]?.accuracyClassOfMFMs}, ${accbTableList[0]?.noOfIncomingTeriminals} incoming terminals ${accbTableList[0]?.noOfOutGoingTeriminals} outgoing terminals ${accbTableList[0]?.noOfMFMs}.` : "-" },
    ];

    const civilAndMMS = [
        { "S.No": 1, "Equipment Name": "Inverter Mounting Arrangment", "UOM": "-", "Quantity": "-", "Proposed Make": "-", "Specification": "-" },
        { "S.No": 2, "Equipment Name": "ACCB Mounting Arrangement", "UOM": "-", "Quantity": "-", "Proposed Make": "-", "Specification": "-" },
        { "S.No": 3, "Equipment Name": "MMS Foundation", "UOM": "-", "Quantity": "-", "Proposed Make": "-", "Specification": "-" },
        { "S.No": 4, "Equipment Name": "Module Mounting Structure", "UOM": "-", "Quantity": "-", "Proposed Make": "-", "Specification": "-" },
    ];
    const ACEarthing = [{ "S.No": 1, "Equipment Name": "AC Earthing & Communication Earthing", "UOM": "Set", "Quantity": "-", "Proposed Make": "-", "Specification": "-" }]

    const downloadPDFData: any = {
        "Project Details": projectDetails,
        "DC Electrical": { "1. DC Cable": DCCables, "2. DC Earthiing": DCEarthing },
        "AC Electrical": { "1. AC Cable": ACCables, "2. AC Earthiing": ACEarthing },
        "Safety Infrastructure": { "1. Lifeline": needLifeline.value === "Yes" ? needLifeline.details.map(item => formattedData(item)) : [], "2. Walkway": needWalkWay.value === "Yes" ? needWalkWay.details.map(item => formattedData(item)) : [], },
        "Monitoring Equipment": needMonitoringSys.value === "Yes" ? needMonitoringSys.details.map(item => formattedData(item)) : [],
        "Module Inverter & ACCB": mouleTb,
        "Civil & MMS": civilAndMMS,
        "Miscellaneos Equipment": { "1. Fire Fighting": needFirefightingSys.value === "Yes" ? needFirefightingSys.details.map(item => formattedData(item)) : [], "2. Module Cleaning": needModuleCleaning.value === "Yes" ? needModuleCleaning.details.map(item => formattedData(item)) : [], },
    };

    const downloadExcelData: any = {
        "Project Details": projectDetails,
        "DC Cable": DCCables,
        "DC Earthing": DCEarthing,
        "AC Cable": ACCables,
        "AC Earthing": ACEarthing,
        "Lifeline": needLifeline.value === "Yes" ? needLifeline.details.map(item => formattedData(item)) : [],
        "Walkway": needWalkWay.value === "Yes" ? needWalkWay.details.map(item => formattedData(item)) : [],
        "Monitoring Equipment": needMonitoringSys.value === "Yes" ? needMonitoringSys.details.map(item => formattedData(item)) : [],
        "Civil & MMS": civilAndMMS,
        "Module Inverter & ACCB": mouleTb,
        "Fire Fighting": needFirefightingSys.value === "Yes" ? needFirefightingSys.details.map(item => formattedData(item)) : [],
        "Module Cleaning": needModuleCleaning.value === "Yes" ? needModuleCleaning.details.map(item => formattedData(item)) : []
    }
    const handleThePriceSubmit = (e: any) => {
        const { name, value } = e.target
        dispatch(setSelectedProject({ ...selectedProject, projectcost: value }))
    }
    const toggleEdit = () => {
        setIsEditing(prev => !prev)
    }
    const generateExcelSheet = (title: string) => {
        const workbook = XLSX.utils.book_new();
        Object.keys(downloadExcelData).forEach((sheetName) => {
            const sheetData = downloadExcelData[sheetName];

            // Truncate sheet name to 31 characters if needed
            let validSheetName = sheetName;
            if (validSheetName.length > 31) {
                validSheetName = validSheetName.substring(0, 28) + '...'; // Add ellipsis for clarity
            }

            const addTableNameToSheet = (tableName: string, sheetData: any) => {
                const worksheetData = XLSX.utils.json_to_sheet(sheetData);
                const worksheetArray: any = XLSX.utils.sheet_to_json(worksheetData, { header: 1 });

                // Create a header that covers the entire row
                const colCount = worksheetArray[0]?.length || 1;
                const header = [[tableName, ...Array(colCount - 1).fill('')]];

                const finalSheetData = header.concat(worksheetArray);
                return finalSheetData;
            };

            if (typeof sheetData === 'object' && !Array.isArray(sheetData)) {
                // For nested objects, create separate sheets
                Object.keys(sheetData).forEach((subSheetName) => {
                    let validSubSheetName = `${validSheetName} - ${subSheetName}`;
                    if (validSubSheetName.length > 31) {
                        validSubSheetName = validSubSheetName.substring(0, 28) + '...';
                    }

                    const subSheetData = sheetData[subSheetName];
                    const finalSheetData = addTableNameToSheet(subSheetName, subSheetData);
                    const worksheet = XLSX.utils.aoa_to_sheet(finalSheetData);
                    XLSX.utils.book_append_sheet(workbook, worksheet, validSubSheetName);
                });
            } else {
                // For arrays or other data types, create a single sheet
                const finalSheetData = addTableNameToSheet(validSheetName, sheetData);
                const worksheet = XLSX.utils.aoa_to_sheet(finalSheetData);
                XLSX.utils.book_append_sheet(workbook, worksheet, validSheetName);
            }
        });
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `${title}.xlsx`);

    }
    const generatePDF: any = async () => {
        setisLoading(true)
        const plantcapcity = dcPowerBasedOnSanctionload((selectedProject as ProjectTy).sanctionload!)
        const completeaddress = await fetchCompleteAddress(projectsetup.lat, projectsetup.lng);
        const completeaddressStr = await fetchCompleteAddressStr(completeaddress);
        const everypageaddress = fetchCompleteAddressStr(getfilterObjKeysByArr(completeaddress, ['city', 'state', 'pincode']));


        const title = "BOQ";
        const projectimg = await getScreenShot()
        const userDetailsText = `${toTitleCase(epcUser.name)} | ${toTitleCase(epcUser.companyname)} | ${epcUser.registrationNo} | ${epcUser.email}`

        const pd = `${(selectedProject as ProjectTy).projectname} | ${toTitleCase(userid ? user?.fname : epCuser.fname)} ${(user?.lname || epCuser?.lname) !== null ? toTitleCase(userid ? user.lname : epCuser.lname) : ""}| ${everypageaddress} | ${toTitleCase(userid ? user.emailid : epCuser.emailid)}`
        await downloadPDFFile(title, downloadPDFData, logoimage, completeaddressStr !== undefined ? completeaddressStr : "", plantcapcity, projectsetup.projectname, userDetailsText, pd, epcUser, typeof projectimg === "string" ? projectimg : "")

        /**************pdf download code start*/

        setisLoading(false)
    };

    const EPCUserTable = () => (
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
            <h4 className="para-md mb-2">EPC Details</h4>
            <TableCheckBtn headers={Object.keys(EpcDetails[0])} data={EpcDetails} />
        </div>
    )

    const ConsumerDetailsTable = () => (
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
            <h4 className="para-md mb-2">Consumer Details</h4>
            <TableCheckBtn headers={Object.keys(consumerDetails[0])} data={consumerDetails} />
        </div>
    )
    const projectDetailsTable = (columns: any) => (
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
            <div className='para-md mb-2'>Generation Details</div>
            <div className='overflow-x-auto'>
                <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="text-left">
                        <tr>
                            <th className='whitespace-nowrap px-4 py-2 font-medium text-gray-900'>Name</th>
                            {generationModelType.pvNXT && <th className='hvalue'>pvNxt Generation</th>}
                            {generationModelType.SAM && <th className='hvalue'>SAM Generation</th>}
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200'>
                        {BOQIData.map((row: any) => {
                            return (
                                <>
                                    <tr className=''>
                                        <td className='sticky inset-y-0 start-0 bg-white px-4 py-2'>{row.name}</td>
                                        {row.name !== "Price Submitted" ? <>
                                            {row.pvNXT && <td className='sticky inset-y-0 start-0 bg-white px-4 py-2' colSpan={row.SAM ? 1 : 2}>{row.pvNXT}</td>}
                                            {row.SAM && <td className='sticky inset-y-0 start-0 bg-white px-4 py-2' >{row.SAM}</td>}
                                        </>
                                            :
                                            <td className='sticky inset-y-0 start-0 bg-white px-4 py-2' colSpan={2}>
                                                {!isEditing ? <span>{(selectedProject as ProjectTy).projectcost}</span> :
                                                    <input className='w-[92%] h-[100%] outline-none' type="number" name="pvnxt" value={(selectedProject as ProjectTy).projectcost} onChange={(e) => handleThePriceSubmit(e)} />}
                                                <button onClick={toggleEdit} type="button" style={{ float: 'inline-end' }}>{!isEditing ? <IconEdit /> : <IconSave />}</button>
                                            </td>}
                                    </tr>
                                </>
                            )
                        })}
                    </tbody>

                </table>
            </div>
        </div>
    );

    const DCElectricalTable = () => {
        const cols = ["S.No", "Equipment Name", "UOM", "Quantity", "Proposed Make", "Specification"]
        const DCCables = [{ "S.No": 1, "Equipment Name": "Modules to Inverter", "UOM": "m", "Quantity": roofDetails[roofDetailsIndx!]?.electricalDetails?.moduletoinverterdistance, "Proposed Make": "Finolex", "Specification": roofDetails[roofDetailsIndx!]?.electricalDetails.cablebtwmoduleandinverter?.label }/*getElementByIndex(filterKeyIncludeArr(cableBtwModuleAndInverter,"cbcableid",lossCalculation?.cablebtwmoduleandinverter),0,"gennocores") ??"-"}*/,]
        const DCEarthing = [{ "S.No": 1, "Equipment Name": "DC Earthing & LA Earthing", "UOM": "Set", "Quantity": "-", "Proposed Make": "-", "Specification": "-" }]
        const tablesData = { "DC Cables": DCCables, "DC Earthing": DCEarthing }
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <SubTable headers={cols} data={tablesData} subTableNames={["DC Cables", "DC Earthing"]} />
            </div>
        )
    }
    const ACElectricalTable = () => {
        const cols = ["S.No", "Equipment Name", "UOM", "Quantity", "Proposed Make", "Specification"]

        const ACCables = [
            { "S.No": 1, "Equipment Name": "Inverter to ACCB", "UOM": "m", "Quantity": roofDetails[roofDetailsIndx!]?.electricalDetails.invertertoaccbdistance, "Proposed Make": "Finolex", "Specification": roofDetails[roofDetailsIndx!]?.electricalDetails.cablebtwaccbandtp?.label/*getElementByIndex(filterKeyIncludeArr(cableBtwACCBAndTP,"accableid",lossCalculation?.cablebtwaccbandtp),0,"mfgname")??"-"*/ },
            { "S.No": 2, "Equipment Name": "ACCB to Termination Point", "UOM": "m", "Quantity": roofDetails[roofDetailsIndx!]?.electricalDetails.invertertoaccbdistance, "Proposed Make": "-", "Specification": roofDetails[roofDetailsIndx!]?.electricalDetails.cablebtwaccbandtp?.label },
        ]
        const ACEarthing = [{ "S.No": 2, "Equipment Name": "AC Earthing & Communication Earthing", "UOM": "Set", "Quantity": "-", "Proposed Make": "-", "Specification": "-" }];
        const tablesData = { "AC Cables": ACCables, "AC Earthing": ACEarthing }
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <SubTable headers={cols} data={tablesData} subTableNames={Object.keys(tablesData)} />
            </div>
        )
    };
    const SafetyInfrastructureTable = () => {
        const cols = ["S.No", "Equipment Name", "UOM", "Quantity", "Proposed Make", "Specification"]
        const tablesData = { "Lifeline": needLifeline.details.map((each, i) => formattedDataTable(each, i)), "Walkway": needWalkWay.details.map((each, i) => formattedDataTable(each, i)) }
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <SubTable headers={cols} data={tablesData} subTableNames={Object.keys(tablesData)} />
            </div>
        )
    }
    const MonitoringEquipementTable = () => {
        const cols = ["S.No", "Equipment Name", "UOM", "Quantity", "Proposed Make", "Specification"]

        return (
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                {/* <h4 className="para-md mb-2">Consumer Details</h4> */}
                <TableCheckBtn headers={cols} data={needMonitoringSys.value === "Yes" ? needMonitoringSys.details.map((each, i) => formattedDataTable(each, i)) : []} />
            </div>

        )
    }
    const ModuleInverterTable = () => {
        const cols = ["S.No", "Equipment Name", "UOM", "Quantity", "Proposed Make", "Specification"]
        const ACCables = [
            { "S.No": 1, "Equipment Name": moduleDetails?.name ?? "-", "UOM": "kWp", "Quantity": roofDesign?.totalModules ?? 0, "Proposed Make": moduleDetails?.manufacturer ?? "-", "Specification": `${moduleDetails?.stname ?? "-"}/${(moduleDetails?.i_mp_ref ?? 0) + (moduleDetails?.v_mp_ref ?? 0)} Wp/, ${moduleDetails?.ptc ?? 0} Cell, ${moduleDetails?.manufacturer ?? "-"}; ${moduleDetails?.technology ?? "-"}, Positive Power Tolerances: ${moduleDetails?.version ?? "-"}` },
            { "S.No": 2, "Equipment Name": moduleInverterDetails?.name ?? "-", "UOM": `${moduleInverterDetails?.name ?? "-"} KW`, "Quantity": getInverterQuantity(parseFloat(roofDetails[roofDetailsIndx!]?.structureDetails?.sanctionload ?? 0) ?? "-", moduleInverterDetails?.paco ?? 0), "Proposed Make": (selectedProject as ProjectTy)?.pvinverter?.name ?? "-", "Specification": moduleInverterDetails.stname ?? "-" /*Al conductor, XLPEinsulated, armoured, 1100V`*/ },
            { "S.No": 3, "Equipment Name": "AC Combiner Box (ACCB)", "UOM": "Nos", "Quantity": "-", "Proposed Make": "-", "Specification": accbTableList.length > 0 ? `${accbTableList[0]?.ACCBName} ${accbTableList[0]?.SPDType} , ${accbTableList[0]?.accuracyClassOfMFMs}, ${accbTableList[0]?.noOfIncomingTeriminals} incoming terminals ${accbTableList[0]?.noOfOutGoingTeriminals} outgoing terminals ${accbTableList[0]?.noOfMFMs}.` : "-" },
        ]

        return (
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <TableCheckBtn headers={cols} data={ACCables} />
            </div>
        )
    }
    const CivilandMMSTable = () => {
        const cols = ["S.No", "Equipment Name", "UOM", "Quantity", "Proposed Make", "Specification"]

        const civilAndMMS = [
            { "S.No": 1, "Equipment Name": "Inverter Mounting Arrangment", "UOM": "-", "Quantity": "-", "Proposed Make": "-", "Specification": "-" },
            { "S.No": 2, "Equipment Name": "ACCB Mounting Arrangement", "UOM": "-", "Quantity": "-", "Proposed Make": "-", "Specification": "-" },
            { "S.No": 3, "Equipment Name": "MMS Foundation", "UOM": "-", "Quantity": "-", "Proposed Make": "-", "Specification": "-" },
            { "S.No": 4, "Equipment Name": "Module Mounting Structure", "UOM": "-", "Quantity": "-", "Proposed Make": "-", "Specification": "-" },
        ]
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <TableCheckBtn headers={cols} data={civilAndMMS} />
            </div>
        )
    }
    const MiscellaneousEquipmentTable = () => {
        const cols = ["S.No", "Equipment Name", "UOM", "Quantity", "Proposed Make", "Specification"]
        const tablesData = { "Fire Fighting": needFirefightingSys.details.map((each, i) => formattedDataTable(each, i)), "Module Cleaning": needModuleCleaning.details.map((each, i) => formattedDataTable(each, i)) }
        return (
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
                <SubTable headers={cols} data={tablesData} subTableNames={Object.keys(tablesData)} />
            </div>
        )
    }
    return (
        <>
            {isloading && <RingLoader />}
            <div>
                <div className='flex justify-between items-center flex-1'>
                    <div className="note-text justify-end text-[0.85rem]">Note: All the quantities mentioned here are indicative. It may change during detailed analysis. The cost and capacity of the project may vary during detailed site analysis.</div>
                    <div className='flex text-1.4xl w-80 text-primary-400  pr-1 font-medium items-center justify-end'><IconSim /> Download BOQ <span className=' text-primary-200 font-medium ml-1 mr-1 cursor-pointer underline' onClick={() => generatePDF("BOQ Details")}>PDF </span> | <span className='cursor-pointer underline ml-1' onClick={() => generateExcelSheet("BOQ Details")}> XLS</span></div>
                </div>
                <div className="h1"></div>
                {/* {EPCUserTable()} */}
                <div className='flex justify-between flex-1 gap-x-4'>
                    {EPCUserTable()}
                    {ConsumerDetailsTable()}
                </div>
                <div className="h2"></div>
                {projectDetailsTable(Object.keys(BOQIData[0]))}
                <div className="h2"></div>
                <div className='space-y-4'>
                    <Accordion1 children={DCElectricalTable()} headName='DC Electrical' open={true} />
                    <Accordion1 children={ACElectricalTable()} headName='AC Electrical' />
                    <Accordion1 children={SafetyInfrastructureTable()} headName='Safety Infrastructure' />
                    <Accordion1 children={MonitoringEquipementTable()} headName='Monitoring Equipment' />
                    <Accordion1 children={ModuleInverterTable()} headName='Module Inverter & ACCB' />
                    <Accordion1 children={CivilandMMSTable()} headName='Civil & MMS' />
                    <Accordion1 children={MiscellaneousEquipmentTable()} headName='Miscellaneous Equipment' />
                    <Accordion1 children={<ChartTabs />} headName='Charts' />
                </div>
                {/* <Accordion1 headName={'New Project Setup'}  children={<ProjectDetailsSummaryTable />} open={true} /> */}
            </div>

        </>
    )
}

export default GenerateBOQI




