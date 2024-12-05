import mongoose,{Schema} from "mongoose";

// User schema 

const userSchema =  new Schema(
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
        image:{
            type:String,
            required:false
        },
        posts:[{
            type:Schema.Types.ObjectId,
            ref:"Post"
        }],
        password:{
            type:String,
            required:true,
        },
        dob:{
            type:String,
            required:false
        }

    },
    {
        timestamps:true
    }
);

export const User = mongoose.model("User",userSchema);