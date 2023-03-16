import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true,"please provide username"],
        unique:[true,"username exist!"]
    },
    password:{
        type:String,
        required:[true,"please provide a password"],
        unique:false
    },
    email:{
        type:String,
        required:[true,"please enter a email"],
        unique:[true,"email already exist!"]
    },
    firstName:{type:String}, 
    lastName:{type:String},
    phone:{type:Number},
    address:{type:String},
    profile:{type:String}
})

 const userModel  = mongoose.model('loginUser',userSchema);
// export default mongoose.model.Users || mongoose.model(user,userSchema);
export default userModel;