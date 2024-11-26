import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import { AxiosResponse } from "axios"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button } from "../../../../Components/AllButton/AllButtons.tsx"
import { ConfirmationModal } from "../../../../Components/AllInput/AllInput"
import { NewModal } from "../../../../Components/New/Modal/NewModal"
import { EPCBtnTitleType, EPCRoofAnalysisAsideList, EPCROOFBTN, PartnerRoofAanalysisAsideRouteList } from '../../../../Containers/DefaultLayouts/AsideRouteLists'
import { UserDetailsAction } from "../../../../ReduxTool/Slice/Auth/asyncHandlers"
import { ProjectTy } from "../../../../ReduxTool/Slice/Auth/types"
import { setModalHeaderFooter } from "../../../../ReduxTool/Slice/CommonReducers/CommonReducers"
import { setIsbtnHide, setTitle } from "../../../../ReduxTool/Slice/Drawer/DrawerReducer"
import { TtitlesPartner } from "../../../../ReduxTool/Slice/Drawer/DrawerTypes"
import { toogleTooltip } from "../../../../ReduxTool/Slice/Map/MapReducer"
import { Arr, getPvNxtGenerationData, getSAMGenerationData, initialGenerationData, Inv, IPvNxtGenerationReq, Loss, lossCalculationType, miscellaneousdesignType, Module, ownLeadProjectTy, plantinfrastructuredesigningNew, roofAnalysisErrorTy, saveEPCProjects, saveLosses, setMiscellaneousDesign, setPlantInfraStructureLoss, setRoofAnalysisError, setSelectedProject } from "../../../../ReduxTool/Slice/Partner/EPC"
import { useAppDispatch, useAppSelector } from "../../../../ReduxTool/store/hooks"
import { getUserType } from "../../../../Utils/AuthRedirections"
import { APIResponse, TDrawerContainer, USER_TYPE_ADMIN } from "../../../../Utils/Const"
import globalLayers from "../../../../Utils/EPCMaps/Maps/GlobaLMap"
import { adminURL, baseURL, BaseURLString, requestUrl } from "../../../../Utils/baseUrls"
import { getIndexByValue, getInverterQuantity, isTruthy } from "../../../../Utils/commonFunctions"
import { buildingBase } from "../../../../lib/EPC/SwitchingMapLayers/SwitchMap"
import GenerateBOQI from "./GenerateBOQ/GenerateBOQI"
import Toast from "../../../../Components/ErrorBoundry/Toast"
type fiels = Array<{ field: keyof roofAnalysisErrorTy; message: string; condition?: boolean }>

export interface roofAnalysisValidationType {weatherDetails:fiels,keepoutsDetails:fiels,electricalDetails:fiels}
const PartnerDrawerContainer = () => {
    const location = useLocation(), dispatch = useAppDispatch(), navigation = useNavigate();
    const [Data, setData] = useState<TDrawerContainer>();
    const { title, isbtnHide } = useAppSelector(state => state.drawer);
    const [openProjectOverView, setopenProjectOverView] = useState(false);
    const { allDiscom } = useAppSelector(state => state.commonReducers);
    const { providertype } = useAppSelector((state) => state.commonReducers);
    const [isGenerateBOQ, setIsGenerateBOQ] = useState<boolean>(false);
    const { roofAnalysis: { formDetails, roofDetails, 
        roofDetailsIndx, roofDesign, formDetails: { plantinfrastructuredesigningNew: { lossCalculation }, 
        miscellaneousdesign, projectsetup }, selectedProject, moduleCapacity, cableBtwModuleAndInverter, cableBtwACCBAndTP, dataSource, moduleDetails, moduleInverterDetails, moduleInverterCapacity } } = useAppSelector(state => state.EPCDetails);

    useEffect(() => {
        if (location.pathname === `/${getUserType()}/RoofAnalysis`) {
            const pageTitle = EPCRoofAnalysisAsideList[title as keyof object]
            setData(pageTitle);
        };
        //handle project layout btn show or
        if (title == 'projectsetup') {
            dispatch(setIsbtnHide(true))
        } else {
            dispatch(setIsbtnHide(false))
        }
        if (title == "miscellaneousdesign") {
            bindMiscellaneousdesignData();
        } else if (title == "plantinfrastructuredesigning") {
            bindLossCalculationData();
        }
    }, [title]);
    /***************Bind miscellaneous design data ********************/
    const bindMiscellaneousdesignData = async () => {
        
        let projectDetails = selectedProject as ProjectTy, miscellaneousdesigndetails = {} as miscellaneousdesignType;
        miscellaneousdesigndetails = {
            ...miscellaneousdesign,
            needFirefightingSys: {
                ...miscellaneousdesign.needFirefightingSys,
                details: projectDetails.needfireflightingsys ? projectDetails.firefightingdata : miscellaneousdesign.needFirefightingSys.details,
                value: projectDetails.needfireflightingsys ? "Yes" : miscellaneousdesign.needFirefightingSys.value
            },
            needLifeline: {
                ...miscellaneousdesign.needLifeline,
                details: projectDetails.lifelinedata ? projectDetails.lifelinedata : miscellaneousdesign.needLifeline.details,
                value: projectDetails.lifelinedata ? "Yes" : miscellaneousdesign.needLifeline.value
            },
            needModuleCleaning: {
                ...miscellaneousdesign.needModuleCleaning,
                details: projectDetails.modulecleaning ? projectDetails.modulecleaning : miscellaneousdesign.needModuleCleaning.details,
                value: projectDetails.modulecleaning ? "Yes" : miscellaneousdesign.needModuleCleaning.value
            },
            needMonitoringSys: {
                ...miscellaneousdesign.needMonitoringSys,
                details: projectDetails.monitoringdata ? projectDetails.monitoringdata : miscellaneousdesign.needMonitoringSys.details,
                value: projectDetails.monitoringdata ? "Yes" : miscellaneousdesign.needMonitoringSys.value
            },
            needWalkWay: {
                ...miscellaneousdesign.needWalkWay,
                details: projectDetails.walkwaydata ? projectDetails.walkwaydata : miscellaneousdesign.needWalkWay.details,
                value: projectDetails.walkwaydata ? "Yes" : miscellaneousdesign.needWalkWay.value
            },
            generationModelType: {
                ...miscellaneousdesign.generationModelType,
                pvNXT: projectDetails.generationpvnxt ? projectDetails.generationpvnxt : projectDetails.isepccomplete ? projectDetails.generationpvnxt : miscellaneousdesign.generationModelType.pvNXT,
                SAM: projectDetails.generationsam ? projectDetails.generationsam : projectDetails.isepccomplete ? projectDetails.generationsam : miscellaneousdesign.generationModelType.SAM
            },
            needRPRProtection: {
                ...miscellaneousdesign.needRPRProtection,
                details: projectDetails.rpfprotectiondata ? projectDetails.rpfprotectiondata : miscellaneousdesign.needRPRProtection.details,
                value: projectDetails.needrpfprotection ? "Yes" : miscellaneousdesign.needRPRProtection.value
            },
            needPVAndDGSynch: {
                ...miscellaneousdesign.needPVAndDGSynch,
                value: projectDetails.needpvanddgsynch ? "Yes" : "No"
            },
            haveDG: {
                ...miscellaneousdesign.haveDG,
                value: projectDetails.havedg ? "Yes" : "No"
            }
        }
        dispatch(setMiscellaneousDesign(miscellaneousdesigndetails));
    };
    /***************Bind miscellaneous design data ********************/
    const bindLossCalculationData = () => {
        let projectDetails = selectedProject as ProjectTy;
        // if(projectDetails.lossid){
        dispatch(setPlantInfraStructureLoss({
            ...lossCalculation,
            accableloss: projectDetails.projectlosscalculation?.accableloss ?? plantinfrastructuredesigningNew.lossCalculation.accableloss,
            auxloss: projectDetails.projectlosscalculation?.auxloss ?? plantinfrastructuredesigningNew.lossCalculation.auxloss,
            climateloss: projectDetails.projectlosscalculation?.climateloss ?? plantinfrastructuredesigningNew.lossCalculation.climateloss,
            dccableloss: projectDetails.projectlosscalculation?.dccableloss ?? plantinfrastructuredesigningNew.lossCalculation.dccableloss,
            lidloss: projectDetails.projectlosscalculation?.lidloss ?? plantinfrastructuredesigningNew.lossCalculation.lidloss,
            moduleefficiencyloss: projectDetails.projectlosscalculation?.moduleefficiencyloss ?? plantinfrastructuredesigningNew.lossCalculation.moduleefficiencyloss,
            modulemissmatchloss: projectDetails.projectlosscalculation?.modulemissmatchloss ?? plantinfrastructuredesigningNew.lossCalculation.modulemissmatchloss,
            soilingloss: projectDetails.projectlosscalculation?.soilingloss ?? plantinfrastructuredesigningNew.lossCalculation.soilingloss,
            stringvoltagemissmatchloss: projectDetails.projectlosscalculation?.stringvoltagemissmatchloss ?? plantinfrastructuredesigningNew.lossCalculation.stringvoltagemissmatchloss,
            unavailloss: projectDetails.projectlosscalculation?.unavailloss ?? plantinfrastructuredesigningNew.lossCalculation.unavailloss,
            cablebtwmoduleandinverter:roofDetails[0]?.electricalDetails.cablebtwmoduleandinverter?.value!,
            cablebtwaccbandtp: roofDetails[0]?.electricalDetails.cablebtwaccbandtp?.value!
        }));
    }
    // Function to update array fields
    const updateArrayFields = async (data: Arr) => {
        data.subarray_tilt = parseFloat(roofDetails[roofDetailsIndx!]?.structureDetails?.mmsAzimuthAngle ?? data.subarray_tilt);
        data.subarray_tilt_eq_lat = 0/* formDetails?.projectsetup?.lat ?? data.subarray_tilt_eq_lat*/;
        data.subarray_rotlim = parseFloat(roofDetails[roofDetailsIndx!]?.structureDetails?.mmsTiltAngle ?? data.subarray_rotlim);
        data.subarray_azimuth = 0/*parseFloat(roofDetails[roofDetailsIndx!]?.structureDetails?.azimuthangle ?? data.subarray_azimuth)*/;
        data.subarray_nstrings = Math.ceil(parseFloat(roofDesign?.totalModules ?? 0) / parseFloat(roofDetails[roofDetailsIndx!]?.electricalDetails?.stringingSize /*?? data.subarray_nstrings*/));
        data.subarray_modules_per_string = parseFloat(roofDetails[roofDetailsIndx!]?.electricalDetails?.stringingSize);
        data.subarray_rear_soiling_loss = lossCalculation?.soilingloss ?? data.subarray_rear_soiling_loss;
        data.subarray_mismatch_loss = lossCalculation.modulemissmatchloss ? lossCalculation.modulemissmatchloss / 100 : data.subarray_mismatch_loss;
        data.subarray_dcwiring_loss = lossCalculation?.dccableloss ?? data.subarray_dcwiring_loss;
        data.subarray_electrical_mismatch = lossCalculation?.stringvoltagemissmatchloss ?? data.subarray_electrical_mismatch;
        return data;
    };

    // Function to update inverter fields
    const updateInverterFields = async (data: Inv) => {
        data.total_mppts = 1;
        data.inverter_count = getInverterQuantity(parseFloat(roofDetails[roofDetailsIndx!].structureDetails.sanctionload), moduleInverterDetails.paco) || 0;
        data.mppt_hi_inverter = moduleInverterDetails?.mppt_high ?? data.mppt_hi_inverter;
        data.mppt_low_inverter = moduleInverterDetails?.mppt_low ?? data.mppt_low_inverter;
        data.inv_ds_paco = (moduleInverterDetails?.paco) ?? data.inv_ds_paco;
        data.inv_ds_pnt = moduleInverterDetails?.pnt ?? data.inv_ds_pnt;
        data.inv_ds_pso = moduleInverterDetails?.pso ?? data.inv_ds_pso;
        data.inv_ds_vdco = moduleInverterDetails?.vdco ?? data.inv_ds_vdco;
        data.inv_ds_vdcmax = moduleInverterDetails?.vdcmax ?? data.inv_ds_vdcmax;
        return data;
    };

    // Function to update module fields
    const updateModuleFields = async (data: Module) => {
        data.vmp = moduleDetails?.v_mp_ref ?? data.vmp;
        data.imp = moduleDetails?.i_mp_ref ?? data.imp;
        data.voc = moduleDetails?.v_oc_ref ?? data.voc;
        data.isc = moduleDetails?.i_sc_ref ?? data.isc;
        data.aisc = moduleDetails?.alpha_sc ?? data.aisc;
        data.nser = moduleDetails?.n_s ?? data.nser;
        data.area = moduleDetails?.a_ref ?? data.area;
        data.tnoct = moduleDetails?.t_noct ?? data.tnoct;
        data.is_bifacial = moduleDetails?.bifacial ?? data.is_bifacial;
        data.pmp = moduleDetails?.stc??data.pmp;
        return data;
    };

    // Function to update loss fields
    const updateLossFields = async (data: Loss) => {
        data.acwiring_loss = lossCalculation.accableloss ? lossCalculation.accableloss / 100 : data.acwiring_loss;
        data.subarray_soiling = lossCalculation.soilingloss ? lossCalculation?.soilingloss / 100 : data.subarray_soiling;
        data.auxilary_loss = lossCalculation.auxloss ? lossCalculation.auxloss / 100 : data.auxilary_loss;
        data.lid_loss = lossCalculation.lidloss ? lossCalculation.lidloss / 100 : data.lid_loss;
        data.system_unavailibility_loss = lossCalculation.unavailloss ? lossCalculation.unavailloss / 100 : data.system_unavailibility_loss;
        return data;
    };

    // Function to update system design fields
    const updateSystemDesignFields = (data: IPvNxtGenerationReq) => {
        let structureDetails = roofDetails[roofDetailsIndx!]?.structureDetails;
        let mms_length = parseFloat(structureDetails?.arrayColumns ?? 0) + (parseFloat(structureDetails?.arrayColumns ?? 0) * parseFloat(structureDetails?.modulespacing ?? 0));
        data.systemDesign.system_capacity = parseFloat(structureDetails?.sanctionload ?? data.systemDesign.system_capacity);
        data.systemDesign.mms_length = mms_length !== 0 ? mms_length : data.systemDesign.mms_length;
        data.pvtilt = parseFloat(structureDetails?.tiltAngle ?? data.pvtilt);
        data.pvlayout = structureDetails?.moduleOrientation?.label!?.toLowerCase();
        return data;
    };
    const getGenerationReqBody = async () => {
        try {
            let generationData = { ...initialGenerationData };
            // Update fields
            generationData.arr = await updateArrayFields(generationData.arr);
            generationData.inv = await updateInverterFields(generationData.inv);
            generationData.module = await updateModuleFields(generationData.module);
            generationData.loss = await updateLossFields(generationData.loss);
            generationData = updateSystemDesignFields(generationData);
            return generationData;
        } catch (err) {
            console.log(err, "generation data binding error");
            toast.error("generation data binding error");
            return initialGenerationData;
        } finally {
            console.log("Exiting getGenerationReqBody");
        }
    };
    /***************Handle Modal action based on title ****************/
    const handleModalActions = async (title: string) => {
        dispatch(toogleTooltip({ dipy: 0, istooltip: "", msg: "" }))
        switch (title) {
            case "Generate BOQ":
                let modalData = "";
                setopenProjectOverView(true);
                setIsGenerateBOQ(false)
                dispatch(setModalHeaderFooter({ title: "Bill Of Quantities", secondaryBtnTxt: "", btnTxt: `Go To ${getUserType() === "Admin" ? "Admin Dashboard" : "Lead Board"}`, modalData: modalData }));
                break;
            case "Go To Lead Board":
                dispatch(setTitle(""));
                updatProjectDetails("", { projectcost: (selectedProject as ProjectTy).projectcost })
                dispatch(setSelectedProject({} as ProjectTy));
                window.location.href= window.location.origin+"/Partner/Onwlead"
                break;
            case "Go To Admin Dashboard":
                window.location.href = adminURL + "/epc_rfpbidding";
                break;
            case "Bill Of Quantities":
                if (getUserType() === USER_TYPE_ADMIN) {
                    window.location.href = adminURL + "/epc_rfpbidding";
                } else {
                    updatProjectDetails("", { projectcost: (selectedProject as ProjectTy).projectcost })
                    dispatch(setSelectedProject({} as ProjectTy));
                    window.location.href = window.location.origin + "/Partner/Onwlead"
                }
                // generatePDF("Bill Of Quantities");
                break;
            case "Confirm The Action":
                const data = {
                    india: true,
                    lat: projectsetup.lat,
                    lng: projectsetup.lng,
                    load: (selectedProject as ProjectTy).sanctionload,
                    // initialGenerationData:initialGenerationData// getGenerationReqBody() 
                    initialGenerationData: await getGenerationReqBody()

                }
                if (miscellaneousdesign.generationModelType.pvNXT && miscellaneousdesign.generationModelType.SAM) {
                    await dispatch(getPvNxtGenerationData(data));
                    await dispatch(getSAMGenerationData(data));
                } else if (miscellaneousdesign.generationModelType.pvNXT) {
                    await dispatch(getPvNxtGenerationData(data));
                } else if (miscellaneousdesign.generationModelType.SAM) {
                    await dispatch(getSAMGenerationData(data));
                };
                setIsGenerateBOQ(prev => !prev);
                updatProjectDetails("Generate BOQ");
                setIsGenerateBOQ(false)
                break;
            case "No":
                setopenProjectOverView(false);
                setIsGenerateBOQ(false)
                break;
            default:
                break;
        };
    };
    /*******************project update function *****************************************/
    const updatProjectDetails = async (btnTitle: string, requestBody?: any) => {
        if ((selectedProject as ProjectTy).isepccomplete) {
            btnTitle && handleModalActions(btnTitle);
            return;
        }
        try {
            let requestB = requestBody ? requestBody : { isepccomplete: true,iscompleted:true };
            const { data }: AxiosResponse<APIResponse<any>> = await baseURL.put(requestUrl.project + `/${selectedProject.projectid}`, requestB);
            if (data.code === "200") {
                toast.success("Project update successfull.");
                btnTitle && handleModalActions(btnTitle);
            };
        } catch (err: any) {
            toast.error(err.response?.data.message ?? "There was an issue to project update. Please try again later");
        };
    };
    /********************update project details based on miscellaneous data ***************/
    const updateProjectBasedOnMission = async (projectid: string) => {
        
        try {
            let reqBody = {
                havedg: miscellaneousdesign.haveDG.value === "Yes" ? true : false,
                needpvanddgsynch: miscellaneousdesign.needPVAndDGSynch.value === "Yes" ? true : false,
                needrpfprotection: miscellaneousdesign.needRPRProtection.value === "Yes" ? true : false,
                needfireflightingsys: miscellaneousdesign.needFirefightingSys.value === "Yes" ? true : false,
                needlifeline: miscellaneousdesign.needLifeline.value === "Yes" ? true : false,
                needwalkway: miscellaneousdesign.needWalkWay.value === "Yes" ? true : false,
                needmonitoringsys: miscellaneousdesign.needMonitoringSys.value === "Yes" ? true : false,

                generationpvnxt: miscellaneousdesign.generationModelType.pvNXT,
                generationsam: miscellaneousdesign.generationModelType.SAM,
                // walkwaydata: miscellaneousdesign.needWalkWay.value === "Yes" ? miscellaneousdesign.needWalkWay.details:"",
                // monitoringdata: miscellaneousdesign.needMonitoringSys.value === "Yes"?miscellaneousdesign.needMonitoringSys.details:"",
                // modulecleaning: miscellaneousdesign.needModuleCleaning.value === "Yes"?miscellaneousdesign.needModuleCleaning.details:"",
            } as ProjectTy;
            if (miscellaneousdesign.haveDG.value === "Yes" || miscellaneousdesign.needPVAndDGSynch.value === "Yes" || miscellaneousdesign.needRPRProtection.value === "Yes") {
                reqBody.rpfprotectiondata = miscellaneousdesign.needRPRProtection.details;
            }
            if (miscellaneousdesign.needFirefightingSys.value === "Yes") {
                reqBody.firefightingdata = miscellaneousdesign.needFirefightingSys.details;
            }
            if (miscellaneousdesign.needLifeline.value === "Yes") {
                reqBody.lifelinedata = miscellaneousdesign.needLifeline.details;
            }
            if (miscellaneousdesign.needWalkWay.value === "Yes") {
                reqBody.walkwaydata = miscellaneousdesign.needWalkWay.details;
            }
            if (miscellaneousdesign.needModuleCleaning.value === "Yes") {
                reqBody.modulecleaning = miscellaneousdesign.needModuleCleaning.details;
            }
            if (miscellaneousdesign.needMonitoringSys.value === "Yes") {
                reqBody.monitoringdata = miscellaneousdesign.needMonitoringSys.details;
            }

            await dispatch(saveEPCProjects({ reqBody, projectid }));
            setIsGenerateBOQ(prev => !prev);
            dispatch(setModalHeaderFooter({ title: "Confirm The Action", btnTxt: "Yes", secondaryBtnTxt: "No" }));
        } catch (err: any) {
            toast.error(err.message);
        }
    };
    /********************save cable loss data ********************************************/
    const savelosses = async (projectid: string, isInitial: boolean) => {
        try {
            let reqBody = {} as lossCalculationType<number>;
            if ((selectedProject as ProjectTy).lossid) {
                reqBody.lossid = (selectedProject as ProjectTy).lossid
            }
            if (isInitial) {
                reqBody.cablebtwmoduleandinverter = roofDetails[0]?.electricalDetails.cablebtwmoduleandinverter?.value!/*getElementByIndex(filterKeyIncludeArr(cableBtwModuleAndInverter, "gennocores", roofDetails[0]?.electricalDetails.cablebtwmoduleandinverter), 0, "cbcableid")*/;
                reqBody.cablebtwaccbandtp = roofDetails[0]?.electricalDetails.cablebtwaccbandtp?.value!/*getElementByIndex(filterKeyIncludeArr(cableBtwACCBAndTP, "mfgname", roofDetails[0]?.electricalDetails.cablebtwaccbandtp), 0, "accableid")*/;
            } else {
                reqBody = lossCalculation
            }

            await dispatch(saveLosses({ reqBody, projectid }));
        } catch (err: any) {
            toast.error(err.message);
        };
    };
    /********************save weather data function ***************************************/
    const saveWeatherDetails = async (projectid: string) => {
        try {
            let reqBody = {
                weatherdatasource: dataSource.pkid,
                corrosioncategory: formDetails.plantinfrastructuredesigningNew.weatherdata.corrosioncategory!.value,
            };
            await dispatch(saveEPCProjects({ reqBody, projectid }));
        } catch (err: any) {
            toast.error(err.message);
        }
    };
    /*******************handle loss calculation validation function ***********************/
    const isPlantInfraValid = (): boolean => {
        let isValid = true;
        const errors = {} as roofAnalysisErrorTy;
        const { weatherdata, lossCalculation } = formDetails.plantinfrastructuredesigningNew;
        // Validation rules for weatherdata
        const validations:Array<{ field: keyof roofAnalysisErrorTy; message: string; condition?: boolean }> = [
            { field: "corrosioncategory", condition: !weatherdata.corrosioncategory, message: "Corrosion Category is Required" },
            { field: "weatherdatasource", condition: !weatherdata.weatherdatasource, message: "Weather data source is Required" },
        ];
    
        // Validation rules for lossCalculation
        const lossCalculations:Array<{ field: keyof roofAnalysisErrorTy; message: string; condition?: boolean }> = [
            { field: "accableloss", condition: !isTruthy(lossCalculation.accableloss), message: "AC Cable Loss is Required" },
            { field: "auxloss", condition: !isTruthy(lossCalculation.auxloss), message: "Aux Cable Loss is Required" },
            { field: "climateloss", condition: !isTruthy(lossCalculation.climateloss), message: "Climate Loss is Required" },
            { field: "dccableloss", condition: !isTruthy(lossCalculation.dccableloss), message: "DC Cable Loss is Required" },
            { field: "lidloss", condition: !isTruthy(lossCalculation.lidloss), message: "Lid Loss is Required" },
            { field: "moduleefficiencyloss", condition: !isTruthy(lossCalculation.moduleefficiencyloss), message: "Efficiency Loss is Required" },
            { field: "modulemissmatchloss", condition: !isTruthy(lossCalculation.modulemissmatchloss), message: "Module Missmatch Loss is Required" },
            { field: "soilingloss", condition: !isTruthy(lossCalculation.soilingloss), message: "Soiling Loss is Required" },
            { field: "stringvoltagemissmatchloss", condition: !isTruthy(lossCalculation.stringvoltagemissmatchloss), message: "String Voltage Missmatch Loss is Required" },
            { field: "unavailloss", condition: !isTruthy(lossCalculation.unavailloss), message: "Unavailability Loss is Required" },
        ];
    
        // Combine validations for weatherdata and lossCalculation
        const allValidations = [...validations, ...lossCalculations];
    
        // Run validations
        for (const { field, condition, message } of allValidations) {
            if (condition) {
                errors[field] = message;
                isValid = false;
            }
        }   
        // Optionally, dispatch errors to Redux or handle them for display in the UI
        if (Object.keys(errors).length > 0) {
            dispatch(setRoofAnalysisError(errors));  // Assuming a Redux action to store errors
        }
        return isValid;
    };
    
    // const isPlantInfraValid = () => {

    //     let isValid = true, msg = "";
    //     const { weatherdata, lossCalculation } = formDetails.plantinfrastructuredesigningNew;
    //     if (!weatherdata.corrosioncategory) {
    //         msg = "Corrosion Category is Required";
    //         isValid = false;
    //     } else if (!weatherdata.weatherdatasource) {
    //         msg = "Weather data source is Required";
    //         isValid = false;
    //     } else if (lossCalculation.accableloss?.toString() == "") {
    //         msg = "AC Cable Loss is Required";
    //         isValid = false;
    //     } else if (lossCalculation.auxloss?.toString() == "") {
    //         msg = "Aux Cable Loss is Required";
    //         isValid = false;
    //     } else if (lossCalculation.climateloss?.toString() == "") {
    //         isValid = false;
    //         msg = "Climate Loss is Required";
    //     } else if (lossCalculation.dccableloss?.toString() == "") {
    //         isValid = false;
    //         msg = "DC Cable Loss is Required";
    //     } else if (lossCalculation.lidloss?.toString() == "") {
    //         isValid = false;
    //         msg = "Lid Loss is Required";
    //     } else if (lossCalculation.moduleefficiencyloss?.toString() == "") {
    //         isValid = false;
    //         msg = "Efficiency Loss is Required";
    //     } else if (lossCalculation.modulemissmatchloss?.toString() == "") {
    //         isValid = false;
    //         msg = "Module Missmatch Loss is Required";
    //     } else if (lossCalculation.soilingloss?.toString() == "") {
    //         isValid = false;
    //         msg = "Soiling Loss is Required";
    //     } else if (lossCalculation.stringvoltagemissmatchloss?.toString() == "") {
    //         isValid = false;
    //         msg = "String Voltage Missmatch Loss is Required";
    //     } else if (lossCalculation.unavailloss?.toString() == "") {
    //         isValid = false;
    //         msg = "Unavailability Loss is Required";
    //     };
    //     !isValid && toast.error(msg, { toastId: "invalidPlantInfra" });
    //     return isValid;
    // };
    //Serialize the Graphics in a GraphicLayer
    function serializeGraphicLayer(graphicLayer: GraphicsLayer): string {
        const serializedGraphics = graphicLayer.graphics.map(graphic => graphic.toJSON());
        return JSON.stringify(serializedGraphics);
    }

    /******************* project save function *******************************************/
    const saveProjectDetails = async (projectid?: string) => {
        try {
            let { structureDetails, keepoutsDetails, electricalDetails } = roofDetails[0];
            let panlesLayer = null as string | null;
            if (globalLayers.solarpanelLayer) {
                panlesLayer = serializeGraphicLayer(globalLayers.solarpanelLayer)
            }
            let reqBody = {
                projectname: formDetails.projectsetup.projectname,
                lat: formDetails.projectsetup.lat,
                lng: formDetails.projectsetup.lng,
                userid: null as null | string,
                epcuserid: (selectedProject as ownLeadProjectTy).epcuserid,
                address: formDetails.projectsetup.address,
                providerid: formDetails.projectsetup.providerid?.value?? null/*getElementByIndex(filterKeyIncludeArr(allDiscom, "providername", formDetails.projectsetup.providerid!), 0, "providerid")*/,
                consumercategoryid: formDetails.projectsetup.consumercategoryid?.value??null/*getElementByIndex(filterKeyIncludeArr(providertype, "consumercategoryname", formDetails.projectsetup.consumercategoryid!), 0, "consumercategoryid")*/,
                //Structure Details            
                pvmodid: structureDetails.modulecapacity?.value/*getElementByIndex(filterKeyIncludeArr(moduleCapacity, "name", structureDetails.modulecapacity), 0, "id")*/,
                noofmodules: parseFloat(roofDesign.totalModules),
                totalroofarea: roofDesign.totalarea,
                useablearea: roofDesign.useablearea,
                sanctionload: parseFloat(structureDetails.sanctionload),
                loading: parseFloat(structureDetails.loading.toString()),
                buildingheight: parseFloat(structureDetails.buildingheight.toString()),
                parapetwall: parseFloat(structureDetails.parapetwall),
                projecttype: structureDetails.rooftype.label,
                roofazimuthangle: structureDetails.azimuthangle,
                rooftiltangle: parseFloat(structureDetails.tiltangle.toString()),
                maxplantcapacity: structureDetails.maxplantcapacity,
                //keepout details bind here
                keepouts: keepoutsDetails,
                //module structure details
                mmstype: "Fixed Tilt"/*structureDetails.MMSType*/,
                moduleorientation: structureDetails.moduleOrientation?.label,
                arrayrows: structureDetails.arrayRows,
                arraycolumns: structureDetails.arrayColumns,
                rowspacing: structureDetails.rowspacing,
                modulespacing: structureDetails.modulespacing,
                mmsazimuthangle: parseFloat(structureDetails.azumuthAngle?.label!),
                mmstiltangle: parseFloat(structureDetails.tiltAngle.toString()),
                //electrical details
                invertertype: structureDetails.inveterType === "onGrid" ? 0 : structureDetails.inveterType == "OffGrid" ? 1 : 2,
                pvinvid: structureDetails.inveterCapacity?.value/*getElementByIndex(filterKeyIncludeArr(moduleInverterCapacity, "name", electricalDetails.inveterCapacity), 0, "id")*/,
                stringingtype: true,
                stringingsize: parseFloat(electricalDetails.stringingSize),
                invertertoaccbdistance: parseFloat(electricalDetails.invertertoaccbdistance),
                moduletoinverterdistance: parseFloat(electricalDetails.moduletoinverterdistance),
                graphicLayer: JSON.stringify(globalLayers.getGraphicbyItsName(buildingBase)),
                panelLayer: panlesLayer
            };

            if(!reqBody.epcuserid && !(selectedProject as ProjectTy).installationmode){
                reqBody.epcuserid = (selectedProject as ownLeadProjectTy).userid;
            }
            let userType = getUserType();
            if(userType === USER_TYPE_ADMIN || (selectedProject as ProjectTy).installationmode){
                reqBody.userid = (selectedProject as ownLeadProjectTy).userid;
                reqBody.epcuserid = null;
            }
            // if((selectedProject as ProjectTy).installationmode){
            //     reqBody.userid = (selectedProject as ownLeadProjectTy).userid;
            //     reqBody.epcuserid = null;
            // }
            const { payload }: any = await dispatch(saveEPCProjects({ reqBody, projectid }));
            if (payload) {
                if (payload.code && payload.code !== "200") {
                    toast.error(payload.response?.data.message ?? payload.message);
                    return;
                }
                toast.success(`The project setup has been successfully ${projectid ? "updated" : "saved"}`);
                sessionStorage.setItem("projectid", payload.projectid);
                await dispatch(UserDetailsAction({ reqBody: { address: reqBody.address }, userid: (userType === USER_TYPE_ADMIN || (selectedProject as ProjectTy).installationmode) ? reqBody.userid! : reqBody.epcuserid! }));
                await savelosses(payload.projectid, true);
                nextModal();
            };
        } catch (err) {
            toast.error(`There was an issue to project ${projectid ? "update" : "save"}. Please try again later.`);
        };
    };
    /******************* validate form for user details **********************************/
    const isFormValid = () => {
        let isValid = true, msg = "";
        if (!(selectedProject as any).epcuserid && !(selectedProject as ownLeadProjectTy).userid) {
            isValid = false;
            msg = "User Lead id not found";
        };
        !isValid && toast.error(msg);
        return isValid;
    };
    /******************* Next btn handler ************************************************/
    const nextModal = () => {
        let titleInd = getIndexByValue(PartnerRoofAanalysisAsideRouteList, title);
        let nextpage = PartnerRoofAanalysisAsideRouteList[titleInd + 1]?.title as TtitlesPartner;
        nextpage && dispatch(setTitle(nextpage));
    };

    /*******************Handle drawer footer btn function ********************************/
    const handleFooterNxtBtn = async (btnTitle: EPCBtnTitleType) => {
        dispatch(toogleTooltip({ dipy: 0, istooltip: "", msg: "" }))
        const { PROJECT_SETUP, PROJECT_DESIGN, MISC_DESIGN, PLANT_INFO, CONFIRM_ACTION } = EPCROOFBTN;
        let projectid = sessionStorage.getItem("projectid") ?? selectedProject.projectid ?? "";

        switch (btnTitle) {
            case PROJECT_SETUP:
                if (!(selectedProject as ProjectTy).isepccomplete) {
                    isFormValid() && saveProjectDetails(projectid);
                } else {
                    nextModal();
                }
                break;
            case PROJECT_DESIGN:
                nextModal();
                break;
            case PLANT_INFO:
                if (selectedProject.projectid && !(selectedProject as ProjectTy).isepccomplete) {
                    if (!isPlantInfraValid()) return;
                    await saveWeatherDetails(selectedProject.projectid);
                    await savelosses(selectedProject.projectid, false);
                };
                nextModal();
                break;
            case MISC_DESIGN:
                if (!miscellaneousdesign.generationModelType.SAM && !miscellaneousdesign.generationModelType.pvNXT){
                    Toast({messageText:"Select Atleast One Generation Type", messageType:"E",autoClose:1500,toastId:"GenerationtToast"});
                }
                else{
                    if (!selectedProject.projectid ) {
                        toast.info("Project Not Created");
                        return;
                    };
                    if (!(selectedProject as ProjectTy).isepccomplete) {
                        updateProjectBasedOnMission(selectedProject.projectid);
                    } 
                    else {
                        setIsGenerateBOQ(prev => !prev);
                        dispatch(setModalHeaderFooter({ title: "Confirm The Action", btnTxt: "Yes", secondaryBtnTxt: "No" }));
                    }
                }
                break;
            default:
                break;
        };
    };
    const confirmGenerateBoqDesc = "Once the Bill of Quantities (BOQ) is generated, no further modifications will be permitted.Are you prepared to proceed under these conditions?"
    return (<>
        {isGenerateBOQ && <ConfirmationModal modalName="Confirm Action" name={"generateBoq"} yesBtn="Yes" cancelBtn={"No"} handleModal={() => handleModalActions("Confirm The Action")} description={confirmGenerateBoqDesc} closeModal={() => setIsGenerateBOQ(false)} modalSize="md" />}
        {/* {openProjectOverView && <NewModal  name={"generateboq"} onSubmit={() => handleModalActions("Confirm The Action")} children={<GenerateBOQI />} closeModal={() => setopenProjectOverView(false)} modalSize="lg" />} */}
        {openProjectOverView && <NewModal isAbleCLick={true} name={"Model Name"} btnName={"Button Name"} onClick={handleModalActions} children={<GenerateBOQI/>} setIsCLose={setopenProjectOverView} modalSize="lgx" />}
    
        <div id="draweContainer" className="lsb-drawer">
            {Data && <Data.Component />}
            {!isbtnHide &&  <div className="lsb-footer">
               <Button className="btn btn-md-primary w-full" name={Data?.btnTitle as EPCBtnTitleType} onClick={() => handleFooterNxtBtn(Data?.btnTitle as EPCBtnTitleType)} />
            </div>}
        </div>
    </>
    )
}

export default PartnerDrawerContainer
