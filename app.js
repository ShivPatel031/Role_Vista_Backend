import cookieParser from "cookie-parser";
import express from "express";
import userRoutes from "./Routes/user.Routes.js";
import postRoutes from "./Routes/post.Routes.js";
import morgan from "morgan";
import cors from "cors"

// creating app object
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
));

// route
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/posts",postRoutes);


app.get("/",(req,res)=>{return res.status(200).json({success:true,message:"Welcome to RoleVista."})})

export {app};