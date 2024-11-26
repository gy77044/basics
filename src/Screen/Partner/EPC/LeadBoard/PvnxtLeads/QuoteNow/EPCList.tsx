import { CIListItem } from "./CustomerInformation";

export const customerDataInEPC = [
  { name: "Customer Unique ID", value: "rm-buildingsolar1-07.." },
  { name: "Customer Name", value: "Building Solar 1" },
  { name: "Customer Email", value: "johndoe@example.com" },
  { name: "Customer Mobile", value: "+91 9876543210" },
  { name: "Customer Address", value: "KLJ Noida One, Sec 62 .." },
  { name: "Total Installed Projects", value: "8" },
];
export const epcProjectSetupData = [
  { name: "Project Unique ID", value: "1001" },
  { name: "Latitute", value: "28.6230" },
  { name: "Longitude", value: "77.3664" },
  { name: "Altitude", value: "200 m" },
];
export const moreLeadInEPC = [
  { name: "100 Leads", value: "Free", btnText: "Try It Now" },
  { name: "Upto 1k Leads", value: "100 credits", btnText: "Subscribe" },
  { name: "Upto 20k Leads", value: "200 credits", btnText: "Subscribe" },
  { name: "Upto 50k Leads", value: "500 credits", btnText: "Subscribe" },
  { name: "Upto 100k Leads", value: "1000 credits", btnText: "Subscribe" },
];
export const quoteNowDataInEPC = [
  { name: "Project Capacity", value: "--",key:"sanctionload" },
  { name: "Consumer Category", value: "--",key:"tariffconsumercategory_mstr.consumercategoryname" },
  { name: "Area (City, State)", value: "--",key:"address" },
  { name: "Submission Deadline", value: "--",key:"bidding.submissiondate" },
];
export const quoteNowDataInEPCCostDetails = [
  { name: "Module Cost", value: "₹60,000",key:"moduleCost"},
  { name: "Inverter Cost", value: "₹15,000",key:"inverterCost" },
  { name: "Total Project Cost", value: "",key:"projectcost" },
];
export const quoteNowDataInEPCCostProjectDetails: CIListItem[] = [
  // { name: "Lead ID", value: "--" ,key:"projectid"},
  { name: "Plant DC Capacity", value: "--" ,key:"sanctionload"},
  { name: "Plant AC Capacity", value: "--" ,key:"sanctionloadAC"},
  { name: "Monthly/Yearly Units", value: "--",key:"yearlygenusablearea"},
  { name: "Project Usable Area", value: "--" ,key:"useablearea"},
  { name: "Submission Deadline", value: "--" ,key:"bidding.submissiondate"},
];




export const settingTableDataInEPC = [
  { name: "User Type", value: "Partner" },
  { name: "Business Type", value: "EPC" },
  { name: "Company  Unique ID", value: "10789" },
  { name: "Company Registration Number", value: "L17110MH1973PLC019786" },
  { name: "Company Registration Certificate", value: "Document 1" },
  { name: "Start-up Recognition Document", value: "Document 1" },
];
export const dcielectricalTableDataInEPC = [
  { name: "Equipment Name", value: ["Solar cable","m","40","Apar, Siechem","1CX4 sqmm, Copper conductor, 1.1 kV"] },
  { name: "UOM", value: ["DC Conduits","m","40","Tirupati Plastomatics","32mm Flexible DWC Conduit"] },
  { name: "Quantity", value: ["Module Connector","nos","10","Elmex","MC4 for cable - Male & Female"] },
  { name: "Proposed Make", value: ["Module Earthing Cable","m","40","Polycab","Lay in lug - Module Earthing (Al)"] },
  { name: "Specification", value: ["Connecting cable (MMS & Earth Strip)","m","40","Polycab","GI wire 6AWG - Connected between MMS & Earth Strip"] },
  { name: "Specification", value: ["DC Earth Strip","m","40","Tirupati Plastomatics","25X3 mm GI earth strip - DC earthing"] },
];


export interface UnitSetting {
  lablename: string;
  name: string;
}

export interface UnitCategory {
  label: string;
  units: UnitSetting[];
}

export const unitCategories: UnitCategory[] = [
  {
    label: "Unit Type",
    units: [
      { lablename: "Metric", name: "Metric" },
      { lablename: "Imperial", name: "Imperial" },
    ],
  },
  {
    label: "Length/Distance",
    units: [
      { lablename: "Millimeter (mm)", name: "Millimeter (mm)" },
      { lablename: "Centimeter (cm)", name: "Centimeter (cm)" },
      { lablename: "Meter (m)", name: "Meter (m)" },
      { lablename: "Kilometer (km)", name: "Kilometer (km)" },
    ],
  },
  {
    label: "Mass/Weight",
    units: [
      { lablename: "Milligram (mg)", name: "Milligram (mg)" },
      { lablename: "Gram (g)", name: "Gram (g)" },
      { lablename: "Kilogram (kg)", name: "Kilogram (kg)" },
    ],
  },
  {
    label: "Capacity/Volume",
    units: [
      { lablename: "Milliliter (ml)", name: "Milliliter (ml)" },
      { lablename: "Liter (L)", name: "Liter (L)" },
    ],
  },
  {
    label: "Temperature",
    units: [{ lablename: "Celsius (°C)", name: "Celsius (°C)" }],
  },
  {
    label: "Time",
    units: [{ lablename: "Second (s)", name: "Second (s)" }],
  },
];