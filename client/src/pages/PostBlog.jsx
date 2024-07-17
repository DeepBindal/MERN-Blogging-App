import { Input, Textarea } from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createBlog, signupUser } from "../api";
import { useAuth } from "../main";

export const blogSchema = z.object({
  blog: z
    .string()
    .min(10, { message: "Blog should be minimum 10 characters." }),
  title: z
    .string()
    .min(3, { message: "title should be minimum 3 characters." }),
});

function PostBlog() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/signin");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(blogSchema),
  });

  const [image, setImage] = useState({ array: [] });
  const [uploading, setUploading] = useState(false);

  const handleDrop = (files) => {
    setUploading(true);
    const uploaders = files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");

      return axios
        .post(
          "https://api.cloudinary.com/v1_1/dnwxccz0p/image/upload",
          formData,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        )
        .then((response) => {
          const data = response.data;
          setImage((prev) => ({ ...prev, array: [...prev.array, data.url] }));
        });
    });

    axios.all(uploaders).then(() => setUploading(false));
  };

  const saveBlog = async (values) => {
    const {blog, title} = values;
    const data = {blog, title, author: user.user._id, image: image.array[0]};
    const response = await createBlog(data);
    const res = await response.data;
    if(res.message === "BLOGCREATED"){
      toast.success("Blog Created", {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate("/")
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  bg-inherit px-4">
      <div className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Post Blog</h1>
      </div>
      <form
        onSubmit={handleSubmit(saveBlog)}
        className="flex flex-col space-y-4 bg-black p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <Input
          type="text"
          label="Title"
          {...register("title")}
          id="title"
          errorMessage={errors.title?.message}
          isInvalid={!!errors.title}
          className="w-full"
        />
        <Textarea
          type="text"
          label="Blog"
          {...register("blog")}
          id="blog"
          errorMessage={errors.blog?.message}
          isInvalid={!!errors.blog}
          className="w-full"
        />
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Blog Thumbnail
          </label>
          <Dropzone onDrop={handleDrop} multiple={false}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="bg-zinc-800 hover:bg-zinc-950  transition duration-300 ease-in-out p-6 w-full h-40 md:h-60 flex flex-col justify-center items-center text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
              >
                <input {...getInputProps()} />
                <p className="text-gray-600">
                  Drag & drop your Blog Thumbnail here, or click to select files
                </p>
              </div>
            )}
          </Dropzone>
          <div className="mt-4 flex flex-wrap gap-2">
            {uploading ? (
              <p className="text-gray-600">Uploading...</p>
            ) : (
              image.array.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Profile Pic"
                  className="h-16 w-16 rounded-full"
                />
              ))
            )}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          Post Blog
        </button>
      </form>
    </div>
  );
}

export default PostBlog;
