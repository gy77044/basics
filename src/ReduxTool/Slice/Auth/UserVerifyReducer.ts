import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EPCFormType, EPCVerificationFormErrorTy } from "../../../Screen/UserVerification/UserTypeList";
import { newgeneratedId } from "../../../Utils/commonFunctions";
import { SubUserTypeOpt, UserTypeOpt } from "../Dashboard/dashboardTypes";
interface initialStateType {
    epcData: EPCFormType,
    usertype:UserTypeOpt
    usersubtype: SubUserTypeOpt,
    error:EPCVerificationFormErrorTy
}
const initialState: initialStateType = {
    epcData: { userid: "", cityname: [], companyId: newgeneratedId(), companyName: "", companyAddress: "", registrationNumber:"", registrationDoc: "", statename: [], dippDoc: "", isstartup: false } as EPCFormType,
    usertype:{} as UserTypeOpt,
    usersubtype: {} as SubUserTypeOpt,
    error:{} as EPCVerificationFormErrorTy
};

const UserVerifyReducer = createSlice({
    name: 'userVerifyReducer',
    initialState,
    reducers: {
        setEpcFormData: (state, { payload }) => {
            state.epcData = payload
        },
        setusertype:(state,{payload})=>{
            state.usertype = payload
        },
        setusersubtype: (state, { payload }) => {
            state.usersubtype = payload
        },
        setVerificationDetailsError:(state,{payload}:PayloadAction<EPCVerificationFormErrorTy>)=>{
            state.error = payload
        },
        resetStateVerfication: (state) => {
            return JSON.parse(JSON.stringify(initialState))
        }
    },
});
export const { setEpcFormData, setusersubtype,setusertype,setVerificationDetailsError, resetStateVerfication } = UserVerifyReducer.actions
export default UserVerifyReducer.reducer