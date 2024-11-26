import Polygon from "@arcgis/core/geometry/Polygon";

interface TopLeftPointInfo {
    point: number[];
    pointIndex: number;
    ringIndex: number;
  }

export function getTopLeftPointAndIndex(polygon: Polygon): TopLeftPointInfo | null {
    if (!polygon || !polygon.rings || polygon.rings.length === 0) {
        return null;
      }
    
      let topLeftPoint: number[] | null = null;
      let pointIndex = -1;
      let ringIndex = -1;
    
      polygon.rings.forEach((ring, rIndex) => {
        ring.forEach((point, pIndex) => {
          if (
            !topLeftPoint ||
            (point[0] < topLeftPoint[0] || (point[0] === topLeftPoint[0] && point[1] > topLeftPoint[1]))
          ) {
            topLeftPoint = point;
            pointIndex = pIndex;
            ringIndex = rIndex;
          }
        });
      });
    
      if (topLeftPoint && pointIndex !== -1 && ringIndex !== -1) {
        return { point: topLeftPoint, pointIndex, ringIndex };
      }
    
      return null;
  }