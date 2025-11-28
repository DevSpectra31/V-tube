import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())
<<<<<<< HEAD
// import routes
import userRoute from "./routes/user.routes.js";
//middleware
app.use("/api/v1/users",userRoute)
=======
//routes import
import userRouter from "./routes/users.routes.js";

//route declaration
app.use("/api/v1/users",userRouter)
>>>>>>> 3e6c18b187369461839562530e534df4c2e1bab4
export{app}