import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IRoofDetailsReducer {
    editable: boolean
    regionName:string,
    useablearea: number 
     totalroofarea: number
     createdId: string | undefined
}
const intialState = {
    editable: false
} as IRoofDetailsReducer

export const RoofDetailsReducer = createSlice({
    name:'roofdetails',
    initialState:intialState,
    reducers:{
        setEditable:(state, {payload}: PayloadAction<boolean>)=>{
            state.editable= payload
        },
        setRegionName: (state: IRoofDetailsReducer, { payload }: PayloadAction<string>) => {
            state.regionName = payload;
        },
        saveProjectId: (state: IRoofDetailsReducer, { payload, }: PayloadAction<{ id: string; totalRoofArea: number; useablearea: number; }>) => {
            state.createdId = payload.id;
            state.totalroofarea = payload.totalRoofArea;
            state.useablearea = payload.useablearea;
        }

    }
})

export const {setEditable,setRegionName, saveProjectId} = RoofDetailsReducer.actions
export default RoofDetailsReducer.reducer;