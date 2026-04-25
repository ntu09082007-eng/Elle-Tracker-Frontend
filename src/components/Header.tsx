import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white w-full border-b border-gray-100">
      {/* Container gióng hàng chuẩn 1700px đồng bộ với Footer và Body */}
      <div className="max-w-[1700px] mx-auto px-8 md:px-16 lg:px-24 py-8">
        <div className="flex justify-between items-center">
          
          {/* LOGO: GIỮ NGUYÊN ĐỘ DÀY font-[900] ĐẲNG CẤP */}
          <h1 className="text-2xl md:text-3xl font-[900] text-gray-900 tracking-tighter uppercase leading-none">
            <Link
              to="/realtime"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              ELLE TRACKER
            </Link>
          </h1>

          {/* 🛠 ĐÃ XOÁ SẠCH 4 CỤC CHỌN (NAV LINKS) THEO Ý BRO */}
          
        </div>
      </div>
    </header>
  );
}
