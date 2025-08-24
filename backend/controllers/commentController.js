import Comments from "../models/Comments.js";
import Post from "../models/Post.js";

export const postComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const { user } = req.auth();
        const { content } = req.body;

        const comment = new Comments({
            post: postId,
            user,
            content,
        })
        await comment.save()

        await Post.findByIdAndUpdate(postId, {
            $push: { comment: comment._id }
        })

        res.json({ success: true, message: "Comment sent" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments = await Comments.find({ post: postId }).populate("user", "full_name email");
        res.json(comments)
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}