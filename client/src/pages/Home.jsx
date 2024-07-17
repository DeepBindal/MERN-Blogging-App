import React, { useEffect, useState } from "react";
import { Pagination, Spinner } from "@nextui-org/react";
import { fetchBlogs } from "../api";
import BlogCard from "../components/BlogCard";

function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomeBlogs = async () => {
      setLoading(true);
      const response = await fetchBlogs({ pageNumber: currentPage });
      const res = await response.data;
      setBlogs(res.posts);
      setLoading(false);
    };
    fetchHomeBlogs();
  }, [currentPage]);

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="text-center text-2xl font-bold text-white mb-6">Home</div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {blogs.length === 0 ? (
              <p className="text-white text-center col-span-full">No posts to show.</p>
            ) : (
              blogs.map((blog, index) => (
                <BlogCard
                  key={index}
                  title={blog.title}
                  image={blog.image}
                  content={blog.blog}
                  blogId={blog._id}
                  author={blog.author}
                  date={blog.createdAt}
                />
              ))
            )}
          </div>
          <Pagination
            total={20}
            color="secondary"
            page={currentPage}
            onChange={setCurrentPage}
            className="mt-8"
          />
        </div>
      )}
    </div>
  );
}

export default Home;
