import Polygon from '@arcgis/core/geometry/Polygon'
import * as projection from '@arcgis/core/geometry/projection.js'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { IconDrawerReDraw } from '../../../../../assests/icons/DrawerIcons'
import { IconDeleteRed, Iconfly } from '../../../../../assests/icons/EPCIcons/Icons'
import { IconErrorPage } from '../../../../../assests/icons/Icons'
import { Button } from '../../../../../Components/AllButton/AllButtons.tsx'
import { Input } from '../../../../../Components/AllInput/AllInput'
import { NewModal } from '../../../../../Components/New/Modal/NewModal'
import ReactSelect from '../../../../../Components/New/Select/ReactSelect'
import { buildingSymbology } from '../../../../../lib/EPC/SketchDraw/SketchSymbols/sketchSymbols'
import { buildingBase } from '../../../../../lib/EPC/SwitchingMapLayers/SwitchMap'
import { ProjectTy } from '../../../../../ReduxTool/Slice/Auth/types'
import { getStateDiscom, getTerrifData } from '../../../../../ReduxTool/Slice/CommonReducers/CommonActions'
import { setModalHeaderFooter } from '../../../../../ReduxTool/Slice/CommonReducers/CommonReducers'
import { IallTypestate, ITariffType } from '../../../../../ReduxTool/Slice/CommonReducers/types'
import { setAccord } from '../../../../../ReduxTool/Slice/Drawer/DrawerReducer'
import { setInformationModal } from '../../../../../ReduxTool/Slice/Map/MapReducer'
import { dataSourceResType, EPCProjectSetupType, getmoduleAcCable, getModuleCapacity, getmoduleDcCable, getModuleInveterById, getModuleManufacturer, getPVModuleDetailsById, getWeatherDataSource, initialRoofDetails, lossCalculationResType, ModuleACcableResType, moduleCapacityType, ModuleCBcableResType, moduleDetailsType, moduleInverterCapacityValue, moduleInverterDetailsType, roofDetailsType, setModuleInfo, setPlantInfraStructureLoss, setRoofAnalysisProjectSetupDetails, setRoofDesignArea, setRoofDetails, setRoofOneError } from '../../../../../ReduxTool/Slice/Partner/EPC'
import { useAppDispatch, useAppSelector } from '../../../../../ReduxTool/store/hooks'
import { baseURL, requestUrl } from '../../../../../Utils/baseUrls'
import { filterKeyIncludeArr, formatReactSelectOptions } from '../../../../../Utils/commonFunctions'
import { defaultmoduleLength, defaultmoduleWidth } from '../../../../../Utils/Const'
import globalLayers from '../../../../../Utils/EPCMaps/Maps/GlobaLMap'
import { addMarkerToMap, getCoordinatesFromAddress, getStateFromCoordinates } from '../../../../../Utils/EPCMaps/Maps/LazyloadMap'
import { Accordion1 } from '../../LeadBoard/PvnxtLeads/PvNxtLeads'
import RoofOne from './ProjectSetup/RoofOne/RoofOne'
import Toast from '../../../../../Components/ErrorBoundry/Toast'
const ProjectSetupLayout = () => {
  const dispatch = useAppDispatch();
  const { modalData } = useAppSelector(state => state.commonReducers.modal)
  const isBuildingThere = useAppSelector(state => state.mapref.isBuildingThere)
  const [isOpenConfirm, setIsOpenConfirm] = useState(false)
  const { roofAnalysis: { roofDetails, selectedProject, formDetails, roofDesign },error } = useAppSelector(state => state.EPCDetails);
  const { allDiscom } = useAppSelector(state => state.commonReducers);
  const { providertype } = useAppSelector((state) => state.commonReducers);
  const { is3DMap } = useAppSelector(state => state.mapref)
  const selectedprojectDetails = selectedProject as ProjectTy;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formDetails.projectsetup.address) {
        const inp = globalLayers?.searchWidgetInput;
        if (inp) {
          (inp as __esri.Search).set('searchTerm', formDetails.projectsetup.address )
          // console.log(inp, 'inp')
        }
        const searchInput = inp?.container?.querySelector(".esri-search__input");
        if (searchInput) {
          // console.log(formDetails.projectsetup.address, '48');
          
          (searchInput as HTMLInputElement).value = formDetails.projectsetup.address;
          if (selectedprojectDetails && selectedprojectDetails.isepccomplete) {
            (searchInput as HTMLInputElement).disabled = true;
          }
        }
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [formDetails.projectsetup.address]);

  useEffect(() => {
    
    globalLayers.buildingdDrawn = [];
    if (selectedprojectDetails && selectedprojectDetails.projectid) {
      bindFormDetails(selectedprojectDetails);
    } else {
      globalLayers.enableGraphicEditing(true)
      getInitialLists();
    };
  }, []);

  const getInitialLists = async () => {
    const coordinates = await getCoordinatesFromAddress(selectedprojectDetails.address);
    if(!coordinates){
      Toast({ messageText: selectedprojectDetails.address + ' could not be found ,Please provide your correct location.' , messageType: 'W', autoClose: 3000, toastId: selectedprojectDetails.address })
      return;
    }
    if (coordinates?.latitude && coordinates?.longitude) {
      const stName = await getStateFromCoordinates(coordinates!.longitude, coordinates!.latitude);
      await dispatch(getStateDiscom(stName));
    };
  };
  const bindFormDetails = async (projectDetails: ProjectTy) => { ///*value: string, id?: string*/) => {
    try {
      let moduleManufacturer:any = [],moduleCapacity={} as any,moduleCapacityType=[] as moduleCapacityType[];
      if(projectDetails.pvmodule && projectDetails.pvmodule.manufacturer){
        const {payload:module} = await dispatch(getModuleManufacturer(projectDetails.pvmodule.manufacturer));
        const {payload:capacity}  = await dispatch(getPVModuleDetailsById(projectDetails?.pvmodid??moduleManufacturer[0].id));   
        const {payload:moduleCapacityLists} = await dispatch(getModuleCapacity(projectDetails.pvmodule.manufacturer))
        moduleManufacturer = module;
        moduleCapacity = capacity;
        moduleCapacityType = moduleCapacityLists;
      };
      const stName = await getStateFromCoordinates(projectDetails.lng, projectDetails.lat);
      const { payload: allDiscom } = await dispatch(getStateDiscom(stName));
      const { payload: providertype } = await dispatch(getTerrifData(projectDetails.providerid))
      let weatherPayload = {} as dataSourceResType;
      if (projectDetails.weatherdatasource) {
        const { payload } = await dispatch(getWeatherDataSource({ searchValue: "", id: projectDetails.weatherdatasource }));
        weatherPayload = payload;
      };
      let lossCalculationData = {} as any, inveterCapacity = {} as moduleInverterDetailsType;
      if (projectDetails.pvinvid) {
        const { payload } = await dispatch(getModuleInveterById(projectDetails?.pvinvid));
        inveterCapacity = payload
      };

      let {payload:cablebtwmoduleandinverter} = await dispatch(getmoduleDcCable());
      let {payload:cablebtwaccbandtp} = await dispatch(getmoduleAcCable());
      if (projectDetails.lossid) {
        lossCalculationData = await getmoduleCableById(projectDetails.projectlosscalculation.cablebtwmoduleandinverter, projectDetails.projectlosscalculation.cablebtwaccbandtp);
      };
      await updateFormDetails(projectDetails, moduleManufacturer, moduleCapacityType, inveterCapacity, allDiscom, providertype, lossCalculationData,cablebtwmoduleandinverter,cablebtwaccbandtp);

    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const getmoduleCableById = async (dcId: string, acId: string) => {
    try {
      const { data: { responseData: dcModule } } = await baseURL.get(requestUrl.getmoduleDCcable + "/" + dcId);
      const { data: { responseData: acModule } } = await baseURL.get(requestUrl.getmoduleAcCable + "/" + acId);
      return { dcModule, acModule };
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  const getTotalModule = (totalRoofArea: number): number => {
    let defualtModuleArea = defaultmoduleLength + defaultmoduleWidth;
    return Math.round(totalRoofArea / defualtModuleArea);
  }

  // Deserialize the JSON back into Graphics and add to GraphicLayer
  function deserializeGraphicLayer(serializedData: string) {
    const graphicsData = JSON.parse(serializedData);
    if (!globalLayers.solarpanelLayer) {
      globalLayers.solarpanelLayer = new GraphicsLayer({
        title: 'Solar Panels',
      })


    }
    // const graphicLayer = new GraphicsLayer();

    graphicsData.forEach((graphicJSON: any) => {
      const graphic = Graphic.fromJSON(graphicJSON);
      globalLayers.solarpanelLayer?.add(graphic);
    });

    globalLayers.multipleSolarPanelLayers[0] = globalLayers.solarpanelLayer;

    globalLayers.map?.layers.add(globalLayers.solarpanelLayer);

    return globalLayers.solarpanelLayer;
  }

  const updateFormDetails = async (projectDetails: ProjectTy, moduleManufacturer: moduleInverterCapacityValue[], moduleCapacity: moduleCapacityType[], inveterCapacity: moduleInverterDetailsType, allDiscom: IallTypestate[], providertype: ITariffType[], lossCalculationData: lossCalculationResType,cablebtwmoduleandinverter:any,cablebtwaccbandtp:any) => {
    try {
      if (projectDetails.parapetwall) {
        globalLayers.parapetwall = projectDetails.parapetwall;
      } else {
        globalLayers.parapetwall = 0
      }
      let updatedForm: roofDetailsType = {
        ...initialRoofDetails,
        structureDetails: {
          ...initialRoofDetails.structureDetails,
          sanctionload: projectDetails.sanctionload ? projectDetails.sanctionload.toString() : initialRoofDetails.structureDetails.sanctionload,
          loading: projectDetails.loading ? projectDetails.loading.toString() : initialRoofDetails.structureDetails.loading,
          buildingheight: projectDetails.buildingheight ? projectDetails.buildingheight.toString() : initialRoofDetails.structureDetails.buildingheight,
          parapetwall: projectDetails.parapetwall ? projectDetails.parapetwall.toString() : initialRoofDetails.structureDetails.parapetwall,
          rooftype: projectDetails.projecttype ? { label: projectDetails.projecttype, value: projectDetails.projecttype } : initialRoofDetails.structureDetails.rooftype,
          azimuthangle: projectDetails.roofazimuthangle ? projectDetails.roofazimuthangle : initialRoofDetails.structureDetails.azimuthangle,
          tiltangle: projectDetails.rooftiltangle ? projectDetails.rooftiltangle : initialRoofDetails.structureDetails.tiltangle,
          modulemanufacturer:moduleManufacturer.length>0?formatReactSelectOptions(filterKeyIncludeArr(moduleManufacturer, "id", projectDetails.pvmodid), { labelKey: "manufacturer", valueKey: "id" }, true):null,
          // modulecapacity: typeof(moduleCapacity) === 'object'?{ label: moduleCapacity.stname, value: moduleCapacity.pvmodid }:null,
          modulecapacity : moduleCapacity.length>0 ? formatReactSelectOptions(filterKeyIncludeArr(moduleCapacity, "id", projectDetails.pvmodid), { labelKey: "name", valueKey: "id" }, true):null,
          maxplantcapacity: projectDetails.plantcapacity ? projectDetails.plantcapacity.toString() : initialRoofDetails.structureDetails.maxplantcapacity,
          //module structure
          MMSType: {label:projectDetails?.mmstype ?? "Fixed Tilt",value:projectDetails?.mmstype ?? "Fixed Tilt"},
          moduleOrientation: projectDetails.moduleorientation ? {label:projectDetails.moduleorientation,value:projectDetails.moduleorientation} : initialRoofDetails.structureDetails.moduleOrientation,
          arrayRows: projectDetails.arrayrows ? projectDetails.arrayrows.toString() : initialRoofDetails.structureDetails.arrayRows,
          arrayColumns: projectDetails.arraycolumns ? projectDetails.arraycolumns.toString() : initialRoofDetails.structureDetails.arrayColumns,
          rowspacing: projectDetails.rowspacing ? projectDetails.rowspacing.toString() : initialRoofDetails.structureDetails.rowspacing,
          modulespacing: projectDetails.modulespacing ? projectDetails.modulespacing.toString() : initialRoofDetails.structureDetails.modulespacing,
          azumuthAngle: projectDetails.mmsazimuthangle ? {label:projectDetails.mmsazimuthangle.toString(),value:projectDetails.mmsazimuthangle.toString()} : initialRoofDetails.structureDetails.azumuthAngle,
          tiltAngle: projectDetails.mmstiltangle ? projectDetails.mmstiltangle.toString() : initialRoofDetails.structureDetails.tiltAngle,
          inveterType: projectDetails?.invertertype === 0 ? "onGrid" : projectDetails?.invertertype == 1 ? "offGrid" : projectDetails?.invertertype == 2 ? "hybrid" : "onGrid",
          inveterManufacturer: projectDetails.pvinverter ? { label: projectDetails.pvinverter.name, value: projectDetails.pvinverter.id } : initialRoofDetails.structureDetails.inveterManufacturer,
          inveterCapacity: { label: inveterCapacity.stname, value: inveterCapacity.pvinvid }

        },
        keepoutsDetails: projectDetails?.keepouts ?? [],
        electricalDetails: {
          ...initialRoofDetails.electricalDetails,
          stringingType: "Manual",
          stringingSize: projectDetails.stringingsize ? projectDetails.stringingsize.toString() : initialRoofDetails.electricalDetails.stringingSize,
          cablebtwmoduleandinverter:Object.keys(lossCalculationData).length>0 ? {label:lossCalculationData?.dcModule?.gennocores,value:lossCalculationData?.dcModule?.cbcableid}: (cablebtwmoduleandinverter && cablebtwmoduleandinverter.length>0)?{label:cablebtwmoduleandinverter[0].gennocores,value:cablebtwmoduleandinverter[0].cbcableid}:null,
          cablebtwaccbandtp: Object.keys(lossCalculationData).length>0 ? {label:lossCalculationData?.acModule?.mfgname,value:lossCalculationData?.acModule?.accableid}:(cablebtwaccbandtp && cablebtwaccbandtp.length>0)?{label:cablebtwaccbandtp[0].mfgname,value:cablebtwaccbandtp[0].accableid}:null,
          invertertoaccbdistance: projectDetails.invertertoaccbdistance ? projectDetails.invertertoaccbdistance.toString() : initialRoofDetails.electricalDetails.invertertoaccbdistance,
          moduletoinverterdistance: projectDetails.moduletoinverterdistance ? projectDetails.moduletoinverterdistance.toString() : initialRoofDetails.electricalDetails.moduletoinverterdistance,
        }
      };
      globalLayers.roofType = projectDetails.projecttype ? projectDetails.projecttype : initialRoofDetails.structureDetails.rooftype.value;
      globalLayers.totalNumberofModules = projectDetails.noofmodules ? Math.round(projectDetails.noofmodules) : getTotalModule(projectDetails.useablearea);
      //project setup
      let updatedPeojectSetupForm: EPCProjectSetupType = {
        ...formDetails.projectsetup,
        providerid: formatReactSelectOptions(filterKeyIncludeArr(allDiscom, "providerid", projectDetails.providerid), { labelKey: "providername", valueKey: "providerid" }, true),
        consumercategoryid: formatReactSelectOptions(filterKeyIncludeArr(providertype, "consumercategoryid", projectDetails.consumercategoryid), { labelKey: "consumercategoryname", valueKey: "consumercategoryid" }, true),
      };

      globalLayers.enableGraphicEditing(!projectDetails.isepccomplete)

      // projectDetails.graphicLayer add it to map 
      if (projectDetails.graphicLayer && projectDetails.graphicLayer !== "") {
        let graphicLayer = typeof projectDetails.graphicLayer === "string" ? JSON.parse(projectDetails.graphicLayer) : projectDetails.graphicLayer;
        if (graphicLayer?.type && graphicLayer?.type === "FeatureCollection") {
          if ((graphicLayer as any).features.length) {
            const rings = ((graphicLayer as any).features[0].geometry.coordinates as number[][][]).map(points => {
              return points.map(point => {
                return [point[0], point[1], 0]
              })
            })
            const polygon = new Polygon({
              rings: rings,
              spatialReference: { wkid: 4326 }
            })

            const projectedPolygon = projection.project(polygon, { wkid: 102100 }) as Polygon;

            graphicLayer = new Graphic({
              geometry: projectedPolygon,
              symbol: buildingSymbology,
              attributes: {
                height: 0,
                elevation: 0,
                useablearea: projectDetails.useablearea,
                totalarea: projectDetails.totalroofarea,
                name: buildingBase + "_" + Math.random() * 100,
              }
            })

            globalLayers.removeLocationGraphic();
            globalLayers.removeLocationMarker();
          }
        }
        if (graphicLayer?.attributes && graphicLayer.attributes.elevationDirection) {
          updatedForm.structureDetails.tiltdirection = { label: graphicLayer.attributes.elevationDirection, value: graphicLayer.attributes.elevationDirection };
        }
        globalLayers.addStringGraphictoSketch(graphicLayer, projectDetails.buildingheight ? projectDetails.buildingheight : 0, projectDetails.mmstiltangle ? projectDetails.mmstiltangle : 0, projectDetails.mmsazimuthangle ? projectDetails.mmsazimuthangle : 0);
        // dispatch(setIsBuildingDrawn(true));
      }

      if (projectDetails?.keepouts && projectDetails?.keepouts.length > 0) {
        projectDetails.keepouts.forEach(ele => {
          if (ele.graphic && ele.graphic !== "") {
            globalLayers.addKeepoutGraphicstoSketch(JSON.parse(ele.graphic));
            //globalLayers.addStringGraphictoSketch(JSON.parse(ele.graphic), projectDetails.buildingheight, projectDetails.mmstiltangle, projectDetails.mmsazimuthangle)
          }
        })
      }

      if (projectDetails.panelLayer) {
        if (typeof projectDetails.panelLayer === 'string' && projectDetails.panelLayer.length > 0) {
          deserializeGraphicLayer(projectDetails.panelLayer)
          // globalLayers.solarpanelLayer = JSON.parse(projectDetails.panelLayer) as GraphicsLayer
          // globalLayers.map?.add(JSON.parse(projectDetails.panelLayer));
        }
      }

      // if (projectDetails.pvmodule?.manufacturer || initialRoofDetails.structureDetails.modulemanufacturer) {
      //   dispatch(getModuleCapacity(projectDetails.pvmodule ? projectDetails.pvmodule?.manufacturer : initialRoofDetails.structureDetails.modulemanufacturer));
      // }
      // if(projectDetails.pvinverter.name || initialRoofDetails.electricalDetails.inveterManufacturer){

      // }
      // if (selectedprojectDetails.pvmodid) {
      //   dispatch(getPVModuleDetailsById(selectedprojectDetails.pvmodid));
      // };
      dispatch(setRoofAnalysisProjectSetupDetails(updatedPeojectSetupForm));
      dispatch(setModuleInfo({ totalModules: projectDetails.noofmodules ? projectDetails.noofmodules.toString() : getTotalModule(projectDetails.totalroofarea).toString() }));
      globalLayers.totalroofArea = projectDetails.totalroofarea;
      globalLayers.totalUseableRoofArea = projectDetails.useablearea;
      globalLayers.defaultmodulePower = projectDetails.pvmodule?.stc??0;
      dispatch(setRoofDesignArea({ totalarea: projectDetails.totalroofarea ? projectDetails.totalroofarea : 0, useablearea: projectDetails.useablearea ? projectDetails.useablearea : 0 }));
      dispatch(setRoofDetails([updatedForm]));
      dispatch(setPlantInfraStructureLoss({ ...projectDetails.projectlosscalculation, cablebtwmoduleandinverter: lossCalculationData?.dcModule?.gennocores ?? "", cablebtwaccbandtp: lossCalculationData?.acModule?.mfgname ?? "" }))
      //loss Calculation

      dispatch(setAccord("Roof 1"));
    } catch (err: any) {
      console.log(err)
      toast.error(err.response?.data.message ?? "There was an issue to bind data. Please try again later.");
    }

  }
  const handleActionBtn = (actionType: string, idx: number) => {
    // console.log("action type")
    switch (actionType) {
      case "edit":
        dispatch(setModalHeaderFooter({ title: "Confirm", btnTxt: "Yes", secondaryBtnTxt: "No", modalData: { idx, actionType } }));
        setIsOpenConfirm(true);
        break;
      case "duplicate":
        dispatch(setRoofDetails([...roofDetails, roofDetails[idx]]));
        break;
      case "delete":
        dispatch(setModalHeaderFooter({ title: "Confirm", btnTxt: "Yes", secondaryBtnTxt: "No", modalData: { idx, actionType } }));
        setIsOpenConfirm(true);
        break;
      default:
    }
  }

  const handleOnClick1 = (actionType: string) => {
    // console.log(actionType)
    if (actionType === "Confirm") {
      globalLayers.removeGraphicbyName('building');
      if (globalLayers.sketchViewModel_Draw.activeTool !== null) {
        globalLayers.sketchViewModel_Draw.cancel();
      }
      addMarkerToMap(dispatch, globalLayers.userCurrentLocation.lat, globalLayers.userCurrentLocation.lng);
      dispatch(setRoofDetails([...roofDetails.slice(0, modalData.idx), ...roofDetails.slice(modalData.idx + 1)]));
    }
    setIsOpenConfirm(false)

  }
  const roofDetailsTable = () => {
    const tableHead = ["Name", "Module Count","Action"];
    const tableBody: any[] = [];
    roofDetails.forEach((el, indx) => {
      tableBody.push(<tr className="table-bodytr1">
        <td className="table-bodytd1">Roof {indx + 1}</td>
        <td className="table-bodytd1">{`${(roofDesign && roofDesign.totalModules && roofDesign.totalModules !== "NaN") ? roofDesign.totalModules : "0"} ${roofDetails[indx].structureDetails.sanctionload ? `(${roofDetails[indx].structureDetails.sanctionload} kWP)` : ""}`}</td>
        <td className="table-bodytd1">
          <div className='flex  items-center space-x-[1vh]'>
            <button className={`${(selectedProject as ProjectTy).isepccomplete?"cursor-default":"cursor-pointer"}`} disabled={(selectedProject as ProjectTy).isepccomplete} title="Draw & Select" onClick={() => handleActionBtn('edit', indx)}><IconDrawerReDraw /></button>
            <button className={`${(selectedProject as ProjectTy).isepccomplete?"cursor-default":"cursor-pointer"}`} title='Fly to map' onClick={() => globalLayers.flytobuilding()}><Iconfly /></button>
            <button className={`${(selectedProject as ProjectTy).isepccomplete?"cursor-default":"cursor-pointer"}`} title='Delete' disabled={(selectedProject as ProjectTy).isepccomplete} onClick={() => handleActionBtn('delete', indx)} ><IconDeleteRed /></button>
          </div>
        </td>
      </tr>)
    });

    return (

      <div className="overflow-x-auto m-2">
        <table className="table-main1">
          <thead className="table-head1">
            <tr>{tableHead.map((el, i) => <th key={`${i}/roofdetails`} className="table-headth1">{el}</th>)}</tr>
          </thead>
          <tbody className='table-body1'>{tableBody}</tbody>
        </table>
      </div>

    )
  };
  const handleNewRoof = () => {

    dispatch(setInformationModal({ state: true, title: "Drawing Mode", content: `Click points on the map to draw an area of interest. Press ESC to cancel the drawing mode.` }));
    if (!isBuildingThere) {
      globalLayers.activeLocationMarker()
      return;
    } else if (isBuildingThere || roofDetails?.length > 0) {
      // return toast.error("Only One Roof Design is Allowed",{toastId:"OnlyOneRoof"})
      dispatch(setInformationModal({ state: true, title: "Not Allow", content: `Only one roof design is allowed.` }));
    } else {
      if (selectedprojectDetails.isepccomplete) return;
      if (roofDetails) {

        dispatch(setRoofDetails([...roofDetails, initialRoofDetails]));
        dispatch(setAccord(`Roof ${roofDetails.length + 1}`));
        // dispatch(setAccord(`Roof 1`));
        // dispatch(setMapToolsTitle('Map Layer'));
      } else {
        if (globalLayers.sketchButton.refresh) {
          globalLayers.selectedGraphic = null;
          globalLayers.sketchButton.refresh.click();
        }
      }

      globalLayers.removeGraphicbyName('building')

      globalLayers.lastactiveTool = 'building'
      globalLayers.sketchButton.polygonEPC?.click();
    }
  };
  const handleChange = async (e: any, selectType?: any) => {
    const { name, value }: { name: string, value: any } = e?.target ?? selectType;
    let formData = { ...formDetails.projectsetup, [name]: value ?? e! },updateErr={...error};
    if(updateErr && updateErr[name]){
      delete updateErr[name];
      dispatch(setRoofOneError(updateErr))
    }
    if (name === "providerid") {
      await dispatch(getTerrifData(e.value));
      formData.consumercategoryid = null;
    };
    dispatch(setRoofAnalysisProjectSetupDetails(formData));

  };

  return (
    <>
      {isOpenConfirm && <NewModal modalSize="sm-x" name={"Model Name"} btnName={"Button Name"} isAbleCLick={true} onClick={handleOnClick1} children={<div className='text-center'>{modalData.actionType === "delete" ? <span>Would you like to delete the roof boundary? Please note that your current drawing and keepouts will be cleared.</span> : <span>Would you like to edit the roof boundary? Please note that your current drawing and keepouts will be cleared.</span>}</div>} setIsCLose={setIsOpenConfirm} />}
      <div className="lsb-body">
        {roofDetails.length > 0 ? <>
          <div className="flex justify-between items-center p-2 ">
            <div className="heading-sm">Roof Design</div>
            <Button className="btn btn-xs-primary" name="New Roof" onClick={handleNewRoof} />
          </div>
          <div className="main-section1 mt-4">
            <h4 className="para-lg">1.1 Roof Design Details</h4>
            {roofDetailsTable()}
          </div>
          <div className="main-section1 mt-4">
            <h4 className="para-lg">Site Details <span className="text-rose-400 text-lg pl-0.5">* </span> </h4>
            <div className="grid grid-cols-2 gap-2">
              <Input error={error?.projectname} disabled={selectedprojectDetails.isepccomplete || is3DMap} id={"projectname"} label={"Project Name"} name={"projectname"} value={formDetails.projectsetup.projectname} type={"text"} onChange={handleChange} isRequired={false} />
              <div title={`${formDetails.projectsetup.address.length ? formDetails.projectsetup.address : 'Project Complete Address'}`}>
                <Input error={error?.address} disabled={selectedprojectDetails.isepccomplete || is3DMap || true} id={"projectCompleteAddress"} label={"Project Complete Address"} name={"address"} value={formDetails.projectsetup.address} type={"text"} onChange={handleChange} isRequired={false} />
              </div>
              {allDiscom.length > 0 && <>
                <ReactSelect onChange={handleChange} options={formatReactSelectOptions(allDiscom, { labelKey: "providername", valueKey: "providerid" }, false)/*.map((el: any) => ({ label: el.providername, value: el.providerid }))*/} value={formDetails.projectsetup.providerid!} closeMenuOnSelect={true} key='providerid' labelname='Discom Provider' name='providerid' placeholder="Select an option .." disabled={selectedprojectDetails.isepccomplete || is3DMap} />
                <ReactSelect onChange={handleChange} options={formatReactSelectOptions(providertype, { labelKey: "consumercategoryname", valueKey: "consumercategoryid" }, false)/*.map((el: any) => ({ label: el.consumercategoryname, value: el.consumercategoryid }))*/} value={formDetails.projectsetup.consumercategoryid!} closeMenuOnSelect={true} key='consumercategoryid' labelname='Discom Provider Type' placeholder="Select an option .." name='consumercategoryid' disabled={selectedprojectDetails.isepccomplete || is3DMap} />
              </>}
            </div>
          </div>
        </> :
          <div className="grid place-content-center bg-white px-4 h-full">
            <div className="text-center">
              <IconErrorPage />
              <h1 className="heading-lg-bold mt-6 ">Uh-oh!</h1>
              <p className="para-lg text-gray-500 mt-2">Draw your roof to see how many <br />solar panels will fit.</p>
              <Button className="btn btn-md-primary mt-6" id="butotp" name="Create New Design" onClick={handleNewRoof} />
            </div>
          </div>
        }
        {roofDetails.map((data, indx) => <div className='mt-4'><Accordion1 headName={`Roof ${indx + 1}`} children={<RoofOne roofNum={indx} />} open={true} /></div>)}
      </div>
    </>
  );
};

export default ProjectSetupLayout;
