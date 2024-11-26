import React, { memo, useState } from "react";
import { toast } from "react-toastify";
import { EditableTable, InputCheckbox, InputRadio2 } from "../../../../../Components/AllInput/AllInput";
import { ProjectTy } from "../../../../../ReduxTool/Slice/Auth/types";
import { fireFightingData, lifeLineData, miscellaneousdetailsTy, miscellaneousFieldType, miscellaneoustype, moduleCleaning, monitoringData, needRPRProtection as needRPRData, setMiscellaneousDesign, setRoofAnalysisDetails, walkwayData } from "../../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector } from "../../../../../ReduxTool/store/hooks";
const RadioButtonOptions = [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }];
const generationModelOption = [{ label: "pvNXT", value: "pvNXT" }, { label: "SAM", value: "SAM" }];

const MiscellaneousDesign = () => {
  const dispatch = useAppDispatch();
  const { formDetails, selectedProject } = useAppSelector((state) => state.EPCDetails.roofAnalysis);
  const { title } = useAppSelector((state) => state.drawer);
  const selectedprojectDetails = selectedProject as ProjectTy;
  const { is3DMap } = useAppSelector(state => state.mapref)
  const [toggleList, setToggleList] = useState({ needFirefightingSys: false, needLifeline: false, needWalkWay: false, needModuleCleaning: false, needMonitoringSys: false, needRPRProtection: false })
  const handleRadioEle = (event: any, name: miscellaneousFieldType) => {
    const { value } = event
    let details = [] as miscellaneousdetailsTy[]
    const { miscellaneousdesign: { haveDG, needPVAndDGSynch, needRPRProtection: currentNeedRFP } } = formDetails;
    if (value === "No") {
      if (name === "haveDG" || name === "needPVAndDGSynch" || name === "needRPRProtection") {
        // if(haveDG.value !=="Yes" && needPVAndDGSynch.value !=="Yes" && currentNeedRFP.value !=="Yes"){
        //   details = needRPRProtection
        // }
        // if((name==="needRPRProtection" && haveDG.value!=="Yes" && needPVAndDGSynch.value !=="Yes") || (name==="needPVAndDGSynch" && haveDG.value!=="Yes" && currentNeedRFP.value !=="Yes")|| (name==="haveDG" && currentNeedRFP.value!=="Yes" && needPVAndDGSynch.value !=="Yes")){
        // }
        details = needRPRData
      } else if (name === "needFirefightingSys") {
        details = fireFightingData
      } else if (name === "needLifeline") {
        details = lifeLineData
      } else if (name === "needWalkWay") {
        details = walkwayData
      } else if (name === "needModuleCleaning") {
        details = moduleCleaning
      } else if (name === "needMonitoringSys") {
        details = monitoringData
      }
      dispatch(setMiscellaneousDesign({ ...formDetails.miscellaneousdesign, [name]: { ...formDetails.miscellaneousdesign[name], ['value']: value, ['details']: details } }))
    } else {
      dispatch(setMiscellaneousDesign({ ...formDetails.miscellaneousdesign, [name]: { ...formDetails.miscellaneousdesign[name], ['value']: value } }))
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name, checked } = e.target
    dispatch(setRoofAnalysisDetails({ ...formDetails, miscellaneousdesign: { ...formDetails.miscellaneousdesign, generationModelType: { ...formDetails.miscellaneousdesign.generationModelType, [name]: checked } } }))

  }
  const handleOnChange = (e: any, tablename: miscellaneousFieldType, index: number) => {
    const { textContent } = e.target
    // console.log(typeof parseInt(textContent))

    if (!isNaN(textContent)) {
      const item: miscellaneousdetailsTy[] = formDetails.miscellaneousdesign[tablename]["details" as keyof object]
      const updatedItem = { ...item[index], Quantity: textContent }
      let details = [] as miscellaneousdetailsTy[];
      item.forEach((el, ind) => {
        if (ind == index) {
          details.push(updatedItem)
        } else {
          details.push(el)
        }
      });
      dispatch(setMiscellaneousDesign({ ...formDetails.miscellaneousdesign, [tablename]: { ...formDetails.miscellaneousdesign[tablename], ['details']: details } }))
    }
    else {
      e.preventDefault()
      return toast.warning("Quantity should be number", { toastId: "tableeror" })
    }
  }


  const handleEditTable = (fieldname: miscellaneousFieldType) => {
    setToggleList(prev => ({ ...prev, [fieldname]: !prev[fieldname as keyof object] }))
  }


  const FireFightingTable = (tableData: miscellaneousdetailsTy[], fieldname: miscellaneousFieldType, tablename: string) => {
    const header = ["Particular", "Quantity", "UOM"]
    return <>
      {tableData.length > 0 ?
        <>
          <div key={tablename}>
            <EditableTable tableCaption={tablename} isEditAble={!selectedprojectDetails.isepccomplete} editColName="Quantity" handleEditClick={() => handleEditTable(fieldname)} header={header} data={tableData} handleChange={(e: any, i: number) => handleOnChange(e, fieldname, i)} toggleContentEditable={toggleList[fieldname as keyof object]} />
          </div>

          {/*  <div className="body-main space-y-[2vh]">
        <div className="table-main">
          <div className="table-name">{tablename}</div>
          <table className="table">
            <thead className="thead">
              <tr>
                <th className="hvalue title">Particulars</th>
                <th className="hvalue">Quantity</th>
                <th className="hvalue units">UOM</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((each, idx) => (
                <tr className="trow">
                  <td className="rvalue">{each.Particular}</td>
                  <td contentEditable={toggleList[fieldname as keyof object]} onBlur={(e) => handleOnChange(e, fieldname, idx)} className="rvalue">{each.Quantity}</td>
                  <td className="rvalue">{each.UOM}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!selectedprojectDetails.isepccomplete && <div className="table-footer">
          <div className="flex justify-end items-center ">
            <button title="edit" disabled={toggleList[fieldname as keyof object]} onClick={()=>handleEditTable(fieldname)}  className={`px-0.4 cursor-pointer`}>
              <IconRSBEdit  color={toggleList[ fieldname as keyof object]===false ? '#1C1B1F' : '#ddd' } />
            </button>
            <button title="save" disabled={toggleList[fieldname as keyof object]===false} onClick={()=>handleEditTable(fieldname)} className="px-0.4 cursor-pointer" >
              <IconRSBSave  color={toggleList[ fieldname as keyof object] ? '#1C1B1F' : '#ddd' } />
            </button>
          </div>
        </div>}
        </div>
      </div>*/}
        </>
        : null}
    </>
  }

  // const SelectedMiscelleniousDesign=()=>{
  //   let result = [] as any
  //   Object.keys(formDetails.miscellaneousdesign).forEach((el: any, ind: number) => {
  //     if (el !== "generationModelType") {
  //       let fields = (formDetails.miscellaneousdesign[el as miscellaneousFieldType] as miscellaneoustype)
  //       console.log(fields,'fields',el);

  //       result.push(
  //         <>
  //           <div className="input-block-size">
  //             <label htmlFor="haveDG" className="separate-label-text">
  //               {fields.label}
  //               <span className="text-red-200">*</span>
  //             </label>
  //             <div className="h1"></div>
  //             <div className="row-space-btw">
  //               <div className="w-full flex items-center gap-5">
  //                 {RadioButtonOptions.map((each, index) => (
  //                   <NewRadioButton disabled={selectedprojectDetails.isepccomplete || is3DMap} key={each.value} name={el} labelname={each.label} value={each.value} onClick={(e) => { handleRadioEle(e, el) }} selectedOption={fields.value} />
  //                 ))}
  //               </div>
  //             </div>
  //           </div>
  //           {(fields.value == "Yes" && fields.details.length > 0 && (el !== "haveDG" && el !== "needPVAndDGSynch")) ? FireFightingTable(fields.details, el, fields.tablename) :
  //             ((selectedprojectDetails.havedg|| selectedprojectDetails.needpvanddgsynch) && el == "needRPRProtection") ? FireFightingTable(formDetails.miscellaneousdesign['needRPRProtection'].details, "needRPRProtection", fields.tablename) : <></>}
  //         </>
  //       )
  //     }
  //   });
  //   return result
  // }


  const bindMiscelleniousDesign = (contains:any) => {
    let result = [] as any;
    const filteredArray = Object.keys(formDetails.miscellaneousdesign).filter((_, index) => contains.includes(index));
    try {
      filteredArray.forEach((el: any, ind: number) => {
        if (el !== "generationModelType") {
          let fields = (formDetails.miscellaneousdesign[el as miscellaneousFieldType] as miscellaneoustype);
          let labelField: JSX.Element = <><div className="input-block-size">
            <label htmlFor={el} className="separate-label-text">
              {fields.label}
           {filteredArray.length>3&&<span className="text-red-500">*</span>}
            </label>
            <div className="h1"></div>
            <div className="row-space-btw">
              <div className="w-full flex items-center gap-5">
                <InputRadio2 id={el} key={fields.tablename} name={fields.tablename} options={RadioButtonOptions} onChange={(e) => { handleRadioEle(e, el) }} disabled={selectedprojectDetails.isepccomplete || is3DMap} value={fields.value} />
              </div>
            </div>
          </div>
            {(fields.value == "Yes" && fields.details.length > 0 && (el !== "haveDG" && el !== "needPVAndDGSynch")) ? FireFightingTable(fields.details, el, fields.tablename) :
              ((formDetails.miscellaneousdesign['haveDG'].value == "Yes" || formDetails.miscellaneousdesign['needPVAndDGSynch'].value == "Yes") && el == "needRPRProtection") ? FireFightingTable(formDetails.miscellaneousdesign['needRPRProtection'].details, "needRPRProtection", fields.tablename) : <></>}
          </>
          if (el !== "haveDG" && el!=="needPVAndDGSynch" && el!=="needRPRProtection") {
            result.push(<>
              <div className='main-section1'>
                {labelField}
              </div>
            </>)
          } else {
            result.push(labelField)
          }

        }
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message)
    }

    return result
  };
  return (
    <>
      <div className="lsb-body pt-2 space-y-3">
        <div className='miscelleous-design'>
        <div className='main-section1'>
          <div className="para-md">DG-PV Synchronization Equipment<span className="text-red-500">*</span></div>
          <div className="flex flex-col pl-1">
            {bindMiscelleniousDesign([0,1,2])}
          </div>
        </div>
          <div className="flex flex-col">
            {bindMiscelleniousDesign([3,4,5,6,7,8,9])}
          </div>
        <div className="main-section1 flex items-center space-x-2 p-2">
          {generationModelOption.map((each, index) => (
            <InputCheckbox key={index} disabled={selectedprojectDetails.isepccomplete || is3DMap} isChecked={formDetails.miscellaneousdesign.generationModelType[each.label as keyof object]} name={each.value} onChange={handleCheckbox} labelname={each.label} id={each.label} />
          ))}
        </div>
        </div>

      </div>

      {/* <div className="body-main">
        <div>DG-PV Synchronization Equipment</div>
        <div className="h1"></div>
        {bindMiscelleniousDesign()} */}
      {/* {selectedProject?SelectedMiscelleniousDesign():bindMiscelleniousDesign()} */}
      {/* <div className="input-block-size">
          <label htmlFor="generationModelType" className="separate-label-text">
            Select the generation model type
            <span className="text-red-200 ml-[5px]">*</span>
          </label>
        </div>
      </div> */}
    </>
  );
};

export default memo(MiscellaneousDesign);
