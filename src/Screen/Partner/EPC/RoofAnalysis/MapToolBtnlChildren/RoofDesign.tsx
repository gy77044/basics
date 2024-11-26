import React, { ChangeEvent, useEffect, useState } from "react";
import NewInput from "../../../../../Components/New/Input/NewInput";
import { IconInfo } from "../../../../../assests/icons/DrawerIcons";
import { useAppDispatch, useAppSelector } from "../../../../../ReduxTool/store/hooks";
import { setMapToolsTitle } from "../../../../../ReduxTool/Slice/MapTools/MapToolsReducer";
import globalLayers from "../../../../../Utils/EPCMaps/Maps/GlobaLMap";
import { toast } from "react-toastify";
import { setResetRoof, setRoofDesignData } from "../../../../../ReduxTool/Slice/Partner/EPC";
import { LocationMarker } from "../../../../../Utils/Const";
import { setInformationModal, setRightClick } from "../../../../../ReduxTool/Slice/Map/MapReducer";
const toastId = 'toastId_exp'
const RoofDesign = () => {
  const [ formdata, setFormData ] = useState({ buildingheight: '',  parapetheight: '', parapetoffset: ''})
  const { totalarea, useablearea, parapetoffset, parapetheight, buildingheight } = useAppSelector(state => state.EPCDetails.roofAnalysis.roofDesign)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formdata, [name]: value })
  };
  const dispatch = useAppDispatch()

  const handleSave = () => {
    if(globalLayers.sketchViewModel_Draw.activeTool !== null) {
      toast.info("Complete your draw first.", {
        toastId: toastId
      })
      return;
    } 

    
    const found = globalLayers.getGraphicbyUID(globalLayers.lastdrawnGraphicUID)
    if(found){
      let cloned_graphic = found.clone();
      cloned_graphic.attributes = {...cloned_graphic.attributes, height: parseInt(formdata.buildingheight) ,buildingheight: parseInt(formdata.buildingheight), parapetheight: parseInt(formdata.parapetheight), parapetoffset: parseInt(formdata.parapetoffset) }
      globalLayers.removeSketchGraphic(found);
      globalLayers.addSketchGraphic(cloned_graphic);
      dispatch(setRoofDesignData(formdata))
      dispatch(setMapToolsTitle('Infra Design'))
      
    } else {
      console.warn('No building grahic found.')
    }
  }

  const handleRoof = () => {
    globalLayers.removeGraphicbyName('building');
    globalLayers.removeLocationMarker();
    dispatch(setRightClick(""));
    dispatch(
      setInformationModal({
        state: true,
        title: "Drawing Mode",
        content: `Click points on the map to draw an area of interest. Press ESC to cancel the drawing mode.`,
      })
    );
    dispatch(setResetRoof())
    setTimeout(() => {
      if(globalLayers.sketchButton.polygonEPC){
        globalLayers.sketchButton.polygonEPC.click();
      }
    }, 100);
  }

  useEffect(() => {
    setFormData({parapetoffset: parapetoffset, parapetheight: parapetheight, buildingheight: buildingheight})
  }, [])

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="table-main">
          <table className="table">
            <thead className="thead">
              <tr>
                <th className="hvalue">Name</th>
                <th className="hvalue">Area</th>
              </tr>
            </thead>
            <tbody>
              <tr className="trow">
                <td className="rheading">Total Area</td>
                <td className="rvalue">{totalarea} sq. m</td>
              </tr>
              <tr className="trow">
                <td className="rheading">Usable Area</td>
                <td className="rvalue">{useablearea} sq. m</td>
              </tr>
            </tbody>
          </table>
          <div className="table-footer">
            <button onClick={handleRoof} className="light-sm-btn">Draw Roof</button>
          </div>
        </div>
        <div className="h4"></div>
        <div className="flex flex-col  justify-start items-center space-y-[3vh] ">
        <NewInput
            id={"buildingheight"}
            labelname={"Building Height (m)"}
            name={"buildingheight"}
            value={formdata.buildingheight}
            type={"text"}
            onChange={e => handleChange(e)}
            star={true}
            icon={<IconInfo />}
          />
          <NewInput
            id={"parapetheight"}
            labelname={"Parapet Height (m)"}
            name={"parapetheight"}
            value={formdata.parapetheight}
            type={"text"}
            onChange={handleChange}
            star={true}
            icon={<IconInfo />}
          />
          <NewInput
            id={"parapetoffset"}
            labelname={"Parapet Offset (m)"}
            name={"parapetoffset"}
            value={formdata.parapetoffset}
            type={"text"}
            onChange={handleChange}
            star={true}
            icon={<IconInfo />}
          />
          <button className="dark-lg-btn" onClick={handleSave}>Submit</button>
          </div>
      </div>
    </>
  );
};

export default RoofDesign;
