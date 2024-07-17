import React, { useState } from "react";
import { Button, Image, Input, Textarea } from "@nextui-org/react";
import Dropzone from "react-dropzone";
import axios from "axios";
import { updateBlog } from "../api";
import toast from "react-hot-toast";

const EditBlogPost = ({ blog, onSave, onCancel, authorId }) => {
  const [title, setTitle] = useState(blog.title);
  const currentImage = blog.image;
  const [content, setContent] = useState(blog.blog);
  const [hasImageChanged, setHasImageChanged] = useState(false);
  const [image, setImage] = useState({ array: [] });
  const [uploading, setUploading] = useState(false);

  const handleDrop = (files) => {
    setUploading(true);
    setHasImageChanged(true);
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

  const handleSave = async () => {
    const data = { title, blog: content, userId: authorId };
    if (hasImageChanged) {
      data.image = image.array[0];
    } else {
      data.image = currentImage;
    }
    try {
      const response = await updateBlog(blog.blogId, data);
      const res = response.data
      const updatedBlog = {title, blog: res.blog.blog, blogId: res.blog._id, image: res.blog.image}
      onSave(updatedBlog); // Call onSave with the updated blog data
      toast.success("Blog updated.", {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    } catch (error) {
      console.error("Failed to update blog:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-gray-800 rounded-xl shadow-lg w-full max-w-3xl p-6 mx-4 my-8">
        <h2 className="text-white text-2xl mb-4">Edit Blog Post</h2>
        <div className="mb-4">
          <Input
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 text-gray-200"
            placeholder="Enter blog title"
          />
          <div>
            <label className="block text-lg font-medium text-gray-400 mb-2">
              Blog Thumbnail
            </label>
            {!hasImageChanged && (
              <Image src={blog.image} width={50} height={50} className="mb-4 rounded-lg" />
            )}
            <Dropzone onDrop={handleDrop} multiple={false}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="bg-zinc-800 hover:bg-zinc-900 transition duration-300 ease-in-out p-6 w-full h-20 md:h-20 flex flex-col justify-center items-center text-center border-2 border-dashed border-gray-400 rounded-lg cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-500">
                    Drag & drop your Blog Thumbnail here, or click to select
                    files
                  </p>
                </div>
              )}
            </Dropzone>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {uploading ? (
              <p className="text-gray-500">Uploading...</p>
            ) : (
              image.array.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Thumbnail"
                  className="h-16 w-16 rounded-full border border-gray-600"
                />
              ))
            )}
          </div>
          <Textarea
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxRows={5}
            className="text-gray-200  mt-4"
            placeholder="Enter blog content"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} color="primary" auto>
            Save
          </Button>
          <Button onClick={onCancel} color="danger" auto>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditBlogPost;
