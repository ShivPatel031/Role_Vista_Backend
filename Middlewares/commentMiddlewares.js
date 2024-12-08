import { Permission } from "../Models/PermissionModel.js";
import { Comment } from "../Models/CommentModel.js";
import { Post } from "../Models/PostModel.js";
import { User } from "../Models/UserModel.js";
import { validateId } from "../Utils/Validations/Validations.js";


const canComment = async (req,res,next) =>
{
    if(req.user.role === "admin") return next();
    try {
        const userId = req.user?._id;

        const permissions = await Permission.findOne({userId});

        if(!permissions) return res.status(500).json({success:false,message:"permissin data not found."});

        if(!permissions.canComment) return res.status(404).json({success:false,message:"User don't have permissin to comment."});

    } catch (error) {
        return res.status(500).json({success:false,message:"Something went wrong while checking user permission"});
    }

    next();
}


const canRemoveComment = async(req,res,next)=>
{
    if(req.user.role === 'admin') return next();

    if(req.user.role === 'user') return res.status(404).json({success:false,message:"don't have permission"});

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
        return res.status(500).json({success:true,message:"something went wrong while removing comment."});
    }

    next();
}

export {canComment,canRemoveComment}