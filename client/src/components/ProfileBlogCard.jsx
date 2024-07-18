import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button } from "@nextui-org/react";
import { useAuth } from "../main";
import EditBlogPost from "./EditBlogPost";

const truncateContent = (content, maxLength) => {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const ProfileBlogCard = ({
  title,
  image,
  blog,
  blogId,
  author,
  date,
  handleDelete,
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [blogData, setBlogData] = useState({ title, image, blog, blogId });

  const handleEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSave = (updatedBlog) => {
    console.log(updatedBlog);
    setBlogData(updatedBlog);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      {isEditing && (
        <EditBlogPost
          authorId={author._id}
          blog={blogData}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
      <div className="flex flex-col md:flex-row gap-4 bg-gray-900 p-4 rounded-xl w-full shadow-xl mb-6 mx-auto max-w-4xl">
        <Link
          to={`/blog/${blogId}`}
          className="block w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row">
            <div
              className="h-48 md:h-auto md:w-48 flex-none bg-cover rounded-t md:rounded-t-none md:rounded-l overflow-hidden"
              title={blogData.title}
            >
              <img
                src={blogData.image}
                className="h-full w-full object-cover"
                alt={title}
              />
            </div>
            <div className="bg-gray-900 text-white p-4 flex flex-col justify-between leading-normal rounded-b md:rounded-b-none md:rounded-r">
              <div className="mb-4">
                <div className="text-xl font-bold mb-2">{blogData.title}</div>
                <p className="text-gray-400 text-sm">
                  {truncateContent(blogData.blog, 60)}
                </p>
              </div>
              <div className="flex items-center mt-4">
                <Avatar
                  src={author.image}
                  alt={`Avatar of ${author.username}`}
                  size="sm"
                />
                <div className="ml-2 text-sm">
                  <p className="text-gray-300 leading-none">
                    @{author.username}
                  </p>
                  <p className="text-gray-500">{formatDate(date)}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
        {user && user.user && user.user._id === author._id && (
  <div className="flex flex-col justify-center gap-2 md:mt-0 md:ml-4">
    <Button auto size="small" color="primary" onClick={handleEdit}>
      Edit
    </Button>
    <Button
      auto
      size="small"
      color="danger"
      onPress={(e) => handleDelete(e, blogId)}
    >
      Delete
    </Button>
  </div>
)}

      </div>
    </>
  );
};

export default ProfileBlogCard;
