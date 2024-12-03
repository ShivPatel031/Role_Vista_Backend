import { Post } from "../models/PostModel"

const createComment = async (req, res) => {
    try {
        const userId = req.body.userId
        const postId = req.body.postId
        const comment = req.body.comment.trim()

        const commentModelResponse = await Comment.create({ userId, postId, comment })

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
        const postId = req.body.commentId

        const postModelResponse = await Post.findOneAndUpdate({ _id: postId }, { $pull: { comments: commentId} })

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