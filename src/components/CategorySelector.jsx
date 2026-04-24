import { useEffect, useState } from "react";
import axios from "axios";
import categories from "../info/categories.json";

export default function CategorySelector({ onSelect }) {
  return (
    <select
      className="max-w-4xl w-full px-6 py-3 bg-white border-2 border-gray-300 rounded-full shadow-sm hover:shadow-md  transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-400 text-gray-700 font-medium cursor-pointer"
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="" className="text-gray-500">
        Chọn hạng mục để phân tích
      </option>
      {categories.map((c) => (
        <option key={c.id} value={c.id} className="py-2">
          {c.name}
        </option>
      ))}
    </select>
  );
}
