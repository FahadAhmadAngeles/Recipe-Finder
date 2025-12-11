import React, { useState, useEffect } from "react";
import RecipeGrid from "./recipeGrid";
import "../style/pagination.css";
import "../style/searchBar.css";

const Pagination = ({ endpoint, title, limit = 10, maxButtons = 5 }) => {
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Input = what the user types
  const [searchInput, setSearchInput] = useState("");

  // Actual query used in fetch
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRecipes = async (currentPage, query = "") => {
    setLoading(true);
    try {
      let url = `http://localhost:3000${endpoint}?page=${currentPage}&limit=${limit}`;
      if (query) url += `&q=${encodeURIComponent(query)}`;

      const res = await fetch(url);
      const data = await res.json();

      setRecipes(data.recipes);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Failed to fetch recipes", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page OR searchQuery change
  useEffect(() => {
    fetchRecipes(page, searchQuery);
  }, [page, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(searchInput);
      setPage(1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handlePageClick = (pageNum) => {
    setPage(pageNum);
  };

  const getPageNumbers = () => {
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxButtons + 1);
    }

    const numbers = [];
    for (let i = start; i <= end; i++) numbers.push(i);
    return numbers;
  };

  return (
    <div className="pagination-container">
      <h2>{title}</h2>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchInput}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyPress}
          className="search-bar-input"
        />
      </div>

      {loading ? <p>Loading...</p> : <RecipeGrid data={recipes} />}

      <div className="pagination-buttons">
        <button onClick={handlePrev} disabled={page === 1} className="pagination-btn">
          Previous
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => handlePageClick(num)}
            className={`pagination-btn ${page === num ? "active" : ""}`}
          >
            {num}
          </button>
        ))}

        <button onClick={handleNext} disabled={page === totalPages} className="pagination-btn">
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
