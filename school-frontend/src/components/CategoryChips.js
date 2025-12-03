// src/components/CategoryChips.jsx
import React from "react";

const Chip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center px-4 py-2 rounded-full border text-sm mr-3 mb-3 transition 
      ${active ? "bg-blue-600 text-white border-blue-600 shadow" : "bg-white text-gray-700 border-gray-200"}
    `}
    aria-pressed={active}
  >
    {label}
  </button>
);

const CategoryChips = ({ categories = [], activeId = null, onChange = () => {} }) => {
  return (
    <div className="flex flex-wrap items-center mt-6">
      <Chip label="All" active={activeId === null} onClick={() => onChange(null)} />
      {categories.map((cat) => {
        const label = cat.title || cat.name || cat.attributes?.title || cat.attributes?.name || "Unnamed";
        return <Chip key={cat.id} label={label} active={activeId === cat.id} onClick={() => onChange(cat.id)} />;
      })}
    </div>
  );
};

export default CategoryChips;
