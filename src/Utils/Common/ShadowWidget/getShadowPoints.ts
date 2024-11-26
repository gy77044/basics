import Geometry from "@arcgis/core/geometry/Geometry";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import globalLayers from "../../EPCMaps/Maps/GlobaLMap";
// import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
// import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer.js";


const colors = ["rgba(115, 0, 115, 0)", "#820082", "#910091", "#a000a0", "#af00af", "#c300c3", "#d700d7", "#eb00eb", "#ff00ff", "#ff58a0", "#ff896b", "#ffb935", "#ffea00"];

export const updateShadowPointsRender = async () => {
    const building = globalLayers.getGraphicbyItsName('building')
    if(globalLayers.graphicUnion && building){
        const height = building.getAttribute('height') ? building.getAttribute('height') : building.getAttribute('buildingheight') ? building.getAttribute('buildingheight') : 0;
        await getShadowPoints(globalLayers.graphicUnion, height)
    }
}

export async function getShadowPoints(geometry: Geometry, height: number) {
    // console.log(geometry, 'geometry')
    globalLayers.shadowLayer?.graphics.removeAll(); // Clear existing graphics

    // const [HeatmapRenderer, FeatureLayer] = await loadEsriModules(["esri/renderers/HeatmapRenderer", "esri/layers/FeatureLayer"])

    let minDuration = Infinity;
    let maxDuration = -Infinity;
    let durations = [] as number[]
    const extent = geometry.extent;
    const gap = 2; // Gap between points in meters
    const points = [];

    let objectIdCounter = 1; // Start ObjectID counter

    // Generate points within the view's extent with a gap of 5 meters
    for (let x = extent.xmin; x <= extent.xmax; x += gap) {
        for (let y = extent.ymin; y <= extent.ymax; y += gap) {
            const point = new Point({
                x: x,
                y: y,
                z: 10,
                spatialReference: extent.spatialReference
            });
            // Only add points that are within the building's boundary
            if (geometryEngine.contains(geometry.extent, point)) {
                points.push(point);
            }
        }
    }

    

    const pointGraphicCollection = [] as Graphic[]
    // Use the getDuration function to calculate shadow duration
    for(let point of points){
        const screenPoint = globalLayers.view?.toScreen(point) as __esri.SceneViewScreenPoint;
        if(globalLayers.shadowCastWidget?.visible){
            // const duration : number =   await (globalLayers.shadowCastWidget as any).viewModel.getDuration(screenPoint)
            const duration: number = await (globalLayers.shadowCastWidget.viewModel as any).getDuration(screenPoint);
                 // Track min and max durations
            // console.log(duration, 'duration')
            if (duration < minDuration) minDuration = duration;
            if (duration > maxDuration) maxDuration = duration;
         
            durations.push(duration)
            // .then((duration: any) => {
                // console.log(duration, 'duration')
            const color = getColorForDuration(duration);
            const pointGraphic = new Graphic({
                geometry: point,
                attributes: {
                    name: 'shadowPoint',
                    duration,
                    ObjectID: objectIdCounter++, 
                },
                symbol: {
                    type: "simple-marker",
                    color: color,
                    size: "6px"
                } as __esri.SymbolProperties
            });
            console.log(pointGraphic, 'point')
            pointGraphicCollection.push(pointGraphic)
            
            // globalLayers.shadowLayer?.graphics.add(pointGraphic)

            // });
        }
    }
    

    // console.log(durations)
    minDuration = Math.min(...durations);
    maxDuration = Math.max(...durations);

    // Function to normalize duration into a ratio between 0 and 1
    function normalizeDuration(duration: number) {
        return (duration - minDuration) / (maxDuration - minDuration);
    }

    // Generate colorStops based on the duration array
    const colorStops = durations.map((duration) => {
        const ratio = normalizeDuration(duration);
        // console.log(ratio, 'ratio')
        return {
            ratio: ratio, // Normalized value between 0 and 1
            color: getColorForRatio(ratio), 
        };
    });


    // const colorStops_ = durations.map((duration) => {
    //     const ratio = normalizeDuration(duration);
    //     return {
    //         ratio: normalizeDuration(ratio), // Normalized value between 0 and 1
    //         color: getColorForRatio(ratio), // Function to get a color based on the ratio
    //     };
    // });

    const colorStops_ex = [
        { ratio: 0 / 12, color: "rgba(25, 43, 51, 0.6)" },
        { ratio: 2 / 12, color: "rgba(30, 140, 160, 1)" },
        { ratio: 3 / 12, color: "rgba(58, 165, 140, 1)" },
        { ratio: 4 / 12, color: "rgba(64, 184, 156, 1)" },
        { ratio: 5 / 12, color: "rgba(68, 199, 168, 1)" },
        { ratio: 6 / 12, color: "rgba(73, 214, 181, 1)" },
        { ratio: 7 / 12, color: "rgba(78, 230, 194, 1)" },
        { ratio: 8 / 12, color: "rgba(83, 245, 207, 1)" },
        { ratio: 9 / 12, color: "rgba(85, 250, 211, 1)" },
        { ratio: 10 / 12, color: "rgba(102, 255, 219, 1)" },
        { ratio: 11 / 12, color: "rgba(121, 237, 210, 1)" },
        { ratio: 12 / 12, color: "rgba(158, 255, 233, 1)" }
      ];

    // Create the heatmap renderer
    const heatmapRenderer = new HeatmapRenderer({
        field: "duration",
        colorStops: colorStops,
        minDensity: 0,
        maxDensity: 0.0035,
        radius: 20,
        referenceScale:  null as any
    });

    // var features = [
    //     new Graphic({
    //         geometry: new Point({
    //             longitude: 77.33,
    //             latitude: 28.69,
    //             z:50,
    //             // spatialReference: { wkid: 102100 }
    //         }),
    //         attributes: {
    //             //ObjectID: 1,
    //             name: "Point 1",
    //             longitude: 77.33,
    //             latitude: 28.69,
    //             z:50,
    //             // spatialReference: { wkid: 102100 }
    //         }
    //     }),
    //     new Graphic({
    //         geometry: new Point({
    //             longitude: 77.29,
    //             latitude: 27.00,
    //             z:50,
    //             // spatialReference: { wkid: 102100 }
    //         }),
    //         attributes: {
    //            // ObjectID: 2,
    //             name: "Point 2",
    //             longitude: 77.29,
    //             latitude: 27.00,
    //             z:50
    //         }
    //     }),
    //     new Graphic({
    //         geometry: new Point({
    //             longitude: 77.29,
    //             latitude: 26.00,
    //             z:50,
    //             // spatialReference: { wkid: 102100 }

    //         }),
    //         attributes: {
    //             //ObjectID: 3,
    //             name: "Point 3",
    //             longitude: 77.29,
    //             latitude: 26.00,
    //             z:50
    //         }
    //     })
    // ];

    // console.log(colorStops_)
    // console.log(normalizeDuration)

// Normalize durations and add them as attributes to the graphics
    // pointGraphicCollection.forEach((graphic) => {
    //     const duration = graphic.attributes.duration;
    //     graphic.attributes = { ...graphic.attributes, normalizedDuration : normalizeDuration(duration)} 
    // });

    // const colorStops_1 = durations.map((duration) => {
    //     const ratio = normalizeDuration(duration);
    //     // createFillSymbol( ratio, getColorForRatio(ratio))
    //     return createFillSymbol( ratio, getColorForRatio(ratio))
    // });

    // const openSpacesRenderer = {
    //     type: "unique-value",
    //     field: "duration",
    //     uniqueValueInfos: colorStops_1
           
    // } 

    // // 
    // const renderer = {
    //     // type: "simple",
    //     // symbol: {
    //     //   type: "simple-marker",
    //     //   style: "circle",
    //     //   color: [250, 250, 250],
    //     //   outline: {
    //     //     color: [255, 255, 255, 0.5],
    //     //     width: 0.5
    //     //   },
    //     //   size: "8px"
    //     // },
    //     visualVariables: [
    //       {
    //         type: "color", // Visual variable to style color
    //         field: "duration", // Field to apply color based on
    //         stops: colorStops_,
    //         // uniquevalueInfo: colorStops_1
    //       }
    //     ]

    //   };

    //   const heatmapRenderer_ = new HeatmapRenderer({           
    //     field: "duration", // Attribute to base heatmap 

    //     colorStops: colorStops_
    //     // colorStops: [             
    //     //     // { ratio: normalizeDuration(0), color: "rgba(33, 102, 172, 0)" },   // 0 hours (blue, low intensity)            
    //     //     // { ratio: normalizeDuration(3), color: "rgba(103, 169, 207, 0.8)" }, // 3 hours            
    //     //     // { ratio: normalizeDuration(6), color: "rgba(209, 229, 240, 0.8)" }, // 6 hours           
    //     //     //  { ratio: normalizeDuration(9), color: "rgba(253, 219, 199, 0.8)" }, // 9 hours          
    //     //     //    { ratio: normalizeDuration(12), color: "rgba(178, 24, 43, 1)" }     // 12 hours (red, high intensity)          
    //     // ],           
    //     // maxPixelIntensity: 100, // You can adjust this based on how dense the points are minPixelIntensity: 0 
    //     });

    const shadowFeatureLayer = new FeatureLayer({
        source: pointGraphicCollection,
        objectIdField: "ObjectID",
        geometryType: "point",
        title: "Heat Map",
        fields: [
            { name: 'duration', type: 'integer' }
        ],
        elevationInfo: {
            mode: "relative-to-scene", // Position relative to the building
            offset: 10 + 1, // Elevate slightly above the building
        }
      });

      shadowFeatureLayer.renderer = heatmapRenderer as any;
      globalLayers.view?.map.layers.add(shadowFeatureLayer)
}

function getColorForDuration(duration: number) {
    // Define min and max duration values
    const minDuration = 0;  // Example minimum duration
    const maxDuration = 4 * 3600 * 1000; // Example maximum duration

    // Normalize duration to a value between 0 and 1
    const normalized = (duration - minDuration) / (maxDuration - minDuration);

    // Clamp the normalized value between 0 and 1
    const clamped = Math.max(0, Math.min(1, normalized));

    // Convert normalized value to a color (linear interpolation between red and green)
    const g = Math.round(255 * (1 - clamped)); // Red decreases as duration increases
    const r = Math.round(255 * clamped);       // Green increases as duration increases
    const b = 0;                               // No blue in this gradient

    // Return the color as a CSS RGB string
    return `rgb(${r},${g},${b})`;
}


   // Example of a function to map ratio to a color
function getColorForRatio(ratio: number) {
    // You can customize this function to assign specific colors for different ranges of ratios
    if (ratio <= 0.2) return "rgba(25, 43, 51, 0.6)";
    if (ratio <= 0.3) return "rgba(30, 140, 160, 1)";
    if (ratio <= 0.4) return "rgba(58, 165, 140, 1)";
    if (ratio <= 0.5) return "rgba(64, 184, 156, 1)";
    if (ratio <= 0.6) return "rgba(68, 199, 168, 1)";
    if (ratio <= 0.7) return "rgba(85, 250, 211, 1)";
    if (ratio <= 0.8) return "rgba(85, 250, 211, 1)";
    if (ratio <= 0.9) return "rgba(121, 237, 210, 1)";
    return "rgba(158, 255, 233, 1)";
}

function millisecondsToHours(milliseconds: number): number {
    const hours = milliseconds / (1000 * 60 * 60);
    return parseFloat(hours.toFixed(2)); // Rounded to 2 decimal places
}

const renderer_ = {
    type: "simple", // Simple renderer
    symbol: {
        type: "simple-marker", // Apply to point symbols
        style: "circle",
        color: [250, 250, 250], // Default color (white)
        outline: {
            color: [255, 255, 255, 0.5],
            width: 0.5
        },
        size: "8px"
    },
    visualVariables: [
        {
            type: "color",
            field: "normalizedDuration", // Use normalized duration
            stops: [
                { value: 0, color: "green", label: "Short Duration" },  // Minimum duration (green)
                { value: 0.5, color: "yellow", label: "Medium Duration" }, // Midpoint duration (yellow)
                { value: 1, color: "red", label: "Long Duration" } // Maximum duration (red)
            ]
        }
    ]
};

function createFillSymbol(value: any, color: any) {
    return {
        "value": value, 
        "symbol": {
            "color": color,
            "type": "simple-fill", "style": "solid", "outline": { "style": "none" }
        }, 
        "label": value
    };
}



// const colorStops_ = durations.map((duration) => {
//     const ratio = normalizeDuration(duration);
//     // createFillSymbol( ratio, getColorForRatio(ratio))
//     return createFillSymbol( ratio, getColorForRatio(ratio))
// });

const openSpacesRenderer = {
    type: "unique-value",
    field: "TYPE",
    uniqueValueInfos:
        [createFillSymbol("Natural Areas", "#9E559C"),
        createFillSymbol("Regional Open Space", "#A7C636"),
        createFillSymbol("Local Park", "#149ECE"),
        createFillSymbol("Regional Recreation Park", "#ED5151")
        ]
}     

function mapDurationsToColorStops(durations: number[]): { color: string, ratio: number }[] {
    const totalDurations = durations.length;
  
    return durations.map((duration, index) => {
      // Generate a random color in rgba format
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.random().toFixed(2)})`;
  
      // Calculate the ratio for this color stop
      const ratio = (millisecondsToHours(totalDurations) / 24).toFixed(2); // Ratio between 0 and 1
  
      return {
        color: randomColor,
        ratio: parseFloat(ratio)
      };
    });
  }

