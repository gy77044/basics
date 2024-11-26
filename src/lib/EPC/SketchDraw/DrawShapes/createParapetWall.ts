import Polygon from '@arcgis/core/geometry/Polygon';
import Point from '@arcgis/core/geometry/Point';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import Graphic from '@arcgis/core/Graphic';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js';
import Geometry from '@arcgis/core/geometry/Geometry';
import { papapetSymbology, papapetSymbologyHeight } from '../SketchSymbols/sketchSymbols';
import globalLayers from '../../../../Utils/EPCMaps/Maps/GlobaLMap';
import { buildingBase } from '../../SwitchingMapLayers/SwitchMap';


// for defult wall width is 0.1524 in meters which is 6 Inches 

export const removeParapetwall = () => {
    globalLayers.sketchLayers.graphics.forEach(graphic => {
        if(graphic.attributes && (graphic.attributes?.name as string).includes('parapet_wall_') ){
            globalLayers.sketchLayers.graphics.remove(graphic)
        }
    })
}

export function createParapetWall(height: number) {
   // Assuming you have an existing buildingPolygon representing the building footprint
    const wall_grap =  globalLayers.getGraphicbyItsName(buildingBase);
    if(!wall_grap) return;

    const buildingPolygon = (globalLayers.getGraphicbyItsName(buildingBase) as Graphic).geometry as Polygon;

    if(!buildingPolygon) return;
    const buildingHeight = (globalLayers.getGraphicbyItsName(buildingBase) as Graphic).attributes.height ?? 0
    // Create an offset for the roof boundary (parapet wall outer boundary)
    const parapetOffset = geometryEngine.offset(buildingPolygon, 0.2, "meters", "round") as Polygon;

    // Create a new array to hold the wall polygons
    const parapetWalls = [];

    // Iterate through the roof boundary and create wall polygons
    const roofRings = buildingPolygon.rings[0]; // Assuming a single ring for the polygon
    const offsetRings = parapetOffset.rings[0]; // The offset roof boundary

    // Loop through each point on the roof boundary
    for (let i = 0; i < roofRings.length - 1; i++) {

        // Extract height (Z-coordinate) from roof rings and offset rings
        const heightAtPoint1 = roofRings[i][2] ?? 0;
        const heightAtPoint2 = roofRings[i + 1][2] ?? 0;


         // Roof points at actual heights
         const roofPoint1 = [roofRings[i][0], roofRings[i][1], heightAtPoint1 + buildingHeight];
         const roofPoint2 = [roofRings[i + 1][0], roofRings[i + 1][1], heightAtPoint2 + buildingHeight];

         // Offset points at same heights
        const offsetPoint1 = [offsetRings[i][0], offsetRings[i][1], heightAtPoint1 + buildingHeight];
        const offsetPoint2 = [offsetRings[i + 1][0], offsetRings[i + 1][1], heightAtPoint2 + buildingHeight];

         // Create a vertical polygon for each segment
         const wallPolygon = new Polygon({
            rings: [[roofPoint1, roofPoint2, offsetPoint2, offsetPoint1, roofPoint1]],
            spatialReference: buildingPolygon.spatialReference
        });

        // Get the roof and offset points
        // const roofPoint1 = [roofRings[i][0], roofRings[i][1], buildingHeight]; // Roof point 1 at 10 meters
        // const roofPoint2 = [roofRings[i + 1][0], roofRings[i + 1][1], buildingHeight]; // Roof point 2 at 10 meters

        // const offsetPoint1 = [offsetRings[i][0], offsetRings[i][1], buildingHeight]; // Offset point 1 at 10 meters
        // const offsetPoint2 = [offsetRings[i + 1][0], offsetRings[i + 1][1], buildingHeight]; // Offset point 2 at 10 meters
    
        // Create a vertical polygon for each segment
        // const wallPolygon = new Polygon({
        // rings: [
        //     [roofPoint1, roofPoint2, offsetPoint2, offsetPoint1, roofPoint1]
        // ],
        // spatialReference: buildingPolygon.spatialReference
        // });
    
        // Add the wall polygon to the parapetWalls array
        parapetWalls.push(wallPolygon);
    }

    // Create a graphic for each parapet wall
    parapetWalls.forEach(wallPolygon => {
        const wallGraphic = new Graphic({
            geometry: wallPolygon,
            symbol: papapetSymbologyHeight(height),
            attributes: {
                name: 'parapet_wall_' + Math.random() * 100,
                title: 'parapet_wall_' + Math.random() * 100,
                height: height
            }
        });
        
        // Add the wall graphic to your graphics layer
        globalLayers.sketchLayers.add(wallGraphic);
    });


    if(globalLayers.sketchViewModel_Draw.activeTool){
        globalLayers.sketchViewModel_Draw.cancel()
    }

}