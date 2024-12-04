import mongoose, {Schema} from "mongoose";


// Post model
const postSchema = new Schema(
    {
        cloudinaryId:{
            type:String,
            required:true,
        },
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
        likes:[
            {
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        ],
        comments:[
            {
                type:Schema.Types.ObjectId,
                ref:"Comment"
            }
        ],
        categories:[
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