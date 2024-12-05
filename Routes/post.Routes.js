import { Router } from "express";
import {auth} from "../Middlewares/auth"
import {canPost, canRemovePost} from "../Middlewares/postMiddlewares"
import {createPost, getPosts, removePost} from "../Controllers/postController"


const route = Router();

route.post("/createPost",auth,canPost,createPost)
route.post("/removePost",auth,canRemovePost,removePost)
route.post("/getPosts",auth,getPosts)

export default route;