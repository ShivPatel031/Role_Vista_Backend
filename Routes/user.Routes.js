import { Router } from "express";
import { approveRequest, fetchAllUserSubAdminAndPermission, fetchUserToRemove, getRequestedUser, loginUser, loginWithToken, logoutUser, modifyPermissions, registerUser, rejectUser, removeUser, verifyUser } from "../Controllers/UserControllers.js";
import {auth, isAdmin} from "../Middlewares/auth.js"
import { modifyPermissionMiddleware } from "../Middlewares/modifyPermissionMiddleware.js";

const router = Router();

router.route("/registerUser").post(registerUser);

router.route("/login").post(loginUser);

router.route("/verifyUser/:token").get(verifyUser);

router.route("/approveUser").post(auth,isAdmin,approveRequest);

router.route("/rejectUser").post(auth,isAdmin,rejectUser);

router.route("/modifyPermission").post(auth,modifyPermissionMiddleware,modifyPermissions);

router.route("/logout").get(auth,logoutUser);

router.route("/requestedUsers").get(auth,isAdmin,getRequestedUser);

router.route("/loginWithToken").get(auth,loginWithToken);

router.route("/fetchUsersWithPermissions").get(auth,fetchAllUserSubAdminAndPermission);

router.route("/fetchUserstoRemove").get(auth,fetchUserToRemove);

router.route("/removeUser").post(auth,isAdmin,removeUser);

export default router;