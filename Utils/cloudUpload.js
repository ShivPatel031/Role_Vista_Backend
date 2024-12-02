import cloudinary from "cloudinary"

const UploadCloudinary=async (file,folder,quality=100)=>{
    const options={folder}
    options.resource_type="auto"
    options.quality=quality
    return await cloudinary.v2.uploader.upload(file.tempFilePath,options)
}

export {postUploadCloudinary}