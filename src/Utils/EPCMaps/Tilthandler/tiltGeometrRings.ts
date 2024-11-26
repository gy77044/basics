import Polygon from "@arcgis/core/geometry/Polygon";
import { getTopLeftPointAndIndex } from "../GetPointsIndex/getPolygonPointsIndex";
import { getTopLeftPoint } from "./getTopLeftPoint";
import Point from "@arcgis/core/geometry/Point";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

/**
 * The function `elevateGeometryRings` takes a polygon geometry and elevation points, and adjusts the
 * height of each point in the rings based on the elevation points provided.
 * @param {Polygon} geometry - The `geometry` parameter is a Polygon object that contains rings
 * representing the shape of a polygon. Each ring is an array of points in the form [x, y].
 * @param {number[]} elevationPoints - The `elevationPoints` parameter is an array of numbers that
 * represent the indices of the points in the polygon geometry that should be elevated. If a point's
 * index is included in the `elevationPoints` array, its height will be increased by 0.5 units compared
 * to the default height
 * @param [height=0] - The `height` parameter in the `elevateGeometryRings` function represents the
 * base height at which the geometry rings are initially positioned. If no `elevationPoints` are
 * provided, all points in the geometry rings will be elevated to this base height. If
 * `elevationPoints` are
 * @returns The `elevateGeometryRings` function takes a Polygon geometry and an array of elevation
 * points, and optionally a height value. It then maps over the rings of the geometry, adjusting the
 * height of each point based on the elevation points provided. The function returns an array of arrays
 * of coordinates, where each coordinate now includes the adjusted height value.
 */
export const elevateGeometryRings = (geometry: Polygon, elevationPoints: number[], height = 0, isRoof = false, baseHeight = 0): { rings: number[][][], distance: number, distance_x: number } | null => {

    if (elevationPoints === undefined || elevationPoints.length === 0) {
        // Return the geometry with the specified height or baseHeight if the elevationPoints array is empty
        const ring = geometry.rings.map((ring: any[]) =>
            ring.map(point => {
                let newHeight = isRoof ? baseHeight : height;
                return [point[0], point[1], newHeight];
            })
        )
        return { rings: ring, distance: 0, distance_x: 0 };
    }

    const maxLimitIndex = geometry.rings[0].length;
    // tilt the module according the azimuth angle provided
    const info = getTopLeftPointAndIndex(geometry);
    const points = getTopLeftPoint(geometry);
    if (info === null) return null;
    const { pointIndex, ringIndex } = info;


    // Adjust the points relative to the top-left point index
    let firstPoint = (elevationPoints[0] + pointIndex) - 1;
    let secondPoint = (elevationPoints[1] + pointIndex) - 1;

    if (firstPoint > maxLimitIndex) {
        console.warn('Incorrect Elevation Point Defined.')
        return null;
    }
    if (secondPoint > maxLimitIndex) {
        secondPoint = 0;
    }
    // if totpleft POint index is zero, then minus one from elevationn points
    // if 1, then they will remain same 
    // if 2, then add one at each point
    // if 3, then add 2 points at each point
    const ringLength = geometry.rings[ringIndex].length;
    let adjustedElevationPoints = elevationPoints.map(ep => (ep + pointIndex - 1) % ringLength);
    if (adjustedElevationPoints[0] === 0 || adjustedElevationPoints[1] === 0) {
        if (adjustedElevationPoints[0] === maxLimitIndex - 1 || adjustedElevationPoints[1] === maxLimitIndex - 1) {
            adjustedElevationPoints.push(1)
        }
        else if (adjustedElevationPoints[0] === 1 || adjustedElevationPoints[1] === 1) {
            adjustedElevationPoints.push(ringLength - 1)
        }
    }

    let elevatedPointsArray = [] as number[][]
    

    const Rings = geometry.rings.map((ring: any[]) =>
        ring.map((point, index) => {
            // get the length of the points given
            let newHeight = elevationPoints.length === 0 ? height : height + (adjustedElevationPoints.includes(index) ? 0.5 : 0)
            if (isRoof) {
                if (adjustedElevationPoints.includes(index)) {
                    elevatedPointsArray.push(point)
                }
                newHeight = elevationPoints.length === 0 ? baseHeight : (adjustedElevationPoints.includes(index) ? height + baseHeight : baseHeight)
            }
            return [point[0], point[1], newHeight];
        })
    );

    Rings.forEach(ring => {
        ring.forEach((ele, index) => {
            if(ele[0] == elevatedPointsArray[1][0] && ele[1] === elevatedPointsArray[1][1]){
                if(index === ring.length - 1){
                    elevatedPointsArray[2] = ring[0]
                } else {
                    elevatedPointsArray[2] = ring[index + 1]
                }
            }
        })
    })

    // get the distnace between two points
    var point1 = elevatedPointsArray[0];
    var point2 = elevatedPointsArray[1];

    // Calculate the differences in x and y coordinates
    var deltaX = point2[0] - point1[0];
    var deltaY = point2[1] - point1[1];

    // Calculate the distance using the distance formula
    var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // get the length pf next point 
    var point3 = elevatedPointsArray[2];

     // Calculate the differences in x and y coordinates
     var delta_X = point3[0] - point2[0];
     var delta_Y = point3[1] - point2[1];
 
     // Calculate the distance using the distance formula
     var distance_x = Math.sqrt(delta_X * delta_X + delta_Y * delta_Y);

    return { rings: Rings, distance, distance_x };
}



export function elevateRingsWithAngle(geometry: Polygon, elePoints: number[], elevatedAngle: number) {
     // Convert angle from degrees to radians
     const elevatedAngleRad = elevatedAngle * (Math.PI / 180);

     // Copy the rings from the original geometry
     const newRings = geometry.rings.map(ring => ring.slice());
 
     // Calculate the elevation in meters only once, based on the first elevated point
     const firstElevatedPointIndex = elePoints[0];
     const currentPoint = newRings[0][firstElevatedPointIndex]; 
     const nextPointIndex = (firstElevatedPointIndex + 1) % newRings[0].length;
     const nextPoint = newRings[0][nextPointIndex];
 
     // Calculate the horizontal distance between the current point and the next point
     const distance = Math.sqrt(
         Math.pow(nextPoint[0] - currentPoint[0], 2) +
         Math.pow(nextPoint[1] - currentPoint[1], 2)
     );
 
     // Calculate the elevation in meters using the tangent of the angle
     const elevationInMeters = distance * Math.tan(elevatedAngleRad);
 
     // Apply the elevation to each of the specified points
     elePoints.forEach(index => {
         if (index < newRings[0].length) {
             newRings[0][index][2] += elevationInMeters;
         }
     });

    return newRings;
}


export function elevateGeometryRingsWithAzimuth(geometry: Polygon, azimuthAngle: number, height: number): number[][][] {
    const azimuthRadians = azimuthAngle * (Math.PI / 180); // Convert degrees to radians

    const cosAzimuth = Math.cos(azimuthRadians);
    const sinAzimuth = Math.sin(azimuthRadians);

    return geometry.rings.map(ring => {
        return ring.map(vertex => {
            const [x, y, z = 0] = vertex;
            // Apply elevation based on the azimuth angle
            const newZ = z + height * (cosAzimuth * (x - geometry.extent.center.x) + sinAzimuth * (y - geometry.extent.center.y));
            return [x, y, newZ];
        });
    })
}

export const convertIndicesToPoints = (polygon: Polygon, indices: number[], defaultHeight: number): { distance:  number, pointAltitude: number } => {
    const points: Point[] = [];
    let pointAltitude = 0;

    let distance_x = 0;
    let isError = "";
  
    try {
      // Validate the input
      if (!polygon || !indices) {
        throw new Error('Invalid input: Polygon or indices array is missing.');
      }
  
      // Extract all rings from the polygon
      const rings = polygon.rings;
  
      // Iterate through each ring
      rings.forEach((ring, i) => {
        ring.forEach((point , i) => {
            if(indices.filter(ele => ele === i).length){
                const [x, y, z] = ring[i];
                pointAltitude = z + defaultHeight;
                points.push(new Point({
                    x,
                    y,
                    z: z,
                    spatialReference: polygon.spatialReference
                }));
            }
        })


         // Ensure the last point in the ring (if closed) matches the first
        if (ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]) {
            ring[ring.length - 1][2] = ring[0][2]; // Ensure elevation matches
        }
       
      });

       
  
    } catch (error) {
      console.error('Error converting indices to points:', error);
    }

    /// now calculate distnace between the points 
    try {
        distance_x = geometryEngine.distance(points[0], points[1], 'meters');
    } catch (error) {
        throw new Error('invalid points for caculation points distance');
    }

    //
  
    return { distance: distance_x, pointAltitude };
};