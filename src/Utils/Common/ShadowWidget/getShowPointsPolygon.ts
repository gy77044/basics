import { Polygon } from "esri/geometry";
import { addHeatmapToBuilding, create3DHeatmap } from "../../../lib/EPC/HeatMap/addHeatmapOnBuilding";
import { buildingBase } from "../../../lib/EPC/SwitchingMapLayers/SwitchMap";
import globalLayers from "../../EPCMaps/Maps/GlobaLMap";

export const getShadowPointPolygon = async () => {

    globalLayers.removeShadowIrradianceMap()
    const build = globalLayers.getGraphicbyItsName(buildingBase)
    if(!build) return;


    if(document.getElementById("loading")){
        document.getElementById("loading")!.className = "loading active";
    }
    await addHeatmapToBuilding(build, build.getAttribute('height') ?? 10)
    if(document.getElementById("loading")){
        document.getElementById("loading")!.className = "loading";
    }
    // await create3DHeatmap(globalLayers.view!, build.geometry as Polygon, build.getAttribute('height') ?? 10)
}