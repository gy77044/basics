import { loadModules } from "esri-loader";

/**
 * The `convertSpatialSystem` function converts a geometry object from one spatial reference system to
 * another using the ArcGIS API for JavaScript.
 * @param geometry - The `geometry` parameter is an object that represents a spatial geometry. It has a
 * property `spatialReference` which is an object that contains the well-known ID (WKID) of the spatial
 * reference system of the geometry.
 * @param {102100 | 4326} outWkid - The `outWkid` parameter is the desired well-known ID (WKID) of the
 * spatial reference system to which you want to convert the input geometry. It can have a value of
 * either `102100` or `4326`.
 * @returns either the input geometry as is if its WKID matches the desired WKID, or the converted
 * geometry if the WKID needs to be changed. If any errors occur during module loading or projection,
 * it will return null.
 */
export const convertSpatialSystem = async function (geometry: { spatialReference: { wkid: any; }; }, outWkid: 102100 | 4326) {
    try {
        const [projection, SpatialReference] = await loadModules(["esri/geometry/projection", "esri/geometry/SpatialReference"]);
        await projection.load();

        if (geometry.spatialReference.wkid === outWkid) {
            // If the input geometry's WKID matches the desired WKID, return it as is
            return geometry;
        } else {
            const outSpatialReference = new SpatialReference({ wkid: outWkid });
            const convertedGeometry = projection.project(geometry, outSpatialReference);
            return convertedGeometry;
        }
    } catch (error) {
        // Handle any errors that might occur during module loading or projection
        console.error("Error converting spatial system:", error);
        return null;
    }
};