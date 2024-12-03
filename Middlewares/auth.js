import jwt from "jsonwebtoken";
import { User } from "../Models/UserModel.js";
require("dotenv").config()

// authentication
exports.auth=async (req,res,next)=>{
    
        const token=req.cookie.token || req.body.token || req.header.token || req.header("Authorisation").replace("Bearer","")

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token not found."
            })
        }

        //decoding jwt token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);

            if(!decode) return res.status(404).json({success:false,message:"not a valid token."});

            let userCredentials = await User.findById(decode?.id);

            if(!userCredentials) return res.status(404).json({success:false,message:"not a valid token."});

            req.user=userCredentials;

        } catch(err){
            return res.status(401).json({
                success:false,
                message:"error while decoding."
            })
        }
        next();
}


// authorization for student
exports.isStudent=(req,res,next)=>{
    try{
        if(req.user.role!="Student"){
            return res.status(401).json({
                success:false,
                message:"you are not student"
            })
        }
        next();
    } catch(err){
        res.status(401).json({
            success:false,
            message:"error while identifying student."
        })
    }
}


// authorization for subAdmin
exports.isSubAdmin=async (req,res,next) => {
    try{
        if(req.user.accountType!="Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is protected route for Instructors only."
            })
        }
        next()

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"error while authorising Instructor."
        })
    }
}


// authorization for admin
exports.isAdmin=(req,res,next)=>{
    try{
        if (req.user.role!="Admin"){
            return res.status(401).json({
                success:false,
                message:"you are not admin."
            })
        }
        next();
    } catch(err){
        res.status(401).json({
            success:false,
            message:"error while verifying admin."
        })
    }
}