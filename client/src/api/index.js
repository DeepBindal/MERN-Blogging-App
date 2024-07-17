import axios from 'axios'

const API = axios.create({baseURL: import.meta.env.VITE_BACKEND_URL});
API.interceptors.request.use((req) => {
    if (localStorage.getItem('user')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('user')).token}`;
    }
  
    return req;
  });

export const signupUser = (data) => API.post('/auth/signup', data);
export const loginUserCredential = (data) => API.post("/auth/login", data);
export const handleGoogleLogin = (data) => API.post("/auth/google", data);
export const fetchUserProfile = (id) => API.get(`/auth/user/${id}`);
export const checkToken = () => API.get("/protected")

export const createBlog = (data) => API.post("/api/create-blog", data);
export const fetchBlogs = (data) => API.post("/api/getblogs", data);
export const getSingleBlog = (blogId) => API.get(`/api/blog/${blogId}`);
export const deleteSingleBlog = (blogId) => API.delete(`/api/blog/${blogId}`);
export const updateBlog = (blogId, data) => API.put(`/api/blog/${blogId}`, data);
export const addCommentToBlog = (data) => API.post("/api/blog/addComment", data);
export const searchForUsers = (data) => API.post("/auth/search/user", data);