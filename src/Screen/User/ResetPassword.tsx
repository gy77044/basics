import React, { useEffect, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseURL, requestUrl } from "../../Utils/baseUrls";
import { IconPass } from "../../assests/icons/Icons";
import { redirectHome } from "../../Utils/AuthRedirections";
import { isValidName } from "../../Utils/Const";
import { validPassword } from "../../Utils/Regex";
import { store } from "../../ReduxTool/store/store";
import { setResetPasswordToken } from "../../ReduxTool/Slice/Auth/AuthReducer";
import { IconInVisible, IconVisible } from "../../assests/icons/MapToolsIcons";
import { removeWideSpace, testPassword } from "../../Utils/commonFunctions";
import { Button } from "../../Components/AllButton/AllButtons.tsx";
import { Input } from "../../Components/AllInput/AllInput";

const ResetPassword = ({ text, handleShow }: any) => {
  const [forget, setForget] = useState<any>({ password: "", cpassword: "" });
  const [istype, setType] = useState<boolean>(false)
  const [passwordHide,setPasswordHide] = useState({password:false,cpassword:false})
  const [error,setError] = useState<any>({});


  const id = useId();

  const handleChange = (e: any) => {
    const { name, value } = e.currentTarget;
    
    if(!testPassword(value) && value!==""){
      return e.preventDefault()
    }    
    setForget({ ...forget, [name]: value });
    if (error && error[name as keyof object]){
      delete error[name as keyof object];
        setError(error);
    }
  };
  const { password, cpassword } = forget;

  // const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   if (!isValidName(password || cpassword)) {
  //     return;
  //   }
  //   else {
  //     if (password && cpassword) {
  //       if (password === cpassword) {

  //         baseURL.post(requestUrl.resetpassword, { email: text, password: password }).then((res: any) => {
  //           if (res.data.code === "200") {
  //             redirectHome(res, text, handleShow);
  //           } else {
  //             toast.error(res.data.responseData);
  //           }
  //         })
  //           .catch((e: any) => {
  //             toast.error("!Server Error 500");
  //           });
  //       } else {
  //         toast.error("Passwords do not match. Please try again");
  //       }
  //     } else {
  //       toast.error("Password is Required");
  //     }
  //   }
  // };

  const handleReset = (e: any) => {
    e.preventDefault();
    let isValid = true
    const errors: Record<string, string> = {};
    const validation:any = [
      { field: "password", condition: !forget.password || !validPassword.test(forget.password!), message: !forget.password?"New password is Required":"Password must contain both numeric and string" },
      { field: "cpassword", condition: forget.password!==forget.cpassword || !forget.cpassword, message:!forget.cpassword?"Confirm Password is Required":"Password Should Match" },
     ];
   
    
      for (const { field, condition, message } of validation) {
        if (condition) {
            errors[field] = message;
            isValid = false;
        }
    }
    if (Object.keys(errors).length > 0) {
     setError(errors);
    };
    if (isValid){
      baseURL.defaults.headers.Authorization = `bearer ${store.getState().auth.passwordResetToken}`
      baseURL
        .put(requestUrl.resetpassword, { email: text, password: password },)
        .then((res: any) => {
          if (res.data.code === "200") {
            baseURL.defaults.headers.Authorization = '';
            store.dispatch(setResetPasswordToken(null));
            redirectHome(res, text, handleShow);
          } else {
            toast.error(res.data.responseData);
          }
        })
        .catch(() => {
          toast.error("!Server Error 500", { toastId: "password" });
          store.dispatch(setResetPasswordToken(null));
          baseURL.defaults.headers.Authorization = ``
        });
    }

  };

  const handlePasswordView = (type:string)=>{
    setPasswordHide(prev=>({...prev,[type]:!prev[type as keyof object]}))
  }

  useEffect(()=>{
      const handleMouseUp = ()=>setPasswordHide({password:false,cpassword:false})
      window.addEventListener("mouseup",handleMouseUp)
      return()=>{
      window.addEventListener("mouseup",handleMouseUp)
      }
  },[])

  return (
    <div className={`flex flex-col justify-center p-8 md:p-14 ${passwordHide.password || passwordHide.cpassword ? "cursor-pointer select-none":"cursor-default"}`}>
      {/*  <img src="./login-sun.gif" /> */}
      <span className="heading heading-lg text-center">Reset Password</span>
      <span className="para para-md text-center">Reset your password to regain access to your account.</span>
      <div>
      <Input error={error?.password??null} handleSufIcon={()=>handlePasswordView("password")} suficon={passwordHide.password?<IconVisible color={error?.password!&&"#fb7185"}/>:<IconInVisible color={error?.password!&&"#fb7185"}/>} label="New Password" onChange={handleChange} id={id + "-password"} type={passwordHide.password?"text":"password"} name="password" placeholder=" " value={forget.password} />
      <Input error={error?.cpassword??null} handleSufIcon={()=>handlePasswordView("cpassword")} suficon={passwordHide.cpassword?<IconVisible color={error?.cpassword!&&"#fb7185"}/>:<IconInVisible color={error?.cpassword!&&"#fb7185"}/>} label="Confirm Password" onChange={handleChange} id={id + "-cpassword"} type={passwordHide.cpassword?"text":"password"} name="cpassword" placeholder=" " value={forget.cpassword}/>
        {/* <input onChange={handleChange} id={id + "-password"} type={istype?"text":"password"} name="password" placeholder=" " className="font-hairline text-1.6xl text-primary-200 pt-[3.4vh] pb-[1vh] pl-[3.4vh]     
                    block w-full px-[0vh] mt-[0vh] bg-transparent border-[0vh] border-b-[0.1vh] rounded-default appearance-none 
                    focus:outline-none focus:ring-0 outline:[0vh] outline-offset:[0vh]
                     focus:border-primary-200 border-primary-600"/>
        <input onChange={handleChange} id={id + "-cpassword"} type="password" name="cpassword" placeholder=" " className="font-hairline text-1.6xl text-primary-200 pt-[3.4vh] pb-[1vh] pl-[3.4vh]     
              block w-full px-[0vh] mt-[0vh] bg-transparent border-[0vh] border-b-[0.1vh] rounded-default appearance-none 
              focus:outline-none focus:ring-0 outline:[0vh] outline-offset:[0vh]
               focus:border-primary-200 border-primary-600"/> */}
        <div className="flex gap-4 max-sm:flex-col mt-8">
          <Button className="btn btn-md-outlineprimary w-full" onClick={handleShow} id="butotp" name="Back" />
          <Button className="btn btn-md-primary w-full" type="submit" id="btnsignin" name="Reset Password" onClick={(e) => handleReset(e)} />
        </div>
      </div>

      {/* <div className="w-full">
      <h5 className="text-center text-primary-200 font-normal text-2xl py-0.8">
        Reset Password
      </h5>
      <div className="h-[7.2vh]"></div>
      <form onSubmit={handleReset}>
      <div className="relative z-0 w-full ">
        <input onChange={handleChange} id={id + "-password"} type={passwordHide.password?"text":"password"} name="password" placeholder=" " className="font-hairline text-1.6xl text-primary-200 pt-[3.4vh] pb-[1vh] pl-[3.4vh]     
                    block w-full px-[0vh] mt-[0vh] bg-transparent border-[0vh] border-b-[0.1vh] rounded-default appearance-none 
                    focus:outline-none focus:ring-0 outline:[0vh] outline-offset:[0vh]
                     focus:border-primary-200 border-primary-600"/>
        <div className="font-hairline absolute top-[0vh] left-[0vh] mt-[3vh] mr-[4vh] text-primary-600">
          <IconPass />
        </div>
        <div className='absolute right-[0vh] top-[50%] cursor-pointer' onMouseDown={()=>handlePasswordHide("password")}>{passwordHide.password?<IconVisible/>:<IconInVisible/>}</div>

        <label htmlFor={id + "-password"} className="absolute duration-300 top-[4.4vh] -z-1 origin-0 text-primary-600 pl-[3vh] text-1.4xl font-normal">
          New Password <span className="text-red-200 pl-[0.2vh] text-1.6xl">*</span>
        </label>
      </div>
      <div className="h4"></div>
      <div className="relative z-0 w-full ">
        <input onChange={handleChange} id={id + "-cpassword"} type={passwordHide.confpassword?"text":"password"} name="cpassword" placeholder=" " className="font-hairline text-1.6xl text-primary-200 pt-[3.4vh] pb-[1vh] pl-[3.4vh]     
              block w-full px-[0vh] mt-[0vh] bg-transparent border-[0vh] border-b-[0.1vh] rounded-default appearance-none 
              focus:outline-none focus:ring-0 outline:[0vh] outline-offset:[0vh]
               focus:border-primary-200 border-primary-600"/>
        <div className="font-hairline absolute top-[0vh] left-[0vh] mt-[3vh] mr-[4vh] text-primary-600">
          <IconPass />
        </div>
        <div className='absolute right-[0vh] top-[50%] cursor-pointer' onMouseDown={()=>handlePasswordHide("confpassword")}>{passwordHide.confpassword?<IconVisible/>:<IconInVisible/>}</div>
        <label htmlFor={id + "-cpassword"} className="absolute duration-300 top-[4.4vh] -z-1 origin-0 text-primary-600 pl-[3vh] text-1.4xl font-normal">
          Confirm Password <span className="text-red-200 pl-[0.2vh] text-1.6xl">*</span>
        </label>
      </div>
      <div className="h4"></div>
      <div className="flex justify-center">
        <button id="btnsignin" type="submit" className="lc-login-dark-btn-global px-3">
          Change Password
        </button>
      </div>
      </form>
      <div className="h-[7.2vh]"></div>
      <p className="text-center text-black text-1.2xl font-normal">
        Have an pvNXT account?
        <button className=" px-0.6" id="butsign" onClick={handleShow}>
          <p className='underline decoration-solid text-1.4xl font-medium text-primary-300 hover:text-primary-100' data-bs-toggle="tooltip" title="Go to login page">
            Sign in now.
          </p>
        </button>
      </p>
    </div> */}
    </div>

  );
};

export default ResetPassword;
