import { Link } from "react-router-dom";
import { startReverification } from "../../ReduxTool/Slice/Auth/AuthReducer";
import { useAppDispatch, useAppSelector } from "../../ReduxTool/store/hooks";
import videoFile from "../../assests/img/Dashboard/EPC/EPC_Flow.mp4";
import { useRef, useState } from "react";
import Toast from "../../Components/ErrorBoundry/Toast";
import { setModalHeaderFooter } from "../../ReduxTool/Slice/CommonReducers/CommonReducers";
import Support from "../../Components/ProfileModal/Support";
import { suportRequestTy, SupportDTy } from "../../Components/AllInput/types";
import { NewModal } from "../../Components/New/Modal/NewModal";
import { FALSE } from "sass";
import { baseURL, requestUrl } from "../../Utils/baseUrls";

const EPCSignupReVerifictionPage = ({
  title,
  showbtn,
}: {
  title: string;
  showbtn?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [supportModal,setSupportModal] = useState<boolean>(false)
  const [supportDetails, setSupportDetails] = useState<any>({ fname: "", lname: "", mobile: "", countrycode: "", subject: "", message: "" })
  const [error,setError] = useState({})


  const handleReverification = () => {
    dispatch(startReverification(true));
  };

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // const togglePlayback = () => {
  //   const iframe = iframeRef.current;
  // };

  const handlePlayClick = () => {
    window.open(
      "https://terranxt.com/wp-content/uploads/2024/08/pvNXT_Portal_270824.mp4",
      "_blank"
    );
  };


  const openSupportModal = ()=>{
    dispatch(setModalHeaderFooter({ title: "Support", btnTxt: "Send", secondaryBtnTxt: "" }));
    setSupportDetails({fname: user.fname, lname: user.lname, mobile: `${user.country_mstr?.countrycode??""}${user.mobile}`, countrycode: user.country_mstr?.countrycode??"", subject: "", message: ""})
    setSupportModal(true)
  }
  const validation = ()=>{
    let isValid = true;
    const errors: Record<string, string> = {};
   const  validate =  [
      { field: "fname", condition: !supportDetails.fname, message: "First name is Required" },
      { field: "lname", condition: !supportDetails.lname, message: "Last name is Required" },
      { field: "subject", condition: !supportDetails.subject, message: "Subject is Required" },
      { field: "message", condition: !supportDetails.message, message: "Message is Required" },
    ]

    for (const { field, condition, message } of validate) {
      if (condition) {
        errors[field] = message;
        isValid = false;
      }     
    }
    if (Object.keys(errors).length > 0) {
      setError(errors);
    };
    return isValid;
  }

  const handleSupport = async()=>{
        const isvalid = validation()
        if (isvalid){
    const reqbody = {
      fname: supportDetails.fname,
      lname: supportDetails.lname,
      message: supportDetails.message,
      mobile: supportDetails.mobile,
      subject: supportDetails.subject,
      userid: user.userid
    } as suportRequestTy;
    try {
      const { data } = await baseURL.post(requestUrl.SupportEmail, reqbody);
      if (data && data.code === "200") {
        Toast({ messageText: "email send to terranxt team", autoClose: 1000, messageType: "S", toastId: "suportMessage" });
        setSupportModal(false);
        setError({});
      };
    } catch (err: any) {
      Toast({ messageText: "", messageType: "E", toastId: "suportMessage", autoClose: 1000 })
    }
        }
  }

  const handleViewProfileModalClose = ()=>{
        setSupportDetails({fname: "", lname: "", mobile: "", countrycode: "", subject: "", message: "" })
        setSupportModal(false)
  }

  const handleChange = (e:any)=>{
     const {name,value} = e.target 
     setSupportDetails((prev:any)=>({...prev,[name]:value}))
     if (error && error[name as keyof object]){
      delete error[name as keyof object];
      setError(error);
     }
  }


  return (
    <>
 {supportModal && <NewModal height="44vh" isAbleCLick onClick={handleSupport} setIsCLose={ handleViewProfileModalClose} name={"Support"} children={<Support profileState={supportDetails} error={error} handleChange={handleChange} />} modalSize="lg" btnName="support" />}
 <div className="flex flex-col items-center justify-center bg-white w-[80%] m-auto h-full">
        {showbtn === undefined && (<div className="text-center">
          <h2 className="heading heading-lg-bold">Verification Under Process</h2>
          <p className="para para-lg">
            We acknowledge receipt of your request. Please anticipate a response
            from us at the earliest, typically within 48 working hours.
            Meanwhile, we encourage you to explore the instructional video
            linked on this page, designed to enhance your understanding of the
            application.
          </p>
          <button className="btn btn-md-primary" onClick={openSupportModal}>Book Demo</button>
        </div>)}
        {typeof showbtn === "boolean" && (
          <>
            <div className=" text-center">
              <h2 className="heading heading-lg-bold">Account Verification Failed</h2>
              <p className="para para-lg">Unfortunately, your recent user account verification was not successful. Our verification team have outlined some details below to help you understand why :-</p>
              <ul className="ul1">
                <li>{user.remark}</li></ul>
              <p className="para para-sm">
                Have any questions or require assistance, please do not
                hesitate to <button onClick={openSupportModal} className="btn-link">contact us</button>.<br/>Thank you for your patience and understanding.
              </p>
              {showbtn && (<button className="btn btn-md-primary" onClick={handleReverification}>Reverification</button>)}
            </div>
          </>
        )}

        <div className="flex justify-center mt-4 w-full">
          <iframe loading="lazy" className="h-[60vh] w-full border border-gray-900" src="https://www.canva.com/design/DAGR7l5pgms/MfA45ZD6StD2bEtjOpV-4w/watch?embed" allowFullScreen allow="fullscreen"></iframe>
        </div>

      </div>

      {/* <div className="w-[100%] flex flex-col h-full ">
        <div className="congrattop flex justify-between items-center h-fit overflow-hidden  max-[900px]:none">
          <div className="flex-1">
            {/* <div style={{
              <iframe loading="lazy" style={{ position: "absolute", width: "100%", height: "100%", top: "0", left: "0", border: "none", padding: "0", margin: "0" }}
                src="https://www.canva.com/design/DAGR7l5pgms/MfA45ZD6StD2bEtjOpV-4w/watch?embed" allow="fullscreen">
              </iframe>
            </div>


      <div


            {/* <img className="w-[60vw] h-[60vh]" src={videoImg} alt="" /> */}
      {/* Video Section */}
      {/* <div className="w-[60vw] h-[60vh]">
          <video width="100%" height="100%" autoPlay loop controls>
              <source src={videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          </div>
          <div className="w-[70vh] m-4  ">
            <div className="text-[4vh] font-medium text-yellow-100 ">
                <li>
                  <b>• </b> For more information kindly click on the
                  Reverification button.
                </li>
              </ul>
              <p className="pt-2 text-primary-400 text-1.6xl font-normal leading-[2vh]">
                Do you have any questions or require assistance, please do
          )}

        </div>
      </div> */}
    </>
  );
};


export default EPCSignupReVerifictionPage;
export const IconPlayVideo = () => {
  return (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="30" cy="30" r="29" stroke="#FF881B" strokeWidth="2" />
      <path
        d="M35.9961 31.1652L25.3911 37.3185C24.4911 37.8402 23.3361 37.2085 23.3361 36.1569V23.8502C23.3361 22.8002 24.4894 22.1668 25.3911 22.6902L35.9961 28.8435C36.2008 28.9604 36.371 29.1293 36.4893 29.3332C36.6077 29.5371 36.67 29.7686 36.67 30.0043C36.67 30.2401 36.6077 30.4716 36.4893 30.6755C36.371 30.8794 36.2008 31.0483 35.9961 31.1652Z"
        fill="#FF881B"
      />
    </svg>
  );
};
