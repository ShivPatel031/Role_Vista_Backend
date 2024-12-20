import { User } from "../Models/UserModel.js";
import { Request } from "../Models/RequestModel.js";
import { validateBranch, validateEmail, validateGender, validateMobileNumber, validateName, validatePassword, validateRole, validateDOB, validateId } from "../Utils/Validations/Validations.js"
import bcrypt from "bcrypt";
import { generateJWT } from "../Utils/generateJWT.js";
import { Permission } from "../Models/PermissionModel.js";
import { Post } from "../Models/PostModel.js"
import jwt from "jsonwebtoken";
import { adminApprovalMessage, adminDisapprovalMessage } from "../constant.js";
import { sendMail } from "../Utils/sendMail.js";

//  user register controller
const registerUser = async (req, res) => {
    // collect all parameter
    let{ name, role, email, branch, dateOfBirth, gender, mobileNo, password } = req.body;
    
    // checking all required parameters present
    if (!name || !email || !role || !branch || !dateOfBirth || !gender || !mobileNo || !password) {
        return res.status(404).json({
            success: false,
            message: "All fields are required."
        });
    }

    // triming and lowecase conversion
    const userName = name.trim().toLowerCase();
    email = email.trim().toLowerCase();
    role = role.trim().toLowerCase();
    branch = branch.trim().toLowerCase();
    const dob = dateOfBirth.trim().toLowerCase();
    gender = gender.trim().toLowerCase();
    mobileNo = mobileNo.trim().toLowerCase();

    
    
    // verifying all parameter values
    if (!validateName(userName)) return res.status(404).json({ success: false, message: "Name length must be less then 50 or only inlude aphabets." });
    
    if (!validateEmail(email)) return res.status(404).json({ success: false, message: "Email is not in correct formate." });
    
    if (!validateMobileNumber(mobileNo)) return res.status(404).json({ success: false, message: "Mobile number must have 10 length and only numeric character" });
    
    if (!validatePassword(password)) return res.status(404).json({ success: false, message: "Password must contain at least 1 lowercase, 1 uppercase , 1 number and 1 special character and length must be between 8-12." });

    if (!validateBranch(branch)) return res.status(404).json({ success: false, message: "Branch is not valid." });

    if (!validateRole(role)) return res.status(404).json({ success: false, message: "Role is not valid." });
    
    if (!validateDOB(dob)) return res.status(404).json({ success: false, message: "Data of birth must be between 1920-present and must be 15 year older or more." });

    if (!validateGender(gender)) return res.status(404).json({ success: false, message: "Gender is not valid." });
    

    if(role === "student") role = "user";
    if(role === "teacher") role = "sub-admin";
    
    //  hashing password
    const hashPassword = await bcrypt.hash(password, Number(process.env.SALT));


    // Storing data
    try {
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(404).json({ success: true, message: "User already exist.", requestedUser: false });

        const existingRequrest = await Request.findOne({ email });
        if (existingRequrest) {
            return res.status(404).json({ success: true, message: "Request already exist.", requestedUser: true, varifiedMail: existingRequrest.verifiedEmail });
        }

        const user = await Request.create({
            userName,
            email,
            mobileNo,
            role,
            branch,
            dob,
            gender,
            password: hashPassword
        });

        

        if (!user) return res.status(500).json({ success: false, message: "something went wrong while add user in database." });

        const token = await generateJWT(user, "10m");

        const success = await user.sendEmailVerifiction(token);

        if (!success) {
            return res.status(500).json({ success: true, message: "something went wrong while sending message but user data is stored successfully." });
        }

        return res.status(200).json({ success: true, message: "User add successfully" });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "something went wrong while adding user.", error: error.message });
    }
}


// user login controller
const loginUser = async (req, res) => {
    // collect parameters
    let { email, password } = req.body;


    // check that all parameters are availabe
    if (!email || !password) return res.status(404).json({ success: true, message: "All fields are required." })


    email = email.trim().toLowerCase();


    // varify all parameter formate 
    if (!validateEmail(email)) return res.status(404).json({ success: false, message: "Email is not in correct formate." });

    if (!validatePassword(password)) return res.status(404).json({ success: false, message: "Password must contain at least 1 lowercase, 1 uppercase , 1 number and 1 special character and length must be between 8-12." });

    try {

        const user = await User.findOne({ email });

        if (!user) {
            const requestedUser = await Request.findOne({ email });

            if (!requestedUser) {
                return res.status(404).json({ success: false, message: "Not Role vista user Register first." });
            }
            else {

                if (!requestedUser.verifiedEmail) {
                    return res.status(404).json({ success: false, message: "Your email is not verified." });
                }
                else {
                    return res.status(404).json({ success: false, message: "Request is yet to approve." });
                }

            }

        }


        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(404).json({ success: false, message: "Email or password is wrong." });

        // to send user data to frontend with password null for security.
        user.password = null;

        // genrate token
        const authToken = await generateJWT(user, "24h");

        if (!authToken) {
            return res.status(500).json({ success: false, message: "token genereation error" });
        }

        const option = {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            expiresIn: '24h'
        }

        return res.status(200).cookie("role_vista_token", authToken, option).json({ success: true, message: "user login successfully.", data: user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "something went wrong while login user.", error: error.message });
    }
}

const logoutUser = async (req, res) => {

    const option = {
        httpOnly: true,
        sameSite: "none",
        secure: true,
    }

    return res.status(200).clearCookie("role_vista_token", option).json({ success: true, message: "User Logout successfully." });

}

function isBoolType(value) {
    return typeof value === "boolean";
}

const modifyPermissions = async (req, res) => {
    
    let { canPost, canComment, canSubAdminRestrictPost, canSubAdminRestrictComment } = req.body;

    if (!isBoolType(canPost) || !isBoolType(canComment) || !isBoolType(canSubAdminRestrictComment) || !isBoolType(canSubAdminRestrictPost)) {
        return res.status(404).json({ success: false, message: "invalid values." });
    }

    const permissions = new Permission(req.permissions);
    
    try {

        if (!permissions) res.status(500).json({ success: false, message: "user permission data not found." });

        permissions.canPost = canPost;
        permissions.canComment = canComment;
        if(!(req.user.role === "sub-admin"))
        {
            permissions.canSubAdminRestrictComment = canSubAdminRestrictComment;
            permissions.canSubAdminRestrictPost = canSubAdminRestrictPost;
        }
        
        const response = await permissions.save();
        
        if (!response) return res.status(500).json({ success: false, message: "somthing went worng while nodifying permission of user." });

        return res.status(200).json({ success: true, message: "Permission is updated successfully." })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Somthing went worng while changing permission", error: error.message });
    }
}

const approveRequest = async (req, res) => {
    const { requestedUserId } = req.body;

    if (!requestedUserId) return res.status(404).json({ success: false, message: "requestedUser Id is not found." });

    if (!validateId(requestedUserId)) return res.status(404).json({ success: false, message: "requestedUserId is not valid id" });

    try {
        const requestedUser = await Request.findById(requestedUserId);

        
        if (!requestedUser) return res.status(404).json({ success: false, message: "Requested user not found in database." });

        if(!requestedUser.verifiedEmail) return res.status(404).json({success:false,message: "Requested user email is not varified yet."});

        const user = await User.findOne({email:requestedUser.email});

        if(user) return res.status(404).json({success:false,message:"User already exist"});

        const createdUser = await User.create({
            userName: requestedUser.userName,
            role: requestedUser.role,
            gender: requestedUser.gender,
            mobileNo: requestedUser.mobileNo,
            email: requestedUser.email,
            branch: requestedUser.branch,
            password: requestedUser.password,
            dob: requestedUser.dob
        });


        if (!createdUser) return res.status(404).json({ success: false, message: "User is not created in database." });

        await Request.findByIdAndDelete(requestedUserId);

        let permissions={}
        if(createdUser.role=="user"){
            permissions={
                canSubAdminRestrictComment:true,
                canSubAdminRestrictPost:true
            }
        }
        permissions.userId=createdUser._id

        const permissionModelResponse=await Permission.create(permissions)

        if (!permissionModelResponse){
            return res.status(500).json({
                success:false,
                message:"unable to create permissions."
            })
        }

        const message = adminApprovalMessage.replaceAll('{{name}}', createdUser.userName)
        .replace('{{email}}', createdUser.email)
        .replace('{{role}}', createdUser.role)
        .replace('{{branch}}', createdUser.branch || 'N/A')
        .replace('{{loginLink}}', `${process.env.FRONTEND_URL}/login`);

        await sendMail(createdUser.email,"Welcome to Rolevista - Your Account Has Been Approved!",message);

        return res.status(200).json({ success: true, message: "User approved successfully." });
    } catch (error) {
        return res.status(404).json({ success: false, message: "Something went wrong while approving user.",error:error.message });
    }
}

const rejectUser = async(req,res)=>
{
    const { requestedUserId } = req.body;

    if (!requestedUserId) return res.status(404).json({ success: false, message: "requestedUser Id is not found." });

    if (!validateId(requestedUserId)) return res.status(404).json({ success: false, message: "requestedUserId is not valid id" });

    try {
        const requestedUser = await Request.findById(requestedUserId);


        if (!requestedUser) return res.status(404).json({ success: false, message: "Requested user not found in database." });

        const message = adminDisapprovalMessage.replaceAll('{{name}}', requestedUser.userName)
        .replace('{{email}}', requestedUser.email)
        .replace('{{role}}', requestedUser.role)
        
        
        await sendMail(requestedUser.email,"Rolevista - Your Account Has Been Rejected!",message);

        await Request.findByIdAndDelete(requestedUserId);

        return res.status(200).json({ success: true, message: "User approved successfully." });
    } catch (error) {
        return res.status(404).json({ success: false, message: "Something went wrong while approving user.",error:error.message });
    }       
}


const removeUser = async (req, res) => {
    try {

        const userId = req.body.userId

        const posts = await Post.find({ userId })

        let comments = []

        posts.map(async (post) => {
            const commentModelResponse = await Comment.findOneAndDelete({ postId: post._id })

            if (!commentModelResponse) {
                return res.status(500).json({
                    success: false,
                    message: "unable to remove comment linked with user post."
                })
            }

            const postModelResponse = await Post.findByIdAndDelete(post._id)
            if (!postModelResponse) {
                return res.status(500).json({
                    success: false,
                    message: "unable to remove post linked with user."
                })
            }
        })


        const userModelResponse = await User.findByIdAndDelete(userId)

        if (!userModelResponse) {
            return res.status(500).json({
                success: false,
                message: "unable to remove user."
            })
        }

        await Permission.findOneAndDelete({userId})

        return res.status(200).json({
            success: true,
            message: "student removed successfully."
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"error while removing user."
        })
    }

}


const verifyUser = async (req,res)=>{
    const {token}  = req.params;

    if(!token) return res.status(404).json({success:true,message:"token not found"});

    

    try{

        const decode=await jwt.verify(token,process.env.JWT_SECRET);

        if(!decode) return res.status(404).json({success:false,message:"not a valid token."});

        const requestUser = await Request.findById(decode?.id);

        if(!requestUser) return res.status(404).json({success:false,message:"Requested uesr not exits."});

        requestUser.verifiedEmail = true;

        await requestUser.save();

        return res.status(200).json({success:true,message:"Email varified successfully"});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:"something went wrong while verifying user."});
    }
    
};

const getRequestedUser = async (req,res)=>
{
    try{
        const response =  await Request.find({verifiedEmail:true});

        if(!response)
        {
            return  res.status(404).json({success:false,message:"User request not found."});
        }

        return res.status(200).json({success:true,message:"User Requests not found.",data:response});
    }
    catch(error)
    {
        return res.status(404).json({success:false,message:"something went wrong while geting using fetching requests."})
    }
}

const loginWithToken = async(req,res)=>
{
    const userId = req.user._id
    try {

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // to send user data to frontend with password null for security.
        user.password = null;

        // genrate token
        const authToken = await generateJWT(user, "12h");

        if (!authToken) {
            return res.status(500).json({ success: false, message: "token genereation error" });
        }

        const option = {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            expiresIn: '12h'
        }

        return res.status(200).cookie("role_vista_token", authToken, option).json({ success: true, message: "user login successfully.", data: user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "something went wrong while login user.", error: error.message });
    }
}

const fetchAllUserSubAdminAndPermission = async (req, res) => {
try {
    // Fetch all users with role 'user' or 'sub-admin'

    let users = ""
    if(req.user.role === 'admin')
    {
        users = await User.find({ role: { $in: ['user', 'sub-admin'] } });
    }

    if(req.user.role === 'sub-admin')
    {
        users = await User.find({$and:[{role:'user',branch:req.user.branch}]});
    }
    

    if (!users || users.length === 0) {
    return res.status(404).json({ success: false, message: "No users found." });
    }

    // Use Promise.all to resolve all async operations
    let data = await Promise.all(
    users.map(async (user) => {
        let permission = await Permission.find({ userId: user._id });

        if (!permission || permission.length === 0) {
        throw new Error(`Permissions not found for user with ID: ${user._id}`);
        }

        // Return a new object with permissions
        return {
        ...user.toObject(), // Convert Mongoose document to plain object
        permissions: permission[0],
        };
    })
    );

    return res.status(200).json({ success: true, message: "Users and their permissions found.", data });
} catch (error) {
    return res.status(500).json({
    success: false,
    message: "Something went wrong while fetching all users.",
    error: error.message,
    });
}
};

const fetchUserToRemove = async (req,res)=>
{
    try
    {
        const users = await User.find({ role: { $in: ['user', 'sub-admin'] } });

        if(!users) return res.status(500).json({success:false,message:"users not founds"});

        return res.status(200).json({success:true,message:"fetch users successfully.",data:users});
    }
    catch(error)
    {
        return res.status(500).json({success:false,message:"something went wrong while fetching user.",error:error.message});
    }
}
  


export { registerUser, loginUser, logoutUser, modifyPermissions, approveRequest, rejectUser ,removeUser ,verifyUser , getRequestedUser,loginWithToken , fetchAllUserSubAdminAndPermission,fetchUserToRemove};