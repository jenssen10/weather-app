import React from "react";

export default function Search({ value, onChange, onSearch }) {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Enter city (e.g. London)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
}
