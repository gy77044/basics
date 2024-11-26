import { memo, useEffect, useState } from "react";
import logoimage from "../../../../../../assests/img/Dashboard/EPC/terranxt_logo 1.png";
import { getScreenShot } from "../../../../../../lib/ScreenShot/getScreenShot";
import { ProjectTy } from "../../../../../../ReduxTool/Slice/Auth/types";
import { ownLeadProjectTy, setReloader } from "../../../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector } from "../../../../../../ReduxTool/store/hooks";
import { baseURL, requestUrl } from "../../../../../../Utils/baseUrls";
import { calculateRatio, camelCaseToWordFormat, dcPowerBasedOnSanctionload, downloadPDFFile, fetchCompleteAddressStr, formateCamalCaseTospace, getfilterObjKeysByArr, toTitleCase } from "../../../../../../Utils/commonFunctions";
import { fetchCompleteAddress } from "../../../../../../Utils/EPCMaps/Maps/LazyloadMap";
import { TableCheckBtn } from "../../../../../../Components/AllInput/AllInput";
import { Button } from "../../../../../../Components/AllButton/AllButtons.tsx";

type ProjectDataKey = 'ProjectDetails' | 'ModuleStructureDetails' | 'KeepoutDetails' | 'InverterDetails' | 'CableDetails';

const Report = ({ roofNum }: { roofNum: number }) => {
  const dispatch = useAppDispatch();
  const { roofAnalysis: { roofDetails, roofDesign, selectedProject, formDetails: { projectsetup } } } = useAppSelector(state => state.EPCDetails)
  let { structureDetails, keepoutsDetails, electricalDetails, reportDetails } = roofDetails[roofNum];
  const { auth } = useAppSelector(state => state)
  const { user } = useAppSelector((state) => state.EPCDetails.roofAnalysis.selectedProject) as any
  const [epcUser, setEpcUser] = useState({ name: "", companyname: "", registrationNo: "", serviceState: "", email: "" as string, mobile: "" })


  const projectData: Record<ProjectDataKey, { name: string, details: string }[]> = {
    ProjectDetails: [
      { name: "No of Module", details: roofDesign.totalModules },
      { name: "Building Height", details: `${structureDetails.buildingheight} m` },
      { name: "Parapet Wall", details: `${structureDetails.parapetwall} m` },
      { name: "DC:AC", details: calculateRatio(parseFloat(structureDetails?.sanctionload), parseFloat(dcPowerBasedOnSanctionload(parseFloat(structureDetails.sanctionload)))) },
      { name: "Total Roof Area", details: `${roofDesign?.totalarea?.toFixed(2) ?? 0} sq m` },
      { name: "Total Usable Area", details: `${roofDesign?.useablearea?.toFixed(2) ?? 0} sq m` },
      { name: "Roof Type", details: structureDetails?.rooftype.value },
      { name: "Roof Azimuth Angle", details: `${structureDetails?.azimuthangle} deg` },
      { name: "Roof Tilt Angle", details: `${structureDetails?.tiltangle} deg` },
      { name: "Module Capacity", details: `${structureDetails.modulemanufacturer?.label} / ${structureDetails.modulecapacity?.label}` }
    ],
    ModuleStructureDetails: [
      { name: "MMS Type", details: `${structureDetails.MMSType.label}` },
      { name: "Module Orientation", details: `${structureDetails.moduleOrientation?.label}` },
      { name: "Array Rows", details: `${structureDetails.arrayRows} nos` },
      { name: "Array Columns", details: `${structureDetails.arrayColumns} nos` },
      { name: "Row Spacing", details: `${structureDetails.rowspacing} m` },
      { name: "Module Spacing", details: `${structureDetails.modulespacing} m` },
      { name: "MMS Azimuth Angle", details: `${structureDetails.azumuthAngle?.label} deg` },
      { name: "MMS Tilt Angle", details: `${structureDetails.tiltAngle} deg` }
    ],
    InverterDetails: [
      { name: "Inverter Type", details: camelCaseToWordFormat(structureDetails.inveterType) },
      { name: "Inverter Capacity", details: `${structureDetails.inveterManufacturer?.label} / ${structureDetails.inveterCapacity?.label}` },
      { name: "Stringing", details: `Manual | ${electricalDetails.stringingSize}` }
    ],
    KeepoutDetails: keepoutsDetails?.map(el => ({ name: el.infraType, details: `Height ${el.infraheight} m | Offset ${el.infraoffset} m` })) ?? [],
    CableDetails: [
      { name: `Module to Inverter | ${electricalDetails.cablebtwmoduleandinverter?.label}`, details: electricalDetails.moduletoinverterdistance },
      { name: `Inverter to ACCB to TP |${electricalDetails.cablebtwaccbandtp?.label}`, details: electricalDetails.invertertoaccbdistance }
    ]
  };

  useEffect(() => {
    if (auth.user.epcid) {
      const fetchEpcDetails = async () => {
        try {
          const { data } = await baseURL.get(`${requestUrl.saveEPC}/${auth.user.epcid}`)
          if (data.code === "200") {
            setEpcUser({ name: `${auth.user.fname} ${auth.user.lname}`, companyname: data.responseData.companyname, registrationNo: data.responseData.registrationnumber, serviceState: data.responseData.serviceablestate.map((each: any) => each.state).join(", "), email: `${auth.user.emailid}`, mobile: auth.user.mobile !== null ? `${auth.user.country_mstr?.countrycode}${auth.user.mobile}` : "" })
          }
        }
        catch (error) {
          console.log("err", error)
        }
      }
      fetchEpcDetails()
    }
    else {
      setEpcUser({ name: "Team Terranxt", companyname: "Terranxt Pvt Ltd", registrationNo: "U74999HR2020PTC089683", serviceState: "Worldwide", email: "admin@terranxt.com", mobile: "+919719499553", })
    }
  }, [])

  const formatPDFData = (item: any) => ({
    Name: item.name,
    Details: item.details
  });

  const downloadTheReport: any = async () => {
    dispatch(setReloader(true));
    const downloadPdfData: any = {
      "Project Details": projectData.ProjectDetails.map(each => formatPDFData(each)),
      "Module Structure Details": projectData.ModuleStructureDetails.map(each => formatPDFData(each)),
      "Inverter Details": projectData.InverterDetails.map(each => formatPDFData(each)),
      "Keepout Details": projectData.KeepoutDetails.map(each => formatPDFData(each)),
      "Cable Details": projectData.CableDetails.map(each => formatPDFData(each)),
    };
    const plantcapcity = dcPowerBasedOnSanctionload(parseFloat(roofDetails[roofNum].structureDetails.sanctionload));
    const completeaddress = await fetchCompleteAddress(projectsetup.lat, projectsetup.lng);
    const completeaddressStr = fetchCompleteAddressStr(completeaddress);
    const everypageaddress = fetchCompleteAddressStr(getfilterObjKeysByArr(completeaddress, ['city', 'state', 'pincode']));
    const projectimg = await getScreenShot();
    const userDetailsText = `${toTitleCase(epcUser.name)} | ${toTitleCase(epcUser.companyname)} | ${epcUser.registrationNo} | ${epcUser.email}`
    // const consumerdetails = {projectname:(selectedProject as ProjectTy).projectname,username:`${toTitleCase(user.fname)} ${user.lname!==null?toTitleCase(user.lname):""}`,address:`${toTitleCase(user.address)}`,emailid:`${user.emailid}` }

    const pd = `${projectsetup.projectname} | ${(selectedProject as ProjectTy).user ? toTitleCase((selectedProject as ProjectTy).user.fname) + " " + toTitleCase((selectedProject as ProjectTy).user.lname) : (selectedProject as ownLeadProjectTy).customerName} | ${everypageaddress} | ${(selectedProject as ProjectTy).user ? (selectedProject as ProjectTy).user.emailid : (selectedProject as ownLeadProjectTy).emailid}`
    await downloadPDFFile("Report", downloadPdfData, logoimage, completeaddressStr !== undefined ? completeaddressStr : "", plantcapcity, projectsetup.projectname, userDetailsText, pd, epcUser, typeof projectimg !== "object" ? projectimg : "");
    dispatch(setReloader(false));
  };

  const tableHeader = ["Name", "Details"]

  return (
    <>
      <div className="flex flex-row justify-end items-center my-2 gap-x-2 mr-2">
        <Button className="btn-link" name="PDF" onClick={downloadTheReport} />
        {/* <span className="text-gray-300">|</span> */}
        {/* <Button className="btn-link" name="XLS" onClick={downloadTheReport} /> */}
      </div>
      {Object.keys(projectData).map((tableKey) => (
        <div key={tableKey} className="mb-1">
          <TableCheckBtn tableCaption={formateCamalCaseTospace(tableKey)} headers={tableHeader} data={projectData[tableKey as keyof typeof projectData].map((each:any)=>({Name:each.name,Details:each.details}))} />
        </div>
      ))}
    </>
  );
};

export default memo(Report);
