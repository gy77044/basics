import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Polyline from "@arcgis/core/geometry/Polyline";
import Geometry from "@arcgis/core/geometry/Geometry";

interface TopLeftPointResult {
  point: Point;
  index: number;
}

/**
 * Finds the top-left point of a given geometry along with its index.
 * @param geometry - The geometry to find the top-left point for.
 * @returns The top-left point and its index.
 */
export const getTopLeftPoint = (geometry: Geometry): TopLeftPointResult | null => {
  let topLeftPoint: Point | null = null;
  let topLeftIndex = -1;
  let currentIndex = 0;

  const updateTopLeftPoint = (point: Point, index: number) => {
    if (!topLeftPoint) {
      topLeftPoint = point;
      topLeftIndex = index;
    } else {
      if (point.longitude < topLeftPoint.longitude ||
        (point.longitude === topLeftPoint.longitude && point.latitude > topLeftPoint.latitude)) {
        topLeftPoint = point;
        topLeftIndex = index;
      }
    }
  };

  if (geometry.type === "polygon" || geometry.type === "polyline") {
    const paths = geometry.type === "polygon" ? (geometry as Polygon).rings : (geometry as Polyline).paths;

    paths.forEach(path => {
      path.forEach(coords => {
        const point = new Point({
          longitude: coords[0],
          latitude: coords[1],
          spatialReference: geometry.spatialReference
        });
        updateTopLeftPoint(point, currentIndex);
        currentIndex++;
      });
    });
  } else if (geometry.type === "point") {
    topLeftPoint = geometry as Point;
    topLeftIndex = 0;
  }

  if (topLeftPoint) {
    return { point: topLeftPoint, index: topLeftIndex };
  } else {
    return null;
  }
};
