import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleBlog } from "../api";
import { useAuth } from "../main";
import Comment from "../components/Comment";
import CommentCard from "../components/CommentCard";
import { Spinner } from "@nextui-org/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Blog() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.blogId;
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSingleBlog = async () => {
      setLoading(true);
      const response = await getSingleBlog(blogId);
      const res = await response.data;
      setBlog(res.blog);
      setLoading(false);
    };
    fetchSingleBlog();
  }, [blogId]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center min-h-scn p-4">
            <div className="max-w-2xl w-full bg-zinc-950 shadow-lg rounded-lg overflow-hidden">
              <img
                className="w-full h-64 object-cover object-center rounded-t-lg"
                src={blog?.image}
                alt="Blog Thumbnail"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-4">
                  {blog?.title}
                </h1>
                <div className="prose prose-lg text-gray-100">
                  <ReactMarkdown
                    children={blog?.blog}
                    remarkPlugins={[remarkGfm]}
                  />
                </div>
              </div>
            </div>
          </div>
          {user?.user && (
            <div className="max-w-2xl w-full mx-auto mt-8">
              <Comment
                blogId={blogId}
                currentUserId={user.user._id}
                currentUserImg={user.user.image}
              />
            </div>
          )}
          <div className="mt-10 max-w-2xl w-full mx-auto grid grid-cols-1 gap-4">
            {blog?.children.map((childItem) => (
              <CommentCard
                key={childItem._id}
                id={childItem._id}
                currentUserId={user?.user?._id || ""}
                parentId={childItem.parentId}
                content={childItem.blog}
                author={childItem.author}
                createdAt={childItem.createdAt}
                comments={childItem.children}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Blog;
