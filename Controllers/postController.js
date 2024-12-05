import {Post} from "../Models/PostModel.js"
import {Comment} from "../Models/CommentModel.js"
import {createPostCloudinary,removePostCloudinary} from "../Utils/cloudinary.js"
import fs from "fs"
import { User } from "../Models/UserModel.js"



const createPost = async (req, res) => {
    try {

        let {title, description, enableComment, category} = req.body;

        title = title.trim();
        description = description.trim();

        enableComment = enableComment === "true" ? true : false;

        const file = req.file;
        

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

        fs.unlinkSync(file.path);

        const dbResponse = await Post.create({
            title,
            description,
            enableComment,
            categories:category,
            userId:req.user._id,
            contentUrl: response.secure_url,
            cloudinaryId:response.public_id
        })

        if (!dbResponse) {
            return res.status(500).json({ success: false, message: "somthing went wrong while inserting post in database." });
        }


        req.user.posts.push(dbResponse._id);

        await req.user.save();

        return res.status(200).json({
            success: true,
            data: dbResponse,
            message: "Post uploaded successfully."
        })
    } catch (err) {

        if(file) fs.unlinkSync(file.path);

        return res.status(500).json({
            success:false,
            message:"error while uploading post."
        })
    }
}

const getPosts=async (req,res)=>{
    try{
        const posts=await Post.find().sort({createdAt:-1})
        if(!posts){
            return res.status(500).json({
                success:false,
                message:"unable to find posts."
            })
        }

        return res.status(200).json({
            success:true,
            message:"successfully fetched all the posts."
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

        const post=await Post.findById(postId)

        const response=await removePostCloudinary(post.cloudinaryId)

        if(!response){
            return res.status(500).json({
                success:false,
                message:"unable to remove."
            })
        }

        post.comments.map(async (comment)=>{
            const commentModelResponse=await Comment.findByIdAndDelete(comment)
            if (!commentModelResponse){
                return res.status(500).json({
                    success:false,
                    message:"unable to remove comments mapped with post."
                })
            }
        })

        req.user.posts.pull(post._id);

        await req.user.save();

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
            message:"error while removing post."
        })
    }
}

export {createPost,removePost,getPosts}