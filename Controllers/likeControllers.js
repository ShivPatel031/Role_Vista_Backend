import { Post } from "../Models/PostModel"


const likePost=async (req,res)=>{
    try{
        
    const {userId,postId}=req.body

    const post=await Post.findById(postId)

    if(!post){
        return res.status(404).json({
            success:false,
            message:"Post doesn't exist."
        })
    }
    if(post.likes.includes(userId)){
        return res.status(404).json({
            success:false,
            message:"you have already liked this post."
        })
    }
    
    const postModelResponse=await Post.findByIdAndUpdate(postId,{$push:{likes:userId}})

    if(!postModelResponse){
        return res.status(500).json({
            success:false,
            message:"unable to like."
        })
    }
    return res.status(200).json({
        success:true,
        message:"liked successfully."
    })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"error while doing like."
        })
    }
}



const removeLike=async (req,res)=>{
    try{
        
    const {userId,postId}=req.body

    const post=await Post.findById(postId)

    if(!post){
        return res.status(404).json({
            success:false,
            message:"Post doesn't exist."
        })
    }
    if(!post.likes.includes(userId)){
        return res.status(404).json({
            success:false,
            message:"you have not liked this post."
        })
    }
    
    const postModelResponse=await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}})

    if(!postModelResponse){
        return res.status(500).json({
            success:false,
            message:"unable to remove like."
        })
    }
    return res.status(200).json({
        success:true,
        message:"removed like successfully."
    })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"error while removing like."
        })
    }
}

export {likePost,removeLike}