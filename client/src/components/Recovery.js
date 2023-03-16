import React, { useEffect, useState } from 'react';
import style from '../styles/Username.module.css';
import { toast, Toaster } from 'react-hot-toast';
import { useAuthStore } from '../store/store.js';
import {generateOTP,verifyOTP} from '../helper/helper.js';
import { useNavigate } from 'react-router-dom';


export default function Recovery() {
  const {username} = useAuthStore(state=>state.auth);
  const [OTP,setOTP] =useState();
  // console.log(OTP);
  const navigate = useNavigate();

   useEffect(()=>{
    generateOTP(username).then((OTP)=>{
      console.log(OTP);
      if(OTP)
        return toast.success("OTP has send to your email");
        return toast.error("Problem in generating OTP");
    })
   },[username]);

   async function onSubmit(e){
    e.preventDefault();
    
    try {
      let { status } = await verifyOTP( username, OTP )
      if(status === 201){
        toast.success('Verify Successfully!')
        return navigate('/reset')
      }  
    } catch (error) {
      return toast.error('Wront OTP! Check email again!')
    }
  }



   function resendOTP(){
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise,{
      loading:'Sending..',
      success: <b>OTP has been send to email</b>,
      error: <b>Couldn't send OTP</b>
    });
    sendPromise.then(OTP=>{
      console.log(OTP);
    })
   }
  return (
    <div className="container mx-auto">
        <Toaster position='top-center' reverseOrder={false}/>
      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass}>

            <div className="title flex flex-col items-center">
                <h4 className='text-5xl font-bold'>Recovery</h4>
                <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Enter OTP to recover password</span>
            </div>
            <form action="" className='pt-20' onSubmit={onSubmit} >
                <div className='textbox flex flex-col items-center gap-6' >
                  <div className='text-center'>
                    <span className='py-4 text-sm text-left text-gray-500'>Enter 6 digit OTP send to your email.</span>
                    <input onChange={(e)=>{setOTP(e.target.value)}} type="text" className={style.textbox} placeholder='OTP' />
                  </div>
                  <button type='submit' className={style.btn}>Recover</button>
                </div>
                <div className='text-center py-4'>
                    <span className='text-gray-500'>Can't get OTP  <button className='text-red-500' onClick={resendOTP}> Resend</button></span>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

