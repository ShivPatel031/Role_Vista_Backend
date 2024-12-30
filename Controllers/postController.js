import {Post} from "../Models/PostModel.js"
import {Comment} from "../Models/CommentModel.js"
import {createPostCloudinary,removePostCloudinary} from "../Utils/cloudinary.js"
import fs from "fs"
import { User } from "../Models/UserModel.js"
import { validateId } from "../Utils/Validations/Validations.js"
import { error } from "console"



const createPost = async (req, res) => {
    const file = req.file;

    try {

        let {title, description, enableComment, category} = req.body;

        title = title.trim();
        description = description.trim();

        enableComment = enableComment === "true" ? true : false; 

        if(!file) return res.status(404).json({success:false,message:"file not found."});

        const supportedType = ["mp4", "mov", "jpg", "jpeg", "png"]
        const fileType = file.originalname.split('.')[1]
        if (!supportedType.includes(fileType)) {
            return res.status(400).json({
                success: false,
                message: "file type not supported."
            })
        }

        const postSize = file.size
        const maxSize = 2097152
        if (postSize > maxSize) {
            return res.status(413).json({
                success: false,
                message: "file size is too large."
            })
        }

        

        const response = await createPostCloudinary(file, "posts")

        if (!response) {
            return res.status(500).json({
                success: false,
                message: "error while uploading Post."
            })
        }
        console.log("test it")

        const dbResponse = await Post.create({
            title,
            description,
            enableComment,
            categories:category,
            userId:req.user._id,
            contentUrl: response.secure_url,
            cloudinaryId:response.public_id
        })

        console.log("test 34");

        if (!dbResponse) {
            return res.status(500).json({ success: false, message: "somthing went wrong while inserting post in database." });
        }

        const user =  await User.findById(req.user._id);

        console.log("test 23");
        console.log("user",user);
        console.log("post",dbResponse);

        user.posts.push(dbResponse._id);

        console.log("user",user);

        console.log("user test");

        await user.save();

        console.log("test2")

        return res.status(200).json({
            success: true,
            data: dbResponse,
            message: "Post uploaded successfully."
        })
    } catch (err) {

        return res.status(500).json({
            success:false,
            message:"error while uploading post."
        })
    }
    finally{
        if(file) fs.unlinkSync(file.path);
    }
}

const getAllPosts=async (req,res)=>{
    try{
        const posts=await Post.find().sort({createdAt:-1}).populate('comments').populate({path:"userId",select:"branch"}).exec();
        if(!posts){
            return res.status(500).json({
                success:false,
                message:"unable to find posts."
            })
        }

        return res.status(200).json({
            success:true,
            message:"successfully fetched all the posts.",
            data:posts
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"error while fetching posts."
        })
    }
}

const removePost = async (req, res) => {
    try {
        const {postId} = req.body;

        if(!postId) return res.status(404).json({success:false,message:"post id not found"});

        if(!validateId(postId)) return res.status(404).json({success:false,message:"post id is not valid."});


        const post=await Post.findById(postId)
        console.log(post);

        if(!post) return res.status(500).json({success:false,message:"post not found."})
        
        post.comments.map(async (comment)=>{
            const commentModelResponse=await Comment.findByIdAndDelete(comment)
            if (!commentModelResponse){
                return res.status(500).json({
                    success:false,
                    message:"unable to remove comments mapped with post."
                })
            }
        })

        const user = await User.findById(post.userId);
        console.log(user)

        if(!user) return res.status(404).json({success:false,message:"post user not found."});

        user.posts.pull(post._id);

        await user.save();

        const response=await removePostCloudinary(post.cloudinaryId);

        if(!response){
            return res.status(500).json({
                success:false,
                message:"unable to remove."
            })
        }

        const postModelResponse=await Post.findByIdAndDelete(postId)

        if(!postModelResponse){
            return res.status(500).json({
                success:false,
                message:"unable to remove post."
            })
        }

        return res.status(200).json({
            success:true,
            message:"post deleted successfully."
        })
        

    } catch (err) {
        return res.status(500).json({
            success:false,
            message:"error while removing post.",
            error:err
        })
    }
}

// const getAllMyPost = async (req,res)=>
// {
//     try {
//         const userId = req.user._id

//         const posts = await Post.find({userId});

        
//     } catch (error) {
//         return res.status(500).json({success:true,message:"somthing went wrong while fetch all user's posts.",error:error.message});
//     }
// }

export {createPost,removePost,getAllPosts}