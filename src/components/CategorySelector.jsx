import React from "react";
import categories from "../info/categories.json";

export default function CategorySelector({ onSelect }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <label className="block text-[11px] font-[900] uppercase text-neutral-400 tracking-[0.25em] text-center mb-3">
        Hạng mục phân tích dữ liệu
      </label>
      
      <div className="relative group">
        <select
          className="w-full px-8 py-4 bg-white border-2 border-gray-200 rounded-[2rem] shadow-sm 
                     hover:border-black transition-all duration-300 focus:outline-none 
                     text-black font-[900] uppercase text-[15px] tracking-tighter cursor-pointer 
                     appearance-none text-center"
          onChange={(e) => onSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled className="text-gray-400 font-bold">
            -- Click để chọn hạng mục --
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="text-black font-bold">
              {c.name}
            </option>
          ))}
        </select>
        
        {/* Mũi tên xịn xò */}
        <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none text-black group-hover:scale-110 transition-transform">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
