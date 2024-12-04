import { Permission } from "../Models/PermissionModel.js";
import { User } from "../Models/UserModel.js";
import { validateId } from "../Utils/Validations/Validations";

const modifyPermissionMiddleware = async(req,res,next)=>
{
    if(req.user.role === 'admin') next();

    const {restrictedUserId} = req.body;
    
    if(!validateId(restrictedUserId)) return res.status(404).json({success:false,message:"not a valid Id."});

    try {
        const restrictUser = await User.findById(restrictedUserId);

        if(!restrictUser) return res.status(404).json({success:false,message:"restrict user not found."});

        // check branch
        if(restrictUser.branch !== req.user.branch) return res.status(500).json({success:false,message:"user don't have permission to restrict givin user."})

        const permissions = await Permission.findOne({userId:restrictedUserId});

        if(!permissions) return res.status(500).json({success:false,message:"restrict user permission data not found."});

        if(!req.body.canPost)
        {
            if(!permissions.canSubAdminRestrictPost) return res.status(500).json({success:false,message:"user don't have permission to restrict this user."})
        }

        if(!req.body.canComment)
        {
            if(!permissions.canSubAdminRestrictComment) return res.status(500).json({success:false,message:"user don't have permission to restrict this user."})
        }

        req.permissions = permissions;
    } 
    catch (error) 
    {
        return res.status(500).json({success:false,message:"something went wrong while modifying permission."})
    }
    
    
    next();

}

export {modifyPermissionMiddleware}