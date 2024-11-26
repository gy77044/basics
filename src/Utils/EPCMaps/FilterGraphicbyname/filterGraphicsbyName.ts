import Collection from "@arcgis/core/core/Collection.js";
import Graphic from "@arcgis/core/Graphic";
import { globalLayerType } from "../../Const";
const infratype = [
    "Walkway",
    "Lifeline",
    "Handrail",
    "Module Cleaning Pipe",
    "Water Storage Tank",
    "Lightning Arrestor",
  ];
export type GraphicCollection = Collection<Graphic>
type filteredGraphics = { polygonsBuildings: GraphicCollection, tanks: GraphicCollection, roofs: GraphicCollection, skylines: GraphicCollection, pipelines: GraphicCollection, rectangles: GraphicCollection, solarmodulePolygon: GraphicCollection, solarpanels: GraphicCollection, walkaways: GraphicCollection, lifeLine: GraphicCollection, handrail: GraphicCollection, lightningArrestor: GraphicCollection, helipad: GraphicCollection, waterstorage: GraphicCollection, existingsolarmodules: GraphicCollection, inverters:GraphicCollection, AC_Earthing_Pit: GraphicCollection,  DC_Earthing_Pit: GraphicCollection, Module_Cleaning_Pipe: GraphicCollection,Mobile_Tower: GraphicCollection,  Chimney: GraphicCollection, Nearby_Trees: GraphicCollection, turbo_vent: GraphicCollection, Skylights: GraphicCollection, Parapet_Wall: GraphicCollection, Mumty_Structure: GraphicCollection, HVAC_Equipment: GraphicCollection, Extended_Columns: GraphicCollection, Roof_Ridge: GraphicCollection }

export function getFilteredGraphics(globalLayers: globalLayerType, buildingBase: string): filteredGraphics | null {
    if (!globalLayers || !globalLayers.sketchLayers || !globalLayers.sketchLayers.graphics) {
        return null;
    }
    
    const filterGraphicsByName = (name: string) => globalLayers.sketchLayers.graphics.filter(
        ele => ele.attributes && ((ele.attributes.name || '') as string).toLowerCase().includes(name.toLowerCase())
    );

    const panels = (name: string) => globalLayers.solarpanelLayer?.graphics.filter(
        ele => ele.attributes && (ele.attributes.name || '').includes(name)
    )!;

    const polygonsBuildings = filterGraphicsByName(buildingBase);
    const tanks = filterGraphicsByName('circle'); // it include water tanks
    const roofs = filterGraphicsByName('roof__');
    // const roofs = [];
    const skylines = filterGraphicsByName('skyline');
    const pipelines = filterGraphicsByName('pipeline');
    const rectangles = filterGraphicsByName('rectangle');
    const solarmodulePolygon = filterGraphicsByName('solarmodule');
    let solarpanels = filterGraphicsByName('panles');
    if(!solarpanels.length){
        globalLayers.solarpanelLayer?.graphics.forEach(ele => {
            if(ele.attributes && ele.getAttribute('name') === 'panels'){
                solarpanels.push(ele)
            }
        })
        // console.log(solarpanels, 'inner')
    }
    // console.log(solarpanels)
    const walkaways = filterGraphicsByName('walkaway');
    const lifeLine = filterGraphicsByName('Lifeline');
    const handrail = filterGraphicsByName('Handrail');
    const lightningArrestor = filterGraphicsByName('lightningArrestor');
    const helipad = filterGraphicsByName('heli');
    const waterstorage = filterGraphicsByName('water');
    const existingsolarmodules = filterGraphicsByName('existing');
    let addedSolarPanles = filterGraphicsByName('existing_solar');
    // existingsolarmodules.addMany(addedSolarPanles)

    const inverters = filterGraphicsByName('Inverter');
    const AC_Earthing_Pit = filterGraphicsByName('AC_Earthing_Pit');
    const DC_Earthing_Pit = filterGraphicsByName('DC_Earthing_Pit');
    const Module_Cleaning_Pipe = filterGraphicsByName('Module_Cleaning_Pipe');
    const Mobile_Tower = filterGraphicsByName('Mobile Tower');
    const Chimney = filterGraphicsByName('Chimney');
    const Nearby_Trees = filterGraphicsByName('Nearby_Trees');
    const turbo_vent = filterGraphicsByName('turbo_vent');
    const Skylights = filterGraphicsByName('Skylights');
    const Roof_Ridge = filterGraphicsByName('Roof_Ridge');
    const Parapet_Wall = filterGraphicsByName('Parapet');
    const Mumty_Structure = filterGraphicsByName('Mumty');
    const HVAC_Equipment = filterGraphicsByName('HVAC');
    
    const Extended_Columns = filterGraphicsByName('Extended_Columns');

    return { polygonsBuildings, tanks, roofs, skylines, pipelines, rectangles, solarmodulePolygon, solarpanels, walkaways, lifeLine, handrail, lightningArrestor, helipad, waterstorage, existingsolarmodules, inverters,  AC_Earthing_Pit, DC_Earthing_Pit, Module_Cleaning_Pipe, Mobile_Tower, Chimney, Nearby_Trees, turbo_vent, Skylights, Roof_Ridge, Parapet_Wall, Mumty_Structure, HVAC_Equipment, Extended_Columns}
}