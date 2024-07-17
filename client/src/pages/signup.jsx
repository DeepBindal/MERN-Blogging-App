import { Input } from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api";
import { useAuth } from "../main";

const userSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }).max(50, { message: "First name cannot exceed 50 characters" }),
  lastName: z.string().min(1, { message: "Last name is required" }).max(50, { message: "Last name cannot exceed 50 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters long" }).max(30, { message: "Username cannot exceed 30 characters" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});

function Signup() {
  const {  isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  const [image, setImage] = useState({ array: [] });
  const [uploading, setUploading] = useState(false);

  const handleDrop = (files) => {
    setUploading(true);
    const uploaders = files.map(file => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my-uploads");

      return axios.post("https://api.cloudinary.com/v1_1/dnwxccz0p/image/upload", formData, {
        headers: { "X-Requested-With": "XMLHttpRequest" },
      }).then(response => {
        const data = response.data;
        setImage(prev => ({ ...prev, array: [...prev.array, data.url] }));
      });
    });

    axios.all(uploaders).then(() => setUploading(false));
  };

  const saveUser = async (values) => {
    const requestBody = { ...values, image: image.array[0], isGoogle: false };
    const response = await signupUser(requestBody);
    const res = response.data;
    if (res) {
      if (res.message === "USERSIGNEDUP") {
        toast.success("User saved successfully!", {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        navigate("/auth/signin");
      } else {
        toast.error(res.message);
      }
    } else {
      toast.error("Failed to sign up");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  bg-inherit px-4">
      <div className="bg-black shadow-lg rounded-xl p-6 md:p-8 lg:p-10 max-w-lg w-full my-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Create your account</h1>
          <p className="text-gray-600 mt-1">to continue to Blogging App</p>
        </div>
        <form onSubmit={handleSubmit(saveUser)} className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <Input
              type="text"
              label="First Name"
              {...register("firstName")}
              id="firstName"
              errorMessage={errors.firstName?.message}
              isInvalid={!!errors.firstName}
              className="w-full"
            />
            <Input
              type="text"
              label="Last Name"
              {...register("lastName")}
              id="lastName"
              errorMessage={errors.lastName?.message}
              isInvalid={!!errors.lastName}
              className="w-full"
            />
          </div>
          <Input
            type="email"
            label="Email"
            {...register("email")}
            id="email"
            errorMessage={errors.email?.message}
            isInvalid={!!errors.email}
            className="w-full"
          />
          <Input
            type="text"
            label="Username"
            {...register("username")}
            id="username"
            errorMessage={errors.username?.message}
            isInvalid={!!errors.username}
            className="w-full"
          />
          <div>
            <label className="block text-lg font-medium text-gray-700">Profile Pic</label>
            <Dropzone onDrop={handleDrop} multiple={false}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="bg-zinc-800 hover:bg-zinc-950  transition duration-300 ease-in-out p-6 w-full h-40 md:h-60 flex flex-col justify-center items-center text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer"
                >
                  <input {...getInputProps()} />
                  <p className="text-gray-600">
                    Drag & drop your Profile Pic here, or click to select files
                  </p>
                </div>
              )}
            </Dropzone>
            <div className="mt-4">
              {uploading ? (
                <p className="text-gray-600">Uploading...</p>
              ) : (
                image.array.map((img, index) => (
                  <img key={index} src={img} alt="Profile Pic" className="inline-block h-16 w-16 rounded-full mr-2" />
                ))
              )}
            </div>
          </div>
          <Input
            type="password"
            label="Password"
            {...register("password")}
            id="password"
            errorMessage={errors.password?.message}
            isInvalid={!!errors.password}
            className="w-full"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;