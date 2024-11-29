import express from "express";

// creating app object
const app = express();

//middleware
app.use(express.json());

app.get("/",(req,res)=>{return res.status(200).json({success:true,message:"Welcome to RoleVista."})})

export {app};