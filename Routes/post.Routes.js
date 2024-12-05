import { Router } from "express";
import {auth} from "../Middlewares/auth.js"
import {canPost, canRemovePost} from "../Middlewares/postMiddlewares.js"
import {createPost, getPosts, removePost} from "../Controllers/postController.js"
import { upload } from "../Config/Multer.js"


const route = Router();

route.post("/createPost",upload.single("image"),auth,canPost,createPost);
route.post("/removePost",auth,canRemovePost,removePost);
route.post("/getPosts",auth,getPosts);

export default route;