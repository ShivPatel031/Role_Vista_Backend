import { Comment } from "../Models/CommentModel";
import { Post } from "../Models/PostModel";
import { User } from "../Models/UserModel";

const canRemoveComment = async(req,res,next)=>
{
    if(req.user.role === 'admin') next();

    if(req.user.role === 'student') return res.status(404).json({success:false,message:"don't have permission"});

    const {commentId} = req.body;
    
    if(!validateId(commentId)) return res.status(404).json({success:false,message:"not a valid Id."});
    
    try {
        const comment = await Comment.findById(commentId);

        if(!comment) return res.status(404).json("comment not found.");

        const post = await Post.findById(comment.postId);

        if(!post) return res.status(404).json("post not found.");

        const postUser = await User.findById(post.userId);

        if(!postUser) return res.status(404).json("post user not found.");

        if(!(postUser.branch === req.user.branch)) return res.status(404).json({success:false,message:"don't have permission."}); 

    } catch (error) {
        return res.status(500).json({success:true,message:"something went wrong while removeing comment."});
    }

    next();
}

export {canRemoveComment};