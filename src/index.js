import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";
import dotenv from 'dotenv'
<<<<<<< HEAD
dotenv.config({ path: './.env' })
import {app} from "./app.js";
=======
dotenv.config({ path: './.env' });
import express from "express";
import {app} from "./app.js"
>>>>>>> 3e6c18b187369461839562530e534df4c2e1bab4
// Approach : 1
// import express from "express";
// const app=express();
// const ConnectDB=(async()=>{
//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/{DB_NAME}`)
//        app.on("error",()=>{
//         console.log("Error : ",error);
//         throw error;
//        })
//        app.listen(process.env.PORT,()=>{
//         console.log(`App is listening on port${process.env.PORT}`);
//        })
//     } catch (error) {
//         console.error("Error : ",error)
//         throw error
//     }
// })

import connectDB from "./db/index.js"
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`Server is listening at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection failed !!! ",err)
})








