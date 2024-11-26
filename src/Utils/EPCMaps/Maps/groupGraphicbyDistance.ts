import { getGroupByLng } from "./groupByLng";
import { sortGroupGraphicbyColRows } from "./groupingGraphics";


/**
 * The function `groupGraphicbyDistance` takes an array of graphics, the number of columns, and the
 * number of rows, and groups the graphics based on their longitude values.
 * @param {__esri.Graphic[]} graphics - An array of __esri.Graphic objects representing graphics on a
 * map.
 * @param {number} columns - The `columns` parameter represents the number of columns in the grid.
 * @param {number} rows - The `rows` parameter represents the number of rows in which the graphics will
 * be grouped.
 * @returns a two-dimensional array of __esri.Graphic objects.
 */
// export function groupGraphicbyDistance(
//     graphics: __esri.Graphic[],
//     columns: number,
//     rows: number,
//     pointGraphicRotation: __esri.Graphic
// ): __esri.Graphic[][] {
//     // const { columns, rows } = getColsRowsCombination(groupSize)
//     let midPoint =  Math.round(columns / 2);
//     const groupedLng = getGroupByLng(graphics, 'longitude');
//     // console.log(groupedLng)
//     let polyCollections: any[] = [];
//     (Object.keys(groupedLng)).forEach(element => {
//         let v = element;
//         let lastSavedIndex = 0;
//         let arrLng = (groupedLng[v as keyof object]); 
//         arrLng.forEach((element: any) => {
//             lastSavedIndex = lastSavedIndex + 1;
//             if (lastSavedIndex >= midPoint) {
//                 element.roadindex = 1;
//                 if (lastSavedIndex == columns) {
//                     lastSavedIndex = 0;
//                 }
//             }
//         });
//         polyCollections.push(arrLng);
//     });

//     const graphicCollection = sortGroupGraphicbyColRows(polyCollections, rows, columns, pointGraphicRotation, []);
//     return graphicCollection;
// }

export function groupGraphicbyDistance(
    graphics: __esri.Graphic[],
    columns: number,
    rows: number,
    pointGraphicRotation: __esri.Graphic
): __esri.Graphic[][] {
    let midPoint = Math.round(columns / 2);
    // console.log("MidPoint:", midPoint);

    const groupedLng = getGroupByLng(graphics, 'longitude');
    // console.log("Grouped by Longitude:", groupedLng);

    let polyCollections: any[] = [];
    Object.keys(groupedLng).forEach(element => {
        let arrLng = groupedLng[element as keyof object];
        // console.log("Processing group:", element, arrLng);

        let lastSavedIndex = 0;
        arrLng.forEach((graphic: any) => {
            lastSavedIndex++;
            if (lastSavedIndex >= midPoint) {
                graphic.roadindex = 1;
                if (lastSavedIndex === columns) {
                    lastSavedIndex = 0;
                }
            }
        });
        polyCollections.push(arrLng);
    });

    // console.log("Poly Collections before sorting:", polyCollections);

    const graphicCollection = sortGroupGraphicbyColRows(polyCollections, rows, columns, pointGraphicRotation, []);
    
    // Check if grouping was successful
    const totalGroupedGraphics = graphicCollection.flat().length;
    if (totalGroupedGraphics !== graphics.length) {
        console.warn("Unable to group all graphics. Returning as is.");
        return [graphics]; // Return all graphics in a single group
    }

    // console.log("Sorted Graphic Collection:", graphicCollection);
    return graphicCollection;
}


