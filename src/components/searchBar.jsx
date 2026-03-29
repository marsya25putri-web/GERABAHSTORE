// src/components/SearchBar.jsx
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ onSearch, placeholder = "Cari produk..." }) => {
  const [term, setTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setTerm(value);
    if (value === "") {
      onSearch(""); // Jika kosong, reset search
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={term}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <FaSearch className="absolute left-3 top-3 text-gray-400" />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
      >
        Cari
      </button>
    </form>
  );
};

export default SearchBar;