import cookieParser from "cookie-parser";
import express from "express";
import userRoutes from "./Routes/user.Routes.js";
import postRoutes from "./Routes/post.Routes.js";
import commentRoutes from "./Routes/comment.Routes.js";
import morgan from "morgan";

// creating app object
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

// route
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/posts",postRoutes);
app.use("/api/v1/comments",commentRoutes);

app.get("/",(req,res)=>{return res.status(200).json({success:true,message:"Welcome to RoleVista."})})

export {app};