import { Router } from "express";
import { registerUser } from "../controllers/users.controller";
const router=Router();
router.route.post("/register",registerUser)

export default router