import { StatusCodes } from "http-status-codes";
import userModel from "../models/user.model.js";
import Jwt from "jsonwebtoken";
import 'dotenv/config';

export async function verifyUser(req,res,next){
    try {
        const {username} = req.method=="GET"?req.query:req.body;
        const exist = await userModel.findOne({username});
        if(!exist){
            res.status(StatusCodes.NOT_FOUND).json({"error":"user doesn't exist"});
        }
        else{
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(404).json({error:"authentication error"});
    }
}

export async function checkAuthorize(req,res,next){
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedtoken = await Jwt.verify(token,process.env.JWT_SECRET);
        req.user = decodedtoken;
        // const token = req.get("Authorization");
    //    res.json({token,decodedtoken});
    console.log(req.user);
        next();
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"my error"});
    }
}

export function localVariables(req,res,next){
    req.app.locals = {
        OTP:null,
        resetSession:false
    }
    next();
}