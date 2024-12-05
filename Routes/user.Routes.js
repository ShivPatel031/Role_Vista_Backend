import { Router } from "express";
import { approveRequest, loginUser, registerUser, verifyUser } from "../Controllers/UserControllers.js";
import {auth, isAdmin} from "../Middlewares/auth.js"

const router = Router();

router.route("/registerUser").post(registerUser);

router.route("/login").post(loginUser);

router.route("/varifyUser/:token").post(verifyUser);

router.route("/approveUser").post(auth,isAdmin,approveRequest);

export default router;