import mongoos,{Schema} from "mongoose";
import { sendMail } from "../Utils/sendMail.js";
import { mailVerificationMessage } from "../constant.js";

// User schema 

const requestSchema =  new Schema(
    {
        userName : {
            type:String,
            required:true,
            maxlength:50,
            lowercase:true,
        },
        role:{
            type:String,
            enum:["user","sub-admin","admin"],
            required:true
        },
        gender:{
            type:String,
            enum:["male","female","other"],
            required:true
        },
        mobileNo:
        {
            type:String,
            required:true,
            match:/^[1-9]\d{9}$/ // Regex for mobile validation
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase:true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Regex for email validation
        },
        branch:{
            type:String,
            required:true,
            enum:["cse","electronic","mechanic"]
        },
        password:{
            type:String,
            required:true,
        },
        dob:{
            type:String,
            required:false
        },
        verifiedEmail:{
            type:Boolean,
            default:false
        },
        verifiedMobileNo:{
            type:Boolean,
            default:false
        },
    },
    {
        timestamps:true
    }
);

requestSchema.methods.sendEmailVerifiction= async function(token){
    

    if(!token) {
        console.log("token not found");
        return false;
    }
    //setup link
    const verificationLink= `${process.env.BACKEND_LINK}/api/v1/users/login`;

    const message = mailVerificationMessage.replace('{{userName}}', this.userName).replace('{{verificationLink}}', verificationLink)
    
    await sendMail(this.email,"Verify Your Email Address",message);

    return true;
};

export const Request = mongoos.model("Request",requestSchema);