import Polygon from "@arcgis/core/geometry/Polygon";
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine.js';


export const applyTiltToPolygon = (polygon: Polygon, tiltAngle: number) => {
    const centroid = polygon.centroid;
    const tiltRadians = tiltAngle * (Math.PI / 180); // Convert degrees to radians

    const tiltRings = polygon.rings.map(ring => {
        return ring.map(point => {
            const x = point[0] - centroid.x;
            const y = point[1];
            const z = point[2] - centroid.y;

            // Apply tilt rotation around the centroid
            const newX = x;
            const newY = y * Math.cos(tiltRadians) - z * Math.sin(tiltRadians);
            const newZ = y * Math.sin(tiltRadians) + z * Math.cos(tiltRadians);

            return [newX + centroid.x, newY, newZ + centroid.y];
        });
    });

    const tiltedPolygon = polygon.clone();
    tiltedPolygon.rings = tiltRings;
    return tiltedPolygon;
}

export const applyRotationToPolygon = (polygon: Polygon, angle: number) => {
    // Calculate the centroid of the polygon
    const centroid = polygon.centroid;

    // Rotate the polygon around its centroid
    const rotatedPolygon = geometryEngine.rotate(polygon, angle, centroid);

    return rotatedPolygon;
}

export const applyTiltElevationToPolygon = (polygon: Polygon, tiltAngle: number) => {
    const centroid = polygon.centroid;
    const tiltRadians = tiltAngle * (Math.PI / 180); // Convert degrees to radians

    const tiltedRings = polygon.rings.map(ring => {
        return ring.map(point => {
            const x = point[0];
            const y = point[1];
            const z = point[2] || 0; // Ensure z-coordinate exists

            // Calculate distance from centroid to point
            const dx = x - centroid.x;
            const dy = y - centroid.y;

            // Apply tilt elevation
            const distance = Math.sqrt(dx * dx + dy * dy);
            const elevationChange = distance * Math.tan(tiltRadians);

            // Adjust the Z coordinate based on the tilt
            return [x, y, z + elevationChange];
        });
    });

    const tiltedPolygon = polygon.clone();
    tiltedPolygon.rings = tiltedRings;
    return tiltedPolygon;
}

export function tiltPolygonGeometry(polygon: Polygon, hypotenuse: number, tiltAngleDegrees: number, azimuthDegrees: number): Polygon {
    // Convert angles to radians
    const tiltAngleRadians = tiltAngleDegrees * (Math.PI / 180);
    const azimuthRadians = azimuthDegrees * (Math.PI / 180);
  
    // Calculate the height based on the tilt angle
    const height = hypotenuse * Math.sin(tiltAngleRadians);
  
    // Calculate the direction of tilt based on azimuth
    const tiltDirectionX = Math.cos(azimuthRadians);
    const tiltDirectionY = Math.sin(azimuthRadians);
  
    // Get the base point (you may choose this based on the centroid or a specific corner)
    const basePoint = polygon.centroid;
    
    // Adjust each vertex in the polygon
    const newRings = polygon.rings.map(ring => {
      return ring.map(vertex => {
        const [x, y, z] = vertex;
  
        // Calculate the relative position of this vertex along the tilt direction
        const deltaX = x - basePoint.x;
        const deltaY = y - basePoint.y;
  
        // Project the vertex onto the tilt direction
        const projection = deltaX * tiltDirectionX + deltaY * tiltDirectionY;
  
        // Adjust the z-coordinate based on the projection
        const newZ = (z || 0) + projection * height / hypotenuse;
  
        return [x, y, newZ];
      });
    });
  
    // Create a new polygon with the adjusted rings
    const tiltedPolygon = new Polygon({
      rings: newRings,
      spatialReference: polygon.spatialReference
    });
  
    return tiltedPolygon;
  }