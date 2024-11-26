import Polygon from "@arcgis/core/geometry/Polygon";
import { weatherStationSelectionClick } from "../../../../ReduxTool/Slice/WeatherAnalysis/weatherStationSelectionClick";
import globalLayers from "../GlobaLMap";
import { addIndividualRoofModulebtClick, deleteIndividualRoofModule, selectGraphicOnClick } from "../Map";
import Point from "@arcgis/core/geometry/Point";
import { newRightClickPos, setInformationModal, setRightClick, setToolTipModal, TCopyState, toggleRoofConfirmBtn } from "../../../../ReduxTool/Slice/Map/MapReducer";
import { AppDispatch } from "../../../../ReduxTool/store/store";
import { LocationMarker, originalGeometry } from "../../../Const";
import { attachMarker } from "../../../../lib/EPC/MarkersFunctions/attachMarker";
import Graphic from "@arcgis/core/Graphic";

export const handleMapClickEvents = async (e: __esri.ViewClickEvent, showConfirmBtn: boolean, dispatch: AppDispatch, copyState: TCopyState, informationModal: boolean) => {
    dispatch(toggleRoofConfirmBtn(false));
    if (e.button === 0) {

        if(globalLayers.activeView === '3D') return;
        // check if right click marker state is active the set it to the current loction 

        // get the graphics when use shift + mouse click for copying the module
        const mapPointGraphic = await globalLayers.view?.hitTest({x: e.x,y: e.y})
        if(mapPointGraphic){
            const { results, screenPoint } = mapPointGraphic;
            results.forEach(res => {
                const { graphic } = res as  { graphic: Graphic, layer: any };
                if(graphic.attributes && graphic.attributes?.name && (graphic.getAttribute('name') as string).toLowerCase().includes('panel')){
                    graphic.setAttribute(originalGeometry, graphic.geometry)
                    globalLayers.selectedPanelGraphic = graphic;
                    
                    globalLayers.multipleSelectedGraphic = [...globalLayers.multipleSelectedGraphic, graphic];
                    
                    
                    globalLayers.solarpanelLayer?.graphics.remove(graphic);
                    globalLayers.sketchLayers.graphics.add(graphic);


                    globalLayers.sketchViewModel_Draw.update(globalLayers.multipleSelectedGraphic, { tool: 'move', enableScaling: false });

                }
            })
        }

        if(globalLayers.sketchButton.rightbuttonMarkerState === 'ongoing'){
            let pointGeometry: Point | undefined  = undefined
            globalLayers.removeLocationGraphic()
            pointGeometry =  globalLayers.view?.toMap({ x: e.x, y: e.y });
            if(!pointGeometry) return;
            globalLayers.sketchButton.rightbuttonMarkerState = '';
            attachMarker(pointGeometry)
            dispatch(setRightClick(''))
            return
        }
        // left is clicked 
        if (globalLayers.shiftPressed && globalLayers.copyState === 'ongoing' && globalLayers.selectedGraphic) {
            const clonedGraphic = globalLayers.selectedGraphic.clone();
            const clickedPoint = e.mapPoint;

            // Adjust the geometry of the cloned graphic
            if (clonedGraphic.geometry.type === 'polygon') {
                const deltaX = clickedPoint.x - clonedGraphic.geometry.extent.center.x;
                const deltaY = clickedPoint.y - clonedGraphic.geometry.extent.center.y;

                const polygon = clonedGraphic.geometry as Polygon;
                const newRings = polygon.rings.map(ring =>
                    ring.map(point => {
                        const newPoint = [point[0] + deltaX, point[1] + deltaY];
                        if (point.length > 2) {
                            newPoint.push(point[2]); // Preserve the z-coordinate if it exists
                        }
                        return newPoint;
                    })
                );
                clonedGraphic.geometry = new Polygon({
                    rings: newRings,
                    spatialReference: polygon.spatialReference
                });
            } else if (clonedGraphic.geometry.type === 'point') {
                const point = clonedGraphic.geometry as Point;
                point.x = clickedPoint.x;
                point.y = clickedPoint.y;
                clonedGraphic.geometry = new Point({
                    x: point.x,
                    y: point.y,
                    spatialReference: point.spatialReference
                });
            }
            // Add the cloned graphic to the appropriate layer
            globalLayers.sketchLayers.graphics.add(clonedGraphic);


        }
        globalLayers.sketchButton.currentButtonClicked = 'left';
        if (globalLayers.featureAddState === 'active') {
            addIndividualRoofModulebtClick(e)
            globalLayers.featureAddState = null;
        }
        if (globalLayers.featureAddState === 'select') {
            // fucntion to select the block from solarpanelLayer
            selectGraphicOnClick(e)
        }
        dispatch(setRightClick(''))
    }

    if (e.button === 2) {
        if(globalLayers.activeView === '3D') return;
        globalLayers.removeLocationMarker()
        globalLayers.sketchButton.currentButtonClicked = 'right';
        globalLayers.markerLocation = { x: e.x, y: e.y };
        globalLayers.userCurrentLocation = { lat: e.mapPoint.latitude, lng: e.mapPoint.longitude }
        dispatch(newRightClickPos({ position: globalLayers.markerLocation, markerPos: { latitude: e.mapPoint.latitude, longitude: e.mapPoint.longitude } }))
        if (globalLayers.featureAddState === 'delete') {
            deleteIndividualRoofModule(e)
            globalLayers.featureAddState = null;
        }
        globalLayers.sketchButton.rightbuttonMarkerState = 'start'
        dispatch(setRightClick('start'))
    }

    if (globalLayers.weatherStations.length) {
        weatherStationSelectionClick(e)
    }
}