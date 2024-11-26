import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../../../../Components/AllButton/AllButtons.tsx';
import { Input } from '../../../../../Components/AllInput/AllInput';
import Toast from '../../../../../Components/ErrorBoundry/Toast';
import FormModal from '../../../../../Components/New/Modal/FormModal';
import ReactSelect from '../../../../../Components/New/Select/ReactSelect';
import { setModalHeaderFooter } from '../../../../../ReduxTool/Slice/CommonReducers/CommonReducers';
import { plantCapacityListTyp } from '../../../../../ReduxTool/Slice/Partner/EPC';
import { useAppDispatch, useAppSelector } from '../../../../../ReduxTool/store/hooks';
import { baseURL, requestUrl } from '../../../../../Utils/baseUrls';
import { AgGridResponseType, APIResponse } from '../../../../../Utils/Const';
import LeadProjectsTable from '../LeadProjectsTable';
import { Lead_Subscription_TAB } from './PvNxtLeads';
interface plantCapacityListTy { label: string; value: string, rate: number };
interface formError {newmodulecapacity:string,leadcount:string,totalprice:string};
interface formData {newmodulecapacity:plantCapacityListTy|null,leadcount:number,totalprice:number}
const SubscribedLeads = ({activeTab}:{activeTab:string}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {user: { epcid },} = useAppSelector((state) => state.auth);
  const [plantCapacity, setPlantCapacity] = useState<plantCapacityListTy[]>([]);
  const [countLength, setCountLength] = useState<{newOpportunity: number;subscribedLeads: number;}>({ newOpportunity: 0, subscribedLeads: 0 });
  let initialFormData = {newmodulecapacity: null,leadcount: 0,totalprice: 0};
  const [formData, setFormData] = useState<formData>(initialFormData);
  const [error,setError] = useState<formError>();
  const [isGridUpdate, setIsGridUpdate] = useState(0);
  useEffect(() => {
    if(epcid && activeTab === Lead_Subscription_TAB){
      getRemainingLeadCount(epcid);
    }
  }, [isGridUpdate,activeTab]);

  useEffect(() => {
    const price = getPrice(formData.newmodulecapacity!, formData.leadcount);
    setFormData({ ...formData, totalprice: price });
  }, [formData.newmodulecapacity, formData.leadcount]);

  const formValidation = (): boolean => {
    let isValid = true;
    const errors = {} as formError;
    const validations:Array<{field:keyof formError,condition:boolean,message:string }> = [
        { field: "newmodulecapacity", condition: !formData.newmodulecapacity, message: "Plant Capacity is Required" },
        { field: "leadcount", condition: !formData.leadcount, message: "Lead Count is Required" },
        { field: "leadcount", condition: formData.leadcount !== undefined && formData.leadcount <= 0, message: "Lead Count should be greater than 0." },
        { field: "leadcount", condition: formData.leadcount !== undefined && formData.leadcount > countLength.newOpportunity, message: `Lead Count cannot exceed the actual count of  ${countLength.newOpportunity}` },
    ];
    for (const { field, condition, message } of validations) {
        if (condition) {
            errors[field] = message;
            isValid = false;
        }
    }
    Object.keys(errors).length > 0 && setError(errors)
    return isValid;
};

  const handleModalClick = async (e:any) => {
    e.preventDefault();
    if (!formValidation()) return;
    try {
      const plantCapacityid = formData.newmodulecapacity?.value;/*getElementByIndex(filterKeyIncludeArr(plantCapacity, "label", formData.newmodulecapacity!.),0,"value")*/;
      const { data }: AxiosResponse<APIResponse<any>> = await baseURL.get(`${requestUrl.getSubscibedBasedOnPayLeads}?epcid=${epcid}&NoOfLeadsToSubscribe=${formData.leadcount}&leadcountid=${plantCapacityid}`);
      if (data.code === "200") {
        setIsGridUpdate(isGridUpdate + 1);
        handleClose();
      }
    } catch (err: any) {
      err.status === 400 ? setError({leadcount:"",totalprice:"",newmodulecapacity:"Leads are not available within given plant capacity range."}) : Toast({messageText:err.response.data.message,messageType:"E"});
    };
  };

  const getPlantCapData = async () => {
    if (!countLength.newOpportunity) {
      Toast({messageText:"No new leads found",messageType:"W"})
      return;
    };
    try {
      const {data,}: AxiosResponse<APIResponse<AgGridResponseType<plantCapacityListTyp[]>>> = await baseURL.get(`${requestUrl.getPlantCapacity}?page=0&per_page=0`);
      if (data.code === "200") {
        setPlantCapacity(data.responseData.data.sort((a, b) => a.from - b.from).map((el) => ({label: `${el.from}kW-${el.to}kW`,value: el.leadcountid,rate: el.price_per_lead,})));
        dispatch(setModalHeaderFooter({title: "Subscribe Leads",btnTxt: "Pay",secondaryBtnTxt: "",}));
        setIsOpen((prev) => !prev);
      }
    } catch (err: any) {
      toast.error(err.response?.data.message ?? err.message);
      return {} as AgGridResponseType<any[]>;
    }
  };
  const getPrice = (newmodulecapacity: plantCapacityListTy, leadcount: number) => {
    if (formData.newmodulecapacity && formData.leadcount) {
      let rateVal =newmodulecapacity.rate /*getElementByIndex(filterKeyIncludeArr(plantCapacity, "label", newmodulecapacity),0,"rate");*/
      return rateVal * leadcount;
    } else {
      return 0;
    }
  };

  const handleChange = async (props: any, selectedOption?: any) => {
    let { name, value } = props?.target ?? props;
    if (selectedOption) {
      name = selectedOption.name;
      value = props;
    };
    if(error && error[name as keyof object]){
      delete error[name as keyof object]
      setError(error)
    }
    setFormData({ ...formData, [name]: value });
  };

  const getRemainingLeadCount = async (id: string) => {
    try {
      const {data,}: AxiosResponse<APIResponse<{ newOpportunity: number; subscribedLeads: number }>> = await baseURL.get(`${requestUrl.getSelfModeProjectCount}/${id}`);
      if (data.code === "200") {
        setCountLength(data.responseData);
      }
    } catch (err: any) {
      Toast({messageText:err.response?.data.message ?? err.message,messageType:"E"});
      return {} as AgGridResponseType<number>;
    }
  };
  const SubscribedLeadsForm = () => (<>
      <ReactSelect error={error?.newmodulecapacity} onChange={handleChange} value={formData.newmodulecapacity} isSearchable={true} id="newmodulecapacity" name="newmodulecapacity" labelname="Plant Capacity" options={plantCapacity} isUpload={false} isRequired={false}/>
      <Input error={error?.leadcount} id={"leadcount"} label={"Lead Count"} name={"leadcount"} value={formData.leadcount?.toString()} type={"number"} max={countLength.newOpportunity.toString()} maxLength={countLength.newOpportunity} onChange={handleChange}/>
      <Input error={error?.totalprice} disabled id={"totalprice"} label={"Total Price"} name={"totalprice"} value={formData.totalprice?.toString()} type={"number"} onChange={handleChange}/>
    </>
  );
  const handleClose = () =>{
    setIsOpen(false);
    setFormData(initialFormData);
    setError({} as formError)
  }
  return (
    <>
      {isOpen && <FormModal overflow={true} modalSize="lg" name="saveLead" btnTitle="Save Lead" headerTitle={"Register New Lead"} onSubmit={handleModalClick} children={SubscribedLeadsForm()} closeModal={handleClose}/>}
      {!countLength?.subscribedLeads && <div className='absolute z-10 w-full backdrop-blur-sm h-[80vh]'>
        <div className="flex flex-col justify-center items-center text-center h-full">
          <div className='text'>Total Leads - {countLength.newOpportunity && countLength.newOpportunity}</div>
          <Button className="btn btn-sm-primary" onClick={getPlantCapData} name="Subscribe Leads" />
        </div>
      </div>}
      {countLength?.subscribedLeads > 0 && <div className="flex text-center items-center pb-1 h-fit">
        <Button className="btn btn-sm-primary" onClick={getPlantCapData} name="Subscribe Leads" />
        <div className='text-center pl-[3vh] pt-0.6'>New Leads - <b>{countLength.newOpportunity && countLength.newOpportunity}</b> | Subscribed Leads - <b>{countLength.subscribedLeads && countLength.subscribedLeads}</b></div>
      </div>}
      <LeadProjectsTable leadsType='subscribedLeads' isGridUpdate={isGridUpdate} />
    </>
  );
};

export default SubscribedLeads;
 