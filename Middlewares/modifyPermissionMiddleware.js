import { Permission } from "../Models/PermissionModel.js";
import { User } from "../Models/UserModel.js";
import { validateId } from "../Utils/Validations/Validations.js";

const modifyPermissionMiddleware = async(req,res,next)=>
{
    if(req.user.role === 'admin') return next();

    if(req.user.role === "user") return res.status(404).json({success:false,message:"user don't have this permission."});

    

    const {restrictedUserId} = req.body;

    if(req.user._id.equals(restrictedUserId)) return res.status(404).json({success:false,message:"user don't have this permission."});
    
    if(!validateId(restrictedUserId)) return res.status(404).json({success:false,message:"not a valid Id."});

    try {
        const restrictUser = await User.findById(restrictedUserId);

        if(!restrictUser) return res.status(404).json({success:false,message:"restrict user not found."});

        // check branch
        if(restrictUser.branch !== req.user.branch) return res.status(500).json({success:false,message:"user don't have permission to restrict givin user."})

        const permissions = await Permission.findOne({userId:restrictedUserId});

        if(!permissions) return res.status(500).json({success:false,message:"restrict user permission data not found."});

        req.body.canPost = req.body.canPost ===  "true" ? true : false ;
        req.body.canComment = req.body.canComment ===  "true" ? true : false ;
        req.body.canSubAdminRestrictComment = req.body.canSubAdminRestrictComment ===  "true" ? true : false ;
        req.body.canSubAdminRestrictPost = req.body.canSubAdminRestrictPost ===  "true" ? true : false ;

        if(!permissions.canSubAdminRestrictPost) return res.status(500).json({success:false,message:"user don't have permission to restrict/unrestrict this user."})


        if(!permissions.canSubAdminRestrictComment) return res.status(500).json({success:false,message:"user don't have permission to restrict/unrestrict this user."})


        req.permissions = permissions;
    } 
    catch (error) 
    {
        return res.status(500).json({success:false,message:"something went wrong while modifying permission."})
    }
    
    
    next();

}

export {modifyPermissionMiddleware}