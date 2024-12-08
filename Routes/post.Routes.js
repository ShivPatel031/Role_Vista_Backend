import { Router } from "express";
import {auth} from "../Middlewares/auth.js"
import {canPost, canRemovePost} from "../Middlewares/postMiddlewares.js"
import {createPost, getAllPosts, removePost} from "../Controllers/postController.js"
import { upload } from "../Config/Multer.js"
import commentRoutes from "./comment.Routes.js"
import { likePost, removeLike } from "../Controllers/likeControllers.js";



const route = Router();

route.post("/createPost",upload.single("image"),auth,canPost,createPost);
route.post("/removePost",auth,canRemovePost,removePost);
route.get("/getAllPosts",auth,getAllPosts);
route.use("/comments",commentRoutes);
route.post("/likePost",auth,likePost);
route.post("/removeLike",auth,removeLike);


export default route;