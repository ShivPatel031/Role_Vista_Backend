import mongoose, {Schema} from "mongoose";

const postSchema = new Schema(
    {
        content:
        {
            type:String,
            required:true,
            maxlength:400
        },
        image:{
            type:String
        },
        like:[
            {
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        ],
        comment:[
            {
                type:Schema.Types.ObjectId,
                ref:"Comment"
            }
        ],
        category:[
            {
                type:String,
                trim:true,
                lowercase:true
            }
        ],
        userId:
        {
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        enableComment:{
            type:Boolean,
            default:true
        }
    },
    {
        timestamps:true
    }
);

export const Post = mongoose.model("Post",postSchema);