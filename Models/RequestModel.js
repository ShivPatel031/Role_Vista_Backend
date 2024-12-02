import mongoos,{Schema} from "mongoose";
import { sendVarificationMail } from "../Utils/varifymail.js";

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
            enum:["student","teacher"],
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
            match:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/
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

requestSchema.methods.sendEmailVerifiction= async ()=>{
    if(!this.verifiedEmail)
    {
        //genrate token
        const token = "";

        //setup link
        const link = `${process.env.BACKEND_LINK}/`

        sendVarificationMail(this.email,this.userName,link)
    }
};

export const Request = mongoos.model("Request",requestSchema);