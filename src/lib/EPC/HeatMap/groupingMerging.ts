import Geometry from "@arcgis/core/geometry/Geometry";
import Graphic from "@arcgis/core/Graphic";
import { areIntersectingGeometry } from "../GeometryOperations/isIntersecting";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";


export function getColorForDuration(hour: number): string {
    // Define colors based on the hour ranges
    const colors = [
      [128, 0, 128, 0.5],  // Purple for 0 to 1 hour
      [255, 165, 0, 0.5],  // Light Orange for 1 to 2 hours
      [255, 140, 0, 0.5],  // Dark Orange for 2 to 3 hours
      [255, 255, 224, 0.6], // Light Yellow for 3 to 4 hours
      [255, 255, 0, 0.9],  // Yellow for 4 to 5 hours
      [255, 204, 0, 0.9],  // Dark Yellow for 5 to 6 hours
      [255, 0, 0, 0.9]     // Red for over 6 hours
    ];


    const color_ = ['#63135a', '#fe7c61', '#fe8067', '#ff9450', '#ffb23d', '#ffd32d', '#fffa29']
  
    // If duration exceeds the number of colors, use the last color (red)
    if (hour >= color_.length) {
      return color_[color_.length - 1];
    }
    
    return color_[hour];
}

export function mergeAdjacentPolygons(polygonGroup: Graphic[]): Geometry[] {
    let mergedPolygons = [] as Geometry[];
  
    polygonGroup.forEach((polygon) => {
      let merged = false;
  
      // Check if the current polygon can be merged with any already merged polygon
      for (let i = 0; i < mergedPolygons.length; i++) {
        if (areIntersectingGeometry(mergedPolygons[i], polygon.geometry)) {
          // Merge the intersecting polygons
          mergedPolygons[i] = geometryEngine.union([mergedPolygons[i], polygon.geometry]);
          merged = true;
          break;
        }
      }
  
      // If the polygon cannot be merged with any existing merged polygons, add it as new
      if (!merged) {
        mergedPolygons.push(polygon.geometry);
      }
    });
  
    return mergedPolygons;
  }


// Main function to group polygons by duration, merge adjacent polygons, and create colored graphics
export function groupAndMergePolygonsByDuration(polygonCollection: Graphic[], maxDurationHours: number = 7): Graphic[] {
    const resultGraphics: Graphic[] = [];
  
    const intervalMilliseconds = 1 * 60 * 60 * 1000; // 1-hour interval in milliseconds
  
    for (let hour = 0; hour <= maxDurationHours; hour++) {
      const minDuration = hour * intervalMilliseconds;
      const maxDuration = (hour + 1) * intervalMilliseconds;
  
      // Group polygons by duration range (e.g., 0 to 1 hour, 1 to 2 hours, etc.)
      const group = polygonCollection.filter(polygon => {
        const duration = polygon.attributes.duration;
        return duration >= minDuration && duration < maxDuration;
      });
  
      // If no polygons in this group, skip to the next group
      if (group.length === 0) {
        continue;
      }
  
      // Merge adjacent polygons in the current group
      const mergedPolygons = mergeAdjacentPolygons(group);
  
      // Create graphics for each merged polygon with a colored fill based on duration
      mergedPolygons.forEach((mergedPolygon) => {
        const color = getColorForDuration(hour);
  
        const symbol = new SimpleFillSymbol({
          color: color,
          outline: { color: color, width: 0 } // Black outline
        });
  
        // Create the graphic for the merged polygon
        const graphic = new Graphic({
          geometry: mergedPolygon,
          symbol: symbol,
          attributes: { durationRange: `${hour} to ${hour + 1} hours` }
        });
  
        resultGraphics.push(graphic);
      });
    }
  
    return resultGraphics;
}