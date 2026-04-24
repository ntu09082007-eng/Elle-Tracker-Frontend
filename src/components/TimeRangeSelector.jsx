import { useEffect, useState } from "react";
import axios from "axios";

export default function TimeRangeSelector({ onSelect }) {
  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      defaultValue={10}
      className="w-full px-6 py-3 bg-white border-2 border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-400 text-gray-700 font-medium cursor-pointer"
    >
      <option value={10}>10 phút</option>
      <option value={20}>20 phút</option>
      <option value={30}>30 phút</option>
      <option value={60}>1 tiếng</option>
      <option value={120}>2 tiếng</option>
      <option value={360}>6 tiếng</option>
      <option value={720}>12 tiếng</option>
    </select>
  );
}
