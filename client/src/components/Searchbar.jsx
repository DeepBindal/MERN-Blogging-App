import React, { useEffect, useState } from "react";
import { Image, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

function Searchbar({ routeType, onSearch }) {
  const router = useNavigate();
  const [search, setSearch] = useState("");

  // Debounce effect to delay search triggering
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(search);
      if (search) {
        router(`/${routeType}?q=` + search);
      } else {
        router(`/${routeType}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType, onSearch]);

  return (
    <div className="searchbar flex items-center space-x-2">
      <Image
        src="search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${
          routeType !== "search" ? "Search communities" : "Search creators"
        }`}
        className="flex-1"
      />
    </div>
  );
}

export default Searchbar;