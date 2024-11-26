import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { baseURL, requestUrl } from "../../../../Utils/baseUrls";

 
 
export interface Itable {
  data: any[]
  data2: any[]
  graphData: number[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed',
  loading2: 'idle' | 'pending' | 'succeeded' | 'failed',
  show: boolean
  showResult: boolean
  showRowModal: boolean
  showModal: boolean,
  error: any
}
 
const initialState = {
  data: [],
  data2: [],
  graphData: [],
  loading: 'idle',
  loading2: 'idle',
  show: false,
  showResult: false,
  showRowModal: false,
  showModal: false,
  error: ''
} as Itable
 
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
    const response: AxiosResponse = await axios.post(requestUrl.getpvNxtData, {
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
 
 
export const PvTableSlice = createSlice({
  name: "pvTable",
  initialState,
  reducers: {
    showTableModal: (state, { payload }: PayloadAction<boolean>) => {
      state.show = payload
    },
    ShowResultTable: (state, { payload }: PayloadAction<boolean>) => {
      state.showResult = payload
    },
    CloseResultTable: (state, { payload }: PayloadAction<boolean>) => {
      state.showResult = payload
    },
    showRowModal: (state, { payload }: PayloadAction<boolean>) => {
      state.showRowModal = payload
    },
    closeRowModal: (state, { payload }: PayloadAction<boolean>) => {
      state.showRowModal = payload
    },
    setModalOpen: (state, { payload }: PayloadAction<boolean>) => {
      state.showModal = payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCalculatedData.fulfilled, (state, { payload, meta }) => {
        const res = JSON.parse(payload)
        state.data = JSON.parse(payload)
        state.graphData = res[9]
        state.loading = 'succeeded'
        state.showRowModal = true
      })
      .addCase(fetchCalculatedData.pending, (state, action) => {
        state.loading = 'pending'
        state.showRowModal = false
      })
      .addCase(fetchCalculatedData.rejected, (state, action) => {
        state.loading = 'failed'
        state.showRowModal = false
        state.error = action.payload
      })
      .addCase(fetchCalData2.fulfilled, (state, { payload, meta }) => {
        const res = JSON.parse(payload)
        const dat = JSON.parse(res.array[1])
        state.data2 = dat.array
        // state.graphData = res[9]
        state.loading2 = 'succeeded'
        state.showRowModal = true
      })
      .addCase(fetchCalData2.pending, (state, action) => {
        state.loading2 = 'pending'
        // state.showRowModal = false
      })
      .addCase(fetchCalData2.rejected, (state, action) => {
        state.loading2 = 'failed'
        // state.showRowModal = false
        state.error = action.payload
      })
  },
});
 
export const { showTableModal, ShowResultTable, showRowModal, closeRowModal, CloseResultTable, setModalOpen } = PvTableSlice.actions
 
export default PvTableSlice.reducer;