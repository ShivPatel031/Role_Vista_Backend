import jwt from "jsonwebtoken"
require("dotenv").config()

// authentication
exports.auth=(req,res,next)=>{
    try{
        const token=req.cookie.token || req.body.token || req.header.token || req.header("Authorisation").replace("Bearer","")

        if(!token){
            res.status(401).json({
                success:false,
                message:"token not found."
            })
        }

        //decoding jwt token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decode
        } catch(err){
            res.status(401).json({
                success:false,
                message:"error while decoding."
            })
        }
        next();
    } catch(err){
        res.status(401).json({
            success:false,
            message:"error while verifying."
        })
    }
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