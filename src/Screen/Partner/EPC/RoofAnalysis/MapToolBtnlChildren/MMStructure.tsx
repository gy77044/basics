import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import { Polygon } from "esri/geometry";
import NewInput from "../../../../../Components/New/Input/NewInput";
import NewRadioButton from "../../../../../Components/New/RadioButton/NewRadioButton";
import { setRowSpacing, setRowSpacingHoriValue, setRowSpacingVerticalValue } from "../../../../../ReduxTool/Slice/Partner/EPC";
import { useAppDispatch, useAppSelector } from "../../../../../ReduxTool/store/hooks";
import { pvHandleRoofTop_updated } from "../../../../../Utils/EPCMaps/GenerateRoof/GenrateRoof";
import { getGeometryAfterObsctructionCutoff } from "../../../../../Utils/EPCMaps/GetGeometry/getGeometryAfterObsctructionCutoff";
import globalLayers from "../../../../../Utils/EPCMaps/Maps/GlobaLMap";
import ModuleAndMSSMain from "../PlantInfrastructureDesign/ModuleAndMSSMain";
import { formatMSSDataObject } from "./formatMMSObject";

const MMStructureOptions = [
  { label: "Automatic", value: "Automatic" },
  { label: "Manual", value: "Manual" },
];

const MMStructure = () => {
  const plantinfrastructuredesigning = useAppSelector((state) =>  state.EPCDetails.roofAnalysis.formDetails.plantinfrastructuredesigning);
  const { tiltAngle, azumuthAngle, rowspacing, rowSpacingHorizontal, rowSpacingVertical }= plantinfrastructuredesigning;
  const dispatch = useAppDispatch();

  const handleRoofGen = async () => {
    if (globalLayers.sketchViewModel_Draw.activeTool) {
      globalLayers.sketchViewModel_Draw.cancel();
    }
    const graphic = await getGeometryAfterObsctructionCutoff(globalLayers);
    if (!graphic) return;
    const removedObstructionArea = geometryEngine.geodesicArea(
      graphic.geometry as Polygon,
      "square-meters"
    );
    globalLayers.map?.allLayers.forEach((lyer) => {
      if (lyer.title && lyer.title.includes("Solar Panels")) {
        globalLayers.map?.allLayers.remove(lyer);
      }
    });
    globalLayers.solarpanelLayer?.graphics.forEach((ele) => {
      globalLayers.solarpanelLayer?.graphics.remove(ele);
    });
    globalLayers.multipleSolarPanelLayers.map((layer) => {
      layer.graphics.removeAll();
      layer.graphics.forEach((ele) => {
        layer.graphics.remove(ele);
      });
    });
    if (globalLayers.solarpanelLayer?.graphics.length) {
      globalLayers.solarpanelLayer?.graphics.removeAll();
    }

    globalLayers.panlesAngles = {
      tiltAngle:
        typeof tiltAngle === "string" ? parseInt(tiltAngle) : tiltAngle,
      azimuthAngle:
        typeof azumuthAngle?.label === "string"
          ? parseInt(azumuthAngle.label)
          : azumuthAngle?.label!,
    };
    
    const data = formatMSSDataObject(plantinfrastructuredesigning);

    if(globalLayers.solarpanelLayer){
      globalLayers.map?.layers.remove(globalLayers.solarpanelLayer)
    }

    setTimeout(() => {
      pvHandleRoofTop_updated(graphic.geometry,graphic.getAttribute("elevation") ?? 0, "panels_" + Math.random() * 10, data);
    }, 500);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="max-h-[91vh] custom-scrollbar-css">
      <div className="h1"></div>
      <ModuleAndMSSMain roofNum={0}/>
      <div className="">
        <label htmlFor="MMS" className="separate-label-text">
          Type of Row Spacing<span className="text-red-200">*</span>
        </label>
        <div className="h1"></div>
        <ModuleAndMSSMain roofNum={0} />
        <div className="">
          <label htmlFor="MMS" className="separate-label-text">
            Type of Row Spacing<span className="text-red-200">*</span>
          </label>
          <div className="h1"></div>
          <div className="row-space-btw">
            <div className="w-full flex items-center gap-2">
              {MMStructureOptions.map((each, index) => (
                <NewRadioButton
                  key={each.value}
                  name={"MMS"}
                  labelname={each.label}
                  value={each.value}
                  selectedOption={rowspacing}
                  onClick={(e) => {
                    dispatch(setRowSpacing(e.target.value as any));
                    if (e.target.value === "Automatic") {
                      dispatch(setRowSpacingHoriValue("0"));
                      dispatch(setRowSpacingVerticalValue("0"));
                    }
                  }}
                />
              ))}
            </div>
          </div>
          <div className="">
            {rowspacing === "Manual" && (
              <div>
                <div className="h3"></div>
                <NewInput
                  labelname="Horizontal Row Spacing (m)"
                  name={"rowSpacingHorizontal"}
                  value={rowSpacingHorizontal}
                  type={"number"}
                  onChange={(e) =>
                    dispatch(setRowSpacingHoriValue(e.target.value))
                  }
                />
                <div className="h3"></div>
                <NewInput
                  labelname="Vertical Row Spacing (m)"
                  name={"rowSpacingVertical"}
                  value={rowSpacingVertical}
                  type={"number"}
                  onChange={(e) =>
                    dispatch(setRowSpacingVerticalValue(e.target.value))
                  }
                />
              </div>
            )}
          </div>
          <div className="h2"></div>
        </div>
      </div>
      <button className="dark-lg-btn" onClick={handleRoofGen}>
        Save
      </button>
    </div>
    </div>
  )
}

export default MMStructure;
