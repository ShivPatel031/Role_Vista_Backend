import mongoose,{Schema} from "mongoose";


// Permission model
const permissionSchema = new Schema(
    {
        userId:
        {
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        canPost:{
            type:Boolean,
            default:true
        },
        canComment:{
            type:Boolean,
            default:true,
        },
        canSubAdminRestrictPost:{
            type:Boolean,
            deafult:false,
        },
        canSubAdminRestrictComment:{
            type:Boolean,
            default:false,
        }
    },
    {
        timestamps:true
    }
);

export const Permission = mongoose.model("Permission",permissionSchema);