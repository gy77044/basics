import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { IEPCTypeOpt } from "../Dashboard/dashboardTypes";

const initialState = {
    OpenCongrat:false as boolean,
    EPCUserDetails:{} as IEPCTypeOpt
}
export const epcModalReducer = createSlice({
    name:"epcModalReducer",
    initialState,
    reducers:{
        setOpenCongrat: (state,  { payload }: PayloadAction<boolean>) => {
            state.OpenCongrat = payload
        },
        setEpcUserDetails:(state,{ payload }: PayloadAction<IEPCTypeOpt>) =>{
            state.EPCUserDetails = payload
        }
    }
});

export const {setOpenCongrat,setEpcUserDetails} = epcModalReducer.actions
export default epcModalReducer.reducer;