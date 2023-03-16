import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import style from '../styles/Username.module.css';
import { useFormik } from 'formik';
import { toast, Toaster } from 'react-hot-toast';
import { PasswordValidate } from '../helper/validate.js';
import useFetch from '../hooks/fetch.hook.js';
import { useAuthStore } from '../store/store.js';
import { verifyPassword } from '../helper/helper.js';
// import { Toaster } from 'react-hot-toast';

export default function Password() {
    const navigate = useNavigate();
    const {username} = useAuthStore(state=>state.auth);
    const[{isLoading, apiData, serverError}]= useFetch(`/user/${username}`);
    const formik = useFormik({
        initialValues:{ password:''},
        validate:PasswordValidate,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: async values=>{
            let loginPromise = verifyPassword({username,password:values.password});
            toast.promise(loginPromise,{
                loading:"Checking..",
                success: <b>Login Successfully!</b>,
                error: <b>Password Not Match!</b>
            })
            loginPromise.then(res=>{
                let token = res.data.data.token;
                localStorage.setItem('token',token);
                navigate('/profile');

            })
        }
    })


    if(isLoading)return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>


  return (
    <div className="container mx-auto">
        <Toaster position='top-center' reverseOrder={false}/>
      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass}>

            <div className="title flex flex-col items-center">
                <h4 className='text-5xl font-bold'>Hello {apiData?.firstName || apiData?.username}</h4>
                <span className='py-4 text-xl w-2/3 text-center text-gray-500'>password varification</span>
            </div>
            <form action="" className='py-1' onSubmit={formik.handleSubmit}>
                <div className='profile flex justify-center py-4'>
                    <img src={apiData?.profile || avatar} className={style.profile_img} alt="" />
                </div>
                <div className='textbox flex flex-col items-center gap-6' >
                    <input {...formik.getFieldProps('password')}type="password" className={style.textbox} placeholder='Password' />
                    <button type='submit' className={style.btn}>Sign In</button>
                </div>
                <div className='text-center py-4'>
                    <span className='text-gray-500'>Forgot Password <Link className='text-red-500' to="/recovery">Recover Now</Link></span>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}

 