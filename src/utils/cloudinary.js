import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import {upload} from "../middlewares/multer.middleware.js"
 cloudinary.config({ 
   cloud_name: process.env.CLOUDINARY_NAME, 
   api_key: process.env.CLOUDINARY_API, 
   api_secret: process.env.CLOUDINARY_API_SECRET,
 });
 const uploadOnCloudinary=async(localFilepath)=>{
     try {
         if(!localFilepath) return null
         //upload
     const response= await cloudinary.uploader.upload(localFilepath,{
             resource_type:"auto",
         })
         //file is uploaded on cloudinary
         console.log("file uploaded successfully",response.url);
         return response;
     } catch (error) {
        fs.unlinkSync(localFilepath) // remove locally tempary saved file as upload is failed      
     }
 }
export{uploadOnCloudinary}