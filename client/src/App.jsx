import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Nav from "./components/Navbar";
import Sidebar from "./components/Sidebar"
import BottomBar from "./components/BottomBar";
import PostBlog from "./pages/PostBlog";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Blog from "./pages/Blog";

function App() {
  return (
    <Router>
      <Nav />

      {/* Main content */}
      <main className="flex montserrat-font-family bg-zinc-800 flex-row">
        <Sidebar />
        <section className="custom-scrollbar main-container">
          <div className="w-full max-w-4xl">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth/signup" element={<Signup />} />
              <Route path="/auth/signin" element={<Signin />} />
              <Route path="/create-blog" element={<PostBlog />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/search" element={<Search />} />
              <Route path="/blog/:blogId" element={<Blog />} />
            </Routes>
          </div>
        </section>
      </main>
      <BottomBar />

      <Toaster position="bottom-right" reverseOrder={false} />
    </Router>
  );
}

export default App;
