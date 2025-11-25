import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null
        //upload
    const response=   await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file is uploaded on cloudinary
        console.log("file uploaded successfully",response.url);
        return response;
    } catch (error) {
       fs.unlinkSync(localFilePath) // remove locally tempary saved file as upload is failed
        
    }
}