import { ChangeEvent, useState } from "react";
import { toggleHeigthModal } from "../../ReduxTool/Slice/Map/MapReducer";
import { useAppDispatch, useAppSelector } from "../../ReduxTool/store/hooks";
import { Azimuth, ElevatedSideHeight, elevationIndex } from "../../Utils/Const";
import globalLayers from "../../Utils/EPCMaps/Maps/GlobaLMap";
import NewInput from "../New/Input/NewInput";
import {
  setTitle,
  toggleDrawer,
} from "../../ReduxTool/Slice/Drawer/DrawerReducer";

const directions = [
  "North",
  "North-East",
  "East",
  "South-East",
  "South",
  "South-West",
  "West",
  "North-West",
];

const MapInfoModal = () => {
  const [height, setHeight] = useState("0");
  const [width, setWidth] = useState("0");
  const { showAddHeightModal } = useAppSelector((state) => state.mapref);
  const [direction, setDirection] = useState(directions[7]);
  const [azimuth, setAzimuth] = useState("0");
  const [azimuth1, setAzimuth1] = useState("");
  const [azimuth2, setAzimuth2] = useState("");

  // store dispatch or selector
  const dispatch = useAppDispatch();

  const handleSave = () => {
    let id = globalLayers.lastdrawnGraphicUID;
    if (id >= 0) {
      globalLayers.sketchLayers?.graphics.forEach((graphic) => {
        if (((graphic as any).uid as number) === id) {
          if (showAddHeightModal === "roof") {
            graphic.setAttribute(elevationIndex, [
              parseInt(azimuth1),
              parseInt(azimuth2),
            ]);
            graphic.setAttribute(Azimuth, parseFloat(azimuth));
            graphic.setAttribute(ElevatedSideHeight, parseFloat(azimuth));
          } else if (showAddHeightModal === "line") {
            graphic.setAttribute("width", parseFloat(width));
            graphic.setAttribute("height", parseFloat(height));
          } else {
            graphic.setAttribute("height", parseFloat(height));
          }
        }
      });
      dispatch(toggleHeigthModal(""));
      globalLayers.sketchViewModel_Draw.complete();
      dispatch(toggleDrawer(true));
      dispatch(setTitle("projectsetup"));
    }
  };

  return (
    <div
      id="mapinfomodal"
      className="flex flex-col w-[200px] h-auto rounded-default gap-2 py-1 absolute right-[50px] bottom-[2vh] bg-white"
    >
      <div className="h2"></div>
      <div className="row px-2 gap-3">
        {(showAddHeightModal === "building" ||
          showAddHeightModal === "line") && (
          <>
            <div className={`input-main`}>
              <div>
                <input
                  id={"height"}
                  placeholder={"height"}
                  className={`input-box`}
                  onChange={(e) => setHeight(e.target.value)}
                  type="text"
                />
              </div>
            </div>
          </>
        )}
        {showAddHeightModal === "line" && (
          <div className={`input-main`}>
            <div>
              <input
                id={"width"}
                placeholder={"width"}
                className={`input-box`}
                onChange={(e) => setWidth(e.target.value)}
                type="text"
              />
            </div>
          </div>
        )}
        {showAddHeightModal === "roof" && (
          <div className="flex-col">
            <div className="row">
              <NewInput
                id="azimuth1"
                placeholder="Define Elevation Point 1"
                // labelname="Define Elevation Point 1"
                name="azimuth1"
                value={azimuth1}
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAzimuth1(e.target.value)
                }
              />
            </div>
            <div className="flex flex-row">
              <NewInput
                id="azimuth2"
                placeholder="Define Elevation Point 1"
                // labelname="Define Elevation Point 2"
                name="azimuth2"
                value={azimuth2}
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAzimuth2(e.target.value)
                }
              />
            </div>
            <div className="flex flex-row">
              <NewInput
                id="azimuth"
                placeholder="Define Elevation Height (m)"
                // labelname="Elevation Height (m)"
                name="heigth"
                value={azimuth}
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAzimuth(e.target.value)
                }
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center row-auto justify-center">
        <button
          type="button"
          className="darkthin-sm-btn w-[80px]"
          onClick={() => handleSave()}
        >
          save
        </button>
      </div>
    </div>
  );
};

export default MapInfoModal;
