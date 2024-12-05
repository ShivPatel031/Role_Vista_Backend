import jwt from "jsonwebtoken";
import { User } from "../Models/UserModel.js";
import dotenv from "dotenv";
dotenv.config();

// authentication
const auth=async (req,res,next)=>{

        const token=req.cookies?.role_vista_token || req.body?.role_vista_token || req.header?.role_vista_token ;
        // || req.header("role_vista_token").replace("Bearer","")

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
        
        return next();       
}


// authorization for student
const isUser=(req,res,next)=>{
    try{
        if(req.user.role!="user"){
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
const isSubAdmin=async (req,res,next) => {
    try{
        if(req.user.role!="sub-admin"){
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
const isAdmin=(req,res,next)=>{
    try{
        if (req.user.role!="admin"){
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

export {auth,isAdmin,isSubAdmin,isUser};