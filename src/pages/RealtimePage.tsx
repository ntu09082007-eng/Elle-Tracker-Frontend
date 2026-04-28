import { useState, useRef, useEffect } from "react";
import axios from "axios";

// 🛠 1. ĐỊNH NGHĨA LẠI INTERFACE CHO CHUẨN (Fix lỗi TS2339)
interface Candidate {
  id: string;
  name: string;
  totalVotes: number;
  categoryId: string;
}

// Backend trả về dạng { data: Candidate[] } nên mình định nghĩa thế này
interface ApiResponse {
  data: Candidate[];
}

export default function RealtimePage() {
  // Ép kiểu cho state để không bị lỗi lúc map
  const [data, setData] = useState<Record<string, Candidate[]>>({});
  const [voteDiff, setVoteDiff] = useState<Record<string, number>>({});
  const prevVotesRef = useRef<Record<string, number>>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, []);

  const fetchData = async () => {
    try {
      // 🛠 2. DÙNG LINK RENDER BACKEND (Không dùng localhost nữa)
      const response = await axios.get<ApiResponse>("https://elle-tracker-backend.onrender.com/realtime");
      
      // Axios trả về object có thuộc tính data, trong đó lại có object data của Backend
      const payloadData = response.data.data; 

      if (!payloadData || !Array.isArray(payloadData)) return;

      const currentDiff: Record<string, number> = {};
      payloadData.forEach((item: Candidate) => {
        const prev = prevVotesRef.current[item.id] ?? 0;
        if (prev > 0 && item.totalVotes > prev) {
          currentDiff[item.id] = item.totalVotes - prev;
        }
        prevVotesRef.current[item.id] = item.totalVotes;
      });

      setVoteDiff(currentDiff);
      setTimeout(() => setVoteDiff({}), 8000);

      const grouped: Record<string, Candidate[]> = {};
      payloadData.forEach((item: Candidate) => {
        const key = item.categoryId || "Khác";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });

      Object.values(grouped).forEach(list => 
        list.sort((a, b) => b.totalVotes - a.totalVotes)
      );
      
      setData(grouped);
    } catch (e) { 
      console.error("Lỗi rồi bà nội:", e); 
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white min-h-screen font-inter antialiased py-10 px-6">
      <div className="max-w-[1700px] mx-auto">
        
        <div className="mb-14 text-center">
          <h1 className="text-5xl font-[900] mb-4 uppercase text-black tracking-tighter">
            ELLE Beauty Awards 2026
          </h1>
          <div className="text-[10px] text-neutral-400 font-bold tracking-[0.4em] uppercase">
            • LIVE UPDATE: {currentTime.toLocaleTimeString("vi-VN")} •
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Object.entries(data).map(([category, candidates]) => (
            <div key={category} className="bg-white rounded-[3rem] overflow-hidden border border-gray-200">
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
                    const isLyhan = c.name.toUpperCase().includes("LYHAN");
                    const isFirst = index === 0;
                    return (
                      <tr key={c.id} className={`border-t border-gray-200 ${isLyhan ? 'bg-red-50' : ''}`}>
                        <td className="py-[18px] pl-5">
                          <div className="flex items-center gap-3">
                            <span className={`font-[900] text-[14px] ${isFirst ? 'text-red-500' : 'text-[#e8d1a4]'}`}>#{index + 1}</span>
                            <span className="text-[14px] uppercase truncate font-medium text-black">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-[18px] text-center">
                          <span className="text-[14px] font-medium text-neutral-700">
                            {c.totalVotes.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-[18px] text-center">
                          {voteDiff[c.id] ? (
                            <span className="text-[14px] font-[900] text-green-600">+{voteDiff[c.id]}</span>
                          ) : (
                            <span className="text-neutral-300 text-[14px]">0</span>
                          )}
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
