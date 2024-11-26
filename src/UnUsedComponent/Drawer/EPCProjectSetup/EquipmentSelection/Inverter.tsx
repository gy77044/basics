import { useState } from 'react';
import { setInverterOpen } from '../../../../ReduxTool/Slice/EquipmentSelection/SelectionReducer';
import { useAppDispatch, useAppSelector } from '../../../../ReduxTool/store/hooks';

const Inverter = () => {
  const dispatch = useAppDispatch()
  const showInverterBox = useAppSelector(state=>state.equipment.showInverterBox)
  const [invwordEntered, setInvWordEntered] = useState("Select an option");
  const [invwordEntered2, setInvWordEntered2] = useState("Select an option");
  const manufactureoptions = [" Ahead Renewable Energy ltd.",
    "Alternative Energiesysteme Holleis KG",
    "Anchor Electricals Pvt. Ltd.",
    "ANJI Technology Co. Ltd.",
    "SunPower",
    "LG Electronics Inc",
    "LeadSolar Energy Co - Ltd"];

  const nameoptions = ["SunPower: SPR-X22-370-E-AC [240V]",
    "Tigo Energy - Inc: TSI-7.6K-US [208V]",
    "Yotta Energy - Inc: DPI-208 [208V]",
    "Gamesa Electric: PV4300 [630V]",
    "ABB: PVI-3.0-OUTD-S-US-A [208V]",
    "FOXESS CO - LTD: AC1-11.4-US [240V]",

  ];

  // const data = ["Ahead Renewable Energy ltd.",
  //   "Alternative Energiesysteme Holleis KG",
  //   "Anchor Electricals Pvt. Ltd.",
  //   "ANJI Technology Co. Ltd.",
  //   "JinkoSolar Holding Co. Ltd.",
  //   "Soventix Canada Inc.",
  //   "Adani Solar",
  //   "Surya Solar"];


  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setInverterData({ ...inverterData, [name]: value })
  // }



  return (
    <>
      <div className="flex justify-center items-center text-brown-100 text-1.8xl font-semibold">
        <div className="drawer-heading">Inverter</div>
        {/* <IconInfo /> */}
      </div>
      <div className="h2"></div>
      <div className="w-full border-b-[0.1vh] border-primary-700/40" />
      <div className="h2"></div>
      {/* <DataInput labelname="Manufacturer" data={data}/> */}
      {/* <DataInput opt="inv" labelname="Manufacturer" data={manufactureoptions} wordEntered={invwordEntered} setWordEntered={setInvWordEntered} />
       */}{/* <CustomSelect labelname="Manufacturer" id={"manufacture"} options={manufactureoptions} value={inverterData.manufacture} onChange={handleChange} /> */}
      <div className="h2"></div>
      {/* <DataInput labelname="Name" data={data} /> */}
      {/* <DataInput opt="inv" labelname="Name" data={nameoptions} wordEntered={invwordEntered2} setWordEntered={setInvWordEntered2} />
       */}{/* <CustomSelect labelname="Name" id={"name"} options={nameoptions} value={inverterData.name} onChange={handleChange} /> */}
      <div className="h2"></div>
     <div className='flex justify-end'>
     <button className="light-sm-btn float-right mr-1" >Place Inv</button>
     <button className="light-sm-btn float-right" onClick={() => dispatch(setInverterOpen(!showInverterBox))} > {showInverterBox?"Close":"Show"}</button>
     </div>
      <div className="h6"></div>
    </>
  )
}

export default Inverter
