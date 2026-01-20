import { Router } from "express";
import { registerUser,loginUser,logoutUser, refreshAccessToken} from "../controllers/users.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import fileUpload from "express-fileupload";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.post("/register",
    upload.fields([
        {
            name:"avatar",
        },
        {
            name:"coverImage",
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

//secured Routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-Token").post(refreshAccessToken)
export default router;