import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../main";

function Sidebar() {
  const location = useLocation();
  const {user} = useAuth();
  const currentPath = location.pathname;

  const menuItems = [
    { name: "Home", icon: "home", path: "/" },
    { name: "Search", icon: "search", path: "/search" },
    { name: "Post a blog", icon: "add", path: "/create-blog" },
  ];

  return (
    <section className="custom-scrollbar leftsidebar bg-zinc-900">
      <div className="flex flex-1 flex-col gap-6 w-full px-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`leftsidebar_link ${
              currentPath === item.path
                ? "bg-violet-500 text-white"
                : "hover:bg-violet-800 hover:text-white"
            }`}
          >
            <i className="material-icons text-white">{item.icon}</i>
            <p className="max-lg:hidden text-white">{item.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Sidebar;
