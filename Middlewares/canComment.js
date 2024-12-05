import { Permission } from "../Models/PermissionModel";

const canComment = async (req,res,next) =>
{
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

export {canComment}