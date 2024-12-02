import mongoose, {Schema} from "mongoose";


// Post model
const postSchema = new Schema(
    {
        title:
        {
            type:String,
            required:true,
            maxlength:40,
            trim:true
        },
        contentUrl:{
            type:String
        },
        description:{
            type:String,
            required:true,
            maxlength:200,
            trim:true
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