import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import style from '../styles/Username.module.css';
import { useFormik } from 'formik';
import { Toaster } from 'react-hot-toast';
import { UsernameValidate } from '../helper/validate.js';
import {useAuthStore} from '../store/store.js';

// import { Toaster } from 'react-hot-toast';
export default function Username() {
    const navigate = useNavigate();
    const setUsername = useAuthStore(state=>state.setUsername);

    const formik = useFormik({
        initialValues:{ username:''},
        validate:UsernameValidate,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: async function(values){
            setUsername(values.username);
            // console.log(values);
            navigate('/password')
        }
    })


  return (
    <div className="container mx-auto">
        <Toaster position='top-center' reverseOrder={false}/>
      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass}>

            <div className="title flex flex-col items-center">
                <h4 className='text-5xl font-bold'>Hello Kuldeep</h4>
                <span className='py-4 text-xl w-2/3 text-center text-gray-500'>username varification</span>
            </div>
            <form action="" className='py-1' onSubmit={formik.handleSubmit}>
                <div className='profile flex justify-center py-4'>
                    <img src={avatar} className={style.profile_img} alt="" />
                </div>
                <div className='textbox flex flex-col items-center gap-6' >
                    <input {...formik.getFieldProps('username')}type="text" className={style.textbox} placeholder='Username' />
                    <button type='submit' className={style.btn}>Let's Go</button>
                </div>
                <div className='text-center py-4'>
                    <span className='text-gray-500'>Not a Member <Link className='text-red-500' to="/register">Register Now</Link></span>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
}
