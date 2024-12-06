import { Router } from "express";
import { approveRequest, loginUser, modifyPermissions, registerUser, verifyUser } from "../Controllers/UserControllers.js";
import {auth, isAdmin} from "../Middlewares/auth.js"
import { modifyPermissionMiddleware } from "../Middlewares/modifyPermissionMiddleware.js";

const router = Router();

router.route("/registerUser").post(registerUser);

router.route("/login").post(loginUser);

router.route("/verifyUser/:token").get(verifyUser);

router.route("/approveUser").post(auth,isAdmin,approveRequest);

router.route("/modifyPermission").post(auth,modifyPermissionMiddleware,modifyPermissions);

export default router;