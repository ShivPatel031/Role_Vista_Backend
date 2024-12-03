import mongoose, { Schema } from "mongoose"

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    comment: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200
    }
})

export const Comment = mongoose.model("Comment", commentSchema)