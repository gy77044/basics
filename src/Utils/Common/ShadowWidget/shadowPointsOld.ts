import Geometry from "@arcgis/core/geometry/Geometry";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Point from "@arcgis/core/geometry/Point";
import globalLayers from "../../EPCMaps/Maps/GlobaLMap";
import Graphic from "@arcgis/core/Graphic";
import { zIndex } from "../../Const";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import HeatmapRenderer from "@arcgis/core/renderers/HeatmapRenderer.js";


const colors = ["rgba(115, 0, 115, 0)", "#820082", "#910091", "#a000a0", "#af00af", "#c300c3", "#d700d7", "#eb00eb", "#ff00ff", "#ff58a0", "#ff896b", "#ffb935", "#ffea00"];

export const updateShadowPointsRender_Old = () => {
    const building = globalLayers.getGraphicbyItsName('building')
    if(globalLayers.graphicUnion && building){
        const height = building.getAttribute('height') ? building.getAttribute('height') : building.getAttribute('buildingheight') ? building.getAttribute('buildingheight') : 0;
        getShadowPointsOld(globalLayers.graphicUnion, height)
    }
}

export async function getShadowPointsOld(geometry: Geometry, height: number) {
    // console.log(geometry, 'geometry')
    globalLayers.shadowLayer?.graphics.removeAll(); // Clear existing graphics
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
                z: height,
                spatialReference: extent.spatialReference
            });
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
            pointGraphicCollection.push(pointGraphic)
            globalLayers.shadowLayer?.graphics.add(pointGraphic)
            // });
        }
    }
    // points.forEach(async (point) => {
        
    // });

    // globalLayers.shadowLayer?.graphics.addMany(pointGraphicCollection);


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


      function millisecondsToHours(milliseconds: number): number {
        const hours = milliseconds / (1000 * 60 * 60);
        return parseFloat(hours.toFixed(2)); // Rounded to 2 decimal places
      }

    //   console.log(mapDurationsToColorStops(durations))

    // Create the heatmap renderer
    const heatmapRenderer = new HeatmapRenderer({
        field: "duration",
        colorStops: mapDurationsToColorStops(durations),
        radius: 2,
        maxDensity: (millisecondsToHours(maxDuration) / 24),
        // maxDensity: 0.04625,
        minDensity: minDuration,
    });

    const shadowFeatureLayer = new FeatureLayer({
        source: pointGraphicCollection, // Pass in the graphics created earlier
        objectIdField: "ObjectID",
        // geometryType: "point",
        // spatialReference: geometry.spatialReference,
        // blendMode: 'normal',
        renderer: heatmapRenderer,
        title: "Heat Map"
      });


      globalLayers.view?.map.add(shadowFeatureLayer);
      
      shadowFeatureLayer.when(() => {
          console.log(globalLayers.view?.map.allLayers);
          console.log(shadowFeatureLayer.fullExtent)

      })

}

function getColorForDurationOld(duration: number) {
    // This is a simple color ramp based on duration (in hours)
    if (duration < 2) return "blue";
    else if (duration < 4) return "green";
    else if (duration < 6) return "yellow";
    else return "red";
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
