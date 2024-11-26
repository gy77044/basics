import Geometry from "@arcgis/core/geometry/Geometry";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as projection from "@arcgis/core/geometry/projection.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer";
import { FillSymbol3DLayer, PolygonSymbol3D } from "@arcgis/core/symbols";
import { normalizeDuration0_1 } from "../../../Utils/Converts/normaliseDuration";
import { downloadFileAnchor } from "../../../Utils/Download/downloadLink";
import globalLayers from "../../../Utils/EPCMaps/Maps/GlobaLMap";
import { areIntersectingGeometry } from "../GeometryOperations/isIntersecting";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { groupAndMergePolygonsByDuration } from "./groupingMerging";

// Define duration ranges and colors for each group
const GROUP_1_COLOR = "green";  
const GROUP_2_COLOR = "orange";
const GROUP_3_COLOR = "red";    
const GROUP_4_COLOR = "red";    


// Calculate shadow heatmap points for a 3D extruded building's top and sides
async function calculate3DHeatmapPoints_(view: __esri.SceneView, buildingPolygon: __esri.Polygon, height: number) {
  const extent = buildingPolygon.extent;
  const gap = Math.max((extent.xmax - extent.xmin) / 50, 1); // Adjust the gap to control the resolution of the heatmap points
  const heatIntensityData = [] as any[];

  let minDuration = Infinity;
  let maxDuration = -Infinity;

  // Create grid points across the building's top and sides
  for (let x = extent.xmin; x <= extent.xmax; x += gap) {
    for (let y = extent.ymin; y <= extent.ymax; y += gap) {
      // Top surface point
      const topPoint = {
        geometry: {
          type: "point",
          x: x,
          y: y,
          z: height,
          spatialReference: extent.spatialReference
        },
        type: "top"
      };

      // Calculate shadow duration for the top surface
      const topDuration = await getShadowDuration_(view, topPoint.geometry as any);
      heatIntensityData.push({ geometry: topPoint.geometry, value: topDuration });

      if (topDuration < minDuration) minDuration = topDuration;
      if (topDuration > maxDuration) maxDuration = topDuration;

      // For each vertical side, generate points at varying heights (Z axis)
      for (let z = 0; z <= height; z += gap) {
        const sidePoints = [
          { x: extent.xmin, y: y, z: z }, // Left side
          { x: extent.xmax, y: y, z: z }, // Right side
          { x: x, y: extent.ymin, z: z }, // Front side
          { x: x, y: extent.ymax, z: z }  // Back side
        ];

        for (const point of sidePoints) {
          const sidePoint = {
            geometry: {
              type: "point",
              x: point.x,
              y: point.y,
              z: point.z,
              spatialReference: extent.spatialReference
            },
            type: "side"
          };

          // Calculate shadow duration for each side point
          const sideDuration = await getShadowDuration_(view, sidePoint.geometry as any);
          heatIntensityData.push({ geometry: sidePoint.geometry, value: sideDuration });

          if (sideDuration < minDuration) minDuration = sideDuration;
          if (sideDuration > maxDuration) maxDuration = sideDuration;
        }
      }
    }
  }

  return { heatIntensityData, minDuration, maxDuration };
}
// Visualize the heatmap on the building's surfaces
export async function create3DHeatmap(view: __esri.SceneView, buildingPolygon: __esri.Polygon, defaultHeight: number) {
  const { heatIntensityData, maxDuration, minDuration } = await calculate3DHeatmapPoints_(view, buildingPolygon, defaultHeight);

  const pointGraphics = [] as __esri.Graphic[];
  let objectIdCounter = 1;

  heatIntensityData.forEach(intensityZone => {
    const heatGraphic = new Graphic({
      geometry: intensityZone.geometry,
      attributes: {
        duration: intensityZone.value,
        ObjectID: objectIdCounter++
      }
    });

    pointGraphics.push(heatGraphic);
  });

  // Define color stops for heatmap visualization
  const colorStops = [
    { ratio: 0, color: "rgba(25, 43, 51, 0.6)" },  // Low shadow duration (more sunlight)
    { ratio: 0.3, color: "rgba(30, 140, 160, 1)" },
    { ratio: 0.5, color: "rgba(58, 165, 140, 1)" },
    { ratio: 0.7, color: "rgba(78, 230, 194, 1)" },
    { ratio: 1, color: "rgba(158, 255, 233, 1)" }  // High shadow duration (more shadows)
  ];

  // Create HeatmapRenderer for shadow intensity
  const heatmapRenderer = new HeatmapRenderer({
    field: "duration",
    colorStops: colorStops,
    minDensity: minDuration,
    maxDensity: maxDuration,
    radius: 20  // Adjust radius for smoothness of heatmap
  });

  // Create a FeatureLayer for rendering heatmap
  const heatmapLayer = new FeatureLayer({
    source: pointGraphics,
    renderer: heatmapRenderer,
    objectIdField: "ObjectID",
    spatialReference: view.spatialReference
  });

  // Add the heatmap layer to the map
  view.map.add(heatmapLayer);
}

// Mockup function for calculating shadow duration
async function getShadowDuration_(view: __esri.SceneView, geometry: __esri.Geometry): Promise<number> {
  // Placeholder for actual shadow analysis logic, you can implement your own or use the shadowCastWidget
  // Example: Calculate sun position, check occlusion, etc.
  return Math.random() * 100;  // Mockup random shadow duration for demonstration
}



function millisecondsToHours(milliseconds: number): number {
  const hours = milliseconds / (1000 * 60 * 60);
  return parseFloat(hours.toFixed(2)); // Rounded to 2 decimal places
}


// Add heatmap to building function
export async function addHeatmapToBuilding(buildingPolygon: Graphic, defaultHeight: number) {
  // console.log(globalLayers.map?.allLayers)
  // Wait for all heat intensity data to be calculated

  await projection.load();
  const { heatIntensityData, maxDuration, minDuration, durations } = await calculateHeatIntensityOnBuilding(buildingPolygon.geometry as Polygon, defaultHeight);
  let pOintCol = [] as any[]
  let polyCollection = [] as Graphic[]

  // Normalize intensity values to range between 0 and 1
  function normalizeIntensity(value: number, min: number, max: number): number {
    return (value - min) / (max - min);
  }


  heatIntensityData.forEach(intensityZone => {
    let objectIdCounter = 1; // Start ObjectID counter
    let { colA, colB, colG, colR } = calculateColor(intensityZone.value)
    const heatSymbol = new PolygonSymbol3D({
      symbolLayers: [
        new FillSymbol3DLayer({
          material: {
            color: [colR, colG, colB, colA] // Use gradient-based color
          },
        })
      ]
    });

    // const heatGraphic = new Graphic({
    //   geometry: intensityZone.geometry.centroid, // Use the centroid of each polygon
    //   attributes: {
    //     duration: intensityZone.value,
    //     // duration: normalizeIntensity(intensityZone.value, minDuration, maxDuration),
    //     ObjectID: objectIdCounter++,
    //     name: 'shadowPoint',
    //     // duration: Math.random() * 10,
    //   }
    // });

    // pOintCol.push(heatGraphic);



    // each grouping based on duartion above code is working 
    const heatPolygonGraphic = new Graphic({
      geometry: intensityZone.geometry, // Use the centroid of each polygon
      attributes: {
        duration: intensityZone.value,
        height: intensityZone.height
      }
    }); 

    polyCollection.push(heatPolygonGraphic)

  });



  //// grouping based on the duartion 
    // const {group1, group2, group3, group4} = groupPolygonsByNormalizedDuration(polyCollection)
    const group = groupAndMergePolygonsByDuration(polyCollection, 7)
    // areIntersectingGraphics() // check if graphci are intersecting sides 

    // Merge polygons in each group based on adjacency
    // const mergedGroup1 = mergeAdjacentPolygons(group1); // green 
    // const firstGroup = mergedGroup1.map(ele => {
    //   return new Graphic({
    //     geometry: ele,
    //     symbol: {
    //       type: "simple-fill", // esri symbol type for polygons
    //       color: '#64145a',
    //       outline: {
    //         width: 0
    //       }
    //     } as any
    //   })
    // })

    // const mergedGroup2 = mergeAdjacentPolygons(group2); // orange
    // const firstGroup2 = mergedGroup2.map(ele => {
    //   return new Graphic({
    //     geometry: ele,
    //     symbol: {
    //       type: "simple-fill", // esri symbol type for polygons
    //       color: [255, 255, 0, 0.7],
    //       outline: {
    //         width: 0
    //       }
    //     } as any
    //   })
    // })


    // const mergedGroup3 = mergeAdjacentPolygons(group3); // red
    // const firstGroup3 = mergedGroup3.map(ele => {
    //   return new Graphic({
    //     geometry: ele,
    //     symbol: {
    //       type: "simple-fill", // esri symbol type for polygons
    //       color:  [255,0, 0, 0.9],
    //       outline: {
    //         width: 0
    //       }
    //     } as any
    //   })
    // })

    // const mergedGroup4 = mergeAdjacentPolygons(group4); // red
    // const firstGroup4 = mergedGroup4.map(ele => {
    //   return new Graphic({
    //     geometry: ele,
    //     symbol: {
    //       type: "simple-fill", // esri symbol type for polygons
    //       color: [ 255,0, 0, 0.9 ],
    //       outline: {
    //         width: 0
    //       }
    //     } as any
    //   })
    // })

    // // const newMergedGraphics = [...firstGroup, ...firstGroup4]
    // const newMergedGraphics = [...firstGroup2, ...firstGroup3, ...firstGroup4, ...firstGroup]


    globalLayers.shadowLayer = new GraphicsLayer({
      title: 'Shadow',
      graphics: group
    })
    // globalLayers.sketchLayers.graphics.addMany(newMergedGraphics)

  ////




  // Ensure the shadowLayer is visible and part of the view
  // if (!globalLayers.view?.map.layers.includes(globalLayers.shadowLayer!)) {
  globalLayers.view?.map.add(globalLayers.shadowLayer!);

  // const colorStops = [
  //   { ratio: 0 / 12, color: "rgba(25, 43, 51, 0.6)" },
  //   { ratio: 2 / 12, color: "rgba(30, 140, 160, 1)" },
  //   { ratio: 3 / 12, color: "rgba(58, 165, 140, 1)" },
  //   { ratio: 4 / 12, color: "rgba(64, 184, 156, 1)" },
  //   { ratio: 5 / 12, color: "rgba(68, 199, 168, 1)" },
  //   { ratio: 6 / 12, color: "rgba(73, 214, 181, 1)" },
  //   { ratio: 7 / 12, color: "rgba(78, 230, 194, 1)" },
  //   { ratio: 8 / 12, color: "rgba(83, 245, 207, 1)" },
  //   { ratio: 9 / 12, color: "rgba(85, 250, 211, 1)" },
  //   { ratio: 10 / 12, color: "rgba(102, 255, 219, 1)" },
  //   { ratio: 11 / 12, color: "rgba(121, 237, 210, 1)" },
  //   { ratio: 12 / 12, color: "rgba(158, 255, 233, 1)" }
    
  // ]; 

  // globalLayers.heatMapRender = new HeatmapRenderer({
  //   colorStops: colorStops,
  //   minDensity: 0,
  //   maxDensity: 0.0035,
  //   radius: 45,
  //   referenceScale: globalLayers.view?.scale//globalLayers.view?.scale
  // });




  // console.log(polyCollection.length)

  const shadowFeatureLayer = new FeatureLayer({
    source: polyCollection,
    objectIdField: "ObjectID",
    title: "Heat Map",
    renderer: globalLayers.heatMapRender,
    opacity: 1,
  });
  
  // shadowFeatureLayer.renderer = heatmapRenderer as any;
  // globalLayers.view?.map.layers.add(shadowFeatureLayer)

  // setTimeout(() => {
  //   // downloadGeoJSON(shadowFeatureLayer)
  // },2000)

  // If needed, manually refresh the view by interacting with it
  // globalLayers.view?.goTo(globalLayers.view.extent.expand(1.001)); // Triggers re-render by zooming out slightly
}

async function calculateHeatIntensityOnBuilding(geometry: Polygon, height: number) {
  const extent = geometry.extent;
  // const gap = 0.3; // Smaller gap for smaller polygons (e.g., 0.5 meters)
  // const gap = Math.max((extent.xmax - extent.xmin) / 100, 0.5); // Smaller gap for smaller polygons (e.g., 0.5 meters)
  const gap = 0.25; // Smaller gap for smaller polygons (e.g., 0.5 meters)
  const heatIntensityData = [] as { geometry: Polygon, value: number, height: number}[]// The smaller grid polygon


  let minDuration = Infinity;
  let maxDuration = -Infinity;

  let durations = [] as number[]
  // Generate smaller grid polygons across the building's surface
  for (let x = extent.xmin; x <= extent.xmax; x += gap) {
    for (let y = extent.ymin; y <= extent.ymax; y += gap) {
      const polygon = new Polygon({
        rings: [
          [
            [x, y, height + 0.02],
            [x + gap, y, height + 0.02],
            [x + gap, y + gap, height + 0.02],
            [x, y + gap, height + 0.02],
            [x, y, height + 0.02]
          ]
        ],
        spatialReference: extent.spatialReference
      });
      // console.log('pol')
      // Ensure the polygon is on the building surface
      if (geometryEngine.contains(geometry, polygon)) {
        const screenPoint = globalLayers.view!.toScreen(polygon.centroid);
        if (globalLayers.shadowCastWidget?.visible) {
          try {
          
            // Await the duration for each smaller polygon
            const duration: number = await (globalLayers.shadowCastWidget.viewModel as any).getDuration(screenPoint);
            heatIntensityData.push({
              geometry: polygon, // The smaller grid polygon
              value: duration,   // Shadow duration as heat value
              height: height     // Use same height as the building
            });
            // Track min and max durations
            if (duration < minDuration) minDuration = duration;
            if (duration > maxDuration) maxDuration = duration;
            durations.push(duration)

          } catch (error) {
            console.error("Error in getDuration:", error);
          }
        }
      }
    }
  }

  // Return heatIntensityData with min and max duration values
  return { heatIntensityData, minDuration, maxDuration, durations };
}

function calculateColor(intensityValue: number) {
  let hours = millisecondsToHours(intensityValue); // Convert milliseconds to hours
  let minutes = hours * 60; // Convert hours to minutes

  let colR = 0, colG = 0, colB = 0, colA = 1; // Alpha is fixed at 1 for full opacity

  // Define the interval in minutes (can be any value, e.g., 30 for 30-minute intervals)
  const minutesInterval = 5;
  const maxHours = 8; // Set the maximum hours (e.g., 8 hours)
  const maxMinutes = maxHours * 60; // Convert max hours to minutes (e.g., 480 minutes)
  const totalIntervals = maxMinutes / minutesInterval; // Calculate total possible intervals

  // Calculate the current interval based on the given minutes value
  let interval = Math.floor(minutes / minutesInterval); // Determine in which interval the current minutes fall

  // Clamp the interval to be within the range (0 to totalIntervals)
  interval = Math.min(interval, totalIntervals);

  // Interpolation logic for shadow duration visualization
  if (interval >= 0 && interval < totalIntervals / 2) {
    // Transition from yellow (255, 255, 0) to orange (247, 124, 30) for lower shadow durations
    const ratio = interval / (totalIntervals / 2);
    colR = Math.floor(255 - (8 * ratio));  // Interpolate Red between 255 (yellow) to 247 (orange)
    colG = Math.floor(255 - (131 * ratio)); // Interpolate Green between 255 (yellow) to 124 (orange)
    colB = Math.floor(0 + (30 * ratio));  // Interpolate Blue between 0 (yellow) to 30 (orange)
  } else if (interval >= totalIntervals / 2 && interval <= totalIntervals) {
    // Transition from orange (247, 124, 30) to red (255, 0, 0) for higher shadow durations
    const ratio = (interval - totalIntervals / 2) / (totalIntervals / 2);
    colR = Math.floor(247 + (8 * ratio));  // Interpolate Red between 247 (orange) to 255 (red)
    colG = Math.floor(124 - (124 * ratio)); // Interpolate Green between 124 (orange) to 0 (red)
    colB = Math.floor(30 - (30 * ratio));  // Interpolate Blue between 30 (orange) to 0 (red)
  }

  return {
    colR,
    colG,
    colB,
    colA
  }
}



type JsonGeo = {
  type: string,
  geometry: {
    type: string,
    coordinates: number[][][]
  },
  properties: {}
}

// Function to convert features to GeoJSON and download
async function downloadGeoJSON(layer: FeatureLayer) {
  // Extract the features from the FeatureLayer

  let collection = [] as JsonGeo[]
  await projection.load()
  
  layer.source.forEach((graphic) => {

    const outSpatialReference = new SpatialReference({ wkid: 4326 });
    const convertedGeometry = projection.project(graphic.geometry, outSpatialReference);
    if (convertedGeometry) {
      let FeaturePoint = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: (convertedGeometry as Polygon).rings,
        },
        properties: graphic.attributes
      } as JsonGeo
      collection.push(FeaturePoint)
    }
  })
  // Create GeoJSON structure
  const geojson = {
    type: "FeatureCollection",
    features: collection
  };
 
  // Convert GeoJSON to string for download
  const geojsonString = JSON.stringify(geojson);

  downloadFileAnchor(geojsonString);
}


function groupPolygonsByNormalizedDuration(polygonCollection: Graphic[]) {
  const group1 = polygonCollection.filter(polygon => {
    // const normalizedDuration = normalizeDuration0_1(polygon.attributes.duration);
    // return normalizedDuration >= 0 && normalizedDuration <= 0.5;
    return polygon.attributes.duration >= 0 && polygon.attributes.duration <= 3600000;  // 0 to 1 hours
  });

  const group1_ = polygonCollection.filter(polygon => {
    // const normalizedDuration = normalizeDuration0_1(polygon.attributes.duration);
    // return normalizedDuration >= 0 && normalizedDuration <= 0.5;
    return polygon.attributes.duration >= 3600000 && polygon.attributes.duration <= 10800000;  // 1 to 3 hours
  });


  
  const group2 = polygonCollection.filter(polygon => {
    // const normalizedDuration = normalizeDuration0_1(polygon.attributes.duration);
    // return normalizedDuration > 0.5 && normalizedDuration <= 0.6;
    return polygon.attributes.duration > 10800000 && polygon.attributes.duration <= 18000000;  // 3 to 5 hour
  });

  const group3 = polygonCollection.filter(polygon => {
    // const normalizedDuration = normalizeDuration0_1(polygon.attributes.duration);
    // return normalizedDuration > 0.5 && normalizedDuration <= 0.6;
    return polygon.attributes.duration > 18000000 && polygon.attributes.duration <= 19800000; // 5 to 6 
  });
  
  const group4 = polygonCollection.filter(polygon => {
    // const normalizedDuration = normalizeDuration0_1(polygon.attributes.duration);
    // return normalizedDuration > 0.6 && normalizedDuration <= 1;
    return polygon.attributes.duration > 19800000   // over 6
  });

  return { group1, group2, group3, group4 };
}