import userModel from "../models/user.model.js";
import statuscodes, { StatusCodes }  from 'http-status-codes';
import bcrypt from 'bcrypt';
import  jwt  from "jsonwebtoken";
import 'dotenv/config';
import otpGenenerator from 'otp-generator';

export async function register(req,res){
    try {
        const { username, password, profile, email } = req.body;  
        // check the existing user
        const checkUsername = await userModel.findOne({ username });
        if(checkUsername){
            res.status(statuscodes.BAD_REQUEST).json({"error":"Enter unique username"});
            return;
        } 
        const checkEmail = await userModel.findOne({ email });
        if(checkEmail){
            res.status(statuscodes.BAD_REQUEST).json({"error":"Enter unique email"});
            return;
        }
        
       const hashedPassword = bcrypt.hashSync(password,12); 
       const user = new userModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email
                            });

       const savedUser =  await user.save();
       res.status(201).json({'msg':'user registerd successfully!'});
       
    } catch (error) {
        return res.status(500).send(error);
    }

}

// export async function register(req,res){

//     try {
//         const { username, password, profile, email } = req.body;        

//         // check the existing user
//         const existUsername = new Promise((resolve, reject) => {
//             userModel.findOne({ username }, function(err, user){
//                 if(err) reject(new Error(err))
//                 if(user) reject({ error : "Please use unique username"});

//                 resolve();
//             })
//         });

//         // check for existing email
//         const existEmail = new Promise((resolve, reject) => {
//             userModel.findOne({ email }, function(err, email){
//                 if(err) reject(new Error(err))
//                 if(email) reject({ error : "Please use unique Email"});

//                 resolve();
//             })
//         });


//         Promise.all([existUsername, existEmail])
//             .then(() => {
//                 if(password){
//                     const hashedPassword = bcrypt.hashSync(password,12); 
                            
//                             const user = new userModel({
//                                 username,
//                                 password: hashedPassword,
//                                 profile: profile || '',
//                                 email
//                             });

//                             // return save result as a response
//                             user.save()
//                                 .then(result => res.status(201).send({ msg: "User Register Successfully"}))
//                                 .catch(error => res.status(500).send({error}))

//                 }
//             }).catch(error => {
//                 console.log(error);
//                 return res.status(500).send({ error })
//             })


//     } catch (error) {
//         return res.status(500).send(error);
//     }

// }

export async function login(req,res){
    try {
        const{username,password} = req.body;
        const checkUser = await userModel.findOne({username});
        if(checkUser){
            if(password){
                if (bcrypt.compareSync(password,checkUser.password)) {
                    const encrypKey = process.env.JWT_SECRET;
                    const token = jwt.sign({'userID':checkUser._id,'username':checkUser.username},encrypKey);
                    checkUser.token = token;
                    res.status(statuscodes.OK).json({'username':checkUser.username,'token':token});
                } else {
                    res.status(statuscodes.UNAUTHORIZED).json({"error":"wrong password"})
                }
            }
            else{
                res.status(statuscodes.BAD_REQUEST).json({'error':'Password is needed'});
            }
        }
        else{
            res.status(statuscodes.BAD_REQUEST).json({'error':'wrong username'});
            
        }
        
    } catch (error) {
        console.log(error);
        res.status(statuscodes.INTERNAL_SERVER_ERROR).json({'error':error.message});
    }
}

export async function registerMail(req,res){
    res.json('registerMail route')
}

export async function authenticate(req,res){
    res.json('authenticate route')
}

export async function getUser(req,res){
   try {
    const username = req.params.username;
    if(!username){
        res.status(statuscodes.BAD_REQUEST).json({"error":"invalid username"});
    }
    const checkUser = await userModel.findOne({username});
    if(checkUser){
        const {password,...restUser} = Object.assign({},checkUser.toJSON());
        res.status(201).json(restUser);
    }
    else{
        res.status(StatusCodes.NOT_FOUND).json({"error":"user not exist"});
    }
}catch(error){
    console.log(error.message);
    res.status(statuscodes.INTERNAL_SERVER_ERROR).json({'error':error.message});
}
}

export async function generateOTP(req,res){
   try {
    let OTP =  otpGenenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
    req.app.locals.OTP = OTP;
    res.status(201).json({'OTP':req.app.locals.OTP})
   } catch (error) {
    console.log(error);
   }
}

export async function verifyOTP(req,res){
   try { 
    const enteredOTP = req.query.OTP;
    if(parseInt(req.app.locals.OTP)===parseInt(enteredOTP)){
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    res.status(201).json({'msg':"OTP verified successfully!"});
}
else{
       res.status(statuscodes.UNAUTHORIZED).json({'msg':"invalid OTP!"});

   }
}
catch(error){ 
    console.log(error);
    res.status(statuscodes.INTERNAL_SERVER_ERROR).json({error});
}
}

export async function createResetSession(req,res){
    if(req.app.locals.resetSession){
        res.status(201).send({flag:req.app.locals.resetSession});
    }
    else{
        res.status(440).json({'message':'session expired!'});
    }
}

export async function updateUser(req,res){
   try {
    const {userID} = req.user;
    const token = req.headers.authorization.split(" ")[1];
    if(userID){
        console.log(userID);
        if(req.body.password){
            req.body['password']=bcrypt.hashSync(req.body.password,12);
        }
        await userModel.updateOne({_id:userID},req.body);
        res.status(statuscodes.OK).json({'message':'updated successfully!',token});
    }else{
        res.status(statuscodes.BAD_REQUEST).json({'error':'user is not specified'});
    }

   } catch (error) {
    console.log(error);
       res.status(statuscodes.INTERNAL_SERVER_ERROR).json({error})
   }
}

export async function resetPassword(req,res){
    try {

        if(!req.app.locals.resetSession)
        return res.status(440).json({'message':'session expired!'});
        
        const {username,password} = req.body;
        const checkUser = await userModel.findOne({username});
        if(checkUser){
        const hashedPassword =  await bcrypt.hashSync(password,12);
        await userModel.updateOne({username:checkUser.username} , {password:hashedPassword});
        res.status(200).json({'message':"password updated successfully"})
        }
        else{
            res.status(404).json({'error':"username not found!"});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({error});
    }
}
