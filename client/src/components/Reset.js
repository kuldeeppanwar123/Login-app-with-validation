import style from '../styles/Username.module.css';
import { useFormik } from 'formik';
import { toast, Toaster } from 'react-hot-toast';
import { resetPasswordValidate } from '../helper/validate.js';
import { resetPassword } from '../helper/helper.js';
import { useAuthStore } from '../store/store.js';
import {useNavigate,Navigate} from 'react-router-dom';
import useFetch from '../hooks/fetch.hook.js'

export default function Reset() {
  const navigate = useNavigate();
  const {username} = useAuthStore(state=>state.auth);
  const [{isLoading,status, serverError}] = useFetch('createResetSession');

    const formik = useFormik({
        initialValues:{ 
          password:'',
          confirm_password:''
        },
        validate:resetPasswordValidate,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit: async function(values){
           let resetPromise = resetPassword({username,password:values.password})
           toast.promise(resetPromise, {
            loading: 'Updating...',
            success: <b>Reset Successfully...!</b>,
            error : <b>Could not Reset!</b>
          });
          resetPromise.then(function(){ navigate('/password')})
        }
    })
    if(isLoading)return <h1 className='text-2xl font-bold'>isLoading</h1>;
    if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>
    if(status && status!==201){
      return <Navigate to={'/password'} replace={true}></Navigate>
    }

  return (
    <div className="container mx-auto">
        <Toaster position='top-center' reverseOrder={false}/>
      <div className='flex justify-center items-center h-screen'>
        <div className={style.glass} style={{width:'35%'}}>

            <div className="title flex flex-col items-center">
                <h4 className='text-5xl font-bold'>Reset</h4>
                <span className='py-4 text-xl w-2/3 text-center text-gray-500'>Enter new Password</span>
            </div>
            <form action="" className='py-1' onSubmit={formik.handleSubmit}>
                
                <div className='textbox flex flex-col items-center gap-6' >
                    <input {...formik.getFieldProps('password')}type="password" className={style.textbox} placeholder='Enter Password' />
                    <input {...formik.getFieldProps('confirm_password')}type="password" className={style.textbox} placeholder='Confirm Password' />
                    <button type='submit' className={style.btn}>Reset</button>
                </div>
                
            </form>
        </div>
      </div>
    </div>
  )
}
