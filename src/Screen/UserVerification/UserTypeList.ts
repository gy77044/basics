import { IconInfo } from "../../assests/icons/DrawerIcons"

import { UserTypePartner } from ".";
import { USER_TYPE_PARTNER } from "../../Utils/Const";
import { ReactSelectErr } from "../../ReduxTool/Slice/Partner/EPC";


export const UserTypeRadioList = [
    {
        name: USER_TYPE_PARTNER,
        labelname: USER_TYPE_PARTNER,
        Content: UserTypePartner
    },
]

export const epcInputList = [
    {id:"companyUID", labelname:"Unique ID", name:"companyUID", type:"text", star:true, icon:IconInfo },
    {id:"companyName", labelname:"Company Name", name:"companyName", type:"text", star:true, icon:IconInfo },
    {id:"companyAddress", labelname:"Company Address", name:"companyAddress", type:"text", star:true, icon:IconInfo },
    {id:"userName", labelname:"UserName", name:"userName", type:"text", star:true, icon:IconInfo },
    {id:"userEmail", labelname:"User Email", name:"userEmail", type:"email", star:true, icon:IconInfo },
    {id:"userMobile", labelname:"User Mobile", name:"userMobile", type:"number", star:true, icon:IconInfo },
    {id:"userAddress", labelname:"User Address", name:"userAddress", type:"text", star:true, icon:IconInfo },
]


export type EPCFormType = {
  userid: string;
  usertypeid?: string;
  subusertypeid?: string;
  supusertypeid?: string;
  companyId: string;
  companyName: string;
  companyAddress: string;
  registrationNumber: string;
  registrationDoc: string;
  dippDoc: string;
  statename:any[];
  cityname:any[];
  isstartup:boolean
}
export type EPCVerificationFormErrorTy = Omit<EPCFormType , 'statename' | 'cityname' |'isstartup'> & Pick<ReactSelectErr,'statename'|'cityname'> ;
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

