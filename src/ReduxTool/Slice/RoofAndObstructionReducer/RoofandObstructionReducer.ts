import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IRoofObstructionType, IRoofObstructionselectType } from "./RoofandObstructionTypes"
const initialState = {
    roofType:"",
    structureType:"",
    roofPVCoverage:"",
    isSaveroofObstrctiondata:false
} as IRoofObstructionType

export const RoofandObstructionReducer = createSlice({
    name: "roofandobstructionslice",
    initialState,
    reducers: {
        setRoofNObstructionData: (state, { payload }: PayloadAction<IRoofObstructionselectType>) => {
            state.roofType = payload.roofType           
            state.structureType = payload.structureType      
            state.roofPVCoverage = payload.roofPVCoverage           
        },
        setSaveroofObstructData: (state, { payload }: PayloadAction<boolean>) => {
            state.isSaveroofObstrctiondata = payload
        },       
      
       
    }
})

export const { setRoofNObstructionData, setSaveroofObstructData } = RoofandObstructionReducer.actions

export default RoofandObstructionReducer.reducer
