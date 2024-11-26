import { useRef } from "react";
import { FileDrop } from "react-file-drop";
import { toast } from "react-toastify";
import { setEpcFormData } from "../../ReduxTool/Slice/Auth/UserVerifyReducer";
import { FileData, FileDataProps } from "../../ReduxTool/Slice/Dashboard/dashboardTypes";
import { useAppDispatch } from "../../ReduxTool/store/hooks";
import { IconCloudUpload } from "../../assests/icons/MapToolsIcons";
import "../../assests/scss/epc/FileUpload.scss";
import { Progress } from "./Progress";

export default function FileUpload({ acceptType, btnLabel, uploaded, setUploaded, isSingle = false, name, filenames, setFileNames, handlePreviewClick }: FileDataProps) {
  const inputRef = useRef<HTMLInputElement>(null), dispatch = useAppDispatch();
  // const [filenames, setFileNames] = useState<FileData[]>([]);

  const fileHandler = (files: FileList | null) => {
    if (files && files.length > 0) {
      const fNames: FileData[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // uploaded=file
        if (uploaded && name) {
          dispatch(setEpcFormData({ ...uploaded, [name]: file }))
        }
        const fileExtension = "." + file.name.split(".").slice(1).join(".").toLowerCase().trim();
        if (fileExtension !== acceptType) {
          return toast.error("File not valid.", { toastId: "customID" });
        }
        if (file.size <= 10 * 1024 * 1024) {
          // Limit to 10MB
          fNames.push({
            name: file.name,
            icon: file.name.split(".")[1]?.toUpperCase().trim() || "",
            file: file,
          });
        } else {
          toast.error(`File ${file.name} exceeds the maximum size of 10MB and will not be uploaded.`, { toastId: "customID" });
        }
      }
      setFileNames((prev) => [...prev, ...fNames]);
    } else {
      toast.error("file type not supported", { toastId: "customID" });
    }
  };

  const handleClear = (name: string, keyName?: string) => {
    setFileNames((prev) => prev.filter((file) => file.name !== name));
    dispatch(setEpcFormData({ ...uploaded, [keyName!]: "" }))
  };

  const filePicker = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <div className="main-box1 group">
        {/* <label className="label-box1">{label}</label> */}
        {/* <input type="file" className="upload-input1 peer" {...props} /> */}
        {/* {props.errors ? (<span className={`helper-box1 ${props.errors ? "text-rose-400" : ""}`} >   ERROR... </span>) : (<span className={`helper-box1`}>   {props.helpertext && "accept" + props.acceptType + "only"} </span>)} */}
      </div>
      <div className="main-box1 group">
        {(isSingle && filenames.length !== 1) && <FileDrop onTargetClick={filePicker} onDrop={(f) => fileHandler(f)}>
          <label className="label-box1" htmlFor="epcUpload"> Upload {btnLabel}</label>
          <input className="upload-input1 peer" name={name} accept={acceptType} value="" ref={inputRef} multiple type="file" onChange={(e) => fileHandler(e.target.files)} />
        </FileDrop>}
        <div className="progressContainer">
          {filenames.map((file, i) => <Progress key={i} name={file.name} keyName={name} icon={file.icon} file={file.file} handleClear={handleClear} handlePreviewClick={handlePreviewClick} />)}
        </div>
      </div></>
  );
}
