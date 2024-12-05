import { Router } from "express";
import { registerUser } from "../Controllers/UserControllers.js";

const router = Router();

router.route("/registerUser").post(registerUser);

export default router;