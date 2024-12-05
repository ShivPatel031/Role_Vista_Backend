import cloudinary from "cloudinary"
import { cloudinaryConnect } from "../Config/Cloudinary.js"

const createPostCloudinary=async (file,folder,quality=100)=>{
    const options={folder}
    options.resource_type="auto"
    options.quality=quality
    cloudinaryConnect();

    return await cloudinary.v2.uploader.upload(file.path,options)
}

const removePostCloudinary=async (public_id)=>{
    return await cloudinary.v2.uploader.destroy(public_id)
}

export {createPostCloudinary,removePostCloudinary}