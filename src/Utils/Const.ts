import { ChangeEvent, Key } from "react"
import { ActionMeta, GroupBase, InputActionMeta, MenuPlacement, MultiValue, SingleValue } from "react-select"
import globalLayers from "./EPCMaps/Maps/GlobaLMap"
import Graphic from "@arcgis/core/Graphic"
import { TObstructionType } from "../ReduxTool/Slice/Partner/EPC"
import { defaultCountries, parseCountry } from "react-international-phone"
import { user_mstr_modal } from "../ReduxTool/Slice/Auth/types"

export const USER_TYPE_CONSUMER:userRole = 'Consumer'
export const USER_TYPE_PARTNER:userRole = 'Partner'
export const USER_TYPE_ADMIN:userRole = 'Admin'
export const USER_TYPE_Verify:userRole = 'verifyUserType'
export const OTP_COUNTER = 60;
export const OTP_COUNT = 3
export interface ProfileTy{
    fname:string | null;
    lname:string | null;
    userEmail:string | null;
    userMobile:string | null;
    countrycode:string;
    isvalid:boolean;
  }
export interface IUpdateEvent {
    graphics: any
    state: string
    aborted: boolean
    tool: string
    toolEventInfo: ToolEventInfo
    type: string
}

export interface ToolEventInfo {
    dx: number
    dy: number
    mover: any
    type: string
}
// let blockLen = 1.6;
// let blockWid = 1;
// Width=1.134
// Height=2.274
// Depth=0.035
// Weight=29.400

// layer names for graphcilayers for 3d layer
export const roofLayerName = "pvlayers:roof";

// useableara 
export const MINUSEABLEAREA = 15;
export const MAXUSEABLEAREA = 2000;

export const roofazimuth = 'roofazimuth';
export const cornerlabel = 'cornerlabel';
export const sketchGraphicTitle = 'Sketch GraphicsLayer'
export const SolarPanelsLayerName = 'Solar Panels'

export type MapViewType = '2D' | '3D'

/// tool type for obstructions
export type TActiveToolType = "Inverter" | "circle" | 'polygon' | "rectangle" | "roof" | "skyline" | "pipeline" | "solarmodule" | "building" | 'walkaway' | '' 
| 'lightningArrestor'  | 'Handrail' | 'Lifeline' | 'waterstorage' | TObstructionType | 'existingsolarmodules' | 'AC_Earthing_Pit' | 'DC_Earthing_Pit' 
| 'Module_Cleaning_Pipe' | 'Skylights' | 'Pipelines' | 'Roof_Ridge' | 'Parapet_Wall' | 'Nearby_Trees' | 'Mumty_Structure' | 'HVAC_Equipment' | 'Extended_Columns' 
| 'turbo_vent';


export type labelIndexType = { "A": number,"B": number,"C": number,"D": number }
export type IndexedGraphic = Record<number, Graphic>
export type globalLayerType = typeof globalLayers;


/**for service countries */
export const serviceCountries = (reqCountry:string[])=>{
    return  defaultCountries.filter((country) => {
       const { iso2 } = parseCountry(country);
       return reqCountry.includes(iso2)
     })
}   
export const countries = serviceCountries(['in','ae','sa', 'us'])


export const defaultmoduleArea = 3;
export const defaultmoduleWidth = 1.134;
export const defaultmoduleLength = 2.274;
export const defaultmodulePower = 545;
export const voltagepermodule = 500;
export const coverageFactor = 0.8;

export const LocationMarker = 'location-marker'
export interface APIResponse<T> {
    code: string,
    responseData: T,
    message?: string
}
export interface AgGridResponseType<T>{
    page: number
    per_page: number
    total: number
    total_pages: number
    data: T
  }
export type TSignWithOtp = {
    email: string,
    toastId: React.MutableRefObject<any>,
    setShow: (value: React.SetStateAction<boolean>) => void
    show: boolean
}
export type sign = {
    email: string, mobile: string, fname: string, lname: string, isMobileValid: boolean
}

export const elevationIndex  = 'elevationindex'
export const Azimuth  = 'azimuth'
export const TiltAngle  = 'TiltAngle'
export const ElevatedSideHeight  = 'ElevatedSideHeight'
export const zIndex  = 'zIndex'
export const attributeheight  = 'height'
export const attributeElevation  = 'elevation'
export const elevatedSideLength  = 'elevatedSideLength'
export const attributeRings  = 'rings'
export const Panels = 'panels'
export const rooftiltangle = 'rooftiltangle'
export const elevationDirection = 'elevationDirection'
export const originalGeometry = 'originalGeometry'
export const isInvalidGeom = 'isInvalidGeom'

//RoofAnalysis Container
export type TDrawerContainer = {
    title: string;
    Component: () => JSX.Element;
    btnTitle: string;
    headerName: string;
}
//Input Props Type
export type TinputType = "text" | "number" | "date" | "checkbox" | "password" | "email" | "file"

export interface IInputProps {
    id?: string,
    labelname?: string,
    name: string,
    value: string | number,
    placeholder?: string
    type: TinputType
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    star?: boolean,
    autoFocus?: boolean,
    icon?: JSX.Element,
    errors?:boolean,
    helpertext?:string
};
export type NewinputType = "text" | "number" | "date" | "checkbox" | "password" | "email"
export interface NewInputProps {
    className?:string,
    id?: string,
    labelname?: string,
    name: string,
    value: string | number,
    placeholder?: string
    type: NewinputType
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    star?: boolean,
    icon?: JSX.Element,
    disabled?: boolean
    maxLength?: number
    content?: string
    hideIcon?: boolean
    max?: string,
    min?: string,
    handlefocus?: (e: any) => void
    onBlur?: (e: any) => void
    autoFocus?: boolean
    onKeyPress?:(e:any)=>void
    onKeyUp?:(e:any)=>void
    isLoging?:boolean
    title?:string
    tooltipInfo?:string,
    tooltipPositon?:'right'|'left'|'buttom'|'top',
    submitBtnTxt?:string,
    helpertext?:string,
    suftext?: string
    error?:string | null
}
export interface InputPropsTy {
    id?: string,
    label?: string,
    name: string,
    value: string | number,
    placeholder?: string
    type: NewinputType
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
    icon?: JSX.Element,
    disabled?: boolean
    maxLength?: number
    content?: string
    hideIcon?: boolean
    max?: string,
    min?: string
}

export type selectOptionType = {
    label: string,
    value: string,
}
export interface reactSelectType {
    id?: string,
    name: string,
    placeholder?: string,
    labelname?: string,
    options: any,
    onChange: any,
    value: selectOptionType | null,
    isMulti?: boolean | undefined,
    closeMenuOnSelect?: boolean | undefined,
    isUpload?: boolean | undefined,
    icon?: any,
    isRequired?: boolean,
    infoDetails?: string
    filterOptions?:({ label, value }: {label: any;value: any;}, string: any) => boolean
    disabled?:boolean
    error?: string | null
    pageSize?:number
    isSearchable?:boolean
    handleInputChange?:(newValue: string,name:string,actionMeta: InputActionMeta) => void;
    isLoading?: boolean;
    key?: Key | null | undefined;
    onFoucs?: React.FocusEventHandler<HTMLInputElement> | undefined
    menuPlacement?:MenuPlacement | undefined
    onBlurChangeEvent?:boolean
}
export const gridOptions = { rowHeight: 60, rowClass: "custom_css_agGrid" };
export const defaultColDef: any = { sortable: true, resizable: true, filter: true, flex: 1, minWidth: 120 };
export interface modalPropsTypes {
    headerTitle: String;
    modalSize: 'lgx' | 'lg' | 'md' | 'sm' | 'sm-x' | 'small';
    btnTitle: string;
    secBtnTitle?: string;
    onClick: (isSecBtn?: boolean) => void;
    onSubmit:(e:React.FormEvent) => void;
    children: JSX.Element;
    fontWeight?: string;
    closeModal: (name?: string) => void;
    name?: string;
    subHeaderTitle?: string;
    className?: string;
    overflow?:boolean
    btnVisible?:boolean
};
export type modalPropsType = Omit<modalPropsTypes,"onSubmit">
export type FormModalPropsType = Omit<modalPropsTypes,"onClick">

export const uploadLeadsCsvData = [["First name","Last name", "Address", "Mobile", "Email",], ["Rajat","mishra","Noida one, Noida sec-62, Uttar pradesh","9852122587","example@gmail.com"]];
export type userRole = "Admin" | "Partner" | "Consumer" | "verifyUserType" |"";
export interface AuthState {
    isAuthenticated: boolean
    user: {
        role: userRole
        hassceen: boolean
    }
}
export type AxioMethodType = "put"|"patch"|"get"|"post";
export interface IGeneration {
    pvNxt:string;
    sam:string;
}

export interface CountryLocationInterface {
    address: Address
    location: Location
  }
  
  export interface Address {
    Match_addr: string
    LongLabel: string
    ShortLabel: string
    Addr_type: string
    Type: string
    PlaceName: string
    AddNum: string
    Address: string
    Block: string
    Sector: string
    Neighborhood: string
    District: string
    City: string
    MetroArea: string
    Subregion: string
    Region: string
    RegionAbbr: string
    Territory: string
    Postal: string
    PostalExt: string
    CntryName: string
    CountryCode: string
    X: number
    Y: number
    InputX: number
    InputY: number
  }
  
  export interface Location {
    x: number
    y: number
    spatialReference: SpatialReference
  }
  
  export interface SpatialReference {
    wkid: number
    latestWkid: number
  }


  export const isValidName = (input: string): boolean => {
    return /^[a-zA-Z]+$/.test(input);
  };
  

export interface ProfileModalOptionsTy{
    view:boolean
    setting:boolean
    support: boolean
    password: boolean
}

export interface PasswordModalTy{
    name: string;
    label: string;
    value: string
    type: string
}
export interface authCheckResTy {
    activestatus: boolean
    emailotp: number
    emailverify: boolean
    issignupcomplete: boolean
    userdetails: user_mstr_modal
  }