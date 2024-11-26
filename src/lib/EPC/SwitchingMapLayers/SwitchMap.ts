// Switches the view from 2D to 3D and vice versa
import Collection from "@arcgis/core/core/Collection";
import Geometry from "@arcgis/core/geometry/Geometry";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline.js";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { attributeElevation, attributeheight, defaultmoduleLength, ElevatedSideHeight, elevatedSideLength, elevationDirection, elevationIndex, rooftiltangle, TiltAngle, zIndex } from "../../../Utils/Const";
import { getFilteredGraphics, GraphicCollection } from "../../../Utils/EPCMaps/FilterGraphicbyname/filterGraphicsbyName";
import globalLayers from "../../../Utils/EPCMaps/Maps/GlobaLMap";
import { getGraphicGroupByLng } from "../../../Utils/EPCMaps/Maps/groupByLng";
import { convertIndicesToPoints, elevateGeometryRings, elevateRingsWithAngle } from "../../../Utils/EPCMaps/Tilthandler/tiltGeometrRings";
import { firstIntersectigGraphics } from "../GeometryOperations/isIntersecting";
import { buildingSymbology, buildingSymbologyHeight, InfraSymbology, InfraSymbologyHeight, obsctructionSymbology, obsctructionSymbologyHeight, pipelineSymbology, pipelineSymbologyWidth, roofSymbology, solarModuleSymbology, solarPanelsSymbology, treeSymbology, updatedSymbolWithHeight, updateElevationSymbology } from "../SketchDraw/SketchSymbols/sketchSymbols";


export const buildingBase = 'building'
var elevatedSideLengthglb = 0;
var elevatedSideLengthglb_x = 0;
var elevatedSideHeight = 0
var baseBuildingHeight = 0
var buildingElevation = [] as number[]


/**
 * The function `switchView` is an asynchronous function that takes in a parameter `activeView` which
 * can be either '2d' or '3d', and based on the value of `activeView`, it loads the appropriate modules
 * and switches between a 2D view and a 3D view.
 * @param {'2D' | '3D'} activeView - The `activeView` parameter is a string that can have two possible
 * values: "2d" or "3d". It determines which view to switch to - either a 2D view or a 3D view.
 */
export async function switchView(activeView: '2D' | '3D') {
    const collection = getFilteredGraphics(globalLayers, buildingBase);
    if (!collection) return;


    const { polygonsBuildings, roofs, skylines, rectangles, solarmodulePolygon, pipelines, tanks, solarpanels, walkaways, handrail, inverters, lightningArrestor, helipad, waterstorage, existingsolarmodules, AC_Earthing_Pit, DC_Earthing_Pit, Module_Cleaning_Pipe, Mobile_Tower, Chimney, Nearby_Trees, turbo_vent, Skylights, Roof_Ridge, Parapet_Wall, Mumty_Structure, HVAC_Equipment, Extended_Columns , lifeLine
     } = collection;
     globalLayers.shadowLayer?.graphics.removeAll();

    // let updatedPolygons = [] as Graphic[]
    if (activeView === '2D') {
        if(globalLayers.stopProjectSelection){
            globalLayers.enableGraphicEditing(false)
          } else {
            globalLayers.enableGraphicEditing(true)
          }
        // remove height and then switch to 2d buildings
        if (polygonsBuildings?.length) {
            polygonsBuildings.forEach(graphic => {
                if (graphic.attributes.height >= 0) {
                    // const updateGraphic = graphic.clone();
                    // updateGraphic.symbol = buildingSymbology;
                    // globalLayers.sketchLayers?.graphics.add(updateGraphic)
                    // globalLayers.sketchLayers?.graphics.remove(graphic)
                    (graphic.geometry as Polygon).rings = (graphic.geometry as Polygon).rings.map(points => {
                        return points.map(point => {
                            return [point[0], point[1], 0]
                        })
                    })
                    graphic.symbol = buildingSymbology;

                    // globalLayers.sketchLayers?.graphics.add(updateGraphic)
                    // globalLayers.sketchLayers?.graphics.remove(graphic)
                }
            })
        };
        
         // check work walkaways if any 
        if(walkaways?.length){
            updateNamedGraphicsbySymbol(walkaways, InfraSymbology, false)
        }

        if(inverters?.length){
            updateNamedGraphicsbySymbol(inverters, InfraSymbology, false)   
        }

        // new ////
        if(lifeLine?.length){
            updateNamedGraphicsbySymbol(lifeLine, obsctructionSymbology, false)
        }
        if(handrail?.length){
            updateNamedGraphicsbySymbol(handrail, obsctructionSymbology, false)
        }
        if(helipad?.length){
            updateNamedGraphicsbySymbol(helipad, obsctructionSymbology, false)
        }
        if(AC_Earthing_Pit?.length){
            updateNamedGraphicsbySymbol(AC_Earthing_Pit, obsctructionSymbology, false)
        }
        if(DC_Earthing_Pit?.length){
            updateNamedGraphicsbySymbol(DC_Earthing_Pit, obsctructionSymbology, false)
        }
        if(Module_Cleaning_Pipe?.length){
            updateNamedGraphicsbySymbol(Module_Cleaning_Pipe, obsctructionSymbology, false)
        }
        if(Mobile_Tower?.length){
            updateNamedGraphicsbySymbol(Mobile_Tower, obsctructionSymbology, false)
        }
        if(Chimney?.length){
            updateNamedGraphicsbySymbol(Chimney, obsctructionSymbology, false)
        }
        if(Nearby_Trees?.length){
            // updateNamedGraphicsbySymbol(Nearby_Trees, treeSymbol, false)
            updateNamedGraphicsbySymbol(Nearby_Trees, treeSymbology, false)
        }
        if(turbo_vent?.length){
            updateNamedGraphicsbySymbol(turbo_vent, obsctructionSymbology, false)
        }
        if(Skylights?.length){
            updateNamedGraphicsbySymbol(Skylights, obsctructionSymbology, false)
        }
        if(Roof_Ridge?.length){
            updateNamedGraphicsbySymbol(Roof_Ridge, obsctructionSymbology, false)
        }
        if(Mumty_Structure?.length){
            updateNamedGraphicsbySymbol(Mumty_Structure, obsctructionSymbology, false)
        }
        if(HVAC_Equipment?.length){
            updateNamedGraphicsbySymbol(HVAC_Equipment, obsctructionSymbology, false)
        }
        if(Extended_Columns?.length){
            updateNamedGraphicsbySymbol(Extended_Columns, obsctructionSymbology, false)
        }


        ///// end 

        if(existingsolarmodules?.length){
            updateNamedGraphicsbySymbol(existingsolarmodules, obsctructionSymbology, false)
        }

        if (skylines?.length) {
            skylines.forEach(updateGraphic => {
                let elevation = getbaseGeometryElevation(updateGraphic);
                //  const elevation = graphic.attributes.elevation;
                // let updateGraphic = graphic.clone();
                // Update the rings with the found elevation
                (updateGraphic.geometry as Polygon).rings = (updateGraphic.geometry as Polygon).rings.map(ring => {
                    return ring.map(point => {
                        return [point[0], point[1], elevation];
                    });
                });

                // Update the centroid elevation
                (updateGraphic.geometry as Polygon).centroid.z = elevation;
                updateGraphic.symbol = buildingSymbology;

                // globalLayers.sketchLayers?.graphics.remove(graphic)
                // globalLayers.sketchLayers?.graphics.add(updateGraphic)
            })
        }

        if (tanks?.length) {
            updateNamedGraphicsbySymbol(tanks, obsctructionSymbology, false)
        }

        if (waterstorage?.length) {
            updateNamedGraphicsbySymbol(waterstorage, InfraSymbology, false)
        }
        if (lightningArrestor?.length) {
            updateNamedGraphicsbySymbol(lightningArrestor, InfraSymbology, false)
        }
        // pipelines
        if (pipelines?.length) {
            updateNamedGraphicsbySymbol(pipelines, pipelineSymbology, false)
        }

        if (rectangles?.length) {
            rectangles.forEach(updateGraphic => {
                let elevation = getbaseGeometryElevation(updateGraphic);
                //  const elevation = graphic.attributes.elevation;
                // let updateGraphic = graphic.clone();
                // Update the rings with the found elevation
                (updateGraphic.geometry as Polygon).rings = (updateGraphic.geometry as Polygon).rings.map(ring => {
                    return ring.map(point => {
                        return [point[0], point[1], elevation];
                    });
                });
                // Update the centroid elevation
                (updateGraphic.geometry as Polygon).centroid.z = elevation;
                updateGraphic.symbol = obsctructionSymbology
                // globalLayers.sketchLayers?.graphics.remove(graphic)
                // globalLayers.sketchLayers?.graphics.add(updateGraphic)
            })
        }

        if (solarmodulePolygon?.length) {   }
        if (roofs.length > 0) {
            roofs.forEach(updateGraphic => {
                const intersecting = firstIntersectigGraphics(updateGraphic, polygonsBuildings)
                let elevation = intersecting ? intersecting.getAttribute(attributeElevation) : updateGraphic.getAttribute(attributeElevation);
                // Clone the graphic and update its geometry
                // let updateGraphic = graphic.clone();
                // Update the rings with the found elevation
                const polygon = updateGraphic.geometry as Polygon;
                polygon.rings = polygon.rings.map(ring => ring.map(point => [point[0], point[1], elevation]));
                // Update the centroid elevation if necessary
                (updateGraphic.geometry as Polygon).centroid.z = elevation;
                updateGraphic.symbol = roofSymbology;
                // Replace the old graphic with the updated one
                // globalLayers.sketchLayers?.graphics.remove(graphic);
                // globalLayers.sketchLayers?.graphics.add(updateGraphic);
            });
        }
        updateRoofModules(globalLayers.solarpanelLayer!, solarModuleSymbology, false, roofs, solarpanels)
        // enable editing on 3d raphic 
        if(globalLayers.sketchViewModel_Draw){
            globalLayers.sketchViewModel_Draw.updateOnGraphicClick = true;
        }


        if(globalLayers.parapetwall > 0){
            globalLayers.hideGrpahicByName('parapet')
            // removeParapetwall()
        }

        globalLayers.hideGrpahicByName('parapet')

    } else {

        

        // add height and then switch to 3d buildings
        if (polygonsBuildings?.length) {
            polygonsBuildings.forEach(graphic => {
                if (graphic.attributes.height >= 0) {
                    const elePoints = graphic.getAttribute(elevationIndex) as number[]
                    const angle = graphic.getAttribute(rooftiltangle) as number
                    if(elePoints && angle){
                        if(elePoints.length > 0 && elePoints[0] !== undefined){
                            const elevatedGeometry = elevateRingsWithAngle(graphic.geometry as Polygon, elePoints,angle);
                            (graphic.geometry as Polygon).rings = elevatedGeometry;
                            graphic.symbol = buildingSymbologyHeight(graphic.attributes.height)
                            buildingElevation = elePoints
                            baseBuildingHeight = graphic.attributes.height ? typeof(graphic.attributes.height) === 'string' ? parseInt(graphic.attributes.height) : graphic.attributes.height : 0
                            const data = convertIndicesToPoints(graphic.geometry as Polygon, elePoints, graphic.attributes.height as number);
                            if(data) {
                                const { distance, pointAltitude } = data;
                                elevatedSideLengthglb_x = distance;
                                elevatedSideHeight = pointAltitude;

                            }
                        } else {
                            graphic.symbol = buildingSymbologyHeight(graphic.attributes.height)
                            globalLayers.graphicUnion = graphic.geometry
                        }
                        
                    } else {
                        graphic.symbol = buildingSymbologyHeight(graphic.attributes.height)
                        globalLayers.graphicUnion = graphic.geometry
                    }
                }
            })
        }

        globalLayers.showParapetGrpahicByName('parapet');

        // check work walkaways if any 
        if(walkaways?.length){
            updateNamedGraphicsbySymbol(walkaways, InfraSymbologyHeight, true)
          
        }
        if(inverters?.length){
            updateNamedGraphicsbySymbol(inverters, InfraSymbologyHeight, true)
        }
        if(existingsolarmodules?.length){
            updateNamedGraphicsbySymbol(existingsolarmodules, obsctructionSymbologyHeight, true)
        }
        // check if the drawn geometry has any intesection graphic 
        if(skylines?.length) {
            updateElevationAndSymbol(skylines, updatedSymbolWithHeight)
        }
        // elevating the tank with the intersection geometry height and elevation
        if(tanks?.length) {
            updateNamedGraphicsbySymbol(tanks, obsctructionSymbologyHeight, true)
        }
        if(lightningArrestor?.length) {
            updateNamedGraphicsbySymbol(lightningArrestor, InfraSymbologyHeight, true)
        }
        if(waterstorage?.length) {
            updateNamedGraphicsbySymbol(waterstorage, InfraSymbologyHeight, true)
        }
        // pipelines
        if(pipelines?.length) {
            updateNamedGraphicsbySymbol(pipelines, pipelineSymbologyWidth, true)
        }
        // for all the rectangles drawn 
        if(rectangles?.length) {
            updateElevationAndSymbol(rectangles, obsctructionSymbologyHeight)
        }
        if(solarmodulePolygon?.length) {
            //updateElevationAndSymbol(solarmodulePolygon, obsctructionSymbologyHeight, false, true)
        }
        if(roofs.length > 0) {
            roofs.forEach(updateGraphic => {
                const intersecting = firstIntersectigGraphics(updateGraphic, polygonsBuildings)
                let ZIndexElevation = intersecting ? intersecting.getAttribute(attributeheight) + intersecting.getAttribute(attributeElevation) : updateGraphic.getAttribute(zIndex);
                let elevation = getElevationofIntesectedGeometry(updateGraphic, 'roof');
                // Clone the graphic and update its geometry 
                // let updateGraphic = graphic.clone();
                // Update the rings with the found elevation
                const polygon = updateGraphic.geometry as Polygon;
                polygon.rings = polygon.rings.map(ring => ring.map(point => [point[0], point[1], elevation + point[2]]));
                // Update the centroid elevation if necessary
                if (polygon?.centroid) {
                    polygon.centroid.z = elevation;
                }
                // modify rings woth the tilt 
                const Rings = elevateGeometryRings((updateGraphic as any).geometry, true ? updateGraphic.getAttribute(elevationIndex) : [], updateGraphic.getAttribute(ElevatedSideHeight), true, ZIndexElevation)
                if (!Rings) return;
                const { rings, distance, distance_x } = Rings;
                elevatedSideLengthglb = distance;
                elevatedSideLengthglb_x = distance_x;
                polygon.rings = rings;
                // Update the symbol
                updateGraphic.geometry = polygon;
                updateGraphic.symbol = updateElevationSymbology(0.5);
                updateGraphic.setAttribute(elevatedSideLength, distance)
                // Replace the old graphic with the updated one
                // globalLayers.sketchLayers?.graphics.remove(graphic);
                // globalLayers.sketchLayers?.graphics.add(updateGraphic);
            });
        } else {
        }
         // new ////
         if(lifeLine?.length){
            updateNamedGraphicsbySymbol(lifeLine, obsctructionSymbologyHeight, true)
        }
         if(handrail?.length){
            updateNamedGraphicsbySymbol(handrail, obsctructionSymbologyHeight, true)
        }
        if(helipad?.length){
            updateNamedGraphicsbySymbol(helipad, obsctructionSymbologyHeight, true)
        }
        if(AC_Earthing_Pit?.length){
            updateNamedGraphicsbySymbol(AC_Earthing_Pit, obsctructionSymbologyHeight, true)
        }
        if(DC_Earthing_Pit?.length){
            updateNamedGraphicsbySymbol(DC_Earthing_Pit, obsctructionSymbologyHeight, true)
        }
        if(Module_Cleaning_Pipe?.length){
            updateNamedGraphicsbySymbol(Module_Cleaning_Pipe, obsctructionSymbologyHeight, true)
        }
        if(Mobile_Tower?.length){
            updateNamedGraphicsbySymbol(Mobile_Tower, obsctructionSymbologyHeight, true)
        }
        if(Chimney?.length){
            updateNamedGraphicsbySymbol(Chimney, obsctructionSymbologyHeight, true)
        }
        if(Nearby_Trees?.length){
            // updateNamedGraphicsbySymbol(Nearby_Trees, treeSymbol, true)
            updateNamedGraphicsbySymbol(Nearby_Trees, treeSymbology, true)
        }
        if(turbo_vent?.length){
            updateNamedGraphicsbySymbol(turbo_vent, obsctructionSymbologyHeight, true)
        }
        if(Skylights?.length){
            updateNamedGraphicsbySymbol(Skylights, obsctructionSymbologyHeight, true)
        }
        if(Roof_Ridge?.length){
            updateNamedGraphicsbySymbol(Roof_Ridge, obsctructionSymbologyHeight, true)
        }

        

        if(Mumty_Structure?.length){
            updateNamedGraphicsbySymbol(Mumty_Structure, obsctructionSymbologyHeight, true)
        }
        if(HVAC_Equipment?.length){
            updateNamedGraphicsbySymbol(HVAC_Equipment, obsctructionSymbologyHeight, true)
        }
        if(Extended_Columns?.length){
            updateNamedGraphicsbySymbol(Extended_Columns, obsctructionSymbologyHeight, true)
        }
        // for roof panles aand add symbol woth height
        updateRoofModules(globalLayers.solarpanelLayer!, updateElevationSymbology, true, roofs, solarpanels)
        

        globalLayers.showParapetGrpahicByName('parapet');

        // disbale editing on skecth modal if 3d is enabled 
        if(globalLayers.sketchViewModel_Draw){
            globalLayers.sketchViewModel_Draw.updateOnGraphicClick = false;
        }

    }

    // console.log(globalLayers.sketchViewModel_Draw.activeTool, 'active')
}

const getElevationofIntesectedGeometry = (graphic: Graphic, isRoof?: string) => {
    let elevation = 0;
    globalLayers.sketchLayers?.graphics.forEach(ele => {
        if ((ele.getAttribute('name') as string).includes(buildingBase)) {
            if (geometryEngine.intersects(graphic.geometry, ele.geometry)) {
                if (isRoof) {
                    elevation = ele.getAttribute('height')
                } else {
                    elevation = ele.getAttribute('height') + ele.getAttribute('elevation');
                }
            }
        }
    });
    return elevation;
}

const getbaseGeometryElevation = (graphic: Graphic) => {
    let elevation = 0;
    globalLayers.sketchLayers?.graphics.forEach(item => {
        if ((item.getAttribute('name') as string).includes(buildingBase)) {
            if (geometryEngine.intersects(graphic.geometry, item.geometry)) {
                elevation = item.getAttribute('elevation')
            }
        }
    })
    return elevation;
}

const updateElevationAndSymbol = (graphics: Collection<Graphic>, symbolUpdater: any, isPolyline: boolean = false, isElevate: boolean = true) => {
    graphics.forEach(updateGraphic => {
        // Clone the graphic and update its geometry
        let elevation = isElevate ? updateGraphic.getAttribute("elevation") : 0.05;
        // Update the rings with the found elevation
        if (isPolyline) {
            const polygon = updateGraphic.geometry as Polyline;
            polygon.paths = polygon.paths.map(ring => ring.map(point => [point[0], point[1], elevation]));
        } else {
            const polygon = updateGraphic.geometry as Polygon;
            polygon.rings = polygon.rings.map(ring => ring.map(point => [point[0], point[1], elevation]));
            // Update the centroid elevation if necessary
            if (polygon?.centroid) {
                polygon.centroid.z = elevation;
            }
        }
        // Update the symbol
        if (isPolyline) {
            updateGraphic.symbol = symbolUpdater(updateGraphic.getAttribute('width'), updateGraphic.getAttribute('height'));
        } else {
            updateGraphic.symbol = symbolUpdater(updateGraphic.attributes.height);
        } 
        const union = geometryEngine.union([updateGraphic.geometry, globalLayers.graphicUnion!]);
        if(union){
            globalLayers.graphicUnion = union
        }
        // Replace the old graphic with the updated one
        // globalLayers.sketchLayers?.graphics.remove(graphic);
        // globalLayers.sketchLayers?.graphics.add(updateGraphic);
    });
};


// TODO: make the roof module tilt and shift to the defined azimuth angle 
function updateRoofModules(layer: GraphicsLayer, symbol: any, withHeight = false, roofs: GraphicCollection, solarPanles: GraphicCollection) {
    // if (globalLayers.multipleSolarPanelLayers.length === 0) return;
    let firstorDefaultRoof: Graphic;
    roofs.forEach(graphic => {
        firstorDefaultRoof = graphic;
    });
    if (withHeight === false) {
        processSolarPanels(solarPanles, solarPanelsSymbology)
    } else {
        processSolarPanelTiltedRoof(solarPanles, withHeight)
    }
}

function updateRoofGraphics(roofs: Graphic[], symbol: any, isHeight: boolean = false) {
    if (!roofs?.length) return;

    roofs.forEach(graphic => {
        let elevation = 0;
        globalLayers.sketchLayers?.graphics.forEach(ele => {
            if ((ele.getAttribute('name') as string).includes('polygon')) {
                if (geometryEngine.intersects(graphic.geometry, ele.geometry)) {
                    if (isHeight) {
                        elevation = ele.getAttribute('height') + ele.getAttribute('elevation');
                    } else {
                        elevation = ele.getAttribute('height');
                    }
                }
            }
        });

        const updateGraphic = graphic.clone();
        const polygon = updateGraphic.geometry as Polygon;
        polygon.rings = polygon.rings.map(ring => ring.map(point => [point[0], point[1], point[2] - elevation]));
        if (polygon.centroid) polygon.centroid.z = elevation;
        updateGraphic.symbol = isHeight ? symbol(updateGraphic.attributes.height) : symbol;
        globalLayers.sketchLayers?.graphics.remove(graphic);
        globalLayers.sketchLayers?.graphics.add(updateGraphic);
    });
}

function getElevationAtPoint(point: number[], tiltedPolygon: Polygon, elevatedSideHeight: number, tiltHeight = 0): number {
    // Assuming the polygon is tilted upwards by a height of 10 meters
    const tiltAngle = Math.atan(tiltHeight / (elevatedSideHeight || 1));

    const centerX = tiltedPolygon.extent.center.x;
    const centerY = tiltedPolygon.extent.center.y;

    // Calculate the distance from the center
    const dx = point[0] - centerX;
    const dy = point[1] - centerY;

    // Calculate the elevation based on the tilt angle
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
    const elevation = Math.sin(tiltAngle) * distanceFromCenter;

    return elevation;
}

function adjustPolygonVertices(polygon: Polygon, tiltedPolygon: Polygon, elevatedSideHeight: number): number[][][] {
    return polygon.rings.map(ring => {
        return ring.map(point => {
            const elevation = getElevationAtPoint(point, tiltedPolygon, elevatedSideHeight);
            return [point[0], point[1], elevation + point[2]];
        });
    });
}

function generateSmallerPolygons(mainPolygon: Polygon, numPolygons: number): Polygon[] {
    const smallerPolygons: Polygon[] = [];

    // Assuming the smaller polygons are generated in a grid pattern within the main polygon
    const boundingBox = mainPolygon.extent;
    const width = (boundingBox.xmax - boundingBox.xmin) / Math.sqrt(numPolygons);
    const height = (boundingBox.ymax - boundingBox.ymin) / Math.sqrt(numPolygons);

    for (let i = 0; i < Math.sqrt(numPolygons); i++) {
        for (let j = 0; j < Math.sqrt(numPolygons); j++) {
            const xmin = boundingBox.xmin + i * width;
            const ymin = boundingBox.ymin + j * height;
            const xmax = xmin + width;
            const ymax = ymin + height;

            const rings = [[
                [xmin, ymin, 0],
                [xmax, ymin, 0],
                [xmax, ymax, 0],
                [xmin, ymax, 0],
                [xmin, ymin, 0]
            ]];

            const smallerPolygon = new Polygon({
                rings: rings,
                spatialReference: mainPolygon.spatialReference
            });

            smallerPolygons.push(smallerPolygon);
        }
    }

    return smallerPolygons;
}
function elevateAndPlaceSmallerPolygons(mainPolygon: Polygon, elevationPoints: number[], height = 0, isRoof = false, baseHeight = 0, numPolygons: number = 4): Graphic[] {
    // Elevate the main polygon
    const elevatedMainPolygon = elevateGeometryRings(mainPolygon, elevationPoints, height, isRoof, baseHeight);

    if (!elevatedMainPolygon) return [];

    const elevatedMainPolygonGeometry = new Polygon({
        rings: elevatedMainPolygon.rings,
        spatialReference: mainPolygon.spatialReference
    });

    // Generate smaller polygons within the bounds of the main polygon
    const smallerPolygons = generateSmallerPolygons(elevatedMainPolygonGeometry, numPolygons);

    // Elevate the smaller polygons using the same elevation points
    const elevatedSmallerPolygons = smallerPolygons.map((polygon: Polygon) => {
        const elevatedRings = elevateGeometryRings(polygon, elevationPoints, height, isRoof, baseHeight);
        return new Graphic({
            geometry: new Polygon({
                rings: elevatedRings?.rings!,
                spatialReference: polygon.spatialReference
            }),
            symbol: updatedSymbolWithHeight(2)
        })
    });

    return elevatedSmallerPolygons;
}

const updateGeometry = (graphic: Graphic, zIndex: number) => {
    const geometry = new Polygon({
        rings: (graphic.geometry as Polygon).rings.map(ring =>
            ring.map(point => [point[0], point[1], zIndex])
        ),
        spatialReference: graphic.geometry.spatialReference
    });
    return geometry;
};

const processSolarPanels = (solarPanels: GraphicCollection, symbol: any) => {
    //const gb = globalLayers.multipleSolarPanelLayers;
    if (solarPanels.length === 0) {
    }
    globalLayers.multipleSolarPanelLayers.forEach(layer => {
        let adjustedGraphic = [] as Graphic[]
        layer.graphics.forEach(item => {
            let updatedGraphic = item.clone() as Graphic;
            updatedGraphic.geometry = updateGeometry(updatedGraphic, 0);
            updatedGraphic.symbol = item.symbol;
            adjustedGraphic.push(updatedGraphic)
        })
        layer.graphics.removeAll();
        layer.graphics.addMany(adjustedGraphic)
    })
};

const calculateNewHeight = (item: Graphic, withHeight: boolean) => {
    return withHeight
        ? item.getAttribute(ElevatedSideHeight) ?? item.getAttribute(attributeheight) + item.getAttribute('elevation') + 0.3
        : item.getAttribute('elevation') + 0.3;
};

export const getTiltsDetails = (item: Graphic, height: number, lengthofElevatedSide: number, lengthofElevatedSide_x: number) => {
    let mainBasehight = item.getAttribute(attributeElevation);
    let mainTiltedhight = height;
    let heightDeviation = mainTiltedhight - mainBasehight;
    var angleRadians = Math.atan2(heightDeviation, lengthofElevatedSide);
    var angleDegrees = angleRadians * (180 / Math.PI);
    var perpendicularHeight = calculatePerpendicular(lengthofElevatedSide_x, angleRadians);
    return { mainBasehight, mainTiltedhight, heightDeviation, angleRadians, angleDegrees, perpendicularHeight }
}

const processSolarPanelTiltedRoof = (solarPanels: GraphicCollection, withHeight: boolean) => {
    globalLayers.multipleSolarPanelLayers.forEach(layer => {
        const roofModules = [] as Graphic[];
        let adjustedGraphic = [] as Graphic[]
        const lengthofElevatedSide = elevatedSideLengthglb;
        const lengthofElevatedSide_x = elevatedSideLengthglb_x;
        if(!layer.graphics.length){
            console.warn('no panles found.')
            return;
        }
        const its = layer.graphics.at(0);
        let mainBasehight = its.getAttribute(attributeElevation);
        let mainTiltedhight = calculateNewHeight(its, withHeight);
        const heightDeviation = elevatedSideHeight - baseBuildingHeight
        // const heightDeviation = mainTiltedhight - mainBasehight;
        // const heightDeviation = 10;
        const angleRadians = Math.atan2(heightDeviation, lengthofElevatedSide_x);
        const angleDegrees = angleRadians * (180 / Math.PI);
        let lastheight = 0;
        let firstPoint = false;
        let baseHeight_for_nxt_graphic = 0;
        let deafultModule_x_length = 2.56;
        let deafultModule_x_length_new = defaultmoduleLength;
        // defaultmoduleLength  =  the_default_lenght_of_module_to_be_layedout_on_roof
        let lastDrawnGraphicTitle = 'building';
        let elevationPointsIndexes = null as null | number[]
        let elevationPointsAngle = 0;
        let buildingElevationDirection = null as string | null;
        let buildingHeight = 0;
        const groupedGraphics = getGraphicGroupByLng(layer.graphics, 'longitude');
        

        globalLayers.sketchLayers?.graphics.forEach((graphic) => {
            const found = firstIntersectigGraphics(its, globalLayers.sketchLayers.graphics);
            if (found && (found.getAttribute('name') as string).includes('building')) {
                lastDrawnGraphicTitle = 'building'
                buildingHeight = found.getAttribute('height') as number;
                if(found.getAttribute(elevationIndex)){
                    if(found.getAttribute(elevationIndex)?.length){
                        elevationPointsIndexes = found.getAttribute(elevationIndex);
                        buildingElevationDirection = found.getAttribute(elevationDirection);

                        elevationPointsAngle = graphic.getAttribute('rooftiltangle')
                    }
                }
            } 
            if(graphic.attributes)
            if(!found){
                if (graphic.attributes && (graphic.getAttribute('name') as string).includes('building')) {
                    lastDrawnGraphicTitle = 'building'
                    buildingHeight = graphic.getAttribute('height') as number;
                    if(graphic.getAttribute(elevationIndex)){
                        if(graphic.getAttribute(elevationIndex)?.length){
                            elevationPointsIndexes = graphic.getAttribute(elevationIndex)
                            elevationPointsAngle = graphic.getAttribute('rooftiltangle')
                        }
                    }
                } 
            }
        })

        Object.keys(groupedGraphics).forEach((key, i) => {
            const longitude = Number(key);
            const graphicsArray = groupedGraphics[longitude];
            if (lastDrawnGraphicTitle === 'building' && !elevationPointsIndexes?.length && buildingElevationDirection === null) {
                graphicsArray.forEach((item) => {
                    const updatedGraphic = item.clone() as Graphic;
                    let tiltAngle = 10;
                    if(updatedGraphic.getAttribute(TiltAngle)){
                        tiltAngle = updatedGraphic.getAttribute(TiltAngle);
                    }
                    const centroid = (updatedGraphic.geometry as Polygon).centroid; 
                     // Convert tilt angle from degrees to radians
                    const tiltAngleInRadians = (tiltAngle * Math.PI) / 180;
                    // const elevatedGeometry = elevateRingsWithAngle(updatedGraphic.geometry as Polygon, elevationPointsIndexes?.map(ele => ele - 1)!, elevationPointsAngle);
                    const modifiedElevationRings = ((updatedGraphic as Graphic).geometry as Polygon).rings.map(ring => {
                        return ring.map((point, i) => {
                            const line = new Polyline({
                                paths: [[[centroid.x, centroid.y], [point[0], point[1]]]],
                            })
                            const distanceFromCentroid = geometryEngine.geodesicLength(line,"meters");
                            // Calculate elevation change based on the tilt angle and horizontal distance
                            const elevationChange = distanceFromCentroid * Math.tan(tiltAngleInRadians);
                            if (i === 1 || i === 2) {
                                return [point[0], point[1], buildingHeight + point[2] + elevationChange]
                            }
                            return [point[0], point[1], buildingHeight + point[2]]
                        })  
                    });
                    (updatedGraphic.geometry as any).rings = modifiedElevationRings;
                    updatedGraphic.symbol = item.symbol;
                    adjustedGraphic.push(updatedGraphic)
                })
                
            } else {
                // You can perform any additional operations here
                var perpendicularHeight = calculatePerpendicular(deafultModule_x_length_new, angleRadians);
                var perpendicularHeightStart = calculatePerpendicular(deafultModule_x_length_new - defaultmoduleLength, angleRadians);
                deafultModule_x_length_new += defaultmoduleLength;
                graphicsArray.forEach((graphic) => {
                    let upd_graphic = graphic.clone();
                    upd_graphic.attributes = graphic.attributes;
                    let ring = (upd_graphic.geometry as Polygon).rings.map(rings => {
                        return rings.map(point => {
                            return [point[0], point[1], point[2]]
                        })
                    });

                    (upd_graphic.geometry as Polygon).rings = ring;
                    // elevate the points
                    const centroid = (upd_graphic.geometry as Polygon).centroid; 

                    let tiltAngle = 10;
                    if(upd_graphic.getAttribute(TiltAngle)){
                        tiltAngle = upd_graphic.getAttribute(TiltAngle);
                    }

                     // Convert tilt angle from degrees to radians
                    const tiltAngleInRadians = (tiltAngle * Math.PI) / 180;

                    upd_graphic.attributes =
                        upd_graphic.geometry = new Polygon({
                            rings: ring.map(rings => {
                                return rings.map((point, i) => {
                                    const line = new Polyline({
                                        paths: [[[centroid.x, centroid.y], [point[0], point[1]]]],
                                    })
                                    const distanceFromCentroid = geometryEngine.geodesicLength(line,"meters");
                                    // Calculate elevation change based on the tilt angle and horizontal distance
                                    const elevationChange = distanceFromCentroid * Math.tan(tiltAngleInRadians);
                                    if (i === 2 || i === 3) { 
                                        return [point[0], point[1], point[2] + perpendicularHeight + buildingHeight + 0.6]
                                    }
                                    return [point[0], point[1], point[2] + perpendicularHeightStart + buildingHeight]
                                })
                            }),
                            spatialReference: upd_graphic.geometry.spatialReference
                        })
                    adjustedGraphic?.push(upd_graphic);
                });
            }

        })

        layer.graphics.removeAll();
        layer.graphics.addMany(adjustedGraphic)
    })
};

const updateNamedGraphicsbySymbol = (graphics: GraphicCollection, symbol: any, isElevate: boolean = true ) => {
    graphics.forEach(updateGraphic => {
        
        // Clone the graphic and update its geometry
        // let updateGraphic = graphic.clone();
        // globalLayers.sketchLayers?.graphics.remove(graphic);
        // globalLayers.view?.graphics.remove(graphic)
        
        let elevation = isElevate ? updateGraphic.getAttribute("elevation") ?? 0 : 0;
        let height = updateGraphic.getAttribute("height") as number;
        // Update the rings with the found elevation
        const polygon = updateGraphic.geometry as Polygon;
        polygon.rings = polygon.rings.map(ring => ring.map(point => [point[0], point[1], elevation]));

        // Update the centroid elevation if necessary
        if (polygon?.centroid) {
            polygon.centroid.z = elevation;
        }
        updateGraphic.symbol = isElevate ?  typeof symbol === 'function' ?  symbol(height) : symbol : symbol;
        const union = combineBuildingAndObs(updateGraphic.geometry, globalLayers.graphicUnion!)
        if(union){
            globalLayers.graphicUnion = union
        }
        // Replace the old graphic with the updated
        // globalLayers.sketchLayers?.graphics.add(updateGraphic);
    });
}


function calculatePerpendicular(baseLength: number, angleRadians: number) {
    return baseLength * Math.tan(angleRadians);
}


// Function to combine building and mumty geometries
export function combineBuildingAndObs(buildingGeometry: Geometry, mumtyGeometry: Geometry): Geometry | null {
    if (geometryEngine && buildingGeometry && mumtyGeometry) {
        // Use geometryEngine.union to combine the two geometries
        const combinedGeometry = geometryEngine.union([buildingGeometry, mumtyGeometry]);
        return combinedGeometry;
    }
    return null;
}
