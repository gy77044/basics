import { plantinfrastructuredesigningTyp } from "../../../../../ReduxTool/Slice/Partner/EPC/type";
import { mmsDataT, ModuleOrientationType } from "../../../../../Utils/EPCMaps/GenerateRoof/GenrateRoof";

export const formatMSSDataObject = (plantinfrastructuredesigning: plantinfrastructuredesigningTyp): mmsDataT => {
    const { azumuthAngle, moduleOrientation, verticalSpaceBtwModules, horizontalSpaceBtwModules, rowSpacingVertical, rowSpacingHorizontal, modulespacing, rowspacing, tiltAngle, arrayColumns, arrayRows } = plantinfrastructuredesigning;
    let orientation = moduleOrientation?.label?.toLowerCase().includes("land")
        ? "Landscape"
        : ("Portrait" as ModuleOrientationType);
    return {
        moduleOrientation: orientation,
        tiltAngle,
        azimuthAngle: azumuthAngle?.label!,
        verticalSpacing: parseFloat(modulespacing),
        horizontalSpacing: parseFloat(modulespacing),
        rows: parseInt(arrayRows),
        columns: parseInt(arrayColumns),
        rowSpacingH: parseFloat(rowspacing),
        rowSpacingV: parseFloat(rowspacing),
    }
}