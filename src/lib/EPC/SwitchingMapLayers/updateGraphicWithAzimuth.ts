import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";

export const adjustGraphicsWithAzimuth = (graphicsArray: Graphic[], buildingHeight: number, symbol: any, azimuthAngle: number) => {
    const adjustedGraphics: Graphic[] = [];
  
    const angleRad = (azimuthAngle * Math.PI) / 180;
  
    const rotatePoint = (point: Point, angleRad: number, center: Point): Point => {
      const sinAngle = Math.sin(angleRad);
      const cosAngle = Math.cos(angleRad);
  
      // Translate point to origin
      const translatedX = point.x - center.x;
      const translatedY = point.y - center.y;
  
      // Rotate point
      const rotatedX = translatedX * cosAngle - translatedY * sinAngle;
      const rotatedY = translatedX * sinAngle + translatedY * cosAngle;
  
      // Translate point back
      const finalX = rotatedX + center.x;
      const finalY = rotatedY + center.y;
  
      return new Point({
        x: finalX,
        y: finalY,
        spatialReference: point.spatialReference
      });
    };
  
    graphicsArray.forEach((item) => {
      const updatedGraphic = item.clone() as any;
      
      const polygon = updatedGraphic.geometry as Polygon;
      const center = polygon.centroid as Point;
  
      const modifiedElevationRings = polygon.rings.map(ring => {
        return ring.map(point => {
          // Adjust elevation
          const elevatedPoint = [point[0], point[1], buildingHeight];
  
          // Rotate point
          const rotatedPoint = rotatePoint(new Point({ x: elevatedPoint[0], y: elevatedPoint[1], spatialReference: polygon.spatialReference }), angleRad, center);
  
          return [rotatedPoint.x, rotatedPoint.y, elevatedPoint[2]];
        });
      });
  
      updatedGraphic.geometry.rings = modifiedElevationRings;
      updatedGraphic.symbol = symbol;
      //  globalLayers.sketchLayers.graphics.add(updatedGraphic)
      adjustedGraphics.push(updatedGraphic);
    });
  
    return adjustedGraphics;
  };