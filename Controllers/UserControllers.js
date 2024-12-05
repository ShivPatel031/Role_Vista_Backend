import { User } from "../Models/UserModel.js";
import { Request } from "../Models/RequestModel.js";
import { validateBranch, validateEmail, validateGender, validateMobileNumber, validateName, validatePassword, validateRole, validateDOB, validateId } from "../Utils/Validations/Validations.js"
import bcrypt from "bcrypt";
import { generateJWT } from "../Utils/generateJWT.js";
import { isValidObjectId } from "mongoose";
import { Permission } from "../Models/PermissionModel.js";
import { Post } from "../Models/PostModel.js"

//  user register controller
const registerUser = async (req, res) => {
    // collect all parameter
    let{ userName, role, email, branch, dob, gender, mobileNo, password } = req.body;

    // checking all required parameters present
    if (!userName || !email || !role || !branch || !dob || !gender || !mobileNo || !password) {
        return res.status(404).json({
            success: false,
            message: "All fields are required."
        });
    }

    // triming and lowecase conversion
    userName = userName.trim().toLowerCase();
    email = email.trim().toLowerCase();
    role = role.trim().toLowerCase();
    branch = branch.trim().toLowerCase();
    dob = dob.trim().toLowerCase();
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

        const token = generateJWT(user, "10m");

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
    const { email, password } = req.body;


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
        const authToken = generateJWT(user, "24h");

        if (!authToken) {
            return res.status(500).json({ success: false, message: "token genereation error" });
        }

        const option = {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            expiresIn: '24h'
        }

        return res.status(200).cookie("role_vista_token", JSON.stringify(authToken), option).json({ success: true, message: "user login successfully.", data: user });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, message: "something went wrong while login user.", error: error.message });
    }
}

const logoutUser = async (req, res) => {
    const userId = req.params;

    if (!userId) return res.status(404).json({ success: false, message: "user id not found." });

    if (!isValidObjectId(userId)) return res.status(404).json({ success: false, message: "user id is not valid." });

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
    const { canPost, canComment, canSubAdminRestrictPost, canSubAdminRestrictComment } = req.body;

    if (!isBoolType(canPost) || !isBoolType(canComment) || !isBoolType(canSubAdminRestrictComment) || !isBoolType(canSubAdminRestrictPost)) {
        return res.status(404).json({ success: false, message: "invalid values." });
    }

    const permissions = new Permission(req.permissions);

    try {

        if (!permissions) res.status(500).json({ success: false, message: "user permission data not found." });

        permissions.canPost = canPost;
        permissions.canComment = canComment;
        permissions.canSubAdminRestrictComment = canSubAdminRestrictComment;
        permissions.canSubAdminRestrictPost = canSubAdminRestrictPost;

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
        if(createdUser.role=="student"){
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

        return res.status(200).json({ success: false, message: "User approved successfully." });
    } catch (error) {
        return res.status(404).json({ success: false, message: "Something went wrong while approving user." });
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


export { registerUser, loginUser, logoutUser, modifyPermissions, approveRequest, removeUser };