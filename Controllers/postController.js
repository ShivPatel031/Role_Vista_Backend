import Post from "../Models/PostModel"
import Comment from "../Models/CommentModel"
import {createPostCloudinary,removePostCloudinary} from "../Utils/cloudinary"


const createPost = async (req, res) => {
    try {

        const { title, description, enableComment, category, userId } = req.body;

        const file = req.files.file;

        const supportedType = ["mp4", "mov", "jpg", "jpeg", "png"]
        const fileType = file.name.split('.')[1]
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

        const dbResponse = await Post.create({
            title,
            description,
            enableComment,
            category,
            userId,
            contentUrl: response.secure_url,
            cloudinaryId:response.public_id
        })

        if (!dbResponse) {
            return res.status(500).json({ success: false, message: "somthing went wrong while inserting post in database." });
        }

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

export {createPost,removePost}