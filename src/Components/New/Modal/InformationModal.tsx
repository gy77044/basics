import { toast } from "react-toastify";
import { buildingBase, switchView } from "../../../lib/EPC/SwitchingMapLayers/SwitchMap";
import { setInformationModal, setIRRadiance, setIs3dMap, setShadow } from "../../../ReduxTool/Slice/Map/MapReducer";
import { useAppDispatch, useAppSelector } from "../../../ReduxTool/store/hooks";
import globalLayers from "../../../Utils/EPCMaps/Maps/GlobaLMap";

interface informationModalProps {
  modaltitle: string;
  content: JSX.Element | string;
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
  isHandleBtn?: boolean;
  handleBtn?: () => void;
  customCss?: string;
  btnTitle?: string
}

const InformationModal: React.FC<informationModalProps> = ({
  isHandleBtn,
  modaltitle,
  content,
  setClose,
  handleBtn,
  customCss,
  btnTitle
}) => {
  const { informationTitle, informationContent, infomationbtnTitle } = useAppSelector((state) => state.mapref);
  const dispatch= useAppDispatch();
  const handleSwitching = async () => {
    if(!globalLayers.sketchLayers.graphics.length){
      if(globalLayers.activeView === '2D'){
        dispatch(
          setInformationModal({
            state: true,
            title: "Mode Switch",
            content: `No Roof found to Switch to 3D view.`,
          })
        );
      }
      return;
    } 
    if(!globalLayers.getGraphicbyItsName(buildingBase)){
      dispatch(
        setInformationModal({
          state: true,
          title: "Mode Switch",
          content: `No Roof found to Switch to 3D view.`,
        })
      );
      return;
    } 

    if (globalLayers.activeView === '2D') {
        globalLayers.activeView = '3D';
        dispatch(
            setInformationModal({
              state: true,
              title: "Mode Switch",
              content: `You are currently in 3D mode. Please switch to 2D mode to enable editing.`,
            })
          );

        if(globalLayers.sketchViewModel_Draw.activeTool){
            globalLayers.sketchViewModel_Draw.cancel()
        }
        dispatch(setIs3dMap(true));
        const inp = globalLayers.searchWidgetInput;
        if(inp && inp.container.querySelector(".esri-search__input")){
            inp.container.querySelector(".esri-search__input").disabled = true;      
        }
        globalLayers.sketchViewModel_Draw.cancel()
    } else {
        globalLayers.activeView = '2D';
        dispatch(setIs3dMap(false));
        dispatch(setInformationModal({ state: false, title: "", content: "" }));
        const inp = globalLayers.searchWidgetInput;
        if(inp && inp.container.querySelector(".esri-search__input")){
            inp.container.querySelector(".esri-search__input").disabled = false;      
        }
    }
    
    await switchView(globalLayers.activeView)
  }
  const handlebtnInfo = async () => {
    if(infomationbtnTitle){
      try{
        await handleSwitching()
      }
      catch(e){
        console.error(e)
      }
      return
    }
  }

  const handleBtn_ = () => {
    if(isHandleBtn && btnTitle === 'Switch to 2D'){
      dispatch(setShadow(false))
      dispatch(setIRRadiance(false)) 
    }
    if(handleBtn){
      handleBtn()
    }
  }


  return (
    <div className="modal-nobackdrop1">
      <div className="main-modal3">
        <h4 className={`heading-sm-semibold ${customCss}`}>
          {informationTitle} :
        </h4>
        <p className="para-md text-gray-600 pt-2">{informationContent}</p>
      
      { infomationbtnTitle !== "" && <div className={`flex gap-4 max-sm:flex-col mt-4 float-right`}>
        <button className={`btn btn-sm-primary`} onClick={handlebtnInfo}>
          {infomationbtnTitle}
        </button>
      </div>}
     { infomationbtnTitle === "" &&<div className={`flex gap-4 max-sm:flex-col mt-4 float-right ${!isHandleBtn && "hidden"}`}>
        <button className={`btn btn-sm-primary`} onClick={handleBtn_}>
          {btnTitle&&btnTitle}
        </button>
      </div>}
      </div>
      
    </div>
  );
};

export default InformationModal;


