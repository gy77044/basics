import { ChangeEvent, useState } from "react";
import { Button } from "../../../../../../Components/AllButton/AllButtons.tsx";
import { useAppDispatch, useAppSelector } from "../../../../../../ReduxTool/store/hooks";
import { addNewRow } from "../../../../../../ReduxTool/Slice/Map/MapReducer";
import { ProjectTy } from "../../../../../../ReduxTool/Slice/Auth/types.js";


type formInfraType = {
  infraheight: string;
  infraoffset: string;
  infratype: string;
}

interface IKeepoutTable {
  handeleEdit: () => void;
  formdata: formInfraType;
  setFromData: React.Dispatch<React.SetStateAction<formInfraType>>;
  selectedRowIndex1: number[];
  setselectedRowIndex1: React.Dispatch<React.SetStateAction<number[]>>;
  enableEditRow: boolean;
  setEnableEditRow: React.Dispatch<React.SetStateAction<boolean>>;
  removeInfraObject: (justGraphic?: boolean) => void;
  setselectedRowIndex: React.Dispatch<
    React.SetStateAction<{
      index: number;
      name: string;
    } | null>
  >;
  handleGraphicSelection: (
    id: number,
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  selectedRowIndex: {
    index: number;
    name: string;
  } | null;
}


export const KeepoutDetailsTable: React.FC<IKeepoutTable> = ( { selectedRowIndex, handeleEdit, removeInfraObject, setselectedRowIndex, handleGraphicSelection } ) => {
  const infraDesignData = useAppSelector(
    (state) =>
      state.EPCDetails.roofAnalysis.roofDetails[0]?.keepoutsDetails ?? []
  );
  const { roofDetails, selectedProject } = useAppSelector(state => state.EPCDetails.roofAnalysis);
    const selectedprojectDetails = selectedProject as ProjectTy;
    const { is3DMap } = useAppSelector(state => state.mapref)
  const dispatch = useAppDispatch()

  return (
    <div className="overflow-x-auto mt-3">
      <table className="table-main1">
        <caption className="table-caption1">1.1 Roof keepout details</caption>
        <thead className="table-head1">
          <tr>
            <th className="table-headth1 sticky inset-y-0 start-0 p-2" style={{width:'15px',margin:'auto'}}>
              <label htmlFor="SelectAll" className="sr-only">
                Select All
              </label>
              <input
                type="checkbox"
                id="SelectAll"
                disabled={selectedprojectDetails.isepccomplete || is3DMap}
                className="size-4 rounded border-gray-300/60"
              />
            </th>
            <th className="table-headth1">Name</th>
            <th className="table-headth1">Height</th>
            <th className="table-headth1">Offset</th>
          </tr>
        </thead>
        <tbody className="table-body1">
          {infraDesignData.length > 0 ?
            infraDesignData.map((ele, i) => {
              return (
                <tr className="table-bodytr1">
                  <td className="table-bodytd1 sticky inset-y-0 start-0  p-2">
                    <label htmlFor="SelectAll" className="sr-only">
                      Select All
                    </label>
                    <input
                      type="checkbox"
                      id="SelectAll"
                      className="size-4 rounded border-gray-300/60"
                      disabled={selectedprojectDetails.isepccomplete || is3DMap}
                      onChange={(e) => {
                        setselectedRowIndex({ name: "", index: i });
                        handleGraphicSelection(i, e);
                        dispatch(addNewRow(null));
                        if (selectedRowIndex !== null) return;

                      }}
                    />
                  </td>
                  <td className="table-bodytd1">{ele.infraType}</td>
                  <td className="table-bodytd1">{ele.infraheight} m</td>
                  <td className="table-bodytd1">{ele.infraoffset} m</td>
                </tr>
              )
            }):<tr className="table-bodytr1"><td colSpan={4} className="table-bodytd1 text-center">No Rows to Show</td></tr>}
          {/* <tr className="table-bodytr1">
                        <td className="sticky inset-y-0 start-0 bg-white p-2">
                            <label htmlFor="SelectAll" className="sr-only">Select All</label>
                            <input type="checkbox" id="SelectAll" className="size-4 rounded border-gray-300/60" />
                        </td>
                        <td className="table-bodytd1">
                            Inverter Placement
                        </td>
                        <td className="table-bodytd1">
                            4 m
                        </td>
                        <td className="table-bodytd1">
                            5 m
                        </td>
                    </tr>
                    <tr className="table-bodytr1">
                        <td className="sticky inset-y-0 start-0 bg-white p-2">
                            <label htmlFor="SelectAll" className="sr-only">Select All</label>
                            <input type="checkbox" id="SelectAll" className="size-4 rounded border-gray-300/60" />
                        </td>
                        <td className="table-bodytd1">
                            Inverter Placement
                        </td>
                        <td className="table-bodytd1">
                            4 m
                        </td>
                        <td className="table-bodytd1">
                            5 m
                        </td>
                    </tr>
                    <tr className="table-bodytr1">
                        <td className="sticky inset-y-0 start-0 bg-white p-2">
                            <label htmlFor="SelectAll" className="sr-only">Select All</label>
                            <input type="checkbox" id="SelectAll" className="size-4 rounded border-gray-300/60" />
                        </td>
                        <td className="table-bodytd1">
                            Inverter Placement
                        </td>
                        <td className="table-bodytd1">
                            4 m
                        </td>
                        <td className="table-bodytd1">
                            5 m
                        </td>
                    </tr>
                    <tr className="table-bodytr1">
                        <td className="sticky inset-y-0 start-0 bg-white p-2">
                            <label htmlFor="SelectAll" className="sr-only">Select All</label>
                            <input type="checkbox" id="SelectAll" className="size-4 rounded border-gray-300/60" />
                        </td>
                        <td className="table-bodytd1">
                            Inverter Placement
                        </td>
                        <td className="table-bodytd1">
                            4 m
                        </td>
                        <td className="table-bodytd1">
                            5 m
                        </td>
                    </tr>
                    <tr className="table-bodytr1">
                        <td className="sticky inset-y-0 start-0 bg-white p-2">
                            <label htmlFor="SelectAll" className="sr-only">Select All</label>
                            <input type="checkbox" id="SelectAll" className="size-4 rounded border-gray-300/60" />
                        </td>
                        <td className="table-bodytd1">
                            Inverter Placement
                        </td>
                        <td className="table-bodytd1">
                            4 m
                        </td>
                        <td className="table-bodytd1">
                            5 m
                        </td>
                    </tr> */}
          {/* <tr className="table-bodytr1">
                        <td className="sticky inset-y-0 start-0 bg-white p-2">
                            <label htmlFor="SelectAll" className="sr-only">Select All</label>
                            <input type="checkbox" id="SelectAll" className="size-4 rounded border-gray-300/60" />
                        </td>
                        <td className="table-bodytd1">
                            Inverter Placement
                        </td>
                        <td className="table-bodytd1">
                            4 m
                        </td>
                        <td className="table-bodytd1">
                            5 m
                        </td>
                    </tr> */}
        </tbody>
      </table>
      <div className="flex flex-row justify-end items-center mt-1 gap-x-2">
        <Button className="btn-link" name="Edit" onClick={handeleEdit}  />
        <Button className="btn-link" name="Delete" onClick={() => removeInfraObject()} />
      </div>
    </div>
  );
};
