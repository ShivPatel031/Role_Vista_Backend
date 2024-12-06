import { Router } from "express";
import { auth } from "../Middlewares/auth.js";
import { createComment, deleteComment } from "../Controllers/commentController.js";
import { canComment, canRemoveComment } from "../Middlewares/commentMiddlewares.js";


const router = Router();

router.route("/doComment").post(auth,canComment,createComment);

router.route("/deleteComment").post(auth,canRemoveComment,deleteComment);

export default router;