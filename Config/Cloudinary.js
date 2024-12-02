import cloudinary from "cloudinary"
require("dotenv").config()

exports.cloudinaryConnect=()=>{
    try{
        cloudinary.v2.config({
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.CLOUDINARY_API_KEY,
            api_secret:process.env.CLOUDINARY_API_SECRET
        })
    } catch(err){
        console.log("error while configuring cloudinary.")
        console.error(err.message)
    }
}