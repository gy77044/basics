import MapView from "@arcgis/core//views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { TextSymbol } from "@arcgis/core/symbols";
import SceneView from "@arcgis/core/views/SceneView";
import axios from "axios";
import { getAltitude } from "../GenerateRoof/GenrateRoof";
import globalLayers from "./GlobaLMap";
import { getGraphic } from "./getFucntion";
import { toast } from "react-toastify";
import { store } from "../../../ReduxTool/store/store";
import { setToolTipModal } from "../../../ReduxTool/Slice/Map/MapReducer";


const actViewObj: any = {}, mapViewObj: any = {}, sceneViewObj: any = {};

const appConfig = {
    mapView: mapViewObj,
    sceneView: sceneViewObj,
    activeView: actViewObj,
    container: {}, // use same container for views
    measurement: null as __esri.Measurement | null,
};

const initialViewParams = {
    zoom: 0,
    center: [77.216721, 28.644800],
    container: appConfig.container,
    map: { showAttribution: false }
};

const createView = (params: any, type: any) => {
    let view;
    if (type === "2d") {
        view = new MapView(params);
    } else {
        view = new SceneView(params);
    }
    return view;
};

const graphicsLayer = new GraphicsLayer();

export const webmap = new WebMap({
    basemap: "satellite"
});
export function intialize(element: HTMLDivElement) {
    appConfig.container = element as HTMLDivElement;
    initialViewParams.container = appConfig.container;
    appConfig.sceneView = createView(initialViewParams, "3d");
    appConfig.sceneView.map = SceneView;
    appConfig.mapView = appConfig.sceneView;
    appConfig.activeView = appConfig.sceneView;
};

export function intializeAppConfig(element: HTMLDivElement, map: any, sceneView: __esri.SceneView) {
    appConfig.sceneView.map = map;
    appConfig.sceneView = sceneView
    appConfig.mapView = appConfig.sceneView;
    appConfig.activeView = appConfig.sceneView;
    appConfig.container = element as HTMLDivElement;
    initialViewParams.container = appConfig.container;
    return appConfig;
};

export function getAppConfig() {
    return appConfig;
};

export function getGraphicLayer() {
    return graphicsLayer;
};

/**
 * The function calculates the latitude and longitude of a destination point given the starting
 * latitude and longitude, distance, and angle.
 * @param {number} latitude - The latitude of the starting point in degrees.
 * @param {number} longitude - The `longitude` parameter represents the longitude of the starting point
 * in degrees.
 * @param {number} deg - The `deg` parameter represents the angle between the two points in degrees. It
 * is used to calculate the direction in which the next point should be located.
 * @param {number} distance - The distance parameter represents the distance between two points on the
 * Earth's surface, measured in meters.
 * @returns an object with two properties: "lat" and "lng". The "lat" property represents the latitude
 * of the destination point, and the "lng" property represents the longitude of the destination point.
 */
export const getNextPointbyDistanceAngle = (latitude: number, longitude: number, deg: number, distance: number) => {
    const R = 6371e3; //rayon of the erth
    let latitudeRad = latitude * Math.PI / 180; // latitude in rad
    let longitudeRad = longitude * Math.PI / 180; // longiture in rad
    let d = distance; //distance between the two points
    let angle = (90 - deg) * Math.PI / 180; // the angle between the 2 points in rad (20°)
    const sigma = d / R;
    const deltaLatitude = sigma * Math.cos(angle);
    let delLatitude = (latitudeRad + deltaLatitude) * 180 / Math.PI;//latitude of the destination point
    // const delta = Math.log(Math.tan(delLatitude / 2 + Math.PI / 4) / Math.tan(latitudeRad / 2 + Math.PI / 4));
    // const q = Math.abs(del) > 10e-12 ? delLat / del : Math.cos(lat1);
    const cosin = Math.cos(latitudeRad)

    const deltaLongitude = sigma * Math.sin(angle) / cosin;
    let delLng = (longitudeRad + deltaLongitude) * 180 / Math.PI; //longitude of the destination point

    return {
        lat: delLatitude,
        lng: delLng
    }
};

export const dropPinSearchLocation = async ({ latitude, longitude }: { latitude: number, longitude: number }) => {
    
    if (latitude && longitude) {
        const newPoint = new Point({
            latitude: latitude,
            longitude: longitude,
            spatialReference: {
                wkid: 4326
            }
        })
        const bufferDistance = 10;
        const geodesicBufferGeometry= geometryEngine.geodesicBuffer(newPoint, bufferDistance, "meters")
        let eleArray: string[] = [];
        (geodesicBufferGeometry as  Polygon).rings[0].forEach((element: any[]) => {
            eleArray.push(element[1] + " " + element[0]);
        });
        const geosolutions = process.env.REACT_APP_GEOSERVER_OWS;
        const GeoURL = (typeNames: string, cqlFilter: string) => `${geosolutions}/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&typeNames=${typeNames}&cql_filter=${cqlFilter}&outputFormat=application/json`;
        const typeNames = 'tipnque:terrace_gm_4326';
        const cqlFilter = `OVERLAPS(the_geom, Polygon((${eleArray.join(",")})))`;
        const wfs = GeoURL(typeNames, cqlFilter);
        axios.get(wfs).then((response) => {
            if (response.status !== 200) {
                // console.log(response)
                return;
            }
            if (response?.data === undefined || response?.data === null) {
                return null;
            }
            if (response?.data?.features.length === 0) {

                return null;
            } else {
                globalLayers.selectedRoof.objectid = (response?.data?.features[0].id as string).split(".")[1]
                globalLayers.selectedRoof.properties = response?.data?.features[0]?.properties
                globalLayers.elevationP = response?.data?.features[0]?.properties.ElevationP;
                // const geometry = response?.data?.features[0]?.geometry;

                const pointG = new Point({
                    latitude: globalLayers.latitude,
                    longitude: globalLayers.longitude,
                })

                const terrainLayer = (globalLayers?.map?.ground.layers as any).items;
                terrainLayer[0].queryElevation((pointG)).then((pointGeom: any) => {

                    globalLayers.altitude = getAltitude(pointGeom.geometry?.z);

                    let newmod = response.data;
                    for (let i = 0; i < (newmod.features[0]?.geometry.coordinates[0][0] as number[]).length; i++) {
                        newmod.features[0]?.geometry.coordinates[0][0][i].push(globalLayers.elevationP + globalLayers.altitude)
                    };
                    const blob = new Blob([JSON.stringify(newmod)], {
                        type: 'application/json',
                    });
                    const url = URL.createObjectURL(blob);
                    let layer = new GeoJSONLayer({
                        url,
                        title: 'GeoJson',

                    });

                    globalLayers.map?.allLayers.forEach((ele) => {
                        if (ele.title === layer.title) {
                            globalLayers.map?.remove(ele);
                            // globalLayers.RemoveLayer('Extruded building footprints');
                        }
                    });
                    globalLayers.RemoveLayer('RoofTopModule');
                    globalLayers.RemoveLayer('ModuleAngles');

                    globalLayers.map?.add(layer);
                    globalLayers.toggleLocationPin()

                })
            }

        })
            .catch((err) => console.error(err.response.data));
    }
};

///Wiring
export const addPostiveNegativeSymbol = (graphicCollection: __esri.Graphic[], Point: any) => {

    graphicCollection.map((graphic) => {
        const outerRing = (graphic as any).geometry.rings[0]
        const bottomRight = outerRing[3];
        const topRight = outerRing[2];


        const plusSymbol = new TextSymbol({
            color: 'black',
            text: '+',
            font: {
                size: 6,
                weight: "bold"
            }
        })
        const minusSymbol = new TextSymbol({
            color: 'black',
            text: '-',
            font: {
                size: 6,
                weight: "bold"
            }
        })


        let positivePointGraphic = null;
        let negativePointGraphic = null;

        if (1) {
            const topPointRight = getNextPointbyDistanceAngle(topRight[1], topRight[0], 240, 0.3);
            let topRightPoint = new Point({
                x: topPointRight.lng,
                y: topPointRight.lat
            });
            const bottomPointRight = getNextPointbyDistanceAngle(bottomRight[1], bottomRight[0], 150, 0.3);
            let bottonRightPoint = new Point({
                x: bottomPointRight.lng,
                y: bottomPointRight.lat
            });
            positivePointGraphic = getGraphic(topRightPoint, plusSymbol, { title: "positive-mark" })
            negativePointGraphic = getGraphic(bottonRightPoint, minusSymbol, { title: "negtive-mark" })
        }
        else {
            const topPointRight = getNextPointbyDistanceAngle(topRight[1], topRight[0], -195, 0.5);
            let topLeftPoint = new Point({
                x: topPointRight.lng,
                y: topPointRight.lat
            });
            const bottomPointRight = getNextPointbyDistanceAngle(bottomRight[1], bottomRight[0], -195, 0.5);
            let bottomLeftPoint = new Point({
                x: bottomPointRight.lng,
                y: bottomPointRight.lat
            });
            positivePointGraphic = getGraphic(topLeftPoint, plusSymbol, { title: "positive-mark" })
            negativePointGraphic = getGraphic(bottomLeftPoint, minusSymbol, { title: "negtive-mark" })
        }
        globalLayers.view?.graphics.add(positivePointGraphic);
        globalLayers.view?.graphics.add(negativePointGraphic);


    })
};

//map events

export function selectGraphicOnClick(e: __esri.ViewClickEvent) {
    if (!globalLayers.solarpanelLayer) return;
    if (globalLayers.solarpanelLayer.graphics.length === 0) return;
    if (globalLayers.isSelected) {

        if (!globalLayers.tempGraphic) return; /// no graphic found to attach 
        const graphic = globalLayers.tempGraphic.clone();
        globalLayers.solarpanelLayer.graphics.remove(globalLayers.tempGraphic);
        globalLayers.addedBlocks.push(graphic);
        removeGuidingLInesforBlock()

        globalLayers.tempGraphic = null;
        globalLayers.featureAddState = null;
        globalLayers.isSelected = false;
        return;
    }
    globalLayers.view?.hitTest(e)
        .then(response => {
            if (response.results.length) {
                const selectedGraphic = (response as any).results[0]?.graphic;
                // add that layer as move able from tempgraphics
                globalLayers.tempGraphic = selectedGraphic;
                // first remove the selected graphic from solarpanelLayer
                globalLayers.solarpanelLayer?.graphics.remove(selectedGraphic);
                globalLayers.solarpanelLayer?.graphics.add(globalLayers.tempGraphic!)
                globalLayers.isSelected = true
            }
        })
}

const removeGuidingLInesforBlock = () => {
    if (!globalLayers.solarpanelLayer) return;
    if (globalLayers.addedBlocks.length > 0) {
        const currentPositionedGraphic = globalLayers.addedBlocks[globalLayers.addedBlocks.length - 1];
        globalLayers.solarpanelLayer.graphics.add(currentPositionedGraphic);

        globalLayers.tempGraphic = null

        // remove the guiding lines graphic 
        if (globalLayers.guidinglines.horizontalLine) {
            globalLayers.solarpanelLayer.graphics.remove(globalLayers.guidinglines.horizontalLine);
        }
        if (globalLayers.guidinglines.verticalLine) {
            globalLayers.solarpanelLayer.graphics.remove(globalLayers.guidinglines.verticalLine);
        }

        globalLayers.guidinglines.horizontalLine = null;
        globalLayers.guidinglines.verticalLine = null;
    }
}



export const addIndividualRoofModulebtClick = (event: __esri.ViewClickEvent) => {
    if (event.button === 2) return;
    if (globalLayers.featureAddState !== 'active') return;
    if (!globalLayers.tempGraphic) return; // no temprory graphic for the pointer move found
    if (!globalLayers.solarpanelLayer) return; // module haven't been generted yet 
    if (globalLayers.solarpanelLayer.graphics.length === 0) {
        console.error('No Solar Module Lyaer found');
        return;
    };

    if (globalLayers.tempGraphic) {
        globalLayers.solarpanelLayer?.graphics.remove(globalLayers.tempGraphic); // remove globalLayers.tempGraphic from solarpanelLayer 
    }

    globalLayers.addedBlocks.push(globalLayers.tempGraphic);
    removeGuidingLInesforBlock()
}

export function deleteIndividualRoofModule(event: __esri.ViewClickEvent) {
    if (event.button !== 2) return; // any other click except right click will return the event 
    if (globalLayers.featureAddState !== 'delete') return;
    if (globalLayers.solarpanelLayer?.graphics.length === 0) return;
    if (globalLayers.sketchButton.currentButtonClicked && globalLayers.sketchButton.currentButtonClicked === 'left') return;
    globalLayers.view?.hitTest(event)
        .then(response => {
            if (response.results.length) {
                const graphic = (response as any).results[0]?.graphic
                globalLayers.solarpanelLayer?.graphics.remove(graphic)
            }
        })
}

export const getDefaultCoordinates = (): { latitude: number; longitude: number } => {
    return { latitude: 19.08489, longitude: 72.85669 };
};

export const getGeolocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise(async (resolve, reject) => {
      if ("geolocation" in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
  
          if (permissionStatus.state === "denied") {
            // toast.error("Location permission is denied. Please enable it in your browser settings to proceed.",{toastId:"permission"});
            // store.dispatch( setToolTipModal({
            //     state: true,
            //     title: "Permission denied",
            //     content: `Location access denied. Please enable permissions in your browser settings or search for a location to proceed.`,
            //   }))
            const inp = document.querySelector(".esri-search__input-container");
            if (inp) {
              const inputElement:any = inp.querySelector(".esri-search__input");
              if (inputElement) {
                inputElement.focus()
              } else {
                console.log('Input element with class "esri-search__input" not found.');
              };
            } else {
              console.log("Container with class 'esri-search__input-container' not found.");
            };
            // Optionally, provide further instructions for users to reset permissions.
            return;
          }
  
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error("Error getting geolocation:", error.message);
              reject(error);
              // resolve(globalLayers.getDefaultCoordinates()); // You can provide default coordinates if needed.
            }
          );
        } catch (error) {
          console.error("Error checking geolocation permission:", error);
          reject(error);
        }
      } else {
        console.error("Geolocation is not supported by your browser");
        // resolve(globalLayers.getDefaultCoordinates()); // Provide default coordinates if needed.
      }
    });
  };
  