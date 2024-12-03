import { User } from "../Models/UserModel.js";
import { Request } from "../Models/RequestModel.js";
import { validateBranch,validateEmail,validateGender,validateMobileNumber,validateName,validatePassword,validateRole,validateDOB, validateId } from "../Utils/Validations/Validations.js"
import bcrypt from "bcrypt";
import { generateJWT } from "../Utils/generateJWT.js";
import { isValidObjectId } from "mongoose";

//  user register controller
const registerUser = async(req,res)=>
{
    // collect all parameter
    const {userName,role,email,branch,dob,gender,mobileNo,password} = req.body;

    
    // checking all required parameters present
    if(!userName || !email || !role || !branch || !dob || !gender || !mobileNo || !password)
    {
        return res.status(404).json({
            success:false,
            message:"All fields are required."
        });
    }

    // triming and lowecase conversion
    userName=userName.trim().toLowerCase();
    email=email.trim().toLowerCase();
    role=role.trim().toLowerCase();
    branch=branch.trim().toLowerCase();
    dob=dob.trim().toLowerCase();
    gender=gender.trim().toLowerCase();
    mobileNo=mobileNo.trim().toLowerCase();
    
    // verifying all parameter values
    if(!validateName(userName)) return res.status(404).json({success:false,message:"Name length must be less then 50 or only inlude aphabets."});

    if(!validateEmail(email)) return res.status(404).json({success:false,message:"Email is not in correct formate."});

    if(!validateMobileNumber(mobileNo)) return res.status(404).json({success:false,message:"Mobile number must have 10 length and only numeric character"});

    if(!validatePassword(password)) return res.status(404).json({success:false,message:"Password must contain at least 1 lowercase, 1 uppercase , 1 number and 1 special character and length must be between 8-12."});
    
    if(!validateBranch(branch)) return res.status(404).json({success:false,message:"Branch is not valid."});

    if(!validateRole(role)) return res.status(404).json({success:false,message:"Role is not valid."});

    if(!validateDOB(dob)) return res.status(404).json({success:false,message:"Data of birth must be between 1920-present and must be 15 year older or more."});

    if(!validateGender(gender)) return res.status(404).json({success:false,message:"Gender is not valid."});
    
    
    //  hashing password
    const hashPassword = bcrypt.hash(password,process.env.SALT);

    
    // Storing data
    try {

        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(404).json({success:true,message:"User already exist.",requestedUser:false});

        const existingRequrest = await Request.findOne({email});
        if(existingRequrest)
        {
            return res.status(404).json({success:true,message:"Request already exist.",requestedUser:true,varifiedMail:existingRequrest.verifiedEmail});
        } 

        const user = await Request.create({
            userName,
            email,
            mobileNo,
            role,
            branch,
            dob,
            gender,
            password:hashPassword
        });
    
        if(!user) return res.status(500).json({success:false,message:"something went wrong while add user in database."});

        const token = generateJWT(user,"10m");

        const success = await user.sendEmailVerifiction(token);

        if(!success)
        {
            return  res.status(500).json({success:true,message:"something went wrong while sending message but user data is stored successfully."});
        }
        
        return res.status(200).json({success:true,message:"User add successfully"});

    } catch (error) 
    {
        console.log(error.message);
        return res.status(500).json({success:false,message:"something went wrong while adding user.",error:error.message});
    }
}


// user login controller
const loginUser = async(req,res) =>
{
    // collect parameters
    const {email,password} = req.body;

    
    // check that all parameters are availabe
    if(!email || !password) return res.status(404).json({success:true , message:"All fields are required."})


    email=email.trim().toLowerCase();


    // varify all parameter formate 
    if(!validateEmail(email)) return res.status(404).json({success:false,message:"Email is not in correct formate."});

    if(!validatePassword(password)) return res.status(404).json({success:false,message:"Password must contain at least 1 lowercase, 1 uppercase , 1 number and 1 special character and length must be between 8-12."});

    try {

        const user = await User.findOne({email});

        if(!user) return res.status(404).json({success:false,message:"Email or password is wrong."});


        const validPassword = await bcrypt.compare(password,user.password);

        if(!validPassword) return res.status(404).json({success:false,message:"Email or password is wrong."});

        // to send user data to frontend with password null for security.
        user.password = null;

        // genrate token
        const authToken = generateJWT(user,"24h");

        if(!authToken)
        {
            return res.status(500).json({success:false,message:"token genereation error"});
        }

        const option = {
            httpOnly:true,
            sameSite:"none",
            secure:true,
            expiresIn: '24h'
        }

        return res.status(200).cookie("role_vista_token",JSON.stringify(authToken),option).json({success:true,message:"user login successfully.",data:user});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({success:false,message:"something went wrong while login user.",error:error.message});
    }
}

const logoutUser = async(req,res)=>
{
    const userId = req.params;
    
    if(!userId) return res.status(404).json({success:false,message:"user id not found."});

    if(!isValidObjectId(userId)) return res.status(404).json({success:false,message:"user id is not valid."});

    const option = {
        httpOnly:true,
        sameSite:"none",
        secure:true,
    }

    return res.status(200).clearCookie("role_vista_token",option).json({success:true,message:"User Logout successfully."});
    
}
export {registerUser,loginUser,logoutUser};