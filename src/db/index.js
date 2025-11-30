import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB=async()=>{
   try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log(`\n MongoDB connected !! DB.host :  ${mongoose.connection.host} \n`);
   } catch (error) {
    console.log("MongoDB conection error :  ",error);
    process.exit(1)
   } 
}
export default connectDB
