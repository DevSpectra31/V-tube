import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
//import route
import userroute from "./routes/users.routes.js";

app.use("/api/v1/users",userroute)
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())
export{app}