import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { handleGoogleLogin, loginUserCredential, signupUser } from "../api";
import { GoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import { EyeSlashFilledIcon } from "../assets/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../assets/EyeFilledIcon";
import { useAuth } from "../main";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

function Signin() {
  const dispatch = useDispatch();
  
  const [isVisible, setIsVisible] = useState(false);
  const {  isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(userSchema),
  });

  const loginGoogle = async (token) => {
    const data = { token: token.credential };
    const response = await handleGoogleLogin(data);
    const user = { user: response.data.user, token: response.data.token };
    console.log(response.data)
    if (
      response.data.message === "User already exists. Use a different email" ||
      response.data.message === "USERSIGNEDUP"
    ) {
      toast.success("Welcome Back !");
      navigate("/");
      dispatch(loginUser(user));
    }
  };

  const onSubmit = async (values) => {
    const response = await loginUserCredential(values);
    if (response && response.data) {
      const user = response.data;
      toast.success("Welcome back !", {
        icon: '👍',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      navigate("/")
      dispatch(loginUser(user));
    } else {
      console.error("Login failed: No user data returned");
    }
    if (isAuthenticated) {
      navigate("/");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center  bg-inherit px-4">
      <div className="bg-black shadow-lg rounded-lg p-6 md:p-8 lg:p-10 max-w-lg w-full my-4">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Login
          </h1>
          <p className="text-gray-500 mt-1">to continue to Admin Dashboard</p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div>
            <Input
              type="email"
              label="Email"
              {...register("email")}
              id="email"
              errorMessage={errors.email?.message}
              isInvalid={!!errors.email}
              className="w-full"
            />
          </div>
          <div>
            <Input
              id="password"
              {...register("password")}
              label="Password"
              // placeholder="Enter your password"
              endContent={
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="focus:outline-none"
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-gray-400" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-gray-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              errorMessage={errors.password?.message}
              isInvalid={!!errors.password}
              className="w-full"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>
        <div className="flex justify-center mt-3 w-full">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              loginGoogle(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
        <p className="mt-6 text-center text-sm text-gray-600">
          No Account?&nbsp;
          <Link
            to="/auth/signup"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
