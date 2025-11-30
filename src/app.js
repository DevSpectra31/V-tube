import express from 'express';
import cors from "cors";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static("public"))
app.use(cookieParser())
//import route
import userroute from "./routes/users.routes.js";
//routes
app.use("/api/v1/users",userroute)
export{app}