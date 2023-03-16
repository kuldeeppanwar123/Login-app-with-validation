import axios from 'axios';
import jwt_decode from 'jwt-decode'
// import 'dotenv/config';

// axios.defaults.baseURL=process.env.REACT_APP_SERVER_DOMAIN;
axios.defaults.baseURL='http://localhost:8500';


export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return Promise.reject("Cannot find Token");
    let decode = jwt_decode(token)
    return decode;
}

export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate',{username})
    } catch (error) {
        console.log(error);
        return {'error':"username doesn't exist"}
    }
}

export async function getUser(username){
    try {
        const user =  await axios.get(`/api/user/${username}`);
        // console.log(user);
        return user;
    } catch (error) {
        console.log(error);
        return {'error':"password doesn't match"}
    }
}

export async function registerUser(userCredential){
    try {
       
        const {data:{msg},status} = await axios.post(`/api/register`,userCredential);
        const {username,email} = userCredential;
        if(status===201){
           await axios.post('/api/registerMail',{username,userEmail:email,text:msg})
        }
        return Promise.resolve(msg);
    } catch (error) {
        console.log({error});
        return Promise.reject({error}); 
    }
}

export async function verifyPassword({username,password}){
    try {
        if(username){
            const data = await axios.post('/api/login',{username,password});
            return Promise.resolve({data});
        }
    } catch (error) {
            console.log(error);
            return Promise.reject({error:"password doesn't match"});
    }
}

export async function updateUser(data){
    try {
        const token = await localStorage.getItem("token");
        const res = await axios.put('/api/updateuser',data,{headers:{"Authorization":`Bearer ${token}`}});
        return Promise.resolve({res});
    } catch (error) {
        console.log(error);
        return Promise.reject({error});
    }
}

export async function generateOTP(username){
    try {
      const {data:{OTP} , status} =  await axios.get('/api/generateOTP',{params:{username}});
      if(status===201){
          let {data:{email}} = await getUser(username);
          let text = `your password recovery OTP is ${OTP}`;
          await axios.post('/api/registerMail',{username,userEmail:email,text,subject:"password recovery OTP"});
      }
      return Promise.resolve(OTP);
    } catch (error) {
        console.log(error);
        return Promise.reject({error});
    }
}


export async function verifyOTP(username,OTP){
    try {
        // console.log(username);
        const {data,status} =  await axios.get('/api/verifyOTP',{params:{username,OTP}})
        return {data,status};
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function resetPassword({username,password}){
    try {
        const {data ,status} = await axios.put('/api/resetPassword',{username,password});
        return Promise.resolve({data,status});
    } catch (error) {
        return Promise.reject({error});
    }
}