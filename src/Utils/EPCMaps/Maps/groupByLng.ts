import Collection from "@arcgis/core/core/Collection";
import Graphic from "@arcgis/core/Graphic";

export const getGroupByLng = (xs: __esri.Graphic[], sortbyProperty: string) => {
    var grouped = [] as Record<number, __esri.Graphic[]>;
    var xsarr: __esri.Graphic[] = xs;
    for (var i = 0; i < xs.length; i++) {
        var key = (xs[i].geometry as any).centroid.longitude;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(xsarr[i]);
    }
    return grouped;
}



export const getGraphicGroupByLng = (xs: Collection<Graphic>, sortbyProperty: string) => {
    var grouped = [] as Record<number, __esri.Graphic[]>;
    var xsarr = [] as Graphic[]
    xs.map(ele => {
        xsarr.push(ele)
    })

    for (var i = 0; i < xs.length; i++) {
        var key = ((xs as any).items[i].geometry as any).centroid.longitude;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(xsarr[i]);
    }

    const sortedGrouped = Object.keys(grouped)
        .map(Number)  // Convert keys back to numbers
        .sort((a, b) => a - b)  // Sort keys in ascending order
        .reduce((acc, key) => {
            acc[key] = grouped[key];
            return acc;
        }, {} as Record<number, Graphic[]>);

    return sortedGrouped;
}