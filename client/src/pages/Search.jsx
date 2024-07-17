import React, { useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserCard from "../components/UserCard";
import { searchForUsers } from "../api";
import { useAuth } from "../main";
import { Pagination, Spinner } from "@nextui-org/react";

const Search = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [results, setResults] = useState();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/signin");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const getData = async () => {
      if (!searchQuery.trim()) {
        setResults({ users: [], isNext: false });
        setLoading(false);
        return;
      }

      setLoading(true);
      const response = await searchForUsers({
        userId: user.user._id,
        pageNumber: currentPage,
        searchString: searchQuery,
      });
      const res = await response.data;
      setResults(res);
      setLoading(false);
    };

    getData();
  }, [searchQuery, currentPage]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to the first page when a new search is performed
  };

  return (
    <section>
      <h1 className="text-white text-2xl font-bold mb-10">Search</h1>
      <Searchbar routeType="search" onSearch={handleSearch} />
      <div className="mt-14 flex flex-col gap-9">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            {results?.users.length === 0 ? (
              <p className="no-result text-white">No Users. Start Searching</p>
            ) : (
              <>
                {results?.users.map((person) => (
                  <UserCard
                    key={person._id}
                    id={person._id}
                    name={`${person.firstName} ${person.lastName}`}
                    username={person.username}
                    imgUrl={person.image}
                    personType="User"
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
      {results?.isNext && (
        <Pagination
          total={20}
          color="secondary"
          page={currentPage}
          onChange={setCurrentPage}
          className="mt-8"
        />
      )}
    </section>
  );
};

export default Search;