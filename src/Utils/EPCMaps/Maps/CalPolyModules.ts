import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import SimpleRenderer from "@arcgis/core/renderers/SimpleRenderer.js";
import globalLayers from "./GlobaLMap";
import { mmsDataT, ModuleOrientationType } from "../GenerateRoof/GenrateRoof";
import { defaultmoduleLength, defaultmoduleWidth } from "../../Const";

type TPoints = { a: number; b: number; }
type TExtentKeys = "mapXMin" | "mapXMax" | "mapYMin" | "mapYMax"

export const CalPolyRoofModules = async (data: { RoadWidth: number }, boundaryGeom: any, height = 0) => {
    const d = data;
    let blockLen = 0.000023;
    let blockWid = 0.000010;
    
    

    if (boundaryGeom.geometry.spatialReference.wkid === 102100) {
        const geometry_4326 = webMercatorUtils.webMercatorToGeographic(boundaryGeom.geometry);
        boundaryGeom.geometry = geometry_4326
    }

    const polyExtent = calPolyExtent(boundaryGeom);
    const precisionx = typeof (blockLen) === "string" ? parseFloat(blockLen) : blockLen;
    const precisiony = typeof (blockWid) === "string" ? parseFloat(blockWid) : blockWid;
    const blockPolyColection: any[] = [];
    let blockCounter = 0;
    for (let x = polyExtent.mapXMin; x < polyExtent.mapXMax; x = x + blockLen) {
        for (let y = polyExtent.mapYMin; y <= polyExtent.mapYMax; y = y + blockWid) {
            const py1 = { a: x, b: y };
            const py2 = { a: x, b: y + precisiony };
            const py3 = { a: x + precisionx, b: y + precisiony };
            const py4 = { a: x + precisionx, b: y };
            blockPolyColection.push(calPolyFromPointsRoofTop(py1, py2, py3, py4, height));
            y = y + d.RoadWidth / 300000;
            blockCounter = blockCounter + 1;
        }
        x = x + d.RoadWidth / 300000;//d.PathWidth;
    }

    return blockPolyColection; //polyGraphicCollection; //this.calFilterInside(polyGraphicCollection,d.BlockCount);
}

function metersToLatitudeDegrees(distanceInMeters: number): number {
    const metersPerDegreeLat = 111320;
    return distanceInMeters / metersPerDegreeLat;
}
function metersToLongitudeDegrees(distanceInMeters: number, latitude: number): number {
    const metersPerDegreeLng = 111320 * Math.cos(latitude * (Math.PI / 180));
    return distanceInMeters / metersPerDegreeLng;
}

export const CalPolyRoofModules_Updated = async (data: { RoadWidth: number }, boundaryGeom: any, height = 0, mmsData: mmsDataT) => {
    const d = data;
    let blockLen = defaultmoduleLength;
    let blockWid = defaultmoduleWidth;
    // let blockLen = 1.6;
    // let blockWid = 1;
    if(mmsData.moduleOrientation === 'Portrait'){
        blockLen = defaultmoduleWidth;
        blockWid = defaultmoduleLength;
    }

    if (boundaryGeom.geometry.spatialReference.wkid === 102100) {
        const geometry_4326 = webMercatorUtils.webMercatorToGeographic(boundaryGeom.geometry);
        boundaryGeom.geometry = geometry_4326
    }
    const polyExtent = calPolyExtent(boundaryGeom);

    blockLen = metersToLatitudeDegrees(blockLen);
    blockWid = metersToLongitudeDegrees(blockWid, polyExtent.mapYMin);

    const precisionx = typeof (blockLen) === "string" ? parseFloat(blockLen) : blockLen;
    const precisiony = typeof (blockWid) === "string" ? parseFloat(blockWid) : blockWid;


    const blockPolyColection: any[] = [];
    let blockCounter = 0;

    const roadWidthVerticalIndegree = metersToLatitudeDegrees(d.RoadWidth);
    const roadWidthHorizontalIndegree = metersToLongitudeDegrees(d.RoadWidth, polyExtent.mapYMin);

    const SpacingVertical = metersToLatitudeDegrees(mmsData.rowSpacingV);
    const SpacingHorizontal = metersToLongitudeDegrees(mmsData.rowSpacingH, polyExtent.mapYMin);

    // Convert module spacing from meters to degrees
    const verticalSpacingDegrees = metersToLatitudeDegrees(mmsData.verticalSpacing);
    const horizontalSpacingDegrees = metersToLongitudeDegrees(mmsData.horizontalSpacing, polyExtent.mapYMin); // Using minimum latitude for conversion

    // this is working for the internal module spacing only
    // for (let x = polyExtent.mapXMin; x < polyExtent.mapXMax; x = x + blockLen + horizontalSpacingDegrees) {
    //     for (let y = polyExtent.mapYMin; y <= polyExtent.mapYMax; y = y + blockWid  + verticalSpacingDegrees) {
    //         const py1 = { a: x, b: y };
    //         const py2 = { a: x, b: y + precisiony };
    //         const py3 = { a: x + precisionx, b: y + precisiony };
    //         const py4 = { a: x + precisionx, b: y };
    //         blockPolyColection.push(calPolyFromPointsRoofTop(py1, py2, py3, py4, height));
    //         y = (y + d.RoadWidth / 300000); // vertical spacing
    //         blockCounter = blockCounter + 1;
    //     }
    //     x = (x + d.RoadWidth / 300000);//d.PathWidth;
    // }

    let cols = mmsData.columns;
    let rows = mmsData.rows;
    let iCols = 0;
    let iRows = 0;
    for (let x = polyExtent.mapXMin; x < polyExtent.mapXMax; x = x + blockLen + horizontalSpacingDegrees) {
        for (let y = polyExtent.mapYMin; y <= polyExtent.mapYMax; y = y + blockWid + verticalSpacingDegrees) {
            const py1 = { a: x, b: y };
            const py2 = { a: x, b: y + precisiony };
            const py3 = { a: x + precisionx, b: y + precisiony };
            const py4 = { a: x + precisionx, b: y };
            blockPolyColection.push(calPolyFromPointsRoofTop(py1, py2, py3, py4, height));
            y = y + roadWidthVerticalIndegree; // vertical spacing
            // y = (y + d.RoadWidth / 300000); // vertical spacing
            blockCounter = blockCounter + 1;
 
            if (iRows == rows) {
                y = y + SpacingVertical;
                iRows=0;
            }
           
            iRows++;
        }
        x = (x + roadWidthHorizontalIndegree);//d.PathWidth;
        // x = (x + d.RoadWidth / 300000);//d.PathWidth;
        if (iCols == cols) {
            x = x + SpacingHorizontal;
            iCols=0;
        }
        iRows=0;
        iCols++;
    }

    // for (let x = polyExtent.mapXMin; x < polyExtent.mapXMax; x += (blockLen * mmsData.columns) + SpacingHorizontal) {
    //     for (let y = polyExtent.mapYMin; y < polyExtent.mapYMax; y += (blockWid * mmsData.rows) + SpacingVertical) {
    //         for (let i = 0; i < mmsData.columns; i++) {
    //             for (let j = 0; j < mmsData.rows; j++) {
    //                 const py1 = { a: x + i * (precisionx + horizontalSpacingDegrees), b: y + j * (precisiony + verticalSpacingDegrees) };
    //                 const py2 = { a: x + i * (precisionx + horizontalSpacingDegrees), b: y + (j + 1) * (precisiony + verticalSpacingDegrees) };
    //                 const py3 = { a: x + (i + 1) * (precisionx + horizontalSpacingDegrees), b: y + (j + 1) * (precisiony + verticalSpacingDegrees) };
    //                 const py4 = { a: x + (i + 1) * (precisionx + horizontalSpacingDegrees), b: y + j * (precisiony + verticalSpacingDegrees) };
    //                 blockPolyColection.push(calPolyFromPointsRoofTop(py1, py2, py3, py4, height));
    //             }
    //         }
    //         y += d.RoadWidth / 300000; // vertical spacing after each group
    //         blockCounter += 1;
    //     }
    //     x += d.RoadWidth / 300000; // horizontal spacing after each group
    // }


    return blockPolyColection; //polyGraphicCollection; //this.calFilterInside(polyGraphicCollection,d.BlockCount);
}

export const CalPolyRoofModules_3D = async (data: { RoadWidth: number }, boundaryGeom: any, height = 0) => {
    const d = data;
    const blockLen = 0.000023; //tableLen * d.TableRows + (d.StructureGap * d.TableRows);
    const blockWid = 0.000010; // tableWid * d.TableCols + (d.StructureGap * d.TableCols);
    const polyExtent = calPolyExtent(boundaryGeom);
    const precisionx = typeof (blockLen) === "string" ? parseFloat(blockLen) : blockLen;
    const precisiony = typeof (blockWid) === "string" ? parseFloat(blockWid) : blockWid;
    const blockPolyColection: any[] = [];
    let blockCounter = 0;
    for (let x = polyExtent.mapXMin; x < polyExtent.mapXMax; x = x + blockLen) {
        for (let y = polyExtent.mapYMin; y <= polyExtent.mapYMax; y = y + blockWid) {
            const py1 = { a: x, b: y };
            const py2 = { a: x, b: y + precisiony };
            const py3 = { a: x + precisionx, b: y + precisiony };
            const py4 = { a: x + precisionx, b: y };
            blockPolyColection.push(calPolyFromPointsRoofTop(py1, py2, py3, py4, height));
            //y = y + d.RoadWidth//d.PathWidth;
            y = (y + d.RoadWidth / 300000) ; // + d.RoadWidth//d.PathWidth;
            blockCounter = blockCounter + 1;
        }
        x = x + d.RoadWidth / 300000;//d.PathWidth;
    }

    return blockPolyColection; //polyGraphicCollection; //this.calFilterInside(polyGraphicCollection,d.BlockCount);
}

export const calPolyFromPointsRoofTop = (point1: TPoints, point2: TPoints, point3: TPoints, point4: TPoints, height = 0) => {
    return {
        type: "polygon",
        rings: [
            [point1.a, point1.b, height],
            [point2.a, point2.b, height + 0], // 0 index to tilt 
            [point3.a, point3.b, height + 0], // 1 index to tilt 
            [point4.a, point4.b, height],
            [point1.a, point1.b, height]]
    };
}

const calPolyExtent = (polygonGraphic: { geometry: any; }) => {
    const maparea = polygonGraphic.geometry;
    const polyExtent: Record<TExtentKeys, number> = {
        "mapXMin": parseFloat(maparea.extent.xmin),
        "mapXMax": parseFloat(maparea.extent.xmax),
        "mapYMin": parseFloat(maparea.extent.ymin),
        "mapYMax": parseFloat(maparea.extent.ymax)
    };
    return polyExtent;
}

export const getRandomColor = () => {
    var red = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var blue = Math.floor(Math.random() * 256);

    return [red, green, blue];
}

export const genGeomCallBack_3dSymbols = (polyGraphicCollection: any[], symbol: any, title: string, zoommin = 0, zoommax = 0, exp = "$feature.OBJECTID") => {
    createLayerWithSymbol(polyGraphicCollection, symbol, title, exp).then(lyrPath => {
        if (zoommin != 0) {
            lyrPath.minScale = zoommin;
            lyrPath.maxScale = zoommax;
        }

        globalLayers.map?.layers.add(lyrPath)
        return lyrPath;
    })
}

export const genGeomCallBack_3D = (polyGraphicCollection: any[], symbol: any, title: string, zoommin = 0, zoommax = 0, exp = "$feature.OBJECTID") => {
    createLayerWithSymbol(polyGraphicCollection, symbol, title, exp).then(lyrPath => {
        if (zoommin != 0) {
            lyrPath.minScale = zoommin;
            lyrPath.maxScale = zoommax;
        }
        return lyrPath;
    })
}


export async function createLayerWithSymbol(graphics: any, symbol: { type: string; color: number[]; outline: { color: number[]; width: number; }; }, title: any, exp = "$feature.OBJECTID") {
    const renderer = new SimpleRenderer({
        symbol: symbol,
    });
    return new FeatureLayer({
        source: graphics,
        objectIdField: "OBJECTID",
        fields: [
            {
                name: "OBJECTID",
                type: "oid"
            },
            {
                name: "url",
                type: "string"
            }
        ],
        id: "pnlModulesPolygon",
        title: title,
        renderer: renderer
    });
}