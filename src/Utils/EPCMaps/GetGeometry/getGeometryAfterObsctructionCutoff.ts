import Graphic from "@arcgis/core/Graphic";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Geometry from "@arcgis/core/geometry/Geometry";
import { globalLayerType } from "../../Const";

export const getGeometryAfterObsctructionCutoff = async (globalLayers: globalLayerType) => {
    const graphics = globalLayers.sketchLayers.graphics; // Get all graphics from the layer
    let buildingGraphic = null as Graphic | null;
  
    // Identify the building graphic and remove any "panels" graphics
    graphics.forEach((graphic) => {
      if (graphic.attributes && graphic.attributes.name.includes("building")) {
        buildingGraphic = graphic;
      } else if (graphic.attributes && graphic.attributes.name.includes("panels")) {
        globalLayers.sketchLayers.graphics.remove(graphic);
      }
    });
  
    if (!buildingGraphic) {
      console.error("No building graphic found.");
      return null;
    }
  
    // Create a clone of the building graphic to perform operations
    let resultantGeometry = buildingGraphic.geometry.clone();
  
    // Subtract all other graphics from the building graphic
     // Subtract all other graphics from the building graphic
    graphics.forEach((graphic) => {
      if (graphic.attributes && !graphic.attributes.name.includes('building')) {
        try {
          // Check if the geometries are compatible
          if (geometryEngine.intersects(resultantGeometry, graphic.geometry)) {
            resultantGeometry  = geometryEngine.difference(
              resultantGeometry,
              graphic.geometry
            ) as Geometry;
          } else {
            console.warn("The geometries do not intersect. Skipping subtraction.");
          }
        } catch (error) {
          console.error("Error performing geometric subtraction:", error);
        }
      }
    });
  
    if(globalLayers.parapetwall > 0){
      let geometryBuffered = geometryEngine.buffer(resultantGeometry, -globalLayers.parapetwall, "meters");
      // Creates a geometry 1 meter inside the edges of the input geometry.
      resultantGeometry = geometryBuffered as Geometry;
    }
    // console.log(resultantGeometry, 'resultantGeometry')
    // Create a new graphic with the resultant geometry
    const resultantGraphic = buildingGraphic.clone();
    resultantGraphic.geometry = resultantGeometry;
    return resultantGraphic;
  };