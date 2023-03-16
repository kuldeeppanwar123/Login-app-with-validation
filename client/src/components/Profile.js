import React, { useState } from 'react';
import avatar from '../assets/profile.png';
import style from '../styles/Username.module.css';
import style2 from '../styles/Profile.module.css';
import { useFormik } from 'formik';
import { toast, Toaster } from 'react-hot-toast';
import {  ProfileValidate} from '../helper/validate.js';
import convertToBase64 from '../helper/convert.js';
import useFetch from '../hooks/fetch.hook.js';
import { updateUser } from '../helper/helper.js';
import { useNavigate } from 'react-router-dom';


export default function Profile() {
  const navigate = useNavigate();
  const [file, setFile]= useState();
  const [{isLoading,apiData,serverError}] = useFetch();
 
    const formik = useFormik({
        initialValues:{
           firstName:apiData?.firstName || '',
           lastName:apiData?.lastName || '',
           phone:apiData?.phone || '',
           email:apiData?.email || '',
           address:apiData?.address ||''},
        enableReinitialize:true,
        validate:ProfileValidate,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: async values=>{
         values = await Object.assign(values, { profile : file || apiData?.profile || ''})
          let updatePromise =  updateUser(values);
          toast.promise(updatePromise,{
            loading:"Updating..",
            success: <b>Update Successfully..!</b>,
            error: <b>Couldn't Update</b>
          })
         
        }
    })

    const onUpload = async e=>{
      const base64 = await convertToBase64(e.target.files[0])
      setFile(base64)
    }

    function userLogout(){
      localStorage.removeItem('token');
      navigate('/');
    }
    if(isLoading)return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>


  return (
    <div  className="container mx-auto" >
        <Toaster position='top-center' reverseOrder={false}/>
      <div className='flex justify-center items-center h-screen'>
        <div className={`${style.glass} ${style2.glass}`} style={{width:"45%",paddingTop:'3em'}}>

            <div className="title flex flex-col items-center">
                <h4 className='text-5xl font-bold'>Register</h4>
                <span className='py-4 text-xl w-2/3 text-center text-gray-500'>You can update your profile</span>
            </div>

            <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-4'>
                  <label htmlFor="profile">
                    <img src={apiData?.profile || file || avatar} className={`${style.profile_img} ${style2.profile_img}`} alt="avatar" />
                  </label>
                  
                  <input onChange={onUpload} type="file" id='profile' name='profile' />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('firstName')} className={`${style.textbox} ${style2.textbox}`} type="text" placeholder='FirstName' />
                  <input {...formik.getFieldProps('lastName')} className={`${style.textbox} ${style2.textbox}`} type="text" placeholder='LastName' />
                </div>

                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('phone')} className={`${style.textbox} ${style2.textbox}`} type="text" placeholder='Mobile No.' />
                  <input {...formik.getFieldProps('email')} className={`${style.textbox} ${style2.textbox}`} type="text" placeholder='Email*' />
                </div>

               
                  <input {...formik.getFieldProps('address')} className={`${style.textbox} ${style2.textbox}`} type="text" placeholder='Address' />
                  <button className={style.btn} type='submit'>Update</button>
               
                  
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>come back later? <button  className='text-red-500' to="/" onClick={userLogout}>Logout</button></span>
              </div>

          </form>
        </div>
      </div>
    </div>
  )
}
