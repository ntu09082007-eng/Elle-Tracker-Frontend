import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Candidate {
  id: string;
  name: string;
  totalVotes: number;
  categoryId: string;
}

interface ApiResponse {
  data: Candidate[];
}

export default function RealtimePage() {
  const [data, setData] = useState<Record<string, Candidate[]>>({});
  const [voteDiff, setVoteDiff] = useState<Record<string, number>>({});
  const prevVotesRef = useRef<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // Đồng hồ chạy giây
  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const fetchData = async () => {
    try {
      // 🛠 FIX: THAY LINK LOCALHOST THÀNH LINK RENDER BACKEND CỦA BÀ
      const response = await axios.get<ApiResponse>("https://elle-tracker-backend.onrender.com/realtime");
      const payloadData = response.data.data;

      const currentDiff: Record<string, number> = {};
      payloadData.forEach((item) => {
        const prev = prevVotesRef.current[item.id] ?? 0;
        // Nếu có sự tăng trưởng thì tính toán (+/-)
        if (prev > 0 && item.totalVotes > prev) {
            currentDiff[item.id] = item.totalVotes - prev;
        }
        prevVotesRef.current[item.id] = item.totalVotes;
      });

      setVoteDiff(currentDiff);
      
      // Sau 8 giây thì ẩn cái số tăng trưởng đi để đợi đợt quét mới
      const timeout = setTimeout(() => setVoteDiff({}), 8000);

      // Nhóm ứng viên theo Category
      const grouped: Record<string, Candidate[]> = {};
      payloadData.forEach((item) => {
        const key = item.categoryId || "Khác";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });

      // Sắp xếp ai nhiều vote nhất lên đầu mỗi bảng
      Object.values(grouped).forEach(list => list.sort((a, b) => b.totalVotes - a.totalVotes));
      
      setData(grouped);
      return () => clearTimeout(timeout);
    } catch (e) { 
        console.error("❌ Lỗi kết nối Backend. Kiểm tra xem Render Backend có đang 'ngủ' không!"); 
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10 giây quét 1 lần
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white min-h-screen font-inter antialiased py-10 px-6">
      <div className="max-w-[1700px] mx-auto">
        
        {/* HEADER TỔNG */}
        <div className="mb-14 text-center">
          <h1 className="text-5xl font-[900] mb-4 uppercase text-black tracking-tighter">
            ELLE Beauty Awards 2026
          </h1>
          <div className="text-[10px] text-neutral-400 font-bold tracking-[0.4em] uppercase">
            • CẬP NHẬT TRỰC TIẾP: {currentTime.toLocaleTimeString("vi-VN")} •
          </div>
        </div>

        {/* GRID CÁC BẢNG VOTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Object.entries(data).map(([category, candidates]) => (
            <div key={category} className="bg-white rounded-[3rem] overflow-hidden border border-gray-200 shadow-sm">
              <div className="py-6 bg-black text-white text-center">
                <h2 className="text-[19px] font-[900] uppercase tracking-wider">
                  {category}
                </h2>
              </div>
              
              <table className="w-full border-collapse table-fixed bg-white">
                <thead>
                  <tr className="text-[14px] font-[900] text-neutral-600 bg-[#f1f3f5]">
                    <th className="py-5 pl-5 text-left w-[58%]">Ứng viên</th>
                    <th className="py-5 text-center w-[27%]">Tổng bình chọn</th>
                    <th className="py-5 text-center w-[15%]">+/-</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c, index) => {
                    // Highlight đặc biệt cho "LYHAN" của bà nè
                    const isLyhan = c.name.toUpperCase().includes("LYHAN");
                    const isFirst = index === 0;
                    const rankColor = isFirst ? "text-red-500" : "text-[#e8d1a4]";
                    const isLastRow = index === candidates.length - 1;

                    return (
                      <tr 
                        key={c.id} 
                        className={`transition-colors border-t border-gray-200 ${
                          isLyhan ? 'bg-red-50' : 'hover:bg-gray-50/30'
                        } ${isLastRow ? 'rounded-b-[3rem]' : ''}`}
                      >
                        <td className="py-[18px] pl-5">
                          <div className="flex items-center gap-3">
                            <span className={`font-[900] text-[14px] shrink-0 w-7 ${rankColor}`}>#{index + 1}</span>
                            <span className={`text-[14px] uppercase truncate tracking-tight ${
                              isFirst ? 'font-bold' : 'font-medium'
                            } ${isLyhan ? 'text-red-500' : 'text-black'}`}>
                              {c.name}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-[18px] text-center">
                          <span className={`text-[14px] tracking-tight ${
                            isFirst ? 'font-[900]' : 'font-medium'
                          } ${isLyhan ? 'text-red-600' : 'text-neutral-700'}`}>
                            {c.totalVotes.toLocaleString()}
                          </span>
                        </td>
                        
                        <td className="py-[18px] text-center">
                          <div className="flex justify-center items-center h-8">
                            {voteDiff[c.id] ? (
                              <span className="text-[14px] font-[900] text-green-600 animate-bounce">
                                +{voteDiff[c.id].toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-neutral-300 text-[14px] font-medium">0</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
