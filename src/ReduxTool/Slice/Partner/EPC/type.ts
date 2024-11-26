import { ParsedCountry } from "react-international-phone";
import { countryJsonType, ProjectTy, user_mstr_modal } from "../../Auth/types";
import { selectOptionType } from "../../../../Utils/Const";

export type TRoofExtended = {roofDesign: Troofdesign, infraDesign: TInfradesign[], obstructions: TObstruction[]}

export interface EPCReducerTy {
    projectDetails: user_mstr_modal[] | ProjectTy[];
    roofAnalysis: roofAnalysisTy & TRoofExtended,
    loadingModuleManufacturer: boolean;
    pvNxtLeads: pvNxtLeadsTy;
    error: any;
    selectedKeepouts: string[]
}
export interface roofAnalysisTy {
    selectedProject:ProjectTy | ownLeadProjectTy;
    roofDetails: roofDetailsType[];
    roofDetailsIndx?:number;
    BillOfQuantities:any;
    moduleManufacturer: moduleInverterCapacityValue[];
    cableBtwModuleAndInverter: ModuleCBcableResType[];
    cableBtwACCBAndTP: ModuleACcableResType[];
    dataSource: dataSourceResType;
    moduleCapacity: any[];
    formDetails: roofAnalysisFormTyp;
    moduleInverter:moduleInverterTy[];
    moduleInverterCapacity:moduleInverterCapacityValue[];
    moduleDetails:moduleDetailsType
    moduleInverterDetails:moduleInverterDetailsType;
    generationPvNxt:any;
    generationSam:any;
    graphData:number[]
    error:roofAnalysisErrorTy
};
export interface roofDetailsType{
  structureDetails:structureDetailsType & plantinfrastructuredesigningTyp
  keepoutsDetails:TInfradesign[]
  electricalDetails:electricalDetailsType
  reportDetails:any,
  error:structureDetailsError
}
export type structureDetailsType = {
    sanctionload: string,
    loading:string,
    inveterType:string;
    buildingheight:string;
    rooftype:selectOptionType;
    azimuthangle:string;
    tiltangle:string;
    modulemanufacturer:selectOptionType | null;
    modulecapacity:selectOptionType | null;
    inveterCapacity:selectOptionType | null;
    inveterManufacturer:selectOptionType | null;
    maxplantcapacity:string;
    tiltdirection:selectOptionType | null;
    parapetwall:string;
  }
export interface electricalDetailsType {
  stringingType:'Automatic' | 'Manual';
  stringingSize:string;
  cablebtwmoduleandinverter:selectOptionType | null;
  cablebtwaccbandtp:selectOptionType | null;
  moduletoinverterdistance:string;
  invertertoaccbdistance:string;
}
export interface roofDetailsError{
  structureDetails:structureDetailsError
  keepoutsDetails:TInfradesign[]
  electricalDetails:structureDetailsError
}
export type structureDetailsError = Omit<structureDetailsType, 'modulemanufacturer' | 'modulecapacity' | 'inveterCapacity' | 'inveterManufacturer' | 'rooftype' | 'tiltdirection'> 
                                    & Pick<ReactSelectErr, 'modulemanufacturer' | 'modulecapacity' | 'inveterManufacturer' | 'inveterCapacity' | 'rooftype' | 'tiltdirection' | 'MMSType' | 'moduleOrientation' | 'azumuthAngle' | 'cablebtwmoduleandinverter' | 'cablebtwaccbandtp' | 'stringingType'>
                                    & Omit<plantinfrastructuredesigningTyp,'MMSType' | 'moduleOrientation' | 'azumuthAngle'>
                                    & Omit<electricalDetailsType, "cablebtwaccbandtp" | "cablebtwmoduleandinverter" | "stringingType">

// export type keepoutsDetailsError = 
export type ReactSelectErr={
    rooftype:string|null;
    modulemanufacturer:string | null;
    modulecapacity:string | null;
    inveterCapacity:string | null;
    inveterManufacturer:string | null;
    tiltdirection:string | null;
    MMSType: string | null;
    moduleOrientation: string | null
    azumuthAngle: string | null
    cablebtwmoduleandinverter:string | null
    cablebtwaccbandtp: string | null
    stringingType:string | null
    //userVerification type
    statename:string | null
    cityname:string | null
    weatherdatasource: string | null,
  corrosioncategory: string | null
}
export type roofAnalysisErrorTy = lossCalculationType<string> & Pick<ReactSelectErr ,'weatherdatasource' | 'corrosioncategory'>
export interface moduleInverterTy {

  name: string
  id: string
  manufacturer: string
  seriesModules: number
  parallelStrings: number
  numberOfInverters: number
}

export interface moduleInverterCapacityValue {
    name: string
    id: string
    manufacturer: string
  }
export interface ownLeadProjectTy{
    userid: string
    epcuserid: string | null,
    customerName: string
    emailid: string
    mobile: string
    address: string
    projectid: string
    projectName: string
    projectCost: string
    RoofAnalysisCompleted: boolean
    projecttype: string
    createddt: string
    sanctionload: string
}
export interface pvNxtLeadsTy{
    ownLead:any[];
    PvNxt:PvNxtTy;
    cardView:any[];
};
export interface PvNxtTy{
    RFPBid:ProjectTy[],
    subscribedLead:any[]
};

/**  PARTNER EPC */

export interface roofAnalysisFormTyp {
    projectsetup: EPCProjectSetupType;
    projectdesign: ProjectDesignType;
    plantinfrastructuredesigning: plantinfrastructuredesigningTyp,
    plantinfrastructuredesigningNew: plantinfrastructuredesigningTypNew
    miscellaneousdesign: miscellaneousdesignType
}
export interface EPCProjectSetupType {
    address: string,
    sanctionload: string,
    connectedvoltage: string,
    meteringpoint: string,
    modulemanufacturer: string,
    modulecapacity: string,
    lat: number,
    lng: number,
    projectid: string,
    projectname: string;
    loading:string
    moduleorientation: string
    consumercategoryid: selectOptionType | null
    providerid: selectOptionType | null
}
export interface ProjectDesignType {
    orientation: string,
    buildingheight: string,
    parapetheight: string,
    parapetoffset: string
}

export type TOrientation = 'Landscape' | 'Portrait' | string
export type TRowType = 'Automatic' | 'Manual'

// export type  EPCProjectSetupType = Pick<EPCProjectSetupTy, 'address' | 'weatherdatasource' | 'connectedvoltage' |'meteringpoint' | 'modulemanufacturer' | 'modulecapacity' | 'lat' | 'lng' | 'projectid' | 'projectname' >
export interface plantinfrastructuredesigningTyp {
    MMSType: selectOptionType
    moduleName: string
    moduleOrientation: selectOptionType | null
    tiltAngle: string
    azumuthAngle: selectOptionType | null
    arrayRows: string
    arrayColumns: string
    heightFromGround: string
    verticalSpaceBtwModules: string
    horizontalSpaceBtwModules: string
    panelStatus: string, 
    noOfExtensionPanel: string,
    typeOfBusBar: string,
    RYBIndication: string
    accblist: string
    mmsTiltAngle: string
    mmsAzimuthAngle: string,
    // rowSpacing: string
    rowspacing: string
    modulespacing: string
    rowSpacingHorizontal: string, rowSpacingVertical: string
}
export interface plantinfrastructuredesigningTypNew {
    weatherdata:weatherdetailsType;  
  // addOrientation:addOrientationType[];
    pvArrayDesign:pvArrayDesignType[];
    lossCalculation:lossCalculationType<number>
}
export interface weatherdetailsType {
  weatherdatasource: selectOptionType | null,
  corrosioncategory: selectOptionType | null
}
export interface addOrientationType {
    orientation:string
    projectType:string
    tiltAngle:string
    azimuthAngle:string
}
export interface pvArrayDesignType{
    pvArrayName: string
    moduleName: string
    invertorManufacture: string
    noOfMPPTs: string
    noOfString: string
    roofOrientation: string
    invertorCapacity: string
    invertorType: string
    noOfModulesInSeries: string
    action?:boolean
    stringSize?:string
  }
  export interface lossCalculationType<T> {
    lossid: string
    dccableloss: T
    cablebtwmoduleandinverter: string
    accableloss: T
    cablebtwaccbandtp: string
    moduleefficiencyloss: T
    lidloss: T
    modulemissmatchloss: T
    stringvoltagemissmatchloss: T
    soilingloss: T
    auxloss: T
    unavailloss: T
    climateloss: T
  }
  export interface lossCalculationResType{
    lossid: string
    dccableloss: number
    cablebtwmoduleandinverter: string
    accableloss: number
    cablebtwaccbandtp: string
    moduleefficiencyloss: number
    lidloss: number
    modulemissmatchloss: number
    stringvoltagemissmatchloss: number
    soilingloss: number
    auxloss: number
    unavailloss: number
    climateloss: number
    createdat: string
    updatedat: string
    dcModule?:any,
    acModule?:any
  }
  
export interface miscellaneousdesignType {
    haveDG:miscellaneoustype;
    needPVAndDGSynch: miscellaneoustype;
    needRPRProtection: miscellaneoustype
    needFirefightingSys: miscellaneoustype
    needMonitoringSys: miscellaneoustype
    generationModelType: generationModelType
    needLifeline:miscellaneoustype
    needWalkWay:miscellaneoustype
    needModuleCleaning:miscellaneoustype
}
export interface miscellaneoustype{
  label:string;
  value:string;
  details:miscellaneousdetailsTy[];
  tablename:string
}
export interface miscellaneousdetailsTy{
  Particular:string;
  Quantity:string;
  UOM:string;
 "Proposed Make"?:string;
  Specification?:string;
}
export interface BOQEPCDetails{
  name:string;
  companyname:string;
  registrationNo:string;
  serviceState:string;
  email:string;
  mobile:string
}

export type miscellaneousFieldType =  "haveDG" | "needPVAndDGSynch" | "needRPRProtection" | "needFirefightingSys" | "needMonitoringSys" | "generationModelType" | "generationModelType" | "needLifeline" | "needWalkWay" | "needModuleCleaning";
export interface generationModelType{
    pvNXT:boolean
     SAM:boolean
}

export interface LeadType {
    index?: number;
    userid: string;
    customerName: string;
    emailid: string;
    mobile: string;
    address: string;
    projectName: string;
    projectid: string;
    RoofAnalysisCompleted: boolean;
    projectCost: string;
    projecttype?: string;
    sanctionload?: number;
    createddt?: string;
    bidwontype?:string;
    mobileValid?:boolean;
    country?:ParsedCountry
  };

  export interface OwnleadT {
    index?: number;
    userid: string;
    fname: string;
    lname:string;
    emailid: string;
    mobile: string;
    address: string;
    projectName: string;
    projectid: string;
    RoofAnalysisCompleted: boolean;
    projectCost: string;
    projecttype?: string;
    sanctionload?: number;
    createddt?: string;
    bidwontype?:string;
    mobileValid?:boolean;
    country?:ParsedCountry
  };

  export interface dataSourceResType {
    pkid: string
    longitude: number
    latitude: number
    avgtemp: number
    distancefromsite: number
    elevation: number
    avgGHI: number
    avgDNI: number
    windspeed: number
    snow: string
    gic: number
    city: string
    type: string
  }
  export interface moduleCapacityType {
    id: string
    name: string
    manufacturer: any
  }

export type TObstructionType = "Existing Solar Modules" | "Mobile Tower" | 'Chimney' | 'Nearby Trees' | 'Helipad' | 'Parapet Wall' | 'Skylights' | 'Roof Ridge' | 'HVAC Equipment' | 'Mumty Structure' | 'Extended Columns' |'Pipelines' | 'Turbo Vents' | 'Others' | "" ;

export type Troofdesign = { totalarea: number, useablearea: number, buildingheight: string,  parapetheight: string, parapetoffset: string, totalModules: string, defaultmodulePower: string, plantDCpower : string };
export type TInfradesign = { totalarea: number, infraoffset: string, infraheight: string, infraType: string, uid: number, name: string, graphic: string };
export type TObstruction = { totalarea: number, obstructionoffset: string, obstructionheight: string, obstructiontype: TObstructionType, uid: number, name: string };

export interface moduleInverterDetailsType {
    pvinvid: string
    name: string
    vac: number
    pso: number
    paco: number
    pdco: number
    vdco: number
    c0: number
    c1: number
    c2: number
    c3: number
    pnt: number
    vdcmax: number
    idcmax: number
    mppt_low: number
    mppt_high: number
    cec_hybrid: string
    cec_date: string
    priority: number
    activestatus: boolean
    createdat: string
    updatedat: string
    type: any
    ondfilepath: any
    pdfpath: any
    stname:string
  }
  

  export interface moduleDetailsType {
    pvmodid: string
    name: string
    manufacturer: string
    technology: string
    bifacial: number
    stc: number
    ptc: number
    a_c: number
    length: any
    width: any
    n_s: number
    i_sc_ref: number
    v_oc_ref: number
    i_mp_ref: number
    v_mp_ref: number
    alpha_sc: number
    beta_oc: number
    t_noct: number
    a_ref: number
    i_l_ref: number
    i_o_ref: number
    r_s: number
    r_sh_ref: number
    adjust: number
    gamma_r: number
    bipv: string
    version: string
    date: string
    priority: number
    activestatus: boolean
    createdat: string
    updatedat: string
    type: any
    panfilepath: any
    pdfpath: any
    stname:string
  }
  
  export interface ModuleACcableResType{
    accableid: string
    mfgname: string
    mfgcountryhq: any
    mfgfacility: any
    gencabledesc: any
    genrefstd: any
    genprecodes: any
    genratedvoltage: any
    gengrade: any
    gencoresph: any
    genconductormat: any
    geninsulatormat: any
    geninnersheathmat: any
    genoutersheathmat: any
    genarmourmat: any
    genmaxcontemp: any
    genmaxshortcontemp: any
    genfaultcurarmour: any
    genfaultcurarmourscreen: any
    genflamefire: any
    genflamefireoutersheath: any
    genantirodent: any
    genantitermite: any
    genwaterswellabletape: any
    genmarinegrade: any
    gensubseacable: any
    genleadsheath: any
    genbelowgroundgeotech: any
    gensoilcorrosive: any
    genwatertable: any
    genvicinitycoastal: any
    genwatersaline: any
    genatmoscorrosion: any
    gennomcrosssection: any
    genshapeconductor: any
    genstrands: any
    gendiamconductor: any
    gennomthickinsulation: any
    gendiaminsulation: any
    gendiamlaidcores: any
    gennomthickinnersheath: any
    gendiaminnersheath: any
    genmetallayer1mat: any
    gennomareacuwscreen: any
    gennomthicksteeltapearmour: any
    gendiamarmorwire: any
    gendiamcuwscreenarmour: any
    gennomthickoutersheath: any
    genoverallcablediam: any
    genweightcompletecable: any
    gencolorinsulation: any
    gencoloroutersheath: any
    genmaxoperatingvoltage: any
    gendcresist20c: any
    genacresist90c: any
    gen3phaseinduct: any
    gen3phasereact60hz: any
    gen3phaseimp90c: any
    gen3phasecap: any
    genmininsulresist20c: any
    genminbendradius: any
    genmaxpulltension: any
    genmaxshortcur: any
    gen3phasedropfactor: any
    gencontcurrating: any
    gensingcircgroundresist: any
    gensingcircgroundtemp: any
    gensingcircgrounddepth: any
    genfreeairtemp: any
    date: any
    priority: number
    activestatus: boolean
    createdat: any
    updatedat: any
    type: any
    panfilepath: any
    pdfpath: any
  }

  export interface ModuleCBcableResType{
    cbcableid: string
    gennocores: string
    genvoltgrade: any
    genmaxopervolt: any
    genrefstandards: any
    condmat: any
    condnomarea: any
    condclass: any
    condnostrands: any
    condmaxtemp: any
    condmaxtempshortcircuit: any
    condmaxtempoverload: any
    insmat: any
    outersheathmattype: any
    outersheathcolor: any
    cabledrumlen: any
    cableemboss: any
    elecmaxdcresat20c: any
    eleccurrratingair60c: any
    addmarking: any
    addhalogenfree: any
    addflameretard: any
    addozoneresist: any
    adduvresist: any
    addelongbreak: any
    addacidresist: any
    addembossdetails: any
    date: any
    priority: number
    activestatus: boolean
    createdat: any
    updatedat: any
    type: any
    panfilepath: any
    pdfpath: any
  }
  
  export interface plantCapacityListTyp {
    leadcountid: string
    from: number
    to: number
    price_per_lead: number
    countryid: string
    country_mstr: countryJsonType
    createdat: string
    updatedat: string
  }

  // export interface IsamGenerationReq {
  //   arr: Arr
  //   trn: Trn
  //   user: User
  //   inv: Inv
  //   main: Main
  //   pvtilt: number
  //   pvlayout: string
  //   timezone: number
  // }
  
  // export interface Arr {
  //   system_design_nstrings: number
  //   system_design_modules_per_string: number
  //   system_design_mppt_input: number
  //   system_design_tilt: number
  //   system_design_tilt_eq_lat: number
  //   system_design_azimuth: number
  //   system_design_track_mode: number
  //   system_design_rotlim: number
  //   system_design_shade_mode: number
  //   system_design_gcr: number
  //   system_design_slope_tilt: number
  //   system_design_slope_azm: number
  //   system_design_mismatch_loss: number
  //   system_design_diodeconn_loss: number
  //   system_design_dcwiring_loss: number
  //   system_design_tracking_loss: number
  //   system_design_nameplate_loss: number
  //   system_design_mod_orient: number
  //   system_design_nmodx: number
  //   system_design_nmody: number
  //   system_design_backtrack: number
  //   system_design_enable: number
  //   system_design_rear_soiling_loss: number
  //   system_design_rack_shading: number
  //   system_design_electrical_mismatch: number
  // }
  
  // export interface Trn {
  //   transformer_no_load_loss: number
  //   transformer_load_loss: number
  // }
  
  // export interface User {
  //   user_Entered_Specifications_celltech: number
  //   user_Entered_Specifications_vmp: number
  //   user_Entered_Specifications_imp: number
  //   user_Entered_Specifications_voc: number
  //   user_Entered_Specifications_isc: number
  //   user_Entered_Specifications_bvoc: number
  //   user_Entered_Specifications_aisc: number
  //   user_Entered_Specifications_gpmp: number
  //   user_Entered_Specifications_nser: number
  //   user_Entered_Specifications_area: number
  //   user_Entered_Specifications_tnoct: number
  //   user_Entered_Specifications_standoff: number
  //   user_Entered_Specifications_mounting: number
  //   user_Entered_Specifications_is_bifacial: number
  //   user_Entered_Specifications_bifacial_transmission_factor: number
  //   user_Entered_Specifications_bifaciality: number
  //   user_Entered_Specifications_bifacial_ground_clearance_height: number
  //   user_Entered_Specifications_transient_thermal_model_unit_mass: number
  // }
  
  // export interface Inv {
  //   inverter_model: number
  //   invertor_count: number
  //   mppt_low_inverter: number
  //   mppt_hi_inverter: number
  //   invertor_ds_paco: number
  //   invertor_ds_eff: number
  //   invertor_ds_pnt: number
  //   invertor_ds_pso: number
  //   invertor_ds_vdco: number
  //   invertor_ds_vdcmax: number
  // }
  
  // export interface Main {
  //   enable_interconnection_limit: number
  //   grid_interconnection_limit_kwac: number
  //   en_batt: number
  //   adjust: number
  //   dc_adjust: number
  //   module_model: number
  //   module_aspect_ratio: number
  //   dcoptimizer_loss: number
  //   acwiring_loss: number
  //   transmission_loss: number
  //   en_snow_model: number
  //   system_capacity: number
  //   use_wf_albedo: number
  //   irrad_mode: number
  //   sky_model: number
  //   enable_mismatch_vmax_calc: number
  // }
  // export interface noOfStringModuleReq {
  //   wattage: number
  //   minAmbTemp: number
  //   maxAmbTemp: number
  //   volTempCoffientVmpVoc: number
  //   nominalOpenCircuitVoltage_VOC: number
  //   maxSystemVoltage: number
  //   mpptInputRangeMin: number
  //   mpptInputRangeMax: number
  //   nominalShortCircuitCurrent_ISC: number
  //   nominalMaximumPowerVoltage_VMPP: number
  //   nominalMaximumPowerCurrent_IMPP: number
  //   maxGhi: number
  //   minGhi: number
  // }

  export interface INoOfString{
    stringCount: number
    actualminVmpp: number
    actualmaxVmpp: number
    response: string[]
  }
  
   export interface IPvNxtGenerationReq {
    arr: Arr
    inv: Inv
    module: Module
    loss: Loss
    systemDesign: SystemDesign
    pvtilt: number
    pvlayout: string
    timezone: number
  }
  
  export interface Arr {
    subarray_enable: number
    subarray_mppt_input: number
    subarray_tilt: number
    subarray_tilt_eq_lat: number
    subarray_track_mode: number
    subarray_rotlim: number
    subarray_azimuth: number
    subarray_nstrings: number
    subarray_modules_per_string: number
    subarray_shade_mode: number
    subarray_gcr: number
    subarray_slope_tilt: number
    subarray_slope_azm: number
    subarray_monthly_tilt: number[]
    subarray_rear_soiling_loss: number
    subarray_rack_shading: number
    subarray_mismatch_loss: number
    subarray_diodeconn_loss: number
    subarray_dcwiring_loss: number
    subarray_tracking_loss: number
    subarray_nameplate_loss: number
    subarray_electrical_mismatch: number
    subarray_mod_orient: number
    subarray_nmodx: number
    subarray_nmody: number
    subarray_backtrack: number
    subarray_soiling: number[]
  }
  
  export interface Inv {
    total_mppts: number
    inverter_count: number
    inverter_model: number
    mppt_low_inverter: number
    mppt_hi_inverter: number
    inv_ds_paco: number
    inv_ds_eff: number
    inv_ds_pnt: number
    inv_ds_pso: number
    inv_ds_vdco: number
    inv_ds_vdcmax: number
    inverter_temp_load: string
  }
  
  export interface Module {
    celltech: number
    vmp: number
    imp: number
    voc: number
    pmp: number
    isc: number
    bvoc: number
    aisc: number
    gpmp: number
    nser: number
    area: number
    tnoct: number
    standoff: number
    mounting: number
    is_bifacial: number
    bifacial_transmission_factor: number
    bifaciality: number
    bifacial_ground_clearance_height: number
    transient_thermal_model_unit_mass: number
    tranmission_loss: number
  }
  
  export interface Loss {
    subarray_soiling: number
    en_snow_model: number
    dcoptimizer_loss: number
    acwiring_loss: number
    auxilary_loss: number
    quality_loss: number
    lid_loss: number
    system_unavailibility_loss: number
  }
  
  export interface SystemDesign {
    system_capacity: number
    use_wf_albedo: number
    use_spatial_albedos: number
    irrad_mode: number
    albedo: number
    sky_model: number
    enable_mismatch_vmax_calc: number
    calculate_rack_shading: number
    calculate_bifacial_electrical_mismatch: number
    module_model: number
    module_aspect_ratio: number
    en_batt: number
    en_benable_subhourly_clippingatt: number
    adjust_constant: number
    adjust_en_timeindex: number
    adjust_en_periods: number
    subarray_monthly_tilt: number[]
    grid_interconnection_limit_kwac: number
    adjust_timeindex: number[]
    adjust_periods: number[]
    mms_length: number
  }