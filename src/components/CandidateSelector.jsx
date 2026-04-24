import { useEffect, useState } from "react";
import candidates from "../info/candidates.json";
import categories from "../info/categories.json";

export default function CandidateSelector({
  onSelect,
  categoryId,
  selectedId,
}) {
  // Lấy danh sách ứng viên từ priority và normal
  const allCandidates = [...candidates.priority, ...candidates.normal];

  // Lọc theo categoryId
  const filteredCandidates = allCandidates.filter(
    (c) => c.categoryId === categoryId
  );

  // Tính toán giá trị hiện tại
  const currentValue = selectedId || (filteredCandidates[0]?.id ?? "");

  return (
    <select
      onChange={(e) => onSelect(e.target.value)}
      value={currentValue}
      className="w-full px-6 py-3 bg-white border-2 border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:border-gray-400 text-gray-700 font-medium cursor-pointer"
    >
      {filteredCandidates.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
