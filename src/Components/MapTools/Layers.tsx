import { useState } from "react";
import globalLayers from "../../Utils/EPCMaps/Maps/GlobaLMap";
 
const Layers = () => {
  const [selectedGraphic, setSelectedGraphic] = useState<string>("");
 
  const handleSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string | undefined
  ) => {
    try {
      if (!name) {
        console.error("Graphic name is undefined or null.");
        return;
      }
 
      if (e.currentTarget.checked) {
        if (!name.includes("build")) {
          setSelectedGraphic(name);
          globalLayers.enableUpdateonGraphicByName(name);
        }
      } else {
        setSelectedGraphic("");
        globalLayers.sketchViewModel_Draw.cancel();
      }
    } catch (error) {
      console.error("An error occurred while selecting a layer:", error);
    }
  };
 
  return (
    <div id="feature" className="overflow-y-auto">
      {globalLayers.sketchLayers && globalLayers.sketchLayers.graphics ? (
        globalLayers.sketchLayers.graphics.length > 0 ? (
          globalLayers.sketchLayers.graphics.map((graphic, index) => {
            const name = graphic.attributes?.name as string | undefined;
 
            if (!name) {
              console.warn(`Graphic at index ${index} does not have a name.`);
              return null;
            }
 
            // Check if the layer is a "build" layer
            if (name.includes("build") || name.includes("parapet")) {
              return (
                <div key={(graphic as any).uid} className="layer-item p-2 text-capitalize cursor-pointer text-1.6xl hover:text-white hover:bg-custom-primary-default">
                  <label>
                    Layer {index + 1} - {name || "Unnamed Layer"}
                  </label>
                </div>
              );
            } else {
              // For non-"build" layers
              return (
                <div key={(graphic as any).uid} className="layer-item p-2 text-capitalize cursor-pointer text-1.6xl hover:text-white hover:bg-custom-primary-default">
                  <label>
                    <input 
                      type="checkbox"
                      checked={selectedGraphic === name}
                      onChange={(e) => handleSelect(e, name)}
                       className="m-3"
                    />
                    Layer {index + 1} - {name || "Unnamed Layer"}
                  </label>
                </div>
              );
            }
          })
        ) : (
          <div className="text-capitalize cursor-pointer text-1.6xl">No layers available.</div>
        )
      ) : (
        <div className="text-capitalize cursor-pointer text-1.6xl">Error: Sketch layers not found.</div>
      )}
    </div>
  );
};
 
export default Layers;