
export interface previewRFPDataTyp{
  projectDetails:previewTableTy;
  moduleDetails: previewTableTy;
  inverterDetails: previewTableTy;
  moduleMountingDetails: previewTableTy;
  accbDetails: previewTableTy;
  miscellaneousDetails: previewTableTy;
  DGPVDetails: previewTableTy
  // RPRProtection: miscellaneousObj
  FirefightingSys: miscellaneousObj
  MonitoringSys: miscellaneousObj
  Lifeline:miscellaneousObj
  WalkWay:miscellaneousObj
  ModuleCleaning:miscellaneousObj
}


export interface miscellaneousObj{
  headerTitle: string;
  feilds: miscellaneousDetails[];
  
}

export interface miscellaneousDetails{
  Sno:string;
  Particular: string;
  Details: string;
  UOM:string
  "Proposed Make"?:string;
  Specification?:string;
}

export interface previewTableTy{
      headerTitle: string;
      feilds: previewTableFieldTy[];
}
export interface previewTableFieldTy{
  Sno:string;
  Particular: string;
  Details: string;
}
export interface previewFormData {
  bos: boolean
  turnkey: boolean
  submissiondate: string
  lsttimesubmission: string
  projectid: string
}
export type previewRFPData = 'projectDetails' | 'moduleDetails' | 'inverterDetails' | 'moduleMountingDetails' | 'accbDetails' | 'miscellaneousDetails' | 'DGPVDetails';
export const projectDetails = [
  {Sno:"1", Particular: "Location of Roof (State/District)", Details: "-",key:"address" },
  {Sno:"2", Particular: "Type of Project (Capex/Opex/Open Access)", Details: "-",key:"" },
  {Sno:"3", Particular: "DC System Volatge (1000 V / 1500 V)", Details: "-",key:"sanctionloadDC" },
  {Sno:"4", Particular: "Commissioning Date of Project", Details: "-",key:"commissioningDate" },
  {Sno:"5", Particular: "Project Duration (Months)", Details: "-",key:"" },
  {Sno:"6", Particular: "Estimated Roof Capacity (kWp)", Details: "-",key:"plantcapacity" },
  {Sno:"7", Particular: "Estimated AC Capacity (kW)", Details: "-",key:"sanctionload" },
  {Sno:"8", Particular: "Operation & Maintenance (Comprehensive O&M/AMC)", Details: "-",key:"" },
  {Sno:"9", Particular: "Tentative Date of Submission of Offer", Details: "-",key:"" },
  {Sno:"10", Particular: "Reverse Auction Date (if applicable)", Details: "-",key:"" },
  {Sno:"11", Particular: "Client's Facility Type (Residential / Industrial / Commercial / Agricultural)", Details: "-",key:"" },
  {Sno:"12", Particular: "Operational days in a year", Details: "-",key:"" },
  {Sno:"13", Particular: "Operational hours in a day", Details: "-",key:"" },
  {Sno:"14", Particular: "No. of days when facility remains shut", Details: "-",key:"" },
  {Sno:"15", Particular: "Operational load during off days (in kW)", Details: "-",key:"" },
  {Sno:"16", Particular: "Total Annual Energy Consumption from Grid (kWh)", Details: "-",key:"" },
  {Sno:"17", Particular: "Monthly Energy Consumption from Grid (kWh)", Details: "-",key:"" },
  {Sno:"18", Particular: "Annual Energy Consumption from DG (kWh or Liters)", Details: "-",key:"" },
  {Sno:"19", Particular: "Monthly Energy Consumption from DG (kWh or Liters)", Details: "-",key:"" },
  {Sno:"20", Particular: "Do we need DG-PV Synchronization? (Yes / No)", Details: "-",key:"" },
  {Sno:"21", Particular: "Do we need RPR? (Yes / No)", Details: "-",key:"" },
  {Sno:"22", Particular: "Roof Information (For RCC Roof Only)", Details: "-",key:"" },
  {Sno:"22.1", Particular: "RCC Rooftop Waterproofing - RCC/ China mosiac/ Tar Sheet", Details: "-",key:"" },
  {Sno:"22.2", Particular: "Roof Tilt", Details: "-",key:"" },
  {Sno:"22.3", Particular: "Chipping allowed (Yes/No)", Details: "-",key:"" },
  {Sno:"22.4", Particular: "Counter Weight blocks option required (Yes/No)", Details: "-",key:"" },
  {Sno:"22.5", Particular: "MMS height to be raised (Yes / No)", Details: "-",key:"" },
  {Sno:"22.6", Particular: "RCC Rooftop Slab Puncturing (Yes/No)", Details: "-",key:"" },
  {Sno:"22.7", Particular: "RCC Rooftop Slab Thickness", Details: "-",key:"" },
  {Sno:"22.8", Particular: "Rooftop Waterproofing required (Yes/No)", Details: "-",key:"" },
  {Sno:"23", Particular: "Roof Dimension", Details: "-",key:"" },
  {Sno:"23.1", Particular: "Length", Details: "-",key:"" },
  {Sno:"23.2", Particular: "Width", Details: "-",key:"" },
  {Sno:"23.3", Particular: "Center Height from the ground", Details: "-",key:"" },
  {Sno:"23.4", Particular: "Eave Height from the ground (in case of slant roof)", Details: "-",key:"" },
  {Sno:"24", Particular: "Obstruction Details", Details: "-",key:"" },
  {Sno:"24.1", Particular: "Turbo Vent (Height / Diameter)", Details: "-",key:"" },
  {Sno:"24.2", Particular: "Skylight (Length / Width)", Details: "-",key:"" },
  {Sno:"24.3", Particular: "Parapet Wall (Height)", Details: "-",key:"" },
  {Sno:"24.4", Particular: "Equipment / Trees (Height / Width)", Details: "-",key:"" },
  {Sno:"24.5", Particular: "Nearby building height & distance from the project roof", Details: "-",key:"" },
  {Sno:"24.6", Particular: "Nearby chimney height & distance from the project roof", Details: "-",key:"" },
  {Sno:"24.7", Particular: "Any other obstacles near to the roof", Details: "-",key:"" },
  {Sno:"24.8", Particular: "Type and amount of dust on the roof", Details: "-",key:"" },
  {Sno:"25", Particular: "Roof Access", Details: "-",key:"" },
  {Sno:"25.1", Particular: "Already Existing (Yes / No)", Details: "-",key:"" },
  {Sno:"25.2", Particular: "If No, then whose scope? (Contractor / Client)", Details: "-",key:"" },
  {Sno:"25.3", Particular: "If Yes, then type of roof access", Details: "-",key:"" },
  {Sno:"25.4", Particular: "If access is available, then can the roof access be used for material shifting?", Details: "-",key:"" },
  {Sno:"25.5", Particular: "No. of Roof access points", Details: "-",key:"" },
  {Sno:"25.6", Particular: "In case of multiple roofs, do we need inter-roof access? (Yes / No)", Details: "-",key:"" },
  {Sno:"25.7", Particular: "Whether client will allow the usage of scaffolding at site for construction purposes? (Yes / No)", Details: "-",key:"" },
  {Sno:"25.8", Particular: "If No, whether machineries are allowed for material shifting inside the premises? (Yes / No)", Details: "-",key:"" },
  {Sno:"26", Particular: "Type of Lightning Arrestor (Conventional / ESE)", Details: "-",key:"" },
  {Sno:"27", Particular: "Spare Evacuation Philosophy", Details: "-",key:"" },
  {Sno:"27.1", Particular: "Whose Scope (Contractor / Client)", Details: "-",key:"" },
  {Sno:"27.2", Particular: "Current Rating of Spare Evacuation Point", Details: "-",key:"" },
  {Sno:"27.3", Particular: "Is vacant panel available at the termination point? (Yes / No)", Details: "-",key:"" },
  {Sno:"27.4", Particular: "If no, then do we have sufficient space at the termination point for installing evacuation panel?", Details: "-",key:"" },
  {Sno:"27.5", Particular: "Do we require busbar extension at the termination point? (Yes / No)", Details: "-",key:"" },
  {Sno:"27.6", Particular: "Do we have sufficient space to carry out the busbar extension (Yes / No)", Details: "-",key:"" },
  {Sno:"27.7", Particular: "Current Rating of the main incoming breaker from the grid side (A)", Details: "-",key:"" },
  {Sno:"27.8", Particular: "Voltage level of the busbar at the evacuation point", Details: "-",key:"" },
  {Sno:"27.9", Particular: "Material of the bus bar", Details: "-",key:"" },
  {Sno:"27.10", Particular: "Current rating of the bus bar", Details: "-",key:"" },
  {Sno:"27.11", Particular: "Fault level of the breaker & the busbar", Details: "-",key:"" },
  {Sno:"27.12", Particular: "Distance between evacuation panel and extension panel (m)", Details: "-",key:"" },
  {Sno:"27.13", Particular: "Connection philosophy (how to connect the extension panel with the existing busbar)", Details: "-",key:"" },
  {Sno:"28", Particular: "Location of LA Earthing Pit", Details: "-",key:"" },
  {Sno:"29", Particular: "Location of DC Earthing Pit", Details: "-",key:"" },
  {Sno:"30", Particular: "Location of AC Earthing Pit", Details: "-",key:"" },
  {Sno:"31", Particular: "Module Cleaning System", Details: "-",key:"" },
  {Sno:"31.1", Particular: "Water Storage Tank Capacity (liters)", Details: "-",key:"" },
  {Sno:"31.2", Particular: "Location of Water Storage Tank", Details: "-",key:"" },
  {Sno:"31.3", Particular: "Distance between Client's water tapping point & the water storage tank (m)", Details: "-",key:"" },
  {Sno:"31.4", Particular: "Water pressure to be maintained till the last module (bar)", Details: "-",key:"" },
  {Sno:"31.5", Particular: "Water Pump Capacity (HP)", Details: "-",key:"" },
  {Sno:"31.6", Particular: "Flow meter required (Yes / No)", Details: "-",key:"" },
  {Sno:"31.7", Particular: "No. of water storage tanks (in case of multi-roof project)", Details: "-",key:"" },
  {Sno:"32", Particular: "DG-PV Synchronization Equipment", Details: "-",key:"" },




];
export const moduleDetails = [
  {Sno:"1", Particular: "Module Make ", Details: "-" ,key:"pvmodule.manufacturer"},
  {Sno:"2", Particular: "Each Module Capacity Range (Wp)", Details: "-" ,key:"pvmodule.stname"},
  {Sno:"3", Particular: "Module Quantity based on each module capacity", Details: "-" ,key:""},
];
export const inverterDetails = [
  {Sno:"1", Particular: "Inverter Make", Details: "-" ,key:"pvinverter.name"},
  {Sno:"2", Particular: "Each Inverter Capacity (kW)", Details: "-" ,key:"pvinverter.stname"},
  {Sno:"3", Particular: "Location of Inverter", Details: "-" ,key:""},
  {Sno:"4", Particular: "Mode for inverter Installation", Details: "-" ,key:""},
];
export const moduleMountingDetails = [
  {Sno:"1", Particular: "Roof Type", Details: "-",key:"projecttype" },
  {Sno:"2", Particular: "Roof Penetration Allowed", Details: "Custom" ,key:""},
  {Sno:"3", Particular: "MMS Make", Details: "-" ,key:""},
  {Sno:"4", Particular: "MMS Type", Details: "-" ,key:"mmstype"},
];
export const accbDetails = [
  {Sno:"1", Particular: "Location of Roof (State/District)", Details: "-" ,key:"address"},
  {Sno:"2", Particular: "Type of Project (Capex/Opex/Open Access)", Details: "-" ,key:""},
  {Sno:"3", Particular: "DC System Volatge (1000 V / 1500 V)", Details: "-" ,key:"sanctionloadDC"},
];

export const miscellaneousDetails = [
  {Sno:"1", Particular: "Monitoring Level (Inverter level / String level)", Details: "-" ,key:""},
  {Sno:"2", Particular: "CEIG Approval Needed?", Details: "-" ,key:""},
  {Sno:"3", Particular: "DISCOM Approval Needed?", Details: "-" ,key:""},
  {Sno:"4", Particular: "Net Metering Needed?", Details: "-" ,key:""},
  {Sno:"5", Particular: "Net Metering Location", Details: "-" ,key:""},
  {Sno:"6", Particular: "Net Metering Voltage Level (kV)", Details: "-" ,key:""},
  {Sno:"7", Particular: "Meter Replacement Scope? (Contractor / Client)", Details: "-" ,key:""},
  {Sno:"8", Particular: "Any other approval if require in whose scope? (Contractor / Client)", Details: "-" ,key:""},

];


export const DGPVDetails = [
    {Sno:"1", Particular: "Plant Capacity (Mention both DC & AC)", Details: "-" ,key:""},
    {Sno:"1.1", Particular: "Location-1 (DC Capacity, kWp)", Details: "-" ,key:""},
    {Sno:"1.2", Particular: "Location-1 (AC Capacity, kW)", Details: "-" ,key:""},
    {Sno:"1.3", Particular: "Location-2 (DC Capacity, kWp)", Details: "-" ,key:""},
    {Sno:"1.4", Particular: "Location-2 (AC Capacity, kW)", Details: "-" ,key:""},
    {Sno:"1.5", Particular: "Location-3 (DC Capacity, kWp)", Details: "-" ,key:""},
    {Sno:"1.6", Particular: "Location-3 (AC Capacity, kW)", Details: "-" ,key:""},
    {Sno:"2", Particular: "Number of Inverters", Details: "-" ,key:""},
    {Sno:"3", Particular: "Inverter make", Details: "-" ,key:""},
    {Sno:"4", Particular: "Inverter rating", Details: "-" ,key:""},
    {Sno:"5", Particular: "Inverter model", Details: "-" ,key:""},
    {Sno:"6", Particular: "DG Make", Details: "-" ,key:""},
    {Sno:"7", Particular: "DG Model", Details: "-" ,key:""},
    {Sno:"8", Particular: "DG Capacity", Details: "-" ,key:""},
    {Sno:"9", Particular: "DG Minimum Load settings", Details: "-" ,key:""},
    {Sno:"10", Particular: "Number of PV MFMs", Details: "-" ,key:""},
    {Sno:"11", Particular: "Make of PV MFMs", Details: "-" ,key:""},
    {Sno:"12", Particular: "Model of PV MFMs", Details: "-" ,key:""},
    {Sno:"13", Particular: "Number of EB MFMs", Details: "-" ,key:""},
    {Sno:"14", Particular: "Make of EB MFMs", Details: "-" ,key:""},
    {Sno:"15", Particular: "Model of EB MFMs", Details: "-" ,key:""},
    {Sno:"16", Particular: "Number of DG MFM", Details: "-" ,key:""},
    {Sno:"17", Particular: "Make of DG MFM", Details: "-" ,key:""},
    {Sno:"18", Particular: "Model of DG MFM", Details: "-" ,key:""},
    {Sno:"19", Particular: "If there are more than one DG’s, then are all the DG’s run in sync model? (Yes / No)", Details: "-" ,key:""},
    {Sno:"20", Particular: "Whether potential free contacts for breaker signals of EB, DGs & Bus-couplers available? If potential contacts are not available then whether additional CT, Shunt coil trip & NO-NC contact available for each breaker?", Details: "-" ,key:""},
    {Sno:"21", Particular: "Do we have RS485 port available on MFMs for communication with the system? (Yes/No)", Details: "-" ,key:""},
    {Sno:"22", Particular: "If no, then parallel meters will have to be installed. For Parallel meters, what is the load burden & spare core of CT required for each meter?", Details: "-" ,key:""},
    {Sno:"23", Particular: "No. of Communication Loops of RS-485", Details: "-" ,key:""},
    {Sno:"24", Particular: "Approximate length of RS-485 Loops", Details: "-" ,key:""},
    {Sno:"25", Particular: "Net Metering available (Yes / No)", Details: "-" ,key:""},
    {Sno:"26", Particular: "Is the data available on Modbus TCP/IP from existing monitoring system?", Details: "-" ,key:""},
    {Sno:"27", Particular: "Is Load Variation Pattern available? (Yes / No).", Details: "-" ,key:""},
    {Sno:"28", Particular: "Please provide the link for the load variation pattern excel sheet.", Details: "-" ,key:""},
    {Sno:"29", Particular: "PV SLD", Details: "-" ,key:""},
    {Sno:"30", Particular: "Main Plant SLD", Details: "-" ,key:""},
    {Sno:"31", Particular: "Distance between DG & Inverter location (roof wise in case of multiple roofs)", Details: "-" ,key:""},
      ]