import Graphic from "@arcgis/core/Graphic";
import Geometry from "@arcgis/core/geometry/Geometry";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import * as projection from "@arcgis/core/geometry/projection.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { solarPanelsSymbology, solarPanlesBlueSymbol } from "../../../lib/EPC/SketchDraw/SketchSymbols/sketchSymbols";
import { rotateGraphicAroundCentroid } from "../../Common/RotateGraphic/rotateGraphicAroundCentroid";
import { Azimuth, Panels, TiltAngle } from "../../Const";
import { createLayerWithSymbol } from "../Maps/CalPolyModules";
import globalLayers from "../Maps/GlobaLMap";
import { getGraphic } from "../Maps/getFucntion";
import { getGroupByLng } from "../Maps/groupByLng";
import { groupGraphicbyDistance } from "../Maps/groupGraphicbyDistance";
import { simpleFillSymbol_2d } from "../Markers/MarkerSymbols";
import { mmsDataT } from "./GenrateRoof";
/**
 * The `generateRoofBlocks` function generates roof blocks on a map using a collection of graphics and
 * a symbol.
 * @param {any[]} polyGraphicCollection - The `polyGraphicCollection` parameter is an array of graphics
 * that represent polygons or shapes on a map.
 * @param {any} symbol - The `symbol` parameter is an object that represents the symbol used to render
 * the graphics in the layer. It could be a marker symbol, line symbol, fill symbol, or text symbol,
 * depending on the type of graphics being rendered.
 * @param {string} title - The title parameter is a string that represents the title of the graphic
 * layer that will be created.
 * @param [zoommin=0] - The `zoommin` parameter is the minimum scale at which the layer should be
 * visible on the map. It is used to control the visibility of the layer based on the zoom level of the
 * map.
 * @param [zoommax=0] - The `zoommax` parameter is used to set the maximum scale at which the layer
 * will be visible on the map. This means that the layer will only be visible when the map is zoomed in
 * beyond the specified scale.
 * @param [exp=.OBJECTID] - The `exp` parameter is an expression that is used to define the
 * attribute value for each graphic in the layer. In this case, it is set to ".OBJECTID", which
 * means that the value of the OBJECTID field from the feature layer will be used as the attribute
 * value for each
 */
export const generateRoofBlocks = async (polyGraphicCollection: any[], symbol: any, title: string, pointGraphicRotation: Graphic, zoommin = 0, zoommax = 0, exp = "$feature.OBJECTID") => {
    const simpleFillSymbol = simpleFillSymbol_2d()
    var roatedGraphicCollection = [] as Graphic[];
    // make the grphic collection rotate minus azmiuth degree and then group them 
    var updatedPolygonCol = [] as Graphic[];
    var updatedPolygonCol_sorted = [] as Graphic[];
    polyGraphicCollection.forEach(element => {
        const rotateelem = geometryEngine.rotate(element.geometry, -globalLayers.azimuth, (pointGraphicRotation.geometry as any));
        let rotateElemGraphic = getGraphic(rotateelem, simpleFillSymbol, {});
        roatedGraphicCollection.push(rotateElemGraphic);
        // add some height to the result polygons module 
        var modifiedElevation = element.geometry.rings.map((ring: any) => {
            return ring.map((item: any) => [item[0], item[1], globalLayers.attribute.elevation + 0.5]);
        })
        const polygon = new Polygon({
            rings: modifiedElevation,
            spatialReference: {
                wkid: 4326
            }
        });
        const projectedPolygon = projection.project(polygon, new SpatialReference({ wkid: 102100 }));
        const gra = new Graphic({
            geometry: projectedPolygon as any,
            symbol: solarPanelsSymbology,
            attributes: { ...globalLayers.attribute, name: Panels }
        })  
        updatedPolygonCol.push(gra)
    })
    // const setsOfGraphics = groupGraphicbyDistance(roatedGraphicCollection, 6, 2, pointGraphicRotation)
    if (globalLayers.roofCounts > 0) {}
    if (globalLayers.solarpanelLayer) {
        // globalLayers.map?.layers.remove(globalLayers.solarpanelLayer!)
    };
    // create a graphic layer for all the layer collection in module table
    globalLayers.lastDrawnRoofBoundryGraphicTitle = `Solar Panels ${globalLayers.multipleSolarPanelLayers.length + 1}`;
    globalLayers.solarpanelLayer = new GraphicsLayer({
        title: globalLayers.lastDrawnRoofBoundryGraphicTitle,
    })
    // const grouped = groupGraphicsIntoModules(updatedPolygonCol, 2, 3) // groupiing the modules
   //const newUpdatedGraphic = adjustGraphicsWithAzimuth(updatedPolygonCol, 0, solarPanelsSymbology,parseFloat(mmsData.azimuthAngle)) // for adding azimuth angle
    //globalLayers.solarpanelLayer?.graphics.addMany(grouped[0]); // these 102100 spatial coordinates are the one making panels on boundry 
    globalLayers.solarpanelLayer?.graphics.addMany(updatedPolygonCol); // the original code 
    globalLayers.multipleSolarPanelLayers[globalLayers.roofCounts - 1] = globalLayers.solarpanelLayer;
    if (globalLayers.solarpanelLayer?.graphics.length) {
        globalLayers.totalNumberofModules = globalLayers.solarpanelLayer?.graphics.length;
    }
    (globalLayers.map?.allLayers as any)._items.forEach((e: any) => {
        if (e.title && e.title === 'Solar Panels') {
            globalLayers.map?.layers.remove(globalLayers.solarpanelLayer!)
        }
    });
    globalLayers.map?.add(globalLayers.solarpanelLayer!);
    // globalLayers.map?.add(globalLayers.multipleSolarPanelLayers[globalLayers.roofCounts - 1]);
    createLayerWithSymbol(polyGraphicCollection, symbol, title, exp).then(lyrPath => {
        if (zoommin != 0) {
            lyrPath.minScale = zoommin;
            lyrPath.maxScale = zoommax;
        }
        // globalLayers.map?.layers.add(lyrPath);
        globalLayers.panles_2d = lyrPath;
        // store the ayer on global state 
        globalLayers.roofTopModuleCount.push(lyrPath);
        return lyrPath;
    })
}
export const generateRoofBlocks_updated = async (polyGraphicCollection: any[], symbol: any, title: string, pointGraphicRotation: Graphic,mmsData: mmsDataT, zoommin = 0, zoommax = 0, exp = "$feature.OBJECTID") => {
    const simpleFillSymbol = simpleFillSymbol_2d()
    var roatedGraphicCollection = [] as Graphic[];
    // make the grphic collection rotate minus azmiuth degree and then group them 
    var updatedPolygonCol = [] as Graphic[];
    var updatedPolygonCol_sorted = [] as Graphic[];
    polyGraphicCollection.forEach(element => {
        const rotateelem = geometryEngine.rotate(element.geometry, -globalLayers.azimuth, (pointGraphicRotation.geometry as any));
        let rotateElemGraphic = getGraphic(rotateelem, simpleFillSymbol,
            {
                ...element.attributes,
                TiltAngle: parseFloat(mmsData.tiltAngle),
                Azimuth: parseFloat(mmsData.azimuthAngle),
                name: Panels + '_' + (Math.random()*1000) + Math.random() * 0.25
            });
        roatedGraphicCollection.push(rotateElemGraphic);
        // add some height to the result polygons module 
        var modifiedElevation = element.geometry.rings.map((ring: any) => {
            return ring.map((item: any) => [item[0], item[1], globalLayers.attribute.elevation + 0.05]);
        })
        const polygon = new Polygon({
            rings: modifiedElevation,
            spatialReference: {
                wkid: 4326
            }
        });
        const projectedPolygon = projection.project(polygon, new SpatialReference({ wkid: 102100 }));
        const new_graphic_with_symbol = new Graphic({
            geometry: projectedPolygon as Geometry,
            symbol: solarPanlesBlueSymbol,
            attributes: { ...globalLayers.attribute, name: Panels + '_' + (Math.random()*1000) + Math.random() * 0.25 }
        })
        new_graphic_with_symbol.setAttribute(TiltAngle, parseFloat(mmsData.tiltAngle))
        new_graphic_with_symbol.setAttribute(Azimuth, parseFloat(mmsData.azimuthAngle))
        updatedPolygonCol.push(new_graphic_with_symbol)
    })
    let updatedSortedGraphic = [] as Graphic[][]
    if(mmsData.columns > 0 && mmsData.rows > 0){
        updatedSortedGraphic = groupGraphicbyDistance(roatedGraphicCollection, mmsData.columns, mmsData.rows, pointGraphicRotation)
        updatedSortedGraphic.map(geo => {
            geo.map(graphic => {
                graphic.symbol = solarPanlesBlueSymbol;
                graphic.setAttribute(TiltAngle, parseFloat(mmsData.tiltAngle))
                graphic.setAttribute(Azimuth, parseFloat(mmsData.azimuthAngle) )
            })
        })
    }
    if (globalLayers.roofCounts > 0) {}
    if (globalLayers.solarpanelLayer) {
        // globalLayers.map?.layers.remove(globalLayers.solarpanelLayer!)
    };
    // create a graphic layer for all the layer collection in module table
    globalLayers.lastDrawnRoofBoundryGraphicTitle = `Solar Panels ${globalLayers.multipleSolarPanelLayers.length + 1}`;
    globalLayers.solarpanelLayer = new GraphicsLayer({
        title: 'Solar Panels',
    })
    // use azimuth anggle to rotate the graphic around their centroid 
    if(parseFloat(mmsData.azimuthAngle) && parseFloat(mmsData.azimuthAngle) > 0){
        updatedSortedGraphic.forEach((graphicGroup) => {
            // Calculate the centroid of the group
            const groupCentroid = calculateGroupCentroid(graphicGroup);
            // const lowestLeftPoint = calculateLowestLeftPoint(graphicGroup);
            // Rotate each graphic in the group around the group's centroid
            graphicGroup.map((item) => {
                const azimuthAngle = parseFloat(mmsData.azimuthAngle);
                // rotateGraphicAroundCentroid(item, azimuthAngle, groupCentroid);
                rotateGraphicAroundCentroid(item, azimuthAngle, groupCentroid);
            });

        })

        
        // updatedSortedGraphic.flat().forEach(item => {
        //     const azimuthAngle = parseFloat(mmsData.azimuthAngle);
        //     rotateGraphicAroundCentroid(item, azimuthAngle)
        // })
    }

    // console.log(updatedSortedGraphic.length, 'updatedSortedGraphic.length')
    if(globalLayers.totalNumberofModules === 0){
        globalLayers.solarpanelLayer?.graphics.addMany(updatedSortedGraphic.length > 0 ? updatedSortedGraphic.flat(): updatedPolygonCol); // the original code 
    } else {
        if(updatedSortedGraphic.flat().length > globalLayers.totalNumberofModules){
            const slicedArray = updatedSortedGraphic.flat().slice(0, globalLayers.totalNumberofModules);
            globalLayers.solarpanelLayer?.graphics.addMany(slicedArray);
        } else {
            globalLayers.solarpanelLayer?.graphics.addMany(updatedSortedGraphic.flat());
        }
    }
    globalLayers.multipleSolarPanelLayers[0] = globalLayers.solarpanelLayer;
    if (globalLayers.solarpanelLayer?.graphics.length) {
        globalLayers.totalNumberofModules = globalLayers.solarpanelLayer?.graphics.length;
    }

    globalLayers.map?.add(globalLayers.solarpanelLayer!);

    globalLayers.solarpanelLayer.graphics.on('after-add', e => {
        
    })

    createLayerWithSymbol(polyGraphicCollection, symbol, title, exp).then(lyrPath => {
        if (zoommin != 0) {
            lyrPath.minScale = zoommin;
            lyrPath.maxScale = zoommax;
        }
        globalLayers.panles_2d = lyrPath;
        globalLayers.roofTopModuleCount.push(lyrPath)
        return lyrPath;
    })
}
export const generateRoofBlocks_EPC = async (polyGraphicCollection: any[], symbol: any, title: string, pointGraphicRotation: Graphic, elevation: number, zoommin = 0, zoommax = 0, exp = "$feature.OBJECTID") => {
    const simpleFillSymbol = simpleFillSymbol_2d()
    var roatedGraphicCollection = [] as Graphic[];
    // make the grphic collection rotate minus azmiuth degree and then group them 
    var updatedPolygonCol = [] as Graphic[];
    polyGraphicCollection.forEach(element => {
        const rotateelem = geometryEngine.rotate(element.geometry, -globalLayers.azimuth, (pointGraphicRotation.geometry as Point));
        let rotateElemGraphic = getGraphic(rotateelem, simpleFillSymbol, {});
        roatedGraphicCollection.push(rotateElemGraphic);
        // add some height to the result polygons module 
        var modifiedElevation = element.geometry.rings.map((ring: any) => {
            return ring.map((item: any) => [item[0], item[1], elevation + 0.5]);
        })
        const polygon = new Polygon({
            rings: modifiedElevation,
            spatialReference: {
                wkid: 4326
            }
        });
        const projectedPolygon = projection.project(polygon, new SpatialReference({ wkid: 102100 }));
        const gra = new Graphic({
            geometry: projectedPolygon as any,
            symbol: solarPanelsSymbology,
            attributes: { ...globalLayers.attribute, 
                name: 'panles',
                // Azimuth: parseFloat(mmsDataType.azimuth)
             }
        })
        updatedPolygonCol.push(gra)
    })
    const setsOfGraphics = groupGraphicbyDistance(roatedGraphicCollection, 6, 2, pointGraphicRotation)
    if (globalLayers.roofCounts > 0) {}
    if (globalLayers.solarpanelLayer) {   
        // globalLayers.map?.layers.remove(globalLayers.solarpanelLayer!)
    };
    // create a graphic layer for all the layer collection in module table
    globalLayers.lastDrawnRoofBoundryGraphicTitle = `Solar Panels ${globalLayers.multipleSolarPanelLayers.length + 1}`;
    globalLayers.solarpanelLayer = new GraphicsLayer({
        title: globalLayers.lastDrawnRoofBoundryGraphicTitle,
    })
    // globalLayers.solarpanelLayer?.graphics.addMany(polyGraphicCollection);
    globalLayers.solarpanelLayer?.graphics.addMany(updatedPolygonCol); // these 102100 spatial coordinates are the one making panels on boundry 
    globalLayers.multipleSolarPanelLayers[globalLayers.roofCounts - 1] = globalLayers.solarpanelLayer;
    if (globalLayers.solarpanelLayer?.graphics.length) {
        globalLayers.totalNumberofModules = globalLayers.solarpanelLayer?.graphics.length;
    }
    (globalLayers.map?.allLayers as any)._items.forEach((e: any) => {
        if (e.title && e.title === 'Solar Panels') {
            // globalLayers.map?.layers.remove(globalLayers.solarpanelLayer!)
        }
    });
    globalLayers.map?.add(globalLayers.solarpanelLayer!);
    globalLayers.map?.add(globalLayers.multipleSolarPanelLayers[globalLayers.roofCounts - 1]);
    createLayerWithSymbol(polyGraphicCollection, symbol, title, exp).then(lyrPath => {
        if (zoommin != 0) {
            lyrPath.minScale = zoommin;
            lyrPath.maxScale = zoommax;
        }
        globalLayers.panles_2d = lyrPath;
        globalLayers.roofTopModuleCount.push(lyrPath)
        return lyrPath;
    })
}
const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
// Function to create a symbol with a specific color
const createSymbolWithColor = (color: string) => {
  return {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: color,
    outline: {
      width: 1,
      color: "black"
    }
  };
};

/**
 * The function `groupGraphicsIntoModules` organizes an array of graphics into modules based on
 * longitude, with each module having a specified number of rows and columns, and assigns a unique
 * color to each module.
 * @param {Graphic[]} graphics - The `graphics` parameter is an array of Graphic objects that you want
 * to group into modules based on their longitude values. Each Graphic object likely contains
 * information about a specific graphic element, such as its longitude, latitude, and other properties.
 * @param {number} rows - The `rows` parameter in the `groupGraphicsIntoModules` function specifies the
 * number of rows each module should have when grouping the graphics. This parameter determines how
 * many graphics will be displayed in each row of the module.
 * @param {number} cols - The `cols` parameter in the `groupGraphicsIntoModules` function represents
 * the number of columns in each module when grouping the graphics. It is used to determine how many
 * graphics should be in each row before moving on to the next row within a module.
 * @returns The function `groupGraphicsIntoModules` returns an array of modules, where each module is
 * an array of graphics grouped based on longitude. Each module contains a specific number of rows and
 * columns specified by the `rows` and `cols` parameters. Each graphic in the modules is assigned a
 * unique color symbol using the `createSymbolWithColor` function.
 */
export const groupGraphicsIntoModules = (
    graphics: Graphic[],
    rows: number,
    cols: number
) => {
    // Group the graphics by longitude
    const groupedByLng = getGroupByLng(graphics, 'longitude');
    // Get the sorted keys (longitudes) to process in order
    const sortedKeys = Object.keys(groupedByLng).sort((a, b) => parseFloat(a) - parseFloat(b));
    const modules = [];
    let currentModule = [];
    for (const key of sortedKeys) {
        const group = groupedByLng[key as any];
        for (const graphic of group) {
            currentModule.push(graphic);
            // Check if the current module has reached the required size
            if (currentModule.length === rows * cols) {
                modules.push(currentModule);
                currentModule = [];
            }
        }
    }
    // If there are remaining graphics, add them as a final module
    if (currentModule.length > 0) {
        modules.push(currentModule);
    }
    // Assign a unique color to each module
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']; // Add more colors if needed
    for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        const color = colors[i % colors.length];
        for (const graphic of module) {
            graphic.symbol = createSymbolWithColor(color) as any
        }
    }
    return modules;
};

// Function to calculate the centroid of a group of polygons
const calculateGroupCentroid = (graphics: Graphic[]) => {
    const points = graphics.flatMap(graphic => (graphic.geometry as Polygon).rings.flat());
    const totalPoints = points.length;

    // Calculate average latitude and longitude (x, y)
    const avgX = points.reduce((sum, point) => sum + point[0], 0) / totalPoints;
    const avgY = points.reduce((sum, point) => sum + point[1], 0) / totalPoints;

    return {
        x: avgX,
        y: avgY,
        spatialReference: graphics[0].geometry.spatialReference
    };
};


// Function to rotate a graphic around a given centroid point
// export const rotateGraphicAroundCentroid = (graphic: Graphic, angle: number, centroid: any) => {
//     const rotatedGeometry = geometryEngine.rotate(graphic.geometry, angle, centroid);
//     graphic.geometry = rotatedGeometry;
// };

function translateGeometryToOrigin(geometry: any, origin: any) {
    const deltaX = -origin.x;
    const deltaY = -origin.y;
    
    return new Polygon({
        rings: (geometry as Polygon).rings.map(ring => ring.map(point => [point[0] + deltaX, point[1] + deltaY]))
    })
}

function translateGeometry(geometry: Polygon, x: any, y: any) {
    return  new Polygon({
        rings: geometry.rings.map(ring => ring.map(point => [point[0] + x, point[1] + y]))
    })
}


export function rotateGraphicAroundPoint(graphic: any, angle: any, point: any) {
    // Translate the graphic to the origin (relative to the point)
    let translatedToOrigin = translateGeometryToOrigin(graphic.geometry, point);

    // Rotate the geometry
    let rotatedGeometry = geometryEngine.rotate(translatedToOrigin as Geometry, angle);

    // Translate the graphic back to the original point
    let translatedBack = translateGeometry(rotatedGeometry as Polygon, point.x, point.y);

    // Update the graphic's geometry
    graphic.geometry = translatedBack;
}



export function calculateLowestLeftPoint(graphicGroup: Graphic[]) {
    let minX = Infinity;
    let minY = Infinity;

    graphicGroup.forEach((graphic) => {
        const geometry = graphic.geometry as Polygon;
        
        // Check if geometry has rings (for polygons) or points
        if (geometry.type === "polygon") {
            geometry.rings.forEach((ring) => {
                ring.forEach((point) => {
                    const [x, y] = point;
                    if (x < minX || (x === minX && y < minY)) {
                        minX = x;
                        minY = y;
                    }
                });
            });
        }
    });

    return { x: minX, y: minY };
}