import React, { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ResetPassword, Timer } from ".";
import { forgetCheckOTP } from "../../Utils/AuthRedirections";
import { baseURL, requestUrl } from "../../Utils/baseUrls";
import { Button } from "../../Components/AllButton/AllButtons.tsx";
import { OTP_COUNTER } from "../../Utils/Const";
import Toast from "../../Components/ErrorBoundry/Toast";

interface FPProps {
  handleShow: () => void;
  text: string;
}
const ForgetPassword: React.FC<FPProps> = ({ handleShow, text }) => {
  // let timeLeft = 10;
  const timeRef = useRef<HTMLAnchorElement>(null);

  const toastId = useRef<any | null>(null);
  const [numbercount, setNumberCount] = useState(0);
  const [newPassword, setNewPassword] = useState(false);
  const [sendOTP, setOtpSend] = useState<string>("");
  const [countdown, setCountdown] = useState(OTP_COUNTER);

  const specialChars = /[@]/;

  const handleValidate = (e: FormEvent) => {
    e.preventDefault();
    const first = (document.getElementById("first") as HTMLInputElement).value;
    const second = (document.getElementById("second") as HTMLInputElement)
      .value;
    const third = (document.getElementById("third") as HTMLInputElement).value;
    const fourth = (document.getElementById("fourth") as HTMLInputElement)
      .value;
    const resultOTP = parseInt(first + second + third + fourth, 10);
    if (!first || !second || !third || !fourth) {
      return toast.warn("Please Provide the OTP");
    }
    if (resultOTP == undefined || resultOTP === null) {
      return toast.warn("Please Provide the OTP");
    }
    forgetCheckOTP({ text, resultOTP, setNewPassword });
  };

  const handleOtpInput = () => {
    const first = (document.getElementById("first") as HTMLInputElement).value;
    const second = (document.getElementById("second") as HTMLInputElement)
      .value;
    const third = (document.getElementById("third") as HTMLInputElement).value;
    const fourth = (document.getElementById("fourth") as HTMLInputElement)
      .value;
    if (first.length === 1) {
      (document.getElementById("second") as HTMLInputElement).focus();
    }
    if (second.length === 1) {
      (document.getElementById("third") as HTMLInputElement).focus();
    }
    if (third.length === 1) {
      (document.getElementById("fourth") as HTMLInputElement).focus();
    }
  };

  // const timerId = setInterval(countdown, 1000);

  // function countdown() {
  //   if (timeLeft == -1) {
  //     clearTimeout(timerId);
  //   } else {
  //     if (timeRef?.current) {
  //       timeRef.current.innerHTML = `${timeLeft} second remaining`;
  //       timeLeft--;
  //     }
  //   }
  // }

  const handleIncrement = () => {
    const count = numbercount;
    toastId.current = toast("Sending New OTP", {
      type: toast.TYPE.INFO,
      progress: 0.2,
    });
    setNumberCount(count + 1);
    if (count < 3) {
      setCountdown(OTP_COUNTER);
      baseURL.get(`${requestUrl.sendNewOtp}/${text}`).then((res: any) => {
        if (res.status === 200) {
          if (toastId.current !== null) {
            toast.dismiss(toastId.current);
          }
          Toast({messageText:"code send successfully.",messageType:"S",autoClose:1000})
          // timeLeft = 60;
        }
      });
      // timeLeft = 30
    } 
    if (count>=2){
      setTimeout(()=>{
        handleShow();
        Toast({messageText:"Resend limit reached.",messageType:"E",autoClose:1000})
      },OTP_COUNTER*1000)
    }
   
  };

  useEffect(() => {
    let name = text.substring(0, text.lastIndexOf("@"));
    let edname = text.substring(
      text.lastIndexOf("@") - 1,
      text.lastIndexOf("@")
    );
    let domain = text.substring(text.lastIndexOf("@") + 1);
    if (specialChars.test(text)) {
      let len = text.length - 2;
      let arr = text.split("");
      let stars: string[] = [];
      arr.forEach((val, i) => {
        if (i > 1) {
          stars.push("*");
        }
      });
      let x = text.lastIndexOf("@") - 3;
      stars.length = x;
      // console.log(text.lastIndexOf("@")-2)

      setOtpSend(
        name.substring(0, 2) + "" + stars.join("") + edname + "@" + domain
      );
    }
  }, []);

  return (
    <>
      {newPassword && <ResetPassword text={text} handleShow={handleShow} />}
      <div className={`flex flex-col justify-center p-8 md:p-14 ${newPassword ? "hidden" : ""}`}>
        {/*  <img src="./login-sun.gif" /> */}
        <span className="heading heading-lg text-center">pvNXT Forgot Password</span>
        <span className="para para-md text-center">We have sent a code to your email {sendOTP}</span>
        <div>
          <div className="flex flex-row items-center justify-between gap-2 mx-auto w-full max-w-full" id="otp" data-bs-toggle="tooltip" title="Enter otp here">
            <input className="input-box1 w-24 h-16 text-xl text-center" type="number" maxLength={1} id="first" name="first" onKeyUp={handleOtpInput} />
            <input className="input-box1 w-24 h-16 text-xl text-center" type="number" maxLength={1} id="second" name="second" onKeyUp={handleOtpInput} />
            <input className="input-box1 w-24 h-16 text-xl text-center" type="number" maxLength={1} id="third" name="third" onKeyUp={handleOtpInput} />
            <input className="input-box1 w-24 h-16 text-xl text-center" type="number" maxLength={1} id="fourth" name="fourth" onKeyUp={handleOtpInput} />
          </div>
          <div className="flex gap-4 max-sm:flex-col mt-8">
            <Button className="btn btn-md-outlineprimary w-full" onClick={handleShow} id="butotp" name="Back" />
            <Button className="btn btn-md-primary w-full" type="submit" id="btnsignin" name="Reset Password" onClick={(e) => handleValidate(e)} />
          </div>
        </div>
        <Timer handleIncrement={handleIncrement} resendcount={numbercount} setNumberCount={setNumberCount} timeRef={timeRef} countdown={countdown} setCountdown={setCountdown} />
      </div>
    </>
  );
};

export default ForgetPassword;
