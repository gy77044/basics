import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ProjectTy } from "../../Auth/types";
import { buildEPCExtraReducers } from "./EpcBuilder";
import { EPCProjectSetupType, EPCReducerTy, IPvNxtGenerationReq, TInfradesign, TObstruction, TOrientation, Troofdesign, addOrientationType, dataSourceResType, electricalDetailsType, lossCalculationType, miscellaneousdesignType, miscellaneousdetailsTy, moduleDetailsType, moduleInverterDetailsType, ownLeadProjectTy, plantinfrastructuredesigningTyp, plantinfrastructuredesigningTypNew, pvArrayDesignType, roofAnalysisErrorTy, roofDetailsError, roofDetailsType, structureDetailsError, structureDetailsType, weatherdetailsType } from "./type";
import { selectOptionType } from "../../../../Utils/Const";
export const projectsetup = { address: "",consumercategoryid:null,providerid:null,sanctionload: "",moduleorientation: "Landscape", meteringpoint: "", connectedvoltage: '', projectname: 'PvNxtFP00', modulecapacity: "", modulemanufacturer: "", projectid: "", lat: 0, lng: 0, weatherdatasource: "",loading:"" };
export const projectdesign = { orientation: "1", buildingheight: "0", parapetheight: "1.5", parapetoffset: "0.5" };
export const plantinfrastructuredesigning = {MMSType: {label:"Fixed Tilt",value:"Fixed Tilt"},accblist:"No", moduleName: "", moduleOrientation: {label:'Landscape',value:"Landscape"}, tiltAngle: "15",azumuthAngle: {label:"0",value:"0"}, arrayRows: "2", arrayColumns: "5", heightFromGround: "",verticalSpaceBtwModules: "", horizontalSpaceBtwModules: "",panelStatus: "", noOfExtensionPanel: "", typeOfBusBar: "", RYBIndication: "No",mmsAzimuthAngle: '0',mmsTiltAngle: '10', rowspacing: '0.5',modulespacing:"0.025" , rowSpacingHorizontal: '', rowSpacingVertical: ''} as plantinfrastructuredesigningTyp;
export const plantinfrastructuredesigningNew = {weatherdata:{weatherdatasource:{label:"OPENMETEO 28.5862,77.3556",value:"OPENMETEO 28.5862,77.3556"},corrosioncategory:{label:"C3 - Corrosivity Medium 28.5862,77.3556",value:"C3 - Corrosivity Medium 28.5862,77.3556"}},pvArrayDesign:[],lossCalculation:{dccableloss:1.5,cablebtwmoduleandinverter:"",accableloss:2.5,cablebtwaccbandtp:"",moduleefficiencyloss:1,lidloss:2,modulemissmatchloss:2,stringvoltagemissmatchloss:2,soilingloss:2,auxloss:2,unavailloss:1,climateloss:2} as lossCalculationType<number>};

export const fireFightingData = [{Particular:"CO2 type 2.5 kg portable type extinguiser",Quantity:"1",UOM:"nos", "Proposed Make":"Kidde", Specification:"CO2 fire extinguisher, 2.5 kg capacity, portable type, suitable for Class B and C fires"},{Particular:"Sand buckets with stand",Quantity:"1",UOM:"nos", "Proposed Make":"Customized", Specification:"Metal stand with two sand buckets, for containing sand for fire suppression"},{Particular:"First aid box with hand gloves",Quantity:"1",UOM:"nos", "Proposed Make":"Apollo", Specification:"First aid box, filled with essential medical supplies, including hand gloves"},{Particular:"LT danger notice plate",Quantity:"1",UOM:"nos", "Proposed Make":"Customized", Specification:"Warning sign indicating the presence of a low-tension (LT) electrical supply"},{Particular:"Shock treatment chart in English, Hindi and local language",Quantity:"1",UOM:"nos", "Proposed Make":"Customized", Specification:"Chart with instructions on how to treat shock, in English, Hindi, and the local language"}]
export const lifeLineData = [{Particular:"Swaged Tensioner",Quantity:"306",UOM:"nos", "Proposed Make":"Bridon", Specification:"High-strength, galvanized steel swaged tensioner, suitable for heavy-duty applications"},{Particular:"Carriage Body",Quantity:"400",UOM:"nos", "Proposed Make":"Bridon", Specification:"Galvanized steel carriage body, designed for use with swaged tensioners and wire ropes"},{Particular:"Intermediate",Quantity:"2",UOM:"nos", "Proposed Make":"Bridon", Specification:"Intermediate fittings for connecting wire ropes to the carriage body"},{Particular:"Swaged Cable Extremity",Quantity:"1",UOM:"nos", "Proposed Make":"Bridon", Specification:"Swaged cable extremity with a thimble, for secure attachment to the tensioner"},{Particular:"Shock Absorber",Quantity:"30",UOM:"nos", "Proposed Make":"Bridon", Specification:"Hydraulic shock absorber, designed to reduce shock loads on the lifeline system"},{Particular:"Wire Rope (Cable Wire)",Quantity:"30",UOM:"nos", "Proposed Make":"Bridon", Specification:"Galvanized steel wire rope, 6mm diameter, with a breaking strength of 10 kN"},{Particular:"Inspection Plate",Quantity:"30",UOM:"nos", "Proposed Make":"Customized", Specification:"Aluminum inspection plate with a clear viewing window, for easy visual inspection of the lifeline system"},{Particular:"Rooftop Anchor Post Extremity",Quantity:"30",UOM:"nos", "Proposed Make":"Bridon", Specification:"Galvanized steel anchor post extremity, for securing the lifeline system to the rooftop"},{Particular:"Rooftop Anchor Post Intermediate",Quantity:"30",UOM:"nos", "Proposed Make":"Bridon", Specification:"Galvanized steel anchor post intermediate, for connecting anchor posts together"},{Particular:"Rooftop Anchor Post Intermediate",Quantity:"30",UOM:"nos", "Proposed Make":"Bridon", Specification:"Galvanized steel anchor post intermediate, for connecting anchor posts together"},]
export const walkwayData = [{Particular:"Walkway - (3000 mm Length & 300 mm Width)",Quantity:"306",UOM:"nos", "Proposed Make":"Customized", Specification:"Galvanized steel walkway, 3000 mm long x 300 mm wide, with anti-slip surface"},{Particular:"M6 X 50 -N/B/W - (Butterfly clamp fixing with walkway support)",Quantity:"408",UOM:"nos", "Proposed Make":"Customized", Specification:"Stainless steel butterfly clamp, M6 x 50, with bolts and nuts, for securing walkway to support"},{Particular:"M6 X 25 -N/B/W - (Connecting of two walkways)",Quantity:"400",UOM:"nos", "Proposed Make":"Customized", Specification:"Stainless steel connector, M6 x 25, with bolts and nuts, for joining two walkways together"},{Particular:"Butterfly Clamp",Quantity:"2",UOM:"nos", "Proposed Make":"Customized", Specification:"Stainless steel butterfly clamp, for securing walkway to support"},{Particular:"U Channel (Cold Form 75x40x2.5 - 1300 MM Length)",Quantity:"1",UOM:"nos", "Proposed Make":"Tata Steel", Specification:"Galvanized steel U channel, 75x40x2.5 mm, 1300 mm long, for supporting walkway"},{Particular:"Walkway Support",Quantity:"30",UOM:"nos", "Proposed Make":"Customized", Specification:"Galvanized steel walkway support, designed to fit the U channel and provide stability"},{Particular:"Self-tapping Screw 110 mm Long (Channel with beneath purlin)",Quantity:"30",UOM:"nos", "Proposed Make":"Hindustan Zinc", Specification:"Self-tapping screw, 110 mm long, for attaching walkway to purlin"},{Particular:"M6 X 50 -N/B/W - (Walkway Support with Channel)",Quantity:"30",UOM:"nos", "Proposed Make":"Customized", Specification:"Stainless steel connector, M6 x 50, with bolts and nuts, for connecting walkway support to U channel"}]
export const monitoringData = [{Particular:"Module Surface Temp. Sensor",Quantity:"1",UOM:"nos", "Proposed Make":"Delta", Specification:"High-accuracy, weatherproof module surface temperature sensor"},{Particular:"Irradiation Sensor",Quantity:"1",UOM:"nos", "Proposed Make":"Kipp & Zonen", Specification:"Solar pyranometer for measuring global solar irradiance"},{Particular:"Wind Speed & Wind Direction Sensors",Quantity:"0",UOM:"nos", "Proposed Make":"Anemometer", Specification:"Anemometer for measuring wind speed and direction"},{Particular:"Ambient Temp Sensors",Quantity:"0",UOM:"nos","Proposed Make":"Thermochron", Specification:"Temperature sensor for measuring ambient temperature"},{Particular:"Datalogger for Weather Station, Inverter, MFM Monitoring",Quantity:"1",UOM:"nos", "Proposed Make":"Campbell Scientific", Specification:"CR1000 datalogger for collecting and storing data from weather station, inverter, and MFM"},{Particular:"DGPV Synchronisation Panel",Quantity:"0",UOM:"nos", "Proposed Make":"Schneider Electric", Specification:"Synchronization panel for connecting diesel generator (DG) to the grid"},{Particular:"Shielded, Armoured Modbus Cable",Quantity:"30",UOM:"meter", "Proposed Make":"Belden", Specification:"Shielded, armored Modbus cable, suitable for outdoor use and harsh environments"},{Particular:"Conduit, 25 mm, HDPE solar grade",Quantity:"30",UOM:"meter", "Proposed Make":"TE Connectivity", Specification:"HDPE conduit, 25 mm diameter, solar grade, for protecting cables"},{Particular:"Armoured FO Cable",Quantity:"0",UOM:"meter", "Proposed Make":"Corning", Specification:"Armored fiber optic cable, suitable for long-distance data transmission"},{Particular:"CAT-6 Cable",Quantity:"0",UOM:"meter","Proposed Make":"Belden", Specification:"CAT-6 cable, for network connections"},{Particular:"Earth Pit",Quantity:"1",UOM:"meter", "Proposed Make":"Customized", Specification:"Earth pit for grounding the electrical system"}]
export const moduleCleaning = [{Particular:"Water Storage Tank - 2000 ltr",Quantity:"1",UOM:"nos", "Proposed Make":"Grundfos", Specification:"2000-liter capacity, HDPE construction, UV-resistant, with overflow protection"},{Particular:"UPVC Piping & Accessories",Quantity:"1",UOM:"nos", "Proposed Make":"Astral", Specification:"1-inch diameter UPVC pipes, elbows, tees, and couplings, suitable for outdoor use"},{Particular:"Pumps (1HP)",Quantity:"0",UOM:"nos", "Proposed Make":"Grundfos", Specification:"Submersible pump, 1 HP, 240V, with automatic float switch for water level control"},{Particular:"Support for pump",Quantity:"0",UOM:"nos", "Proposed Make":"Customized", Specification:"Galvanized steel frame for secure mounting of the pump"},{Particular:"Elevated structure for water tank",Quantity:"1",UOM:"nos", "Proposed Make":"Customized", Specification:"Galvanized steel structure for raising the water tank to improve water pressure"},{Particular:"Nozzle",Quantity:"1",UOM:"nos", "Proposed Make":"Rain Bird", Specification:"Rotary nozzle, adjustable spray pattern, with built-in filter to prevent clogging"},]
export const haveDG=[{} as miscellaneousdetailsTy],needPVAndDGSynch=[{} as miscellaneousdetailsTy],needRPRProtection=fireFightingData;

export const initialRoofDetails = {
    structureDetails: {parapetwall:"0.3",sanctionload: "",loading:"20",buildingheight:"",rooftype:{label:"RCC Roof",value:"RCC Roof"},azimuthangle:"0",tiltangle:"0",modulemanufacturer:null,modulecapacity:null,inveterType:"onGrid",inveterManufacturer:null,inveterCapacity:null,tiltdirection:null,...plantinfrastructuredesigning},
    keepoutsDetails:[] as TInfradesign[],
    electricalDetails:{stringingType:"Manual",invertertoaccbdistance:'10',moduletoinverterdistance:'5',cablebtwmoduleandinverter:null,cablebtwaccbandtp:null} as electricalDetailsType,
    reportDetails:{},
    error:{}
} as roofDetailsType;

export const initialGenerationData:IPvNxtGenerationReq={"arr":{"subarray_enable":1,"subarray_nstrings":1,"subarray_modules_per_string":10,"subarray_mppt_input":1,"subarray_tilt":20,"subarray_tilt_eq_lat":0,"subarray_azimuth":180,"subarray_track_mode":3,"subarray_rotlim":45,"subarray_shade_mode":0,"subarray_gcr":0.3,"subarray_slope_tilt":0,"subarray_slope_azm":0,"subarray_monthly_tilt":[40,40,40,20,20,20,20,20,20,40,40,40],"subarray_rear_soiling_loss":0,"subarray_rack_shading":4,"subarray_mismatch_loss":0.02,"subarray_diodeconn_loss":0.5,"subarray_dcwiring_loss":2,"subarray_tracking_loss":0,"subarray_nameplate_loss":0,"subarray_electrical_mismatch":0,"subarray_mod_orient":0,"subarray_nmodx":7,"subarray_nmody":2,"subarray_backtrack":0,"subarray_soiling":[5,5,5,5,5,5,5,5,5,5,5,5]},"inv":{"total_mppts":0,"inverter_count":1,"inverter_model":1,"mppt_low_inverter":100,"mppt_hi_inverter":480,"inv_ds_paco":3300,"inv_ds_eff":97.6,"inv_ds_pnt":0,"inv_ds_pso":15,"inv_ds_vdco":330,"inv_ds_vdcmax":600,"inverter_temp_load":"3593.0, 3593.0, 3437.0, 3437.0, 3125.0, 0.0"},"module":{"celltech":0,"vmp":41.8,"imp":13.04,"voc":49.65,"pmp":0,"isc":13.92,"bvoc":-0.0000000142,"aisc":0.0000772,"gpmp":-0.331,"nser":72,"area":2.556048,"tnoct":46,"standoff":0,"mounting":0,"is_bifacial":0,"bifacial_transmission_factor":0.013,"bifaciality":0.7,"bifacial_ground_clearance_height":1,"transient_thermal_model_unit_mass":11.0919,"tranmission_loss":0},"loss":{"subarray_soiling":0.05,"en_snow_model":0,"dcoptimizer_loss":0,"acwiring_loss":0,"auxilary_loss":0.006,"quality_loss":0.06,"lid_loss":0.015,"system_unavailibility_loss":0.094},"systemDesign":{"system_capacity":5.49692,"use_wf_albedo":1,"use_spatial_albedos":0,"irrad_mode":0,"albedo":0.2,"sky_model":2,"enable_mismatch_vmax_calc":0,"calculate_rack_shading":0,"calculate_bifacial_electrical_mismatch":1,"module_model":2,"module_aspect_ratio":1.6680202,"en_batt":0,"en_benable_subhourly_clippingatt":0,"adjust_constant":0,"adjust_en_timeindex":0,"adjust_en_periods":0,"subarray_monthly_tilt":[0],"grid_interconnection_limit_kwac":100000,"adjust_timeindex":[0],"adjust_periods":[0,0,0],"mms_length":4.5},"pvtilt":20,"pvlayout":"landscape","timezone":5.5};
export const miscellaneousdesign = {haveDG:{value:"No",details:[] as miscellaneousdetailsTy[],tablename:"",label:"Do you have DG in your premise?"},needPVAndDGSynch:{value:"No",details:[] as miscellaneousdetailsTy[],label:"Do you need DG-PV Synch. equipment?",tablename:""},needRPRProtection:{value:"No",details:needRPRProtection,label:"If no, then do you need RPR protection",tablename:"PV-DG Design"},needFirefightingSys:{value:"No",details:fireFightingData,label:"Do you need Fire-fighting system?",tablename:"Fire Fighting System Design"},needLifeline:{value:"No",details:lifeLineData,label:"Do you need lifeline on the roof?",tablename:"Lifeline Design"},needWalkWay:{value:"No",details:walkwayData,label:"Do you need walkway on the roof? ",tablename:"Walkway Design"},needMonitoringSys:{value:"No",details:monitoringData,label:"Do you need monitoring system?",tablename:"Monitoring System Design"},needModuleCleaning:{value:"No",details:moduleCleaning,label:"Do you need module cleaning system?",tablename:"Module Cleaning System Design"},generationModelType:{pvNXT:true,SAM:false}};
export const initialCalNoOfModule = {"wattage": 530,"minAmbTemp": -5,"maxAmbTemp": 48,"volTempCoffientVmpVoc": -0.28,"nominalOpenCircuitVoltage_VOC": 49.48,"maxSystemVoltage": 1500,"mpptInputRangeMin": 800,"mpptInputRangeMax": 1300,"nominalShortCircuitCurrent_ISC": 13.73,"nominalMaximumPowerVoltage_VMPP": 40.87,"nominalMaximumPowerCurrent_IMPP": 12.97,"maxGhi": 941,"minGhi": 12}
const initialState: EPCReducerTy = {
    //RoofAnalysis inital state
    roofAnalysis:{
        selectedProject:{} as ProjectTy | ownLeadProjectTy,
        roofDetails:[],
        roofDetailsIndx:0,
        moduleManufacturer: [],
        moduleInverter: [], 
        moduleInverterCapacity: [],
        cableBtwModuleAndInverter:[],
        cableBtwACCBAndTP:[],
        dataSource: {} as dataSourceResType,
        moduleCapacity:[], 
        BillOfQuantities:{},
        formDetails: {projectsetup,projectdesign,plantinfrastructuredesigning,plantinfrastructuredesigningNew,miscellaneousdesign},
        roofDesign: { totalarea: 0, useablearea: 0, buildingheight: '', parapetheight: '', parapetoffset: '', totalModules: '' } as Troofdesign,
        infraDesign: [] as TInfradesign[],
        obstructions: [],
        moduleInverterDetails:{} as moduleInverterDetailsType,
        moduleDetails:{} as moduleDetailsType,
        generationPvNxt:{},
        generationSam:{},
        graphData:[],
        error:{} as roofAnalysisErrorTy
    },
    //ProjectDetails inital state
    projectDetails:[],
    //LeadBoardInitalState
    pvNxtLeads:{
        ownLead:[],
        PvNxt:{RFPBid:[],subscribedLead:[]},
        cardView:[]
    },

    loadingModuleManufacturer: false,
    error: null,
    selectedKeepouts: [] as string[]
};

const EPCSlice = createSlice({
    name: "EPC",
    initialState,
    reducers: {
        //roofAnalysis Actions
        setRoofDetails: (state, { payload }:PayloadAction<roofDetailsType[]>) => {
            state.roofAnalysis.roofDetails = payload
        },
        setRoofDetailsIndx: (state, { payload }:PayloadAction<number>) => {
            state.roofAnalysis.roofDetailsIndx = payload
        },
        setstructureDetails: (state, { payload }:PayloadAction<structureDetailsType & plantinfrastructuredesigningTyp>) => {
            state.roofAnalysis.roofDetails[state.roofAnalysis.roofDetailsIndx!].structureDetails = payload
        },
        setelectricalDetails: (state, { payload }:PayloadAction<electricalDetailsType>) => {
            state.roofAnalysis.roofDetails[state.roofAnalysis.roofDetailsIndx!].electricalDetails = payload
        },
        setModuleManufacturer:(state,{payload}:PayloadAction<selectOptionType>)=>{
            state.roofAnalysis.roofDetails[state.roofAnalysis.roofDetailsIndx!].structureDetails.modulemanufacturer = payload;
        },
        setModulecapacity:(state,{payload}:PayloadAction<selectOptionType>)=>{
            state.roofAnalysis.roofDetails[state.roofAnalysis.roofDetailsIndx!].structureDetails.modulecapacity = payload;
        },
        setInveterManufacturer:(state,{payload}:PayloadAction<selectOptionType>)=>{
            state.roofAnalysis.roofDetails[state.roofAnalysis.roofDetailsIndx!].structureDetails.inveterManufacturer = payload;
        },
        setInveterCapacity:(state,{payload}:PayloadAction<selectOptionType | null>)=>{
            state.roofAnalysis.roofDetails[state.roofAnalysis.roofDetailsIndx!].structureDetails.inveterCapacity = payload;
        },
        setRoofDetailsError:(state,{payload}:PayloadAction<structureDetailsError>)=>{
            state.roofAnalysis.roofDetails[state.roofAnalysis.roofDetailsIndx!]['error'] = payload
        },
        setRoofOneError:(state,{payload}:PayloadAction<any>)=>{
            state.error = payload;
        },
        setRoofAnalysisError:(state,{payload}:PayloadAction<roofAnalysisErrorTy>)=>{
            state.roofAnalysis.error = payload;
        },
        setModuleCapacity:(state,{payload})=>{
            state.roofAnalysis.moduleCapacity=payload
        },
        setInveterModuleCapacity:(state,{payload})=>{
            state.roofAnalysis.moduleInverterCapacity=payload
        },
        setRoofAnalysisDetails:(state,{payload})=>{
            state.roofAnalysis.formDetails=JSON.parse(JSON.stringify(payload))
        },
        setRoofAnalysisProjectSetupDetails:(state,{payload}:PayloadAction<EPCProjectSetupType>)=>{
            state.roofAnalysis.formDetails.projectsetup=payload
        },
        setPlantInfraStructureDesigning:(state,{payload}:PayloadAction<plantinfrastructuredesigningTypNew>)=>{
            state.roofAnalysis.formDetails.plantinfrastructuredesigningNew=payload;
        },
        setweatherdatadetails:(state,{payload}:PayloadAction<weatherdetailsType>)=>{
            state.roofAnalysis.formDetails.plantinfrastructuredesigningNew.weatherdata=payload;
        },
        setPlantInfraStructureAddOrientation:(state,{payload}:PayloadAction<addOrientationType[]>)=>{
            // state.roofAnalysis.formDetails.plantinfrastructuredesigningNew.addOrientation=payload;
        },
        setPlantInfraStructureAddPvArray:(state,{payload}:PayloadAction<pvArrayDesignType[]>)=>{
            state.roofAnalysis.formDetails.plantinfrastructuredesigningNew.pvArrayDesign=payload;
        },
        setPlantInfraStructureLoss:(state,{payload}:PayloadAction<lossCalculationType<number>>)=>{
            state.roofAnalysis.formDetails.plantinfrastructuredesigningNew.lossCalculation=payload;
        },
        setMiscellaneousDesign:(state,{payload}:PayloadAction<miscellaneousdesignType>)=>{
            state.roofAnalysis.formDetails.miscellaneousdesign = payload;
        },
        //LeadBoard Actions
        setRFPBidding: (state, { payload }: PayloadAction<ProjectTy[]>) => {
            state.pvNxtLeads.PvNxt.RFPBid = payload;
        },
        setSubscribedLead: (state, { payload }: PayloadAction<ProjectTy[]>) => {
            state.pvNxtLeads.PvNxt.subscribedLead = payload;
        },
        setSelectedProject: (state, { payload }: PayloadAction<ProjectTy | ownLeadProjectTy>) => {
            state.roofAnalysis.selectedProject = payload;
        },
        setRoofDesignArea: (state, { payload }: PayloadAction<Partial<Pick<Troofdesign, 'totalarea' | 'useablearea'>>>) => {
            if(payload.totalarea){
                state.roofAnalysis.roofDesign.totalarea = payload.totalarea
            }
            if(payload.useablearea){
                state.roofAnalysis.roofDesign.useablearea = payload.useablearea
            }
        },
        setRoofDesignData: (state, { payload }: PayloadAction<Omit<Troofdesign, 'totalarea' | 'useablearea' | 'totalModules' | 'defaultmodulePower' | 'plantDCpower'>>) => {
            state.roofAnalysis.roofDesign.parapetoffset = payload.parapetoffset
            state.roofAnalysis.roofDesign.buildingheight = payload.buildingheight
            state.roofAnalysis.roofDesign.parapetheight = payload.parapetheight
        },
        setResetRoof: (state, { payload }: PayloadAction) => {
            state.roofAnalysis.roofDesign.parapetoffset = '';
            state.roofAnalysis.roofDesign.buildingheight = '';
            state.roofAnalysis.roofDesign.parapetheight = '';
            state.roofAnalysis.roofDesign.totalarea = 0;
            state.roofAnalysis.roofDesign.useablearea = 0;
        },
        setRoofHeight: (state, { payload }: PayloadAction<Partial<Omit<Troofdesign, 'totalarea' | 'useablearea' | 'totalModules' | 'defaultmodulePower' | 'plantDCpower'>>>) => {
            if(payload.buildingheight){
                state.roofAnalysis.roofDesign.buildingheight = payload.buildingheight
            }
        },
        setModuleInfo: (state, { payload }: PayloadAction<Partial<Troofdesign>>) => {
            
            if(payload.totalModules){
                if( isFinite(parseFloat(payload.totalModules))){
                    // console.log(payload.totalModules, 'payload.totalModules')
                    state.roofAnalysis.roofDesign.totalModules = payload.totalModules
                }
            }
            if(payload.defaultmodulePower){
                state.roofAnalysis.roofDesign.defaultmodulePower = payload.defaultmodulePower
            }
            if(payload.plantDCpower){
                state.roofAnalysis.roofDesign.plantDCpower = payload.plantDCpower;
                if(state.roofAnalysis.roofDetails.length){
                    state.roofAnalysis.roofDetails[0].structureDetails.sanctionload = payload.plantDCpower.toString()
                }
            }
        },
        setInfraDesignData: (state, { payload }: PayloadAction<TInfradesign>) => {
            state.roofAnalysis.roofDetails[0].keepoutsDetails.push(payload)
        },
        updateInfraDesignData: (state, { payload }: PayloadAction<Pick<TInfradesign, 'infraheight' | 'infraoffset' | 'name' | 'uid'>>) => {
            // console.log(state.roofAnalysis.roofDetails[0].keepoutsDetails, payload)
            let index  = state.roofAnalysis.roofDetails[0].keepoutsDetails.findIndex(ele => ele.name === payload.name);
            if(index > -1){
                state.roofAnalysis.roofDetails[0].keepoutsDetails[index].infraheight = payload.infraheight
                state.roofAnalysis.roofDetails[0].keepoutsDetails[index].infraoffset = payload.infraoffset
                state.roofAnalysis.roofDetails[0].keepoutsDetails[index].uid = payload.uid

            }
        },
        removeInfraDesignData: (state, { payload }: PayloadAction<string>) => {
            if(payload.length === 0) return
            if(state.roofAnalysis.roofDetails.length){
                if(Object.keys(state.roofAnalysis.roofDetails[0]).length){
                    state.roofAnalysis.roofDetails[0].keepoutsDetails = state.roofAnalysis.roofDetails[0].keepoutsDetails.filter(item => item.name !== payload)
                }
            }
        },
        setObstructionData: (state, { payload }: PayloadAction<TObstruction>) => {
            state.roofAnalysis.obstructions.push(payload)
        },
        setUpdateObstructionData: (state, { payload }: PayloadAction<Pick<TObstruction, 'obstructionheight' | 'obstructionoffset' | 'uid' | 'name'>>) => {
            let index = state.roofAnalysis.obstructions.findIndex(ele => ele.name === payload.name);
            if(index > -1){
                state.roofAnalysis.obstructions[index].obstructionheight = payload.obstructionheight
                state.roofAnalysis.obstructions[index].obstructionoffset = payload.obstructionoffset
                state.roofAnalysis.obstructions[index].uid = payload.uid
            }
        },
        removeObstructionData: (state, { payload }: PayloadAction<string>) => {
            state.roofAnalysis.obstructions = state.roofAnalysis.obstructions.filter(item => item.name !== payload)
        },
        resetRoofAnalysisDetails: (state,{payload}:PayloadAction) => {
            state.roofAnalysis = initialState.roofAnalysis
        },
        setRowSpacing: (state,{payload}:PayloadAction<'Automatic' | 'Manual'>) => {
            state.roofAnalysis.formDetails.plantinfrastructuredesigning.rowspacing = payload
        },
        setRowSpacingHoriValue: (state,{payload}:PayloadAction<string>) => {
            state.roofAnalysis.formDetails.plantinfrastructuredesigning.rowSpacingHorizontal = payload
        },
        setRowSpacingVerticalValue: (state,{payload}:PayloadAction<string>) => {
            state.roofAnalysis.formDetails.plantinfrastructuredesigning.rowSpacingVertical = payload
        },
        setReloader: (state,{payload}:PayloadAction<boolean>) => {
            state.loadingModuleManufacturer=payload
        },
        setSerachedLocation: (state, { payload }: PayloadAction<string>) => {
            state.roofAnalysis.formDetails.projectsetup.address = payload
        },
        setSearchedLocationLatLong:(state,{payload}:PayloadAction<{lat:number,lng:number}>)=>{
            state.roofAnalysis.formDetails.projectsetup.lat = payload.lat
            state.roofAnalysis.formDetails.projectsetup.lng = payload.lng
        },
        addPvModule:(state,{payload}:PayloadAction<any>)=>{
             state.roofAnalysis.moduleManufacturer = [...state.roofAnalysis.moduleManufacturer,payload]
        },
        addPvInverter:(state,{payload}:PayloadAction<any>)=>{
            state.roofAnalysis.moduleInverter = [...state.roofAnalysis.moduleInverter,payload]
        },
        setMaxPlantCapacity:(state,{payload}:PayloadAction<string>) => {
            if(state.roofAnalysis.roofDetails.length > 0){
                state.roofAnalysis.roofDetails[0].structureDetails.maxplantcapacity = payload
            }
        },
        setStringSize:(state,{payload}:PayloadAction<string>) =>{
            state.roofAnalysis.roofDetails[state.roofAnalysis.roofDetailsIndx!].electricalDetails.stringingSize = payload;
        }
    },
    extraReducers: buildEPCExtraReducers,
});

export const {setStringSize,setInveterManufacturer,setRoofOneError,setRoofAnalysisError,setRoofDetailsError,setInveterCapacity,setReloader,setSerachedLocation,setRoofDetails,setSearchedLocationLatLong, setMaxPlantCapacity, setModuleCapacity,setModulecapacity,setweatherdatadetails,setRoofDetailsIndx,setModuleInfo,setSubscribedLead, setstructureDetails,setelectricalDetails,setRFPBidding,setMiscellaneousDesign,setInveterModuleCapacity,setModuleManufacturer, setResetRoof, updateInfraDesignData, setUpdateObstructionData, setRoofAnalysisProjectSetupDetails,setPlantInfraStructureAddOrientation,setPlantInfraStructureAddPvArray,setPlantInfraStructureLoss, setRoofAnalysisDetails,setSelectedProject,resetRoofAnalysisDetails,setRowSpacing,  setRoofDesignArea, setRoofDesignData, setInfraDesignData, removeInfraDesignData, setObstructionData, removeObstructionData, setRowSpacingVerticalValue, setRowSpacingHoriValue,addPvModule,addPvInverter } = EPCSlice.actions;
export default EPCSlice.reducer;
