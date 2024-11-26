import axios, { AxiosResponse } from "axios";
import globalLayers from "./GlobaLMap";
import { getsimpleFillSymbol } from "../Markers/MarkerSymbols";
import { loadEsriModules } from "./getEsriModules";
import { getGraphic } from "./getFucntion";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import Graphic from "@arcgis/core/Graphic";
import { buildingSymbologyHeight, hvacSymbologywithHeight, InfraSymbologyHeight, mumtyStructureSymbologywithHeight, obsctructionSymbologyHeight, papapetSymbologyHeight, pipelineSymbologywithHeight, solarModuleSymbologyWithHeight, solarPaneExistingSymbologywithHeight, symbolforColredHeight } from "../../../lib/EPC/SketchDraw/SketchSymbols/sketchSymbols";

export interface LayerProperties {
    fid: string,
    height: string
    id: string
    msi: any
    name: string
    parent: string
    type: string
}

type featureLyarGeo = {
    bbox: any
    geometry: any
    geometry_name: string,
    id: string,
    properties: LayerProperties,

}

type geoServerObject = {
    bbox: number[]
    crs: any
    features: featureLyarGeo[]
    numberMatched: number
    numberReturned: number
    timeStamp: number
    totalFeatures: number
    type: string
}

const geosolutions = process.env.REACT_APP_GEOSERVER_OWS
const GeoURL = (typeNames: string, cqlFilter: string) => `${geosolutions}/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&typeNames=${typeNames}&cql_filter=${cqlFilter}&outputFormat=application/json`
// const GeoURL_ = (typeNames: string, cqlFilter: string) => `${geosolutions}/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&typeNames=${typeNames}&cql_filter=${cqlFilter}&outputFormat=application/json`
const GeoURL_ = (typeNames: string, parentId: string) => 
    `${geosolutions}/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&typeNames=${typeNames}&CQL_FILTER=parent='${parentId}'&outputFormat=application/json`;

// partner EPC
export const fetchRooffromCoordinates = async (latitude: number, longitude: number): Promise<null | Polygon> => {

    let PolygonBuilding = null as null | Polygon
    const typeNames = 'pvlayers:building'
    const cqlFilter = "INTERSECTS(geom, POINT (" + latitude + ' ' + longitude + "))"
    const wfs = GeoURL(typeNames, cqlFilter)
    var response = null as AxiosResponse<geoServerObject, any> | null;
    try {
        response = await axios.get(wfs)
    } catch (e) {
        console.log(e)
        return null;
    }

    if (!response) return null;

    if (response.status !== 200) {
        console.log("encountered some error while fetching the layer");
        return null;
    }


    if (response.data?.features.length) {

        globalLayers.selectedRoof.objectid = response?.data.features[0].properties.id 
        globalLayers.selectedRoof.properties = response?.data.features[0]?.properties
        // globalLayers.elevationP = response?.data.features[0]?.properties.ElevationP;
        const geometry = response?.data.features[0]?.geometry;
        // const [Polygon, GeoJSONLayer] = await loadEsriModules(['esri/geometry/Polygon', 'esri/layers/GeoJSONLayer'])
        if (geometry.coordinates && geometry.coordinates.length) {
            PolygonBuilding = new Polygon({
                rings: geometry.coordinates[0]
            })
            const blob = new Blob([JSON.stringify(response?.data)], {
                type: "application/json"
            });
            const url = URL.createObjectURL(blob);
            let layer = new GeoJSONLayer({
                url,
                title: "GeoJson_Layer"
            }) as __esri.GeoJSONLayer;
            globalLayers.map?.allLayers.forEach((ele: any) => {
                if (ele?.title === layer.title) {
                    globalLayers.map?.remove(ele);
                }

            })

        }
    }

    return PolygonBuilding
}

export const fetchKeepOutsRoofsByParentId = async (id: string, lyrNames: string[], geometry: __esri.Geometry) => {
    let differnecGeom = geometry as any;
    const axiosRequests = lyrNames.map(async (name) => {
        const typeNames = `pvbuilding:${name}`;
        const cqlFilter = `parentid = ` + id;
        const wfs = GeoURL(typeNames, cqlFilter);
        const response = await axios.get(wfs);
        (response?.data.features as any[]).forEach(item => {
            let cutOffGeom = item.geometry;
            const diffPoly = new Polygon({
                rings: cutOffGeom.coordinates[0]
            });
            let height: number = (item.properties as { height: number }).height ? parseFloat(item.properties.height) : 0;
            const bufferGeometry: any = geometryEngine.geodesicBuffer(diffPoly, height, 'meters', true);
            differnecGeom = (geometryEngine as __esri.geometryEngine).difference(differnecGeom, bufferGeometry);

        });
    });

    await Promise.all(axiosRequests);

    const symbol = new SimpleFillSymbol(getsimpleFillSymbol([173, 150, 50, 0.5], [150, 55, 0]))
    globalLayers.selectedGraphic = getGraphic(differnecGeom, symbol, { title: 'roofboundry' })

    globalLayers.sketchLayers?.graphics.forEach(ele => {
        if (ele.attributes && ele.attributes?.title === 'roofboundry') {
            globalLayers.sketchLayers?.graphics.remove(ele);
        }
    })

    globalLayers.sketchLayers?.graphics.add(globalLayers.selectedGraphic);
    globalLayers.sketchVM.update(globalLayers.selectedGraphic);
};

// to fetch roof feature and then add the approritely to the roof 
export const fetchChildWMSLayersByParentId_roof = async (id: string) => {
    let zoom = 0;
    let firstRoof = 0;
     // Iterate over each layer name one by one, waiting for each request to complete
     for (const name of globalLayers.wmsLayers.layerNames) {
        const typeNames = name;
        const cqlFilter = `parent = ` + 1;
        
        const wfs = GeoURL_(typeNames, cqlFilter);

        try {
            // const response: AxiosResponse<geoServerObject, any> = await axios.get(wfs);
            // // Fetch data from GeoServer using axios
            // let baseHeight = 0;

            if(name.includes('roof')){
                const response: AxiosResponse<geoServerObject, any> = await axios.get(wfs);
            // Fetch data from GeoServer using axios
            let baseHeight = 0;
                const item = (response?.data.features as featureLyarGeo[])[14];

                baseHeight = parseFloat(item.properties.height);
                    if(parseFloat(item.properties.height) > 5){
                        if(parseFloat(item.properties.height) > globalLayers.wmsLayers.wms_roof_height){
                            globalLayers.wmsLayers.wms_roof_height = parseFloat(item.properties.height);
                        }
                    }

                // Extract the height property or use 0 as default
                let height: number = item.properties.height ? parseFloat(item.properties.height) : 0;

                let elevatedMterHeight = 0

                if(!name.includes('roof')){
                    const graphics = globalLayers.wmsLayers.baseLayer!.graphics.find(ele => ele.attributes.id === item.properties.parent)
                    // const h = globalLayers.wmsLayers.wms_roof_height;
                    if(graphics){
                        elevatedMterHeight = graphics.attributes.height
                    }
                    // item.properties
                }

                 // Create the polygon geometry for the graphic
                 const childWMSPolygon = new Polygon({
                    rings: (item.geometry.coordinates[0] as number[][][]).map(points => {
                        return points.map(point => {
                            return [point[0], point[1], name.includes('roof') ? 0 : elevatedMterHeight];
                        });
                    })
                });

                // Convert the coordinate system
                const convertedGeom = await globalLayers.convertCoordinateSystem(childWMSPolygon, 102100);
                if (!convertedGeom) continue;

                // Create the graphic and add it to the graphics layer
                
                const graphic = new Graphic({
                    geometry: convertedGeom,
                    // symbol: name.includes('roof') ? InfraSymbologyHeight(height) : obsctructionSymbologyHeight(height),
                    attributes: {
                        height: height,
                        title: name.includes('roof')  ? name + '' + 'building' : name,
                        name: name.includes('roof')  ? name + '' + 'building' : name,
                        id: item.properties.id
                    }
                });

                if(name.includes('roof')){
                    graphic.symbol = buildingSymbologyHeight(height)
                } 

                if(zoom === 0){
                    globalLayers.goto(28.6080805, 77.3689462)
                    zoom +=1
                }

                // globalLayers.sketchLayers.graphics.add(graphic)

                
                globalLayers.wmsLayers.baseLayer?.graphics.add(graphic);
                

            }  else {
                
                const response: AxiosResponse<geoServerObject, any> = await axios.get(wfs);
                // Fetch data from GeoServer using axios
                let baseHeight = 0;
                // Process the features and create Graphics
                for (const item of (response?.data.features as featureLyarGeo[])) {
                    // if (name.includes('roof')) {
                    //     // Set base height for RCC roof layers
                    //     baseHeight = parseFloat(item.properties.height);
                    //     if(parseFloat(item.properties.height) > 5){
                    //         if(parseFloat(item.properties.height) > globalLayers.wmsLayers.wms_roof_height){
                    //             globalLayers.wmsLayers.wms_roof_height = parseFloat(item.properties.height);
                    //         }
                    //     }
                    // }
    
                    // Extract the height property or use 0 as default
                    let height: number = item.properties.height ? parseFloat(item.properties.height) : 0;
    
                    let elevatedMterHeight = 0
    
                    if(!name.includes('roof')){
                        const graphics = globalLayers.wmsLayers.baseLayer!.graphics.find(ele => ele.attributes.id === item.properties.parent)
                        // const h = globalLayers.wmsLayers.wms_roof_height;
                        if(graphics){
                            elevatedMterHeight = graphics.attributes.height
                        }
                        // item.properties
                    }
    
                     // Create the polygon geometry for the graphic
                     const childWMSPolygon = new Polygon({
                        rings: (item.geometry.coordinates[0] as number[][][]).map(points => {
                            return points.map(point => {
                                return [point[0], point[1], name.includes('roof') ? 0 : elevatedMterHeight];
                            });
                        })
                    });
    
                    // Convert the coordinate system
                    const convertedGeom = await globalLayers.convertCoordinateSystem(childWMSPolygon, 102100);
                    if (!convertedGeom) continue;
    
                    // Create the graphic and add it to the graphics layer
                    
                    const graphic = new Graphic({
                        geometry: convertedGeom,
                        // symbol: name.includes('roof') ? InfraSymbologyHeight(height) : obsctructionSymbologyHeight(height),
                        attributes: {
                            height: height,
                            title: name.includes('roof')  ? name + '' + 'building' : name,
                            name: name.includes('roof')  ? name + '' + 'building' : name,
                            id: item.properties.id
                        }
                    });
    
                    if(name.includes('roof')){
                        graphic.symbol = buildingSymbologyHeight(height)
                    } else if(name.includes('existing')){
                        graphic.symbol = solarPaneExistingSymbologywithHeight(height)
                    } else if(name.includes('water_tanks')){
                        graphic.symbol = InfraSymbologyHeight(height)   
                    }else if(name.includes('mumty_structure')){
                        graphic.symbol = mumtyStructureSymbologywithHeight(height)
                    } 
                    else if(name.includes('hvac_equipment')){
                        graphic.symbol = hvacSymbologywithHeight(height)
                    } 
                    else if(name.includes('pipelines')){
                        graphic.symbol = pipelineSymbologywithHeight(height)
                    } 
                    else {
                        graphic.symbol = papapetSymbologyHeight(height)
                    }
    
                    if(zoom === 0){
                        globalLayers.goto(28.6080805, 77.3689462)
                        zoom +=1
                    }
    
                    // globalLayers.sketchLayers.graphics.add(graphic)
    
                    if(elevatedMterHeight > 0 && !name.includes('roof')){
                        globalLayers.wmsLayers.baseLayer?.graphics.add(graphic);
                        // globalLayers.sketchLayers.graphics.add(graphic)
                    }
                    // if(firstRoof === 0){
                    //     globalLayers.wmsLayers.baseLayer?.graphics.add(graphic);
                    //     // globalLayers.sketchLayers.graphics.add(graphic)
                    //     firstRoof += 1
                    // }
                }
            }

    

        } catch (error) {
            console.error(`Error fetching data for layer ${name}:`, error);
        }
    }
};

// export const fetchChildWMSLayersByParentId_roof_All = async (id: string) => {
//     let zoom = 0;
//     let firstRoof = 0;
//     let id_ = globalLayers.selectedRoof.objectid;
//     const roofFeatures: featureLyarGeo[] = []; // Store roof features
     
//     // First, fetch the roof layer
//     const roofLayerName = "pvlayers:roof";
//     const roofWfsUrl = GeoURL_(roofLayerName, id);

//     try {
//         const roofResponse: AxiosResponse<geoServerObject, any> = await axios.get(roofWfsUrl);
//         // Store roof features for later use
//         roofFeatures.push(...(roofResponse?.data.features as featureLyarGeo[]));

//         // Process each roof feature to determine base height
//         for (const item of roofFeatures) {
//             if (parseFloat(item.properties.height) > 5) {
//                 if (parseFloat(item.properties.height) > globalLayers.wmsLayers.wms_roof_height) {
//                     globalLayers.wmsLayers.wms_roof_height = parseFloat(item.properties.height);
//                 }
//             }
//         }

//         // Now, iterate over each non-roof layer
//         for (const name of globalLayers.wmsLayers.layerNames) {
//             if (name === roofLayerName) continue; // Skip the roof layer

//             const typeNames = name;
//             // const wfs = GeoURL_(typeNames, id); // Use the same id for other layers
//             // Use the roof ID for non-roof layers
//             const roofId = roofFeatures[0]?.properties.id; // Get the first roof ID
//             const wfs = GeoURL_(typeNames, roofId); // Use the roof ID for other layer

//             try {
//                 const response: AxiosResponse<geoServerObject, any> = await axios.get(wfs);

//                 for (const item of (response?.data.features as featureLyarGeo[])) {
//                     let elevatedMterHeight = 0;

//                     // Use the roof features to determine height for non-roof layers
//                     const roofFeature = roofFeatures.find(r => r.properties.id === item.properties.parent);
//                     if (roofFeature) {
//                         elevatedMterHeight = parseFloat(roofFeature.properties.height);
//                     }

//                     // Create the polygon geometry for the graphic
//                     const childWMSPolygon = new Polygon({
//                         rings: (item.geometry.coordinates[0] as number[][][]).map(points => {
//                             return points.map(point => {
//                                 return [point[0], point[1], name.includes('roof') ? 0 : elevatedMterHeight];
//                             });
//                         })
//                     });

//                     // Convert the coordinate system
//                     const convertedGeom = await globalLayers.convertCoordinateSystem(childWMSPolygon, 102100);
//                     if (!convertedGeom) continue;

//                     // Create the graphic and add it to the graphics layer
//                     const height: number = item.properties.height ? parseFloat(item.properties.height) : 0;
//                     const graphic = new Graphic({
//                         geometry: convertedGeom,
//                         attributes: {
//                             height: height,
//                             title: name.includes('roof') ? name + ' building' : name,
//                             name: name.includes('roof') ? name + ' building' : name,
//                             id: item.properties.id
//                         }
//                     });

//                     // Set the graphic symbol based on layer name
//                     if (name.includes('roof')) {
//                         graphic.symbol = buildingSymbologyHeight(height);
//                     } else if (name.includes('existing')) {
//                         graphic.symbol = solarPaneExistingSymbologywithHeight(height);
//                     } else if (name.includes('water_tanks')) {
//                         graphic.symbol = InfraSymbologyHeight(height);
//                     } else if (name.includes('mumty_structure')) {
//                         graphic.symbol = mumtyStructureSymbologywithHeight(height);
//                     } else if (name.includes('hvac_equipment')) {
//                         graphic.symbol = hvacSymbologywithHeight(height);
//                     } else if (name.includes('pipelines')) {
//                         graphic.symbol = pipelineSymbologywithHeight(height);
//                     } else {
//                         graphic.symbol = papapetSymbologyHeight(height);
//                     }

//                     // Add the graphic to the base layer
//                     globalLayers.wmsLayers.baseLayer!.graphics.add(graphic);
//                 }

//             } catch (error) {
//                 console.error(`Error fetching data for layer ${name}:`, error);
//             }
//         }
        
//     } catch (error) {
//         console.error(`Error fetching roof layer data:`, error);
//     }

    
//     // Iterate over each layer name one by one, waiting for each request to complete


//     //  for (const name of globalLayers.wmsLayers.layerNames) {
//     //     const typeNames = name;
//     //     const cqlFilter = id;
//     //     const wfs = GeoURL_(typeNames, cqlFilter);

//     //     try {
//     //         // const response: AxiosResponse<geoServerObject, any> = await axios.get(wfs);
//     //         // // Fetch data from GeoServer using axios
//     //         let baseHeight = 0;

//     //         const response: AxiosResponse<geoServerObject, any> = await axios.get(wfs);
//     //         // Fetch data from GeoServer using axios
//     //         // Process the features and create Graphics
//     //         for (const item of (response?.data.features as featureLyarGeo[])) {
//     //             if (name.includes('roof')) {
//     //                 // Set base height for RCC roof layers
//     //                 baseHeight = parseFloat(item.properties.height);
//     //                 if(parseFloat(item.properties.height) > 5){
//     //                     if(parseFloat(item.properties.height) > globalLayers.wmsLayers.wms_roof_height){
//     //                         globalLayers.wmsLayers.wms_roof_height = parseFloat(item.properties.height);
//     //                     }
//     //                 }
//     //             }

//     //             // Extract the height property or use 0 as default
//     //             let height: number = item.properties.height ? parseFloat(item.properties.height) : 0;

//     //             let elevatedMterHeight = 0

//     //             if(!name.includes('roof')){
//     //                 const graphics = globalLayers.wmsLayers.baseLayer!.graphics.find(ele => ele.attributes.id === item.properties.parent)
//     //                 if(graphics){
//     //                     elevatedMterHeight = graphics.attributes.height
//     //                 }
//     //             }

//     //              // Create the polygon geometry for the graphic
//     //              const childWMSPolygon = new Polygon({
//     //                 rings: (item.geometry.coordinates[0] as number[][][]).map(points => {
//     //                     return points.map(point => {
//     //                         return [point[0], point[1], name.includes('roof') ? 0 : elevatedMterHeight];
//     //                     });
//     //                 })
//     //             });

//     //             // Convert the coordinate system
//     //             const convertedGeom = await globalLayers.convertCoordinateSystem(childWMSPolygon, 102100);
//     //             if (!convertedGeom) continue;

//     //             // Create the graphic and add it to the graphics layer
                
//     //             const graphic = new Graphic({
//     //                 geometry: convertedGeom,
//     //                 attributes: {
//     //                     height: height,
//     //                     title: name.includes('roof')  ? name + '' + 'building' : name,
//     //                     name: name.includes('roof')  ? name + '' + 'building' : name,
//     //                     id: item.properties.id
//     //                 }
//     //             });

//     //             if(name.includes('roof')){
//     //                 graphic.symbol = buildingSymbologyHeight(height)
//     //             } else if(name.includes('existing')){
//     //                 graphic.symbol = solarPaneExistingSymbologywithHeight(height)
//     //             } else if(name.includes('water_tanks')){
//     //                 graphic.symbol = InfraSymbologyHeight(height)
//     //             }else if(name.includes('mumty_structure')){
//     //                 graphic.symbol = mumtyStructureSymbologywithHeight(height)
//     //             } 
//     //             else if(name.includes('hvac_equipment')){
//     //                 graphic.symbol = hvacSymbologywithHeight(height)
//     //             } 
//     //             else if(name.includes('pipelines')){
//     //                 graphic.symbol = pipelineSymbologywithHeight(height)
//     //             } 
//     //             else {
//     //                 graphic.symbol = papapetSymbologyHeight(height)
//     //             }

//     //             // if(zoom === 0){
//     //             //     // globalLayers.goto(28.6080805, 77.3689462)
//     //             //     zoom +=1
//     //             // }

//     //             globalLayers.wmsLayers.baseLayer!.graphics.add(graphic)
//     //         }

        

//     //     } catch (error) {
//     //         console.error(`Error fetching data for layer ${name}:`, error);
//     //     }
//     // }
// };

export const fetchChildWMSLayersByParentId_roof_All = async (id: string) => {
    globalLayers.activeView = '3D';
    const roofLayerName = "pvlayers:roof";
    const roofWfsUrl = GeoURL_(roofLayerName, id);
    
    try {
        const roofResponse: AxiosResponse<geoServerObject, any> = await axios.get(roofWfsUrl);
        const roofFeatures: featureLyarGeo[] = roofResponse?.data.features as featureLyarGeo[];

        // Iterate over each roof feature
        for (const roofFeature of roofFeatures) {
            const roofId = roofFeature.properties.id;
            const baseHeight = parseFloat(roofFeature.properties.height) || 0;

            // Process the roof graphic
            const roofPolygon = new Polygon({
                rings: (roofFeature.geometry.coordinates[0] as number[][][]).map(points => {
                    return points.map(point => [point[0], point[1], 0]);
                })
            });

            const convertedRoofGeom = await globalLayers.convertCoordinateSystem(roofPolygon, 102100);
            if (!convertedRoofGeom) continue;

            const roofGraphic = new Graphic({
                geometry: convertedRoofGeom,
                attributes: {
                    height: baseHeight,
                    title: `${roofLayerName}_building_`,
                    name: `${roofLayerName}_building`,
                    id: roofId,
                    elevation: 0
                },
                symbol: buildingSymbologyHeight(baseHeight)
            });

            globalLayers.sketchLayers.graphics.add(roofGraphic);

            // Now, fetch the non-roof layers for this roof feature
            for (const name of globalLayers.wmsLayers.layerNames) {
                if (name === roofLayerName) continue; // Skip roof layer since it's already processed

                // Use the current roofId for non-roof layers
                const wfs = GeoURL_(name, roofId);

                try {
                    const response: AxiosResponse<geoServerObject, any> = await axios.get(wfs);
                    const features = response?.data.features as featureLyarGeo[];

                    for (const item of features) {
                        let elevatedMterHeight = baseHeight; // Set height relative to the roof's base height

                        // Create the polygon geometry for the graphic
                        const childWMSPolygon = new Polygon({
                            rings: (item.geometry.coordinates[0] as number[][][]).map(points => {
                                return points.map(point => [point[0], point[1], elevatedMterHeight]);
                            })
                        });

                        // Convert the coordinate system
                        const convertedGeom = await globalLayers.convertCoordinateSystem(childWMSPolygon, 102100);
                        if (!convertedGeom) continue;

                        // Create the graphic and set the appropriate symbol
                        const height = item.properties.height ? parseFloat(item.properties.height) : 0;
                        const graphic = new Graphic({
                            geometry: convertedGeom,
                            attributes: {
                                height: height,
                                title: name,
                                name: name,
                                id: item.properties.id,
                                elevation: baseHeight
                            }
                        });

                        // Apply the appropriate symbology based on the layer type
                        if (name.includes('existing')) {
                            graphic.symbol = solarPaneExistingSymbologywithHeight(height);
                        } else if (name.includes('water_tanks')) {
                            graphic.symbol = InfraSymbologyHeight(height);
                        } else if (name.includes('mumty_structure')) {
                            graphic.symbol = mumtyStructureSymbologywithHeight(height);
                        } else if (name.includes('hvac_equipment')) {
                            graphic.symbol = hvacSymbologywithHeight(height);
                        } else if (name.includes('pipelines')) {
                            graphic.symbol = pipelineSymbologywithHeight(height);
                        } else {
                            graphic.symbol = papapetSymbologyHeight(height);
                        }

                        // Add the graphic to the base layer
                        // globalLayers.wmsLayers.baseLayer!.graphics.add(graphic);
                        globalLayers.sketchLayers.graphics.add(graphic);
                    }

                } catch (error) {
                    console.error(`Error fetching data for layer ${name}:`, error);
                }
            }
        }

        if(globalLayers.sketchViewModel_Draw.activeTool){
            globalLayers.sketchViewModel_Draw.cancel()
        }
        
    } catch (error) {
        console.error(`Error fetching roof layer data:`, error);
    }
};


export const fetchChildWMSLayersByParentId = async (id: string) => {

    // Create an array of axios requests
    const axiosRequests = globalLayers.wmsLayers.layerNames.map(async (name) => {
        const typeNames = name;
        const cqlFilter = `parent = ` + id;
        
        const wfs = GeoURL_(typeNames, cqlFilter);

        // Fetch data from GeoServer using axios
        const response: AxiosResponse<geoServerObject, any> = await axios.get(wfs);
        const graphics: Graphic[] = [];
        let baseHeight = 0;

    
        // Process the features and create Graphics
        (response?.data.features as featureLyarGeo[]).forEach(async (item) => {
            if(name.includes('rcc')){
                // globalLayers.selectedRoof.properties.height = item.properties.height
                baseHeight = parseFloat(item.properties.height)
            }
            // Create the polygon geometry for the graphic
            const childWMSPolygon = new Polygon({
                rings: (item.geometry.coordinates[0] as number[][][]).map(points => {
                    return points.map(point => {
                        return [point[0], point[1], name.includes('rcc') ? 0 : baseHeight]
                    })
                })
            });

            // change the coordinate system 
            const convertedGeom = await globalLayers.convertCoordinateSystem(childWMSPolygon, 102100);
            if(!convertedGeom) return;

            // Extract the height property or use 0 as default
            const height: number = item.properties.height ? parseFloat(item.properties.height) : 0;

            // Create the graphic and push it into the array
            const graphic = new Graphic({
                geometry: convertedGeom,
                symbol: obsctructionSymbologyHeight(height),
                attributes: {
                    height: height,
                    title: name,
                    name
                }
            });

            globalLayers.wmsLayers.baseLayer?.graphics.add(graphic)
            
        });
    });

    await Promise.all(axiosRequests);
};
