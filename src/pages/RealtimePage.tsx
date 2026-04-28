import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function RealtimePage() {
  const [data, setData] = useState<any>({});
  const [voteDiff, setVoteDiff] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const prevVotesRef = useRef<any>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = async () => {
    try {
      // 🛠 1. CẬP NHẬT LINK MỚI CỦA BÀ (backend-1)
      const response = await axios.get("https://elle-tracker-backend-1.onrender.com/realtime");
      
      // Kiểm tra dữ liệu thô từ Console (F12)
      console.log("Data từ backend-1 nè:", response.data);

      // 🛠 2. BÓC TÁCH DỮ LIỆU LINH HOẠT (Chấp cả mảng hoặc object)
      let payloadData = response.data.data || response.data;
      if (!Array.isArray(payloadData)) {
        console.warn("Dữ liệu không phải là mảng, bà check lại Backend nhé!");
        return;
      }

      // Tính toán chênh lệch vote (+/-)
      const currentDiff: any = {};
      payloadData.forEach((item: any) => {
        const prev = prevVotesRef.current[item.id] ?? 0;
        if (prev > 0 && item.totalVotes > prev) {
          currentDiff[item.id] = item.totalVotes - prev;
        }
        prevVotesRef.current[item.id] = item.totalVotes;
      });

      setVoteDiff(currentDiff);

      // Nhóm theo Category
      const grouped: any = {};
      payloadData.forEach((item: any) => {
        const key = item.categoryName || item.categoryId || "Khác";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });

      // Sắp xếp theo số vote cao nhất
      Object.values(grouped).forEach((list: any) => 
        list.sort((a: any, b: any) => b.totalVotes - a.totalVotes)
      );

      setData(grouped);
      setLoading(false);
    } catch (e) { 
      console.error("Vẫn chưa gọi được link mới bà nội ơi!", e); 
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10 giây cập nhật 1 lần
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { 
      clearInterval(interval); 
      clearInterval(clock); 
    };
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white text-black font-black text-2xl uppercase italic animate-pulse">
      Đang đánh thức Backend-1... đợi tí bà nội 🕒
    </div>
  );

  return (
    <div className="w-full bg-white min-h-screen font-inter antialiased py-10 px-6">
      <div className="max-w-[1700px] mx-auto">
        
        <div className="mb-14 text-center">
          <h1 className="text-5xl font-[900] mb-4 uppercase text-black tracking-tighter italic">
            ELLE Beauty Awards 2026
          </h1>
          <div className="text-[10px] text-neutral-400 font-bold tracking-[0.4em] uppercase">
            • LIVE UPDATE: {currentTime.toLocaleTimeString("vi-VN")} •
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Object.entries(data).map(([cat, candidates]: any) => (
            <div key={cat} className="bg-white rounded-[3rem] overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all">
              <div className="py-6 bg-black text-white text-center">
                <h2 className="text-[19px] font-[900] uppercase tracking-wider">{cat}</h2>
              </div>
              
              <table className="w-full border-collapse table-fixed bg-white">
                <thead>
                  <tr className="text-[12px] font-[900] text-neutral-500 bg-[#f8f9fa] border-b">
                    <th className="py-4 pl-6 text-left w-[55%]">ỨNG VIÊN</th>
                    <th className="py-4 text-center w-[30%]">TỔNG VOTE</th>
                    <th className="py-4 text-center w-[15%]">+/-</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c: any, index: number) => {
                    const isLyhan = c.name.toUpperCase().includes("LYHAN");
                    return (
                      <tr key={c.id} className={`border-b border-gray-50 transition-colors ${isLyhan ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                        <td className="py-5 pl-6">
                          <div className="flex items-center gap-3">
                            <span className={`font-[900] text-[14px] ${index === 0 ? 'text-red-500' : 'text-neutral-300'}`}>
                              #{index + 1}
                            </span>
                            <span className="text-[13px] uppercase font-bold text-black truncate">
                              {c.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-5 text-center">
                          <span className="text-[15px] font-black text-neutral-800">
                            {c.totalVotes.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-5 text-center">
                          {voteDiff[c.id] ? (
                            <span className="text-[13px] font-black text-green-600 animate-bounce">
                              +{voteDiff[c.id]}
                            </span>
                          ) : (
                            <span className="text-neutral-200 text-[13px]">0</span>
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
}    } catch (e) { console.error("Lỗi gọi số rồi bà nội!"); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { clearInterval(interval); clearInterval(clock); };
  }, []);

  if (loading) return <div className="p-20 text-center font-bold">ĐANG ĐÁNH THỨC BACKEND... 🕒</div>;

  return (
    <div className="p-10">
      <h1 className="text-4xl font-black text-center mb-10 uppercase">ELLE Beauty Awards 2026</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(data).map(([cat, candidates]: any) => (
          <div key={cat} className="border rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-black text-white p-4 text-center font-bold">{cat}</div>
            <table className="w-full text-sm">
              <tbody className="divide-y">
                {candidates.map((c: any, index: number) => (
                  <tr key={c.id} className={c.name.toUpperCase().includes("LYHAN") ? "bg-red-50" : ""}>
                    <td className="p-4 font-bold">#{index + 1} {c.name}</td>
                    <td className="p-4 text-center font-black">{c.totalVotes.toLocaleString()}</td>
                    <td className="p-4 text-center text-green-600 font-bold">{voteDiff[c.id] ? `+${voteDiff[c.id]}` : "0"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
