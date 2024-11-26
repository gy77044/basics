import axios from "axios";
import globalLayers from "../Utils/EPCMaps/Maps/GlobaLMap";
import { getAltitude } from "../Utils/EPCMaps/GenerateRoof/GenrateRoof";
import { loadMultipleModules } from "../Utils/EPCMaps/Maps/LazyloadMap";
// import { getAltitude } from "./GenerateRoof/GenrateRoof";
// import { loadMultipleModules } from "./MapHelpers/LazyloadMap";

export const dropPinSearchLocation = async ({ latitude, longitude, dispatch }: { latitude: number, longitude: number, dispatch: any }) => {
    const [GeoJSONLayer, Point, geometryEngine] = await loadMultipleModules(["esri/layers/GeoJSONLayer", "esri/geometry/Point", "esri/geometry/geometryEngine"])
    if (latitude && longitude) {
        const newPoint = new Point({
            latitude: latitude,
            longitude: longitude,
            spatialReference: {
                wkid: 4326
            }
        })
        const bufferDistance = 10;
        const geodesicBufferGeometry = geometryEngine.geodesicBuffer(newPoint, bufferDistance, "meters")
        let eleArray: string[] = [];
        geodesicBufferGeometry.rings[0].forEach((element: any[]) => {
            eleArray.push(element[1] + " " + element[0]);
        });
        const geosolutions = process.env.REACT_APP_GEOSERVER_OWS;
        const GeoURL = (typeNames: string, cqlFilter: string) => `${geosolutions}/wfs?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&typeNames=${typeNames}&cql_filter=${cqlFilter}&outputFormat=application/json`;
        const typeNames = 'tipnque:terrace_gm_4326';
        const cqlFilter = `OVERLAPS(the_geom, Polygon((${eleArray.join(",")})))`;
        const wfs = GeoURL(typeNames, cqlFilter);
        axios.get(wfs).then((response) => {
                if(response.status !== 200){
                    // console.log(response)
                    return;
                }
                if(response?.data === undefined || response?.data === null){
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