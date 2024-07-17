import React from "react";
import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";

const BlogCard = ({ title, image, content, blogId, author, date }) => {
  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };
  return (
    <Link to={`/blog/${blogId}`} className="cursor-pointer">
      <div
        className="relative block w-full mb-4 rounded-lg shadow-lg overflow-hidden transition-shadow duration-300"
        style={{ height: "400px" }} // Set a fixed height for the card
      >
        <div
          className="absolute inset-0 bg-black opacity-50"
          style={{ zIndex: 1 }}
        ></div>
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`,
            objectFit: "cover",
            zIndex: 0,
          }}
        ></div>
        <div
          className="relative p-6 flex flex-col justify-between h-full text-white"
          style={{ zIndex: 2 }}
        >
          <div>
            <h2 className="text-xl font-extrabold mb-4">{title}</h2>
            <p className="mb-6">{truncateContent(content, 100)}</p>
          </div>
          <div className="flex items-center">
            <Avatar as={Link} to={`/profile/${author._id}`} src={author.image} alt={`Avatar of ${author.username}`} />
            <div className="ml-4">
              <p className="text-lg font-semibold">{author.username}</p>
              <p className="text-sm">{formatDate(date)}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
