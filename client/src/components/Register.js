import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import style from '../styles/Username.module.css';
import { useFormik } from 'formik';
import { toast, Toaster } from 'react-hot-toast';
import {  RegisterValidate } from '../helper/validate.js';
import convertToBase64 from '../helper/convert.js';
import { registerUser } from '../helper/helper.js';
// import { Toaster } from 'react-hot-toast';
export default function Register() {
 const navigate = useNavigate();
  const [file, setFile]= useState();

    const formik = useFormik({
        initialValues:{
           email:'',
           username:'',
           password:''},
        validate:RegisterValidate,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: async function(values){
          values = await Object.assign(values,{profile:file ||''});
            // console.log(values);
          let userPromise =   registerUser(values);
          // console.log(userPromise);
           toast.promise(userPromise,{
            loading:'Creating..',
            success: <b>Registered Successfully</b>,
            error: <b>Couldn't Registered</b>
           })
           userPromise.then(()=>{navigate('/')});
        }
    })

    const onUpload = async e=>{
      const base64 = await convertToBase64(e.target.files[0])
      setFile(base64)
    }

  return (
    <div style={{marginTop:0}} className="container mx-auto" >
        <Toaster position='top-center' reverseOrder={false}/>
      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass} style={{width:'45%',paddingTop:'3em'}}>

            <div className="title flex flex-col items-center">
                <h4 className='text-5xl font-bold'>Register</h4>
                <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Happy to join you!</span>
            </div>
            <form action="" className='py-1' onSubmit={formik.handleSubmit}>
                <div className='profile flex justify-center py-4'>
                  <label htmlFor="profile">
                    <img src={file || avatar} className={style.profile_img} alt="" />
                  </label>
                  <input onChange={onUpload} type="file" name="Profile" id="profile" />
                </div>
                <div className='textbox flex flex-col items-center gap-6' >
                    <input {...formik.getFieldProps('username')}type="text" className={style.textbox} placeholder='username' />
                    <input {...formik.getFieldProps('email')}type="email" className={style.textbox} placeholder='Email' />
                    <input {...formik.getFieldProps('password')}type="password" className={style.textbox} placeholder='Password' />
                    <button type='submit' className={style.btn}>Register</button>
                </div>
                <div className='text-center py-4'>
                    <span className='text-gray-500'>Already Register? <Link className='text-red-500' to="/">Login Now</Link></span>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}
