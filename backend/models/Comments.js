import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    post: {type: String, ref: 'Post'},
    user: {type: String, ref: 'User'},
    content: {type: String, required: true, trim: true},
    createdAt: {type: Date, default: Date.now}
}, {timestamps: true})

const Comments = mongoose.model("Comment", CommentSchema);

export default Comments;