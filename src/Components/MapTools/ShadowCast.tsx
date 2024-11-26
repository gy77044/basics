import { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../ReduxTool/store/hooks"
import globalLayers from "../../Utils/EPCMaps/Maps/GlobaLMap"
import { Toogle1 } from "../AllInput/AllInput"
import { getShadowPointPolygon } from "../../Utils/Common/ShadowWidget/getShowPointsPolygon"
import shadowImg from "../../assests/img/shadow.png";
import ShadowCast from "@arcgis/core/widgets/ShadowCast.js"
import { toast } from "react-toastify"
import { setInformationModal, setIRRadiance, setShadow } from "../../ReduxTool/Slice/Map/MapReducer"

const ShadowCastModal = () => {
  const [activestatus, setActivStatus] = useState(false);
  const [activeIrradiance, setActivIrradiance] = useState(false);
  let renders = useRef<number>(0)
  const dispatch = useAppDispatch()
  const { shadowToggle, irrradianceToggle } = useAppSelector(state => state.mapref)

  const handleTheStatus = async (status: boolean) => {
    if(globalLayers.activeView === '2D'){
      dispatch(
        setInformationModal({
          state: true,
          title: "Mode Switch",
          content: `You are currently in 2D mode. Please switch to 3D mode to enable editing.`,
          infomationbtnTitle: 'Switch to 3D'
        })
      );
      dispatch(setShadow(false))
      return false;
    } else {

      if (!shadowToggle) {
        if (globalLayers.shadowCastWidget === null) {
          globalLayers.shadowCastWidget = new ShadowCast({
            view: globalLayers.view!,
            container: document.getElementById("shadow") as HTMLElement,
          });
  
          if(!globalLayers.shadowCastWidget) return;
  
          globalLayers.shadowCastWidget.when(() => {
            console.log('shadow Initilized')
            const viewModel = globalLayers.shadowCastWidget?.viewModel!;
            // Set the default shadow color to green
            globalLayers.shadowCastWidget?.set('color', '#b3b1b1');
  
            viewModel.watch(['startTimeOfDay'], (startTimeOfDay: number) => {
              // debouncedUpdateShadowPointsRender()
              if (activeIrradiance) {
                globalLayers.removeShadowIrradianceMap()
                setActivIrradiance(false)
              }
            })
            viewModel.watch(['endTimeOfDay'], (endTimeOfDay: number) => {
              if (activeIrradiance) {
                globalLayers.removeShadowIrradianceMap()
                setActivIrradiance(false)
              }
            })
          })
        }
        globalLayers.shadowCastWidget.visible = true;
        globalLayers.shadowCastWidget.visibleElements.tooltip = true;
        setActivStatus(true);
        dispatch(setShadow(true))
      } else {
        dispatch(setShadow(false))
        setActivStatus(true);
        if (globalLayers.shadowCastWidget) {
          globalLayers.shadowCastWidget.visible = false;
          globalLayers.shadowCastWidget.visibleElements.tooltip = false;
          globalLayers.removeShadowIrradianceMap()
        }
      }
    }
    return true
  };
    // to show heat map on the sceneview 
  const handleShadowHeatMap = async () => {
    globalLayers.removeShadowIrradianceMap();
    if(shadowToggle){

      // if false add irradinace
      if(!irrradianceToggle){
        await getShadowPointPolygon()
        dispatch(setIRRadiance(false))
      } else {
        // toggle to false
        globalLayers.removeShadowIrradianceMap();
        dispatch(setIRRadiance(false))
      }



    } else {
      toast.info('Please enable Shadow Casting first.', { toastId: 'enable' })
    }
    // if(activestatus) {
    //   if(globalLayers.activeView === '2D'){
    //     dispatch(
    //       setInformationModal({
    //         state: true,
    //         title: "Mode Switch",
    //         content: `You are currently in 2D mode. Please switch to 3D mode to enable editing.`,
    //         infomationbtnTitle: 'Switch to 3D'
    //       })
    //     );
    //   } else {
    //     if(globalLayers.shadowCastWidget === null){
    //       toast.info('Please enable Shadow Casting First.', { toastId: 'enable' })
    //     } else {
    //       if(globalLayers.shadowCastWidget.visible === false){
    //         toast.info('Please enable Shadow Casting First.', { toastId: 'enable' })

    //       } else {
    //         dispatch(
    //           setInformationModal({
    //             state: true,
    //             title: "Mode Switch",
    //             content: `You are currently in 3D mode. Please switch to 2D mode to enable editing.`,
    //             infomationbtnTitle: 'Switch to 3D'
    //           })
    //         );

    //       }
    //     }
    //   }
    //   return;
    // };
    // if(!activeIrradiance){
    //   await getShadowPointPolygon()
    // } else {
    //   globalLayers.removeShadowIrradianceMap()
    // }
    // setActivIrradiance(!activeIrradiance)
  }
  
  useEffect(() => {
    const div = document.getElementById("shadowCast")
    if (div && renders.current === 0) {
      renders.current = renders.current + 1;
      globalLayers.shadowCast('add')
    }

  }, [])

  return (
    <>
      <div className='main-section2'>
        <div className="flex flex-row justify-between">
        <h4 className="para-md">Shadow Analysis</h4>
          <Toogle1 label={"Yes"} isChecked={shadowToggle} onToggle={handleTheStatus} />
        </div>
        {/* shadow widget scene here  */}
        <div className="w-full" id="shadowwrapper">
          <div className="w-full" id="shadow"></div>
        </div>
        {shadowToggle === false && <img className="blur-sm w-full" src={shadowImg} />}
      </div>
      <div className='main-section2'>
        <div className="flex flex-row justify-between">
          <h4 className="para-md">Module Irradiance</h4>
          <Toogle1 label={"Yes"} isChecked={irrradianceToggle} onToggle={handleShadowHeatMap} />
        </div>
      </div>

    </>
  )
}

export default ShadowCastModal

