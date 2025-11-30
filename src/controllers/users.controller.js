import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import  {ApiResponse}          from "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import path from "path"
const registerUser = asyncHandler(async (req, res) => {
    //get user detials from frontend
    console.log("req body : " ,req.body)
    console.log("req files: ",req.files)
    const {username,email,fullname,password}=req.body
    // validation
    if([fullname,username,email,password].some((field)=>field?.trim() === "")){
        throw new ApiError(400,"All fields are required")
    }
   // check user is existed before
     const existeduser= await User.findOne({
         $or : [{username},{email }]
     })
     console.log(existeduser)
     if(existeduser){
         throw new ApiError(405,"User with email or username exist")
     }
    // check avatar file is missing or not
    const avatarLocalPath=  req.files?.avatar[0]?.path;
    const coverImageLocalPath=  req.files?.coverImage[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    // upload to cloduinary
     const avatarupload= await uploadOnCloudinary(avatarLocalPath,"temp/avatars")
     const coverImageupload= await uploadOnCloudinary(coverImageLocalPath,"temp/coverImages")
     console.log("avatar file path : ",avatarupload)
      if(!avatarupload){
          throw new ApiError(400,"not able to upload on cloudinary ")
     }
     //create user object - create entry in object
     const user=await User.create({
        username:username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: avatarupload,
        coverImage:coverImageupload || ""
    })
    // remove password and refresh token field from response 
    const createduser= await User.findById(user._id).select("-password")
    // check for user creation
    if(!createduser){
        throw new ApiError(500,"Something went wrong while registering a user")
    }
    // return res
    return res.status(201).json(
        new ApiResponse(200,createduser,"User registerd successfully")
    )
})

export {registerUser}