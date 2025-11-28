import express from "express";
import { registerUser } from "../controllers/user.controller.js";
const app=express();
app.route("register").post(registerUser)
export default app