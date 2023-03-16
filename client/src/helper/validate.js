import toast from "react-hot-toast";
import { authenticate } from "./helper.js";
// *******************validate*****************************

export async function resetPasswordValidate(values){
    const error = passwordVarify({},values);
    if(values.password!==values.confirm_password){
        error.exist = toast.error("Password not match!");
    }
}
export async function UsernameValidate(values){
    const error = usernameVarify({},values);
    if(values.username){
        const {status}  = await authenticate(values.username);
        if(status!==200){
            error.exist = toast.error("User doesn't exist");
        }
    }
    return error;
}

export async function PasswordValidate(values){
    const error = passwordVarify({},values);
    return error;
}

export async function RegisterValidate(values){
    const error = usernameVarify({},values);
    emailVarify(error , values);
    passwordVarify(error,values);
    return error;
}


export async function ProfileValidate(values){
    const error = emailVarify({},values);
    return error;
}
// *******************varify*******************************


function usernameVarify(error={},values){
    if(!values.username){
       error.username = toast.error("username required!");
    }
    else if(values.username.includes(" ")){
        error.username = toast.error("invalid username!");
    }
    return error;
}

function passwordVarify(error={},values){
     /* eslint-disable no-useless-escape */
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(!values.password){
        error.password = toast.error("password required!");
    }
    else if(values.password.includes(" ")){
        error.password = toast.error("invalid password!");
    }
    else if(values.password.length<6){
        error.password = toast.error("password must have atleast 6 characters")
    }
    else if(!specialChars.test(values.password)){
        error.password = toast.error("password must have special characters")

    }
}

function emailVarify(error={},values){
    if(!values.email){
        error.email = toast.error("Email Required!");
    }
    else if(values.email.includes(" ")){
        error.email = toast.or("Wrong Email!");
    }
    else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.or("invalid Email!");
    }
    return error;
}