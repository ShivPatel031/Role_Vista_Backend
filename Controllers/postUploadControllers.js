import Post from "../models/PostModel"
import postUploadCloudinary from "../Utils/cloudUpload"



exports.postUpload=async (req,res)=>{
    try{

        const {title,description,enableComment,category,userId}=req.body;
        const file=req.files.file;

        const supportedType=["mp4","mov","jpg","jpeg","png"]
        const fileType=file.name.split('.')[1]
        if(!supportedType.includes(fileType)){
            return res.status(400).json({
                success:false,
                message:"file type not supported."
            })
        }

        const postSize=file.size
        const maxSize=2097152
        if(postSize>maxSize){
            return res.status(413).json({
                success:false,
                message:"file size is too large."
            })
        }

        const response=await postUploadCloudinary(file,"posts")

        if(!response){
            return res.status(500).json({
                success:false,
                message:"error while uploading Post."
            })
        }

        const dbResponse=await Post.create({
            title,
            description,
            enableComment,
            category,
            userId,
            contentUrl:response.secure_url,
        })

        return res.status(200).json({
            success:true,
            data:dbResponse,
            message:"Post uploaded successfully."
        })
    }catch(err){
        console.log(err.message)
    }
}
