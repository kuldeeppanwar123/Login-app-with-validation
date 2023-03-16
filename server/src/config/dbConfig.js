import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import 'dotenv/config';
// const ATLAS_URL = 'mongodb+srv://Kuldeep:Kul12345@cluster0.3db5hyb.mongodb.net/?retryWrites=true&w=majority';
const ATLAS_URL = process.env.ATLAS_URL;
export async function dbConfig(){
    try {
    mongoose.set('strictQuery',true);
    await mongoose.connect('mongodb://127.0.0.1:27017/NewLoginDB');
    // await mongoose.connect('mongodb+srv://Kuldeep:Kul12345@cluster0.3db5hyb.mongodb.net/?retryWrites=true&w=majority');
    // await mongoose.connect(ATLAS_URL);
    console.log("Database connected!");
    } catch (error) {
        console.log(error);
    }

}