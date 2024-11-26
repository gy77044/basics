import Graphic from "@arcgis/core/Graphic";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import { setInformationModal } from "../../../../../ReduxTool/Slice/Map/MapReducer";
import { setMapToolsTitle } from "../../../../../ReduxTool/Slice/MapTools/MapToolsReducer";
import { TObstructionType } from "../../../../../ReduxTool/Slice/Partner/EPC";
import {
  removeObstructionData,
  setObstructionData,
  setUpdateObstructionData,
} from "../../../../../ReduxTool/Slice/Partner/EPC/EpcReducer";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../ReduxTool/store/hooks";
import globalLayers from "../../../../../Utils/EPCMaps/Maps/GlobaLMap";
import {
  IconRSBAddRow,
  IconRSBDelete,
  IconRSBEdit,
  IconRSBSave,
} from "../../../../../assests/icons/MapToolsIcons";
import { obstructiontype } from "./_consts";

const toast_id = "toast_id" + Math.random() * 100;

const ObstructionDetails = () => {
  const [newRow, addNewRow] = useState<null | number>(null);
  const [enableEditRow, setEnableEditRow] = useState<boolean>(false);
  const [selectedRowIndex, setselectedRowIndex] = useState<null | {
    index: number;
    name: string;
  }>(null);

  const [formdata, setFromData] = useState({
    obstructionheight: "",
    obstructionoffset: "",
    obstructiontype: "" as TObstructionType,
  });

  const { newMapToolstitle } = useAppSelector((state) => state.mapToolsReducer);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFromData({ ...formdata, [name]: value });
  };

  const obstructions = useAppSelector(
    (state) => state.EPCDetails.roofAnalysis.obstructions
  );
  const dispatch = useAppDispatch();
  const handleDrawbyObsType = ({ value }: { value: TObstructionType }) => {
    if (value === "Existing Solar Modules") {
      globalLayers.sketchVM.create("polygon");
      globalLayers.lastactiveTool = 'existingsolarmodules';
    } else if (value === "Mobile Tower") {
    } else if (value === "Chimney") {
      globalLayers.sketchVM.create('polygon');
      globalLayers.lastactiveTool = 'Chimney';
    } else if (value === "Nearby Trees") {
    } else if (value === "Helipad") {
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = 'circle';
    } else if (value === "Pipelines") {
    } else if (value === "Turbo Vents") {
      globalLayers.sketchVM.create("circle");
      globalLayers.lastactiveTool = 'circle';
      
    } else if (value === "Others") {
    }
    dispatch(
      setInformationModal({
        state: true,
        title: "Drawing Mode",
        content: `Click points on the map to draw an area of interest. Press ESC to cancel the drawing mode.`,
      })
    );
    setFromData({ ...formdata, obstructiontype: value });
  };

  const handleSave = () => {
    if (globalLayers.sketchViewModel_Draw.activeTool !== null) {
      toast.info("Complete your draw first.", {
        toastId: toast_id,
      });
      return;
    }
    if (
      !formdata.obstructiontype ||
      !formdata.obstructionheight ||
      !formdata.obstructionoffset
    ) {
      toast.error("Both height & offset is Required", { toastId: toast_id });
      return;
    }
    // save and generate graphic on the basis of selection
    let found = null as Graphic | null;
    if (selectedRowIndex !== null && enableEditRow === true) {
      const selectedRowData = obstructions[selectedRowIndex.index];
      found = globalLayers.getGraphicbyUID(selectedRowData.uid);
    } else {
      found = globalLayers.getGraphicbyUID(globalLayers.lastdrawnGraphicUID);
    }
    if (!found) return;
    let cloned_infra = found.clone();

    cloned_infra.attributes = {
      ...cloned_infra.attributes,
      height: parseInt(formdata.obstructionheight),
      offset: parseInt(formdata.obstructionoffset),
      type: formdata.obstructiontype,
    };

    globalLayers.removeGraphicbyName(cloned_infra.getAttribute("name"));
    globalLayers.addSketchGraphic(cloned_infra);

    if (enableEditRow && selectedRowIndex !== null) {
      dispatch(
        setUpdateObstructionData({
          uid: (cloned_infra as any).uid,
          name: cloned_infra.getAttribute("name"),
          obstructionheight: formdata.obstructionheight,
          obstructionoffset: formdata.obstructionoffset,
        })
      );
    } else {
      dispatch(
        setObstructionData({
          ...formdata,
          obstructiontype: formdata.obstructiontype,
          uid: (cloned_infra as any).uid,
          totalarea: cloned_infra.getAttribute("totalarea"),
          name: cloned_infra.getAttribute("name"),
        })
      );
    }

    addNewRow(null);
    setEnableEditRow(false);
    setselectedRowIndex(null);
    setFromData({
      obstructionheight: "",
      obstructionoffset: "",
      obstructiontype: "",
    });
  };

  const removeInfraObject = () => {
    if (selectedRowIndex === null) return;
    const selectedRowData = obstructions[selectedRowIndex.index];
    if (globalLayers.removeGraphicbyName(selectedRowData.name)) {
      dispatch(removeObstructionData(selectedRowData.name));
    }
  };

  const handleEdit = () => {
    if (selectedRowIndex === null) return;
    setEnableEditRow(true);
    const obs = obstructions[selectedRowIndex.index];
    setFromData({
      obstructionheight: obs.obstructionheight,
      obstructionoffset: obs.obstructionoffset,
      obstructiontype: obs.obstructiontype,
    });
  };

  const hadleGraphicSelection = (id: number) => {
    const selectedRowData = obstructions[id];
    globalLayers.selectGraphicbyName(selectedRowData.name);
  };

  const moveNext = () => {
    if(newRow === null){
      dispatch(setMapToolsTitle("Module Mounting Structure"))
    }
    if(newRow){
      if(formdata.obstructiontype !== '' && (formdata.obstructionoffset === '' || formdata.obstructionheight === '')){
        toast.warn('Values are Required')
      }
      if(formdata.obstructiontype === '' && formdata.obstructionheight === '' && formdata.obstructionoffset === ''){
        dispatch(setMapToolsTitle("Module Mounting Structure"))
      }
    } 
  }

  return (
    <div className="w-full flex flex-col">
      <div className="table-main">
        <table className="table infraDesignTable">
          <thead className="thead">
            <tr>
              <th className="hvalue">Name</th>
              <th className="hvalue w-[25%]">
                Height <span className="lowercase ">(m)</span>
              </th>
              <th className="hvalue w-[25%]">
                Offset <span className="lowercase ">(m)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {obstructions.length > 0 &&
              obstructions.map((item, i) => (
                <tr
                  key={i}
                  className={
                    selectedRowIndex?.index === i ? "bg-primary-700" : "trow"
                  }
                  onClick={() => {
                    setselectedRowIndex({ name: "", index: i });
                    hadleGraphicSelection(i);
                    if (selectedRowIndex !== null) return;
                    // const obs = obstructions[i];
                    // // if(typeof(selectedRowIndex) === 'object') return;

                    // setFromData({
                    //   obstructionheight: obs.obstructionheight,
                    //   obstructionoffset: obs.obstructionoffset,
                    //   obstructiontype: obs.obstructiontype,
                    // });
                  }}
                >
                  <td className="rheading">{item.obstructiontype}</td>
                  <td className="rvalue">
                    {selectedRowIndex?.index !== i || !enableEditRow ? (
                      `${item.obstructionheight} m`
                    ) : (
                      <input
                        type="number"
                        name="infraheight"
                        value={formdata.obstructionheight}
                        onChange={(e) =>
                          setFromData({
                            ...formdata,
                            obstructionheight: e.target.value,
                          })
                        }
                        className="text-primary-400 outline-none focus:outline font-normal"
                      />
                    )}
                  </td>
                  <td className="rvalue">
                    {selectedRowIndex?.index !== i || !enableEditRow ? (
                      `${item.obstructionoffset} m`
                    ) : (
                      <input
                        type="number"
                        name="infraoffset"
                        value={formdata.obstructionoffset}
                        onChange={(e) =>
                          setFromData({
                            ...formdata,
                            obstructionoffset: e.target.value,
                          })
                        }
                        className="text-primary-400 outline-none focus:outline font-normal"
                      />
                    )}
                  </td>
                </tr>
              ))}
            {newRow === null && obstructions.length === 0 && (
              <tr>
                <td className="rvalue text-center" colSpan={3}>
                  No Data Available
                </td>
              </tr>
            )}
            {newRow !== null && (
              <tr>
                <td className="rvalue">
                  <select
                    disabled={false}
                    name="infratype"
                    className="orientation-select w-[160px] focus:outline-none text-primary-400"
                    value={formdata.obstructiontype}
                    onChange={(e) =>
                      handleDrawbyObsType({
                        value: e.target.value as TObstructionType,
                      })
                    }
                  >
                    <option value="select" className="w-[160px]">
                      Select an option ..
                    </option>
                    {obstructiontype.map((each) => {
                      return (
                        <option value={each} key={each} className="w-[160px]">
                          {each}
                        </option>
                      );
                    })}
                  </select>
                </td>
                <td className="rheading">
                  <input
                    disabled={false}
                    type="number"
                    placeholder="Height (m)"
                    value={formdata.obstructionheight}
                    name="obstructionheight"
                    onChange={handleChange}
                    className="text-primary-400 outline-none focus:outline font-normal"
                  />
                </td>
                <td className="rheading">
                  <input
                    type="number"
                    disabled={false}
                    value={formdata.obstructionoffset}
                    placeholder="Offset (m)"
                    name="obstructionoffset"
                    onChange={handleChange}
                    className="text-primary-400 outline-none focus:outline font-normal"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="table-footer">
          <div className="flex justify-end items-center ">
            <div className="p-0.4" onClick={() => addNewRow(1)}>
              <IconRSBAddRow
                newMapToolstitle={newMapToolstitle === "Obstruction Details"}
              />
            </div>
            <div className="p-0.4" onClick={handleEdit}>
              <IconRSBEdit />
            </div>
            <div className="p-0.4" onClick={handleSave}>
              <IconRSBSave />
            </div>
            <div className="p-0.4" onClick={removeInfraObject}>
              <IconRSBDelete />
            </div>
          </div>
          </div>
          <div className="h4"></div>
          <button
            className="dark-lg-btn"
            onClick={() =>
              moveNext()
            }
          >
            Save
          </button>
        </div>
      </div>
    
  );
};

export default ObstructionDetails;
