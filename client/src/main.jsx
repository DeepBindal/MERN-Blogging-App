import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./app/store"; // Ensure the store is exported properly
import { Provider, useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "./features/auth/authSlice.js";
import { NextUIProvider } from "@nextui-org/react";
import { loginUserCredential } from "./api/index.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // const login = async (userData) => {
  //   const response = await loginUserCredential(userData);

  //   if (response && response.data) {
  //     const user = response.data;
  //     toast.success("Welcome back !")
  //     dispatch(loginUser(user));
  //   } else {
  //     console.error("Login failed: No user data returned");
  //   }
  // };

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <React.StrictMode>
        <AuthProvider>
          <NextUIProvider className="dark">
            <App />
          </NextUIProvider>
        </AuthProvider>
      </React.StrictMode>
    </GoogleOAuthProvider>
  </Provider>
);

