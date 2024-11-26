import { ExtrudeSymbol3DLayer, LineSymbol3D, ObjectSymbol3DLayer, PathSymbol3DLayer, PointSymbol3D, PolygonSymbol3D } from "@arcgis/core/symbols";
import SolidEdges3D from "@arcgis/core/symbols/edges/SolidEdges3D.js";
import { WebStyleSymbol } from "@arcgis/core/symbols"
const defaultHeight = 0.05

export const buildingSymbology = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: defaultHeight,
      material: {
        color: [255, 255, 255, 0.4]
      },
      edges: new SolidEdges3D({
        size: 2,
        color: [255, 136, 27, 1]
      })
    })
  ]
});

export const buildingSymbologyHeight = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [255, 255, 255, 0.4]
        },
        edges: new SolidEdges3D({
          size: 2,
          color: [255, 136, 27, 1]
        })
      })
    ]
  })
};
export const papapetSymbology = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: defaultHeight,
      material: {
        color: [179, 177, 177, 0.4]
      },
      edges: new SolidEdges3D({
        size: 2,
        color: [179, 177, 177, 1]
      })
    })
  ]
});

/// parapet color symbol
export const papapetSymbologyHeight = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [200,10,0, 0.4]
        },
        edges: new SolidEdges3D({
          size: 2,
          color: [200,10,0, 1]
        })
      })
    ]
  })
};

export const symbolforColredHeight = (height: number, color: number[]) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: color
        },
        edges: new SolidEdges3D({
          size: 2,
          color: color
        })
      })
    ]
  })
};
export const pipelineSymbologywithHeight = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [2, 150, 50, 0.7]
        },
        edges: new SolidEdges3D({
          size: 2,
          color: [2, 150, 50, 0.7]
        })
      })
    ]
  })
};

export const hvacSymbologywithHeight = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [50, 150, 150,  0.7]
        },
        edges: new SolidEdges3D({
          size: 2,
          color: [50, 150, 150,  0.7]
        })
      })
    ]
  })
};

export const solarPaneExistingSymbologywithHeight = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [150, 10, 10, 0.6]
        },
        edges: new SolidEdges3D({
          size: 2,
          color: [150, 10, 10, 0.6]
        })
      })
    ]
  })
};
export const mumtyStructureSymbologywithHeight = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [150, 100, 250, 0.6]
        },
        edges: new SolidEdges3D({
          size: 2,
          color: [150, 100, 250, 0.6]
        })
      })
    ]
  })
};


export const treeSymbol = {
  type: "picture-marker",  // autocasts as new PictureMarkerSymbol()
  url: "https://static.arcgis.com/images/Symbols/Shapes/BlackStarLargeB.png",
  width: "64px",
  height: "64px"
} as any

export const InfraSymbology = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: defaultHeight,
      material: {
        color: [251, 71, 255, 0.4]
      },
      edges: new SolidEdges3D({
        size: 1,
        color: [251, 71, 255, 1]
      })
    })
  ]
});
export const obsctructionSymbology = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: defaultHeight,
      material: {
        color: [226, 58, 59, 0.4]
      },
      edges: new SolidEdges3D({
        size: 1,
        color: [226, 58, 59, 1]
      })
    })
  ]
});

export const obsctructionSymbologyHeight = (height: number) =>  {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [226, 58, 59, 0.4]
        },
        edges: new SolidEdges3D({
          size: 1,
          color: [226, 58, 59, 1]
        })
      })
    ]
  })
};
export const InfraSymbologyHeight = (height: number) =>  {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [251, 71, 255, 0.4]
        },
        edges: new SolidEdges3D({
          size: 1,
          color: [251, 71, 255, 1]
        })
      })
    ]
  })
};

export const solarPanelsSymbology = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: defaultHeight,
      material: {
        color: [0, 0, 75, 0.4]
      },
      edges: new SolidEdges3D({
        size: 1,
        color: [128, 128, 128, 0.5]
      })
    })
  ]
});

export const updateElevationSymbology = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [0, 0, 75, 0.4]
        },
        edges: new SolidEdges3D({
          size: 0,
          color: [128, 128, 128, 0.5]
        })
      })
    ]
  })
};

export const updatedSymbolWithHeight = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height, // extrude by 3.5m meters
        material: {
          color: [255, 255, 255, 0.4]
        },
        edges: new SolidEdges3D({
          size: 1,
          color: [82, 82, 122, 1]
        })
      })
    ]
  })
}

export const solarPanlesBlueSymbol =  new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: 0.08,
      material: {
        color: [0, 0, 75, 0.4]
      },
      edges: new SolidEdges3D({
        size: 0,
        color: [128, 128, 128]
      })
    })
  ]
})

export const solarPanlesRedSymbol =  new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: 0.08,
      material: {
        color: [255, 0, 0, 0.9]
      },
      edges: new SolidEdges3D({
        size: 0,
        color: [255, 255, 255]
      }),
    }),
    
  ]
})

// polyline symbols
export const pipelineSymbology = new LineSymbol3D({
  symbolLayers: [
    new PathSymbol3DLayer({
      anchor: 'bottom',
      profile: "quad", // creates a path symbol with rectangular profile
      width: 0.3, // symbology width in meters
      height: defaultHeight, // symbology height in meters
      material: {
        color: "#a57e5e"
      },
      cap: "square",
      profileRotation: "heading"
    })
  ]
});

export const pipelineSymbologyWidth = (width: number, height: number) => {
  return new LineSymbol3D({
    symbolLayers: [
      new PathSymbol3DLayer({
        anchor: 'bottom',
        profile: "circle",
        width, // symbology width in meters
        height, // symbology height in meters
        material: {
          color: "#a57e5e"
        },
        cap: "square",
        profileRotation: "heading"
      })
    ]
  })
};

// solar panels cutouts symbols
export const solarModuleSymbology = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: 0.002,
      material: {
        color: [0, 0, 0, 0.5]
      },
      edges: new SolidEdges3D({
        size: 1,
        color: [82, 82, 122, 1]
      })
    })
  ]
});

export const solarModuleSymbologyWithHeight = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height, // extrude by 3.5m meters
        material: {
          color: [0, 0, 0, 0.5]
        },
        edges: new SolidEdges3D({
          size: 1,
          color: [82, 82, 122, 1]
        })
      })
    ]
  })
}

export const roofSymbology = new PolygonSymbol3D({
  symbolLayers: [
    new ExtrudeSymbol3DLayer({
      size: 0,
      material: {
        color: [0, 0, 0, 0.1]
      },
      edges: new SolidEdges3D({
        size: 1,
        color: [82, 82, 122, 1]
      })
    })
  ]
});

export const roofSymbologywithHeight = (height: number) => {
  return new PolygonSymbol3D({
    symbolLayers: [
      new ExtrudeSymbol3DLayer({
        size: height,
        material: {
          color: [0, 0, 0, 0.1]
        },
        edges: new SolidEdges3D({
          size: 1,
          color: [82, 82, 122, 1]
        })
      })
    ]
  })
}

export const treeSymbology = new PointSymbol3D({
  symbolLayers: [
    new ObjectSymbol3DLayer({
      resource: {
        href: "https://static.arcgis.com/arcgis/styleItems/ThematicTrees/gltf/resource/PlatanusOccidentalis.glb"
      },
      height: 15
    })
  ]
});

export const symb_simple = {
  type: "simple-fill",  // autocasts as new SimpleFillSymbol()
  color: [0, 0, 75, 0.4],
  outline: { 
    color: [128, 128, 128, 0.5],
    width: "0.5px"
  }
};

export const simpleMarkerSymbol = {
  type: "simple-marker",
  color: [226, 119, 40],  // Orange
  outline: {
      color: [255, 255, 255], // White
      width: 1
    }
}