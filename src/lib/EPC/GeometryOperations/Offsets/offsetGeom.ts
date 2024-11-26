import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";

// to check if the drawn polygon is within another polygon
export const isWithinPolygon = async (polygon: any, boundaryPolygon: any) => {
    // returns true if a geometry is completely within another
    const isWithin = geometryEngine.within(polygon, boundaryPolygon);
    return isWithin as boolean;
}

export const createOffset = async (Geom: any) => {
    // making the offet just outside the drawn geometry
    const newOffset = (geometryEngine as geometryEngine).offset(Geom, -1);
    return newOffset;
}

export function offsetPolyline(paths: number[][][], distance: number) {
    const offsetPaths: number[][][] = [];
    for (let path of paths) {
        const offsetPath: number[][] = [];
        for (let i = 0; i < path.length; i++) {
            const p1: number[] = path[i];
            const p2: number[] | undefined = path[i + 1];
            if (!p2) {
                offsetPath.push(p1);
                continue;
            }
            const angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
            const offsetX = distance * Math.sin(angle);
            const offsetY = -distance * Math.cos(angle);
            const offsetPoint: number[] = [p1[0] + offsetX, p1[1] + offsetY];
            offsetPath.push(offsetPoint);
        }
        offsetPaths.push(offsetPath);
    }
    return offsetPaths;
}