import { Avatar, Button } from "@nextui-org/react";
import React from "react";
import { useNavigate } from "react-router-dom";

function UserCard({ id, name, username, imgUrl, personType }) {
  const navigate = useNavigate();

  return (
    <article className="user-card p-4 bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row items-center md:items-start md:justify-between space-y-4 md:space-y-0 md:space-x-4">
      <div className="user-card_avatar flex items-center space-x-4">
        <div className="relative h-12 w-12">
          <Avatar src={imgUrl} alt="user_logo" />
        </div>

        <div className="flex-1">
          <h4 className="text-base font-semibold text-white truncate">{name}</h4>
          <p className="text-sm font-medium text-gray-400">@{username}</p>
        </div>
      </div>

      <Button
        className="user-card_btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        onClick={() => {
          navigate(`/profile/${id}`);
        }}
      >
        View
      </Button>
    </article>
  );
}

export default UserCard;
