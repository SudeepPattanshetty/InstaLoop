import { SendHorizontal } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
function CommentBox({ post }) {
  const { getToken } = useAuth();

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/post/${post._id}/comments`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });
      console.log("Fetched comments:", res.data);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const body = { content };

      const res = await api.post(
        `/api/post/${post._id}/comments`,
        body,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (res.data.success) {
        toast.success("Comment sent");
        setComments((prev) => [...prev, res.data.comment]);
        setContent("");
      } else {
        toast.error(res.data.message || "Failed to send comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error.message);
      toast.error("Something went wrong while sending comment");
    }
  };

  useEffect(() => {
    if (post?._id) {
      fetchComments();
    }
  }, [post?._id]);

  return (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4">
      <h3 className="font-semibold text-lg mb-2">Comments</h3>

      <div className="space-y-3">
      {Array.isArray(comments) && comments.length > 0 ? (
        comments.map((comment) =>
          comment ? (
            <div key={comment._id}>
              <p>{comment.content}</p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </div>
          ) : null
        )
      ) : (
        <p>No comments yet</p>
      )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 m-6">
        <input
          type="text"
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <SendHorizontal />
        </button>
      </form>
    </div>
  );
}

export default CommentBox;