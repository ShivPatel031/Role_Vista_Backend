import { Permission } from "../Models/PermissionModel.js"
import { Post } from "../Models/PostModel.js"
import { User } from "../Models/UserModel.js"


const canPost = async (req, res, next) => {
    try {
        if(req.user.role === 'admin') return next();
        
        const { _id } = req.user
        const permissions = await Permission.findOne({ userId: _id })

        if (!permissions) {
            return res.status(500).json({
                success: false,
                message: "error while reading permissions."
            })
        }

        if (!permissions.canPost) {
            return res.status(404).json({
                success: false,
                message: "you don't have permission to post."
            })
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "error while verifying permissions."
        })
    }
    next()
}

const canRemovePost = async (req, res, next) => {
        try{
            const user=req.user
            const postId=req.body.postId

            if(user.role==="admin"){
                return next();
            }
            
            
            if(!postId){
                return res.status(404).json({
                    success:false,
                    message:"postId not found."
                })
            }
            
            const post=await Post.findById(postId)
            if(!post){
                return res.status(500).json({
                        success:false,
                        message:"post not found."
                })
            }
            
            if(user.role === "user" && user._id.equals(post.userId)){
                
                return next();
            }


            const postUser=await User.findById(post.userId)
            if(!postUser){
                return res.status(500).json({
                    success:false,
                    message:"error while fetching details of postUser."
                })
            }
            if(user.role==="sub-admin" && user.branch===postUser.branch){
                
                return next();
            }
            
            return res.status(404).json({
                success:false,
                message:"you don't have permissions to delete this post."
            })
    
        } catch (error) {
            return res.status(500).json({success:false,message:"something went wrong while removing post."});
        }
    
        
}

export { canPost, canRemovePost }