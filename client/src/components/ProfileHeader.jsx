import { Avatar, Tabs, Tab } from "@nextui-org/react";
import ProfileBlogCard from "./ProfileBlogCard";
import { deleteSingleBlog } from "../api";
import { useState } from "react";
import toast from "react-hot-toast";

function ProfileHeader({ name, username, imgUrl, blogs }) {
  const [userBlogs, setUserBlogs] = useState(blogs);
  const handleDelete = async (e, id,) => {
    console.log(id);
    const response = await deleteSingleBlog(id);
    console.log(response.data);
    setUserBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id))
    toast.success("Blog deleted", {
      icon: '🗑️',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });

  };
  return (
    <div className="flex flex-col w-full justify-start p-4 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar
            src={imgUrl}
            alt="profile"
            size="xl"
            className="object-cover shadow-2xl"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{name}</h2>
            <p className="text-base text-gray-300">@{username}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 h-0.5 w-full bg-gray-600" />

      <div className="flex w-full flex-col mt-4">
        <Tabs aria-label="Options">
          <Tab key="blogs" title="Blogs">
            <div className="flex flex-wrap justify-center">
              {userBlogs && userBlogs.length > 0 ? (
                userBlogs.map((blog, index) => (
                  <ProfileBlogCard
                    key={index}
                    title={blog.title}
                    image={blog.image}
                    blog={blog.blog}
                    blogId={blog._id}
                    author={blog.author}
                    date={blog.createdAt}
                    handleDelete={handleDelete}
                  />
                ))
              ) : (
                <p className="text-white">No blogs to display.</p>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default ProfileHeader;
