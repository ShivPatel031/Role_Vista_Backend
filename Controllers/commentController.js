import { Post } from "../Models/PostModel.js"
import { Comment } from "../Models/CommentModel.js";

const createComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.body.postId
        const comment = req.body.comment.trim()

        console.log(userId,postId,comment);

        const commentModelResponse = await Comment.create({ userId, postId, comment })

        console.log(userId,postId,comment,"till here");

        if (!commentModelResponse) {
            return res.status(500).json({
                success: false,
                message: "error while creating comment."
            })
        }

        const postModelResponse = await Post.findOneAndUpdate({ _id: postId }, { $push: { comments: commentModelResponse._id } })

        if (!postModelResponse) {
            return res.status(500).json({
                success: false,
                message: "error while mapping comment with post."
            })
        }
        return res.status(200).json({
            success: true,
            message: "comment saved successfully.",
            data: commentModelResponse
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "comment not created."
        })
    }
}


const deleteComment = async (req, res) => {
    try {
        const commentId = req.body.commentId

        const comment=await Comment.findById(commentId)

        const postModelResponse = await Post.findOneAndUpdate({ _id: comment.postId }, { $pull: { comments: commentId} })

        if (!postModelResponse){
            return res.status(500).json({
                success:false,
                message:"error while deleting comment from post."
            })
        }

        const commentModelResponse= await Comment.findOneAndDelete({_id:commentId})

        if(!commentModelResponse){
            return res.status(500).json({
                success:false,
                message:"error while deleting comment."
            })
        }

        return res.status(200).json({
            success:true,
            message:"comment deleted successfully."
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "comment not deleted."
        })
    }
}

export { createComment ,deleteComment}