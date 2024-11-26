import { createAsyncThunk } from "@reduxjs/toolkit";
import { APIResponse, AxioMethodType } from "../../../../Utils/Const";
import axios, { AxiosResponse } from "axios";
import { baseURL, requestUrl } from "../../../../Utils/baseUrls";
import { ProjectTy, user_mstr_modal } from "../../Auth/types";
import { toast } from "react-toastify";
import { dataSourceResType, lossCalculationResType, ModuleACcableResType, moduleCapacityType, ModuleCBcableResType, moduleDetailsType, moduleInverterCapacityValue, moduleInverterDetailsType, moduleInverterTy } from "./type";
//**************RoofAnalysis ActionList*****************************//
export const getModuleManufacturer = createAsyncThunk<any, any, { rejectValue: string }>(
    "moduleManufacturer/get",
    async (searchValue, { rejectWithValue }) => {
        try {
            const { data }: AxiosResponse<APIResponse<any>> = await baseURL.get(requestUrl.getPvModule + searchValue);
            if (data.code !== '200') {
                return rejectWithValue(data.message!);
            }
            return data.responseData.value;
        } catch (error) {
            return rejectWithValue('Failed to fetch module manufacturers');
        }
    }
);
export const getModuleCapacity = createAsyncThunk<moduleCapacityType[], any, { rejectValue: any }>(
    "getModuleCapacity/get",
    async (searchValue, { rejectWithValue }) => {
        try {
            let query = searchValue
            if(searchValue){
                let value = searchValue?.split(" | ");
                if(value && value.length){
                    query = value[0];
                }
            }
            const { data }: AxiosResponse<APIResponse<moduleCapacityType[]>> = await baseURL.get(requestUrl.getPvModuleInfo + query);
            if (data.code !== '200') {
                return rejectWithValue(data.message!);
            }
            return data.responseData;
        } catch (error) {
            return rejectWithValue('Failed to fetch module manufacturers');
        }
    }
);

export const getModuleInveter = createAsyncThunk<moduleInverterTy[], any, { rejectValue: string }>(
    "getModuleInveter/get",
    async ({searchValue,pvModuleID,sanctionload}, { rejectWithValue }) => {
        if(!pvModuleID){
            return [];
        }
        try {
            // let url = requestUrl.getPvInveter + searchValue
            // if(sanctionload && searchValue){
            // }
            // url = `${requestUrl.getPVInverterByCapacity}?capacity=${sanctionload}&manufacturer=${searchValue}`
            // const { data }: AxiosResponse<APIResponse<moduleInverterTy[]>> = await baseURL.get(`${requestUrl.getPVInverterByCapacity}?capacity=${sanctionload*1000}&manufacturer=${searchValue||null}`);
            const { data }: AxiosResponse<APIResponse<moduleInverterTy[]>> = await baseURL.get(`${requestUrl.getPVCompatibleInvertersForModule}${pvModuleID}/${sanctionload}/${searchValue||null}`);
            if (data.code !== '200') {
                return rejectWithValue(data.message!);
            };
            return data.responseData;
        } catch (error:any) {
            return rejectWithValue(error?.response?.data?.message??'Failed to fetch module manufacturers');
        }
    }
);
export const getModuleInveterCapacity = createAsyncThunk<moduleInverterCapacityValue[], any, { rejectValue: any }>(
    "getModuleInveterCapacity/get",
    async (searchValue, { rejectWithValue }) => {
        try {
            const { data }: AxiosResponse<APIResponse<moduleInverterCapacityValue[]>> = await baseURL.get(requestUrl.getPvInveterInfo + searchValue);
            if (data.code !== '200') {
                return rejectWithValue(data.message!);
            }
            return data.responseData;
        } catch (error) {
            return rejectWithValue('Failed to fetch module manufacturers');
        }
    }
);
export const getModuleInveterById = createAsyncThunk<moduleInverterDetailsType, any, { rejectValue: any }>(
    "getModuleInveterById/get",
    async (invId, { rejectWithValue }) => {
        try {
            const { data }: AxiosResponse<APIResponse<moduleInverterDetailsType>> = await baseURL.get(requestUrl.getPvInveterById + invId);
            if (data.code !== '200') {
                return rejectWithValue(data.message!);
            }
            return data.responseData;
        } catch (error) {
            return rejectWithValue('Failed to fetch module manufacturers');
        }
    }
);

// get pvmodule details using is id 

export const getPVModuleDetailsById = createAsyncThunk<moduleDetailsType, any, { rejectValue: any }>(
    "getPVModuleDetailsById/get",
    async (modid, { rejectWithValue }) => {
        try {
            const { data }: AxiosResponse<APIResponse<moduleDetailsType>> = await baseURL.get(requestUrl.getPvmodulebyid + modid);
            if (data.code !== '200') {
                return rejectWithValue(data.message!);
            }
            return data.responseData;
        } catch (error) {
            return rejectWithValue('Failed to fetch module manufacturers');
        }
    }
);

export const getWeatherDataSource = createAsyncThunk<dataSourceResType, any, { rejectValue: any }>(
    "weatherDataSource/get",
    async ({searchValue,id}, { rejectWithValue }) => {
        try {
            let url = requestUrl.getWeatherData + searchValue;
            if(id){
                url = requestUrl.getWeatherDataById + id;
            }
            const { data }: AxiosResponse<APIResponse<dataSourceResType>> = await baseURL.get(url);
            if (data.code !== '200') {
                return rejectWithValue(data.message!);
            }
            return data.responseData;
        } catch (error) {
            return rejectWithValue('Failed to fetch module manufacturers');
        }
    })
//**************LeadBoard ActionList*****************************//
export const getAllSubscribedLeads = createAsyncThunk<ProjectTy[], any, { rejectValue: string }>(
    "subscribedLeads/get",
    async (reqBody, { rejectWithValue }) => {
        const { userid,type} = reqBody
        try {
            const { data }: AxiosResponse<APIResponse<ProjectTy[]>> = await baseURL.get(requestUrl.projectsByUser + '/' + userid);
            if (data.code !== '200') {
                return rejectWithValue('Failed to fetch subscribed leads');
            };
            let resultData = data.responseData;
            if(type == "RFP"){
                resultData = resultData.filter(el => {
                    if (el.bidepc && el.bidepc.length) {
                        return el
                    }
                })
            }
            return resultData;
        } catch (error) {
            return rejectWithValue('Failed to fetch subscribed leads');
        }
    }
);

export const getOwnLeadsDetails = createAsyncThunk<user_mstr_modal[], any, { rejectValue: [] }>("getOwnLeads/get",async (epcid, { rejectWithValue }) => {
        const res = await baseURL.get(requestUrl.getEPCUsers + epcid);
        if (res.status === 200) {
            if (res.data.code === "200") {
                return res.data.responseData.data
            }
        } else {
            return rejectWithValue(res.data.responseData.message)
        }
    }
);
export const getRFPByEPCId = createAsyncThunk<ProjectTy[], any, { rejectValue: [] }>("getRFPByEPCId/get",async ({epcid,pageQuery}, { rejectWithValue }) => {
    const res = await baseURL.get(requestUrl.getRFPByEPCId + epcid + "/" + pageQuery);
    if (res.status === 200) {
        if (res.data.code === "200") {
            return res.data.responseData
        }
    } else {
        return rejectWithValue(res.data.responseData.message)
    }
});

export const getAllProjectsByEPCid = createAsyncThunk<ProjectTy[], any, { rejectValue: string }>("getAllProjectsByEPCid/get", async (epcid, { rejectWithValue }) => {
    try{
        const {data}:AxiosResponse<APIResponse<ProjectTy[]>> = await baseURL.get(requestUrl.getProjectBasedOnEPC + epcid);
        if (data.code === '200') {
                return data.responseData
            } else {
            return rejectWithValue(data.message!)
        }
    }catch(err:any){
        return rejectWithValue(err.response?.data?.message??"There was an issue. Please try again later.")
    }
})
export const getProjectsByProjectid = createAsyncThunk<ProjectTy, any, { rejectValue: [] }>("getProjectsByProjectid/get", async (projectid, { rejectWithValue }) => {
    const res = await baseURL.get(requestUrl.project + "/" + projectid);
    if (res.status === 200) {
        if (res.data.code === "200") {
            return res.data.responseData
        }
    } else {
        return rejectWithValue(res.data.responseData.message)
    }
});

export const getEPCProjects = createAsyncThunk<ProjectTy[],any,{rejectValue:[]}>(
  "getEPCProjects/get",
  async (epcid, { rejectWithValue }) => {
    const res = await baseURL.get(requestUrl.getProjectBasedOnEPC + epcid);
    if (res.status === 200) {
        if (res.data.code === "200") {
            return res.data.responseData
        }
    } else {
        return rejectWithValue(res.data.responseData.message)
    }
}
)


export const saveEPCProjects = createAsyncThunk<ProjectTy, any, {}>("project/saveUpdate", async ({reqBody,projectid}, { rejectWithValue }) => {
    try {
        let url = requestUrl.project,method:AxioMethodType = "post";
        if(projectid){
            url = `${requestUrl.project}/${projectid}`;
            method = "put";
        }
        const { data }: AxiosResponse<APIResponse<ProjectTy>> = await baseURL[method](url, reqBody);
        if (data.code === "200") {
            return data.responseData;
        } else {
            return rejectWithValue(data.message)
        }
    } catch (err: any) {
        return rejectWithValue(err);
    };
});
export const getmoduleAcCable = createAsyncThunk<ModuleACcableResType[], void, {}>("getmoduleAcCable/get", async (_,{ rejectWithValue }) => {
    try {
        const { data }:AxiosResponse<APIResponse<ModuleACcableResType[]>> = await baseURL.get(requestUrl.getmoduleAcCable);
        if (data.code === "200") {
            return data.responseData;
        } else {
            return rejectWithValue(data.message)
        }
    } catch (err: any) {
        return rejectWithValue(err);
    };
});
export const getmoduleDcCable = createAsyncThunk<ModuleCBcableResType[], void, {}>("getModuleDcCable/get", async (_,{ rejectWithValue }) => {
    try {
        const { data }: AxiosResponse<APIResponse<ModuleCBcableResType[]>> = await baseURL.get(requestUrl.getmoduleDCcable);
        if (data.code === "200") {
            return data.responseData;
        } else {
            return rejectWithValue(data.message)
        }
    } catch (err: any) {
        return rejectWithValue(err);
    };
})

export const saveLosses = createAsyncThunk<lossCalculationResType, any, {}>("saveLosses/save", async ({reqBody,projectid}, { rejectWithValue }) => {
    try {
        let url = requestUrl.saveLossCalculation+projectid,method="post" as AxioMethodType;
        if(reqBody.lossid){
            url = requestUrl.saveLossCalculation+reqBody.lossid;
            method="put";
            // delete reqBody.lossid;
        };
        const { data }: AxiosResponse<APIResponse<lossCalculationResType>> = await baseURL[method](url, reqBody);
        if (data.code === "200") {
            return data.responseData;
        } else {
            return rejectWithValue(data.message)
        }
    } catch (err: any) {
        return rejectWithValue(err);
    };
})

export const getPvNxtGenerationData = createAsyncThunk<any, any>("generationPvNxt/get", async (data,{ rejectWithValue }) => {
    const {initialGenerationData:reqBody, load,lat,lng,india} = data
    try {
        const { data }: AxiosResponse<APIResponse<string>> = await baseURL.post(`${requestUrl.generationPvNXT}${load}/${lat}/${lng}/${india}`,reqBody);
        if (data.code === "200") {
            return JSON.parse(data.responseData);
        } else {
            return rejectWithValue(data.message)
        }
    } catch (err: any) {
        return rejectWithValue(err);
    };
});
export const getSAMGenerationData = createAsyncThunk<any, any, {}>("generationSAM/get", async (data,{ rejectWithValue }) => {
    const {initialGenerationData:reqBody, load,lat,lng,india} = data
    try {
        const { data }: AxiosResponse<APIResponse<string>> = await baseURL.post(`${requestUrl.generationSAM}${load}/${lat}/${lng}/${india}`,reqBody);
        if (data.code === "200") {
            return JSON.parse(data.responseData);
        } else {
            return rejectWithValue(data.message)
        }
    } catch (err: any) {
        return rejectWithValue(err);
    };
})


export const fetchCalculatedData = createAsyncThunk<any, any>(
    'pvTable/fetchTables',
    async (data, { rejectWithValue }) => {
      const response: AxiosResponse = await baseURL.post(requestUrl.getSAMData, data)
      if (response.status === 200) {
        if (response.data.code === "200") {
          return response.data.responseData
        } else {
          return rejectWithValue(response.data)
        }
      }
      return rejectWithValue(response.data)
    }
  )
  export const fetchCalData2 = createAsyncThunk<any, any>(
    'pvTable/fetchTables2',
    async (data, { rejectWithValue }) => {
      const response: AxiosResponse = await baseURL.post(requestUrl.getpvNxtData, {
        Headers: {
          'Access-Control-Allow-Origin': '*',
        },
        data: data
      })
      if (response.status === 200) {
        return response.data
      }
      return rejectWithValue(response.data)
    }
  )
   

  // fetch country code using countryid 

 export const fetchCountryDetails = async (countryid:string|null) => {
    try {
      const { data } = await baseURL.get(`${requestUrl.getCountryCode}/${countryid}`);
       if (data.code==="200"){
        return data.responseData
       }
       return toast.error(data.responseData,{toastId:"countryid"})
    } catch (err) {
      console.log(err);
    }
  };