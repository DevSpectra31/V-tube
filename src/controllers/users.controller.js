import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import  {ApiResponse}  from   "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import path from "path"
import jwt from "jsonwebtoken"
const generateAccessTokenAndRefreshToken=asyncHandler(async(userId)=>{
    try {
      const user=  await User.findById(userId)
      const accessToken=user.generateAccessToken()
      console.log("AccessToken : ",accessToken)
      const refreshToken=user.generateRefreshToken()
      user.refreshToken=refreshToken
      await user.save({validateBeforeSave:false})
      return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong")
    }
})
const registerUser = asyncHandler(async (req, res) => {
    //get user detials from frontend
    console.log("Debug")
    console.log("-------")
    console.log("req body : " ,req.body)
    console.log("req files: ",req.files)
    console.log("-----------")
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
    const avatarLocalPath=  req.files?.avatar?.[0]?.path;
    const coverImageLocalPath=  req.files?.coverImage?.[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    // upload to cloduinary
      const avatarupload= await uploadOnCloudinary(avatarLocalPath,"temp/avatars")
      const coverupload= await uploadOnCloudinary(coverImageLocalPath,"temp/coverImages")
      console.log("avatar file path : ",avatarupload)
    //     if(!avatarupload?.secure_url){
    //    throw new ApiError(400,"not able to upload on cloudinary ")
    //     }
    //create user object - create entry in object
     const user=await User.create({
        username:username.toLowerCase(),
        email,
        fullname,
        password,
        avatar: avatarLocalPath,
        coverImage:coverImageLocalPath || ""
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

const loginUser=asyncHandler(async(req,res)=>{
    // req.body->data
    const {username,email,password}=req.body
    console.log(username)
    // username or email
    if(!username && !email){
        throw new ApiError(404,"username or email is required")
    }
    // find the user
    const user=await User.findOne({
        $or:[{email},{username}]
    })
    if(!user){
        throw new ApiError(400,"user not found")
    }
    // password check
    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400,"password is not valid")
    }
    // generate access  token and refreshtoken
    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)
    console.log(accessToken)
    //send cookies
    // to know the user with these tokens logged with loggeduser
    const loggeduser=await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true,
    }
    return res
       .status(200)
       .cookie("accessToken : ",accessToken,options)
       .cookie("RefreshToken : ",refreshToken,options)
       .json(
          new ApiResponse(
            200,
            {
                user:loggeduser,accessToken,
                refreshToken
            },
            "User logged Successfully",
          )
       )
})

const logoutUser=asyncHandler(async(req,res)=>{
   const user = await User.findOneAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true
    })
    const options={
        httpOnly:true,
        secure:true
    }
    return res
      .status(200)
      .clearCookie("accessToKen",accessToken)
      .clearCookie("refreshToken",refreshToken)
      .json(new ApiResponse(200,{},"User logged Out"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incoimgRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(incoimgRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }
    const decodedToken=jwt.verify(
        incoimgRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
    )
    const user=await User.findById(decodedToken?._id)
    if(!user){
        throw new ApiError(401,"Invalid refreshToken")
    }
    if(incoimgRefreshToken !== user?.refreshToken){
        throw new ApiError(401,"RefreshToken is expired or used")
    }
    const options={
        httpOnly:true,
        secure:true
    }
    await generateAccessTokenAndRefreshToken(user._id)
    return res
      .status(200)
      .cookie("accessToken : ",accessToken,options)
      .cookie("refreshToken : ",newrefreshToken,options)
      .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken:newrefreshToken}
        )
      )
})
export {
    registerUser,
    loginUser,
logoutUser,
refreshAccessToken}