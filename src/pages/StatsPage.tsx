import { useEffect, useState } from "react";
import CategorySelector from "../components/CategorySelector";
import Charts from "../components/Charts";
import History from "../components/History";
import Error from "../components/Error";

// Import dữ liệu local
import finalHistory1 from "../info/final_history_1.json";
import finalHistory2 from "../info/final_history_2.json";

interface ApiHistory {
  categoryName: string;
  data: any[];
}

export default function StatsPage() {
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiPayload, setApiPayload] = useState<ApiHistory | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setApiPayload(null);
      return;
    }
    
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        let rawData: any = null;

        // 1. Lấy dữ liệu thô từ file JSON
        if (categoryId === "w27-82w27-80w27-83w27-79w27-78w27-81") {
          rawData = finalHistory1;
        } else if (categoryId === "w28-64w28-63w28-62w28-65w28-60w28-86") {
          rawData = finalHistory2;
        }

        /* 🛠 FIX TRIỆT ĐỂ LỖI TRẮNG MÀN HÌNH (NORMALIZATION)
           Nếu JSON là mảng: [{}, {}] -> Chuyển về { data: [{}, {}] }
           Nếu JSON là object: { data: [] } -> Giữ nguyên
        */
        let normalizedPayload: ApiHistory | null = null;

        if (Array.isArray(rawData)) {
          normalizedPayload = { categoryName: "Thống kê", data: rawData };
        } else if (rawData && Array.isArray(rawData.data)) {
          normalizedPayload = rawData;
        } else if (rawData && rawData.data && Array.isArray(rawData.data.data)) {
            // Trường hợp bị bọc 2 lần data.data
          normalizedPayload = rawData.data;
        }

        if (normalizedPayload) {
          setApiPayload(normalizedPayload);
        } else {
          console.error("Dữ liệu JSON không hợp lệ:", rawData);
          setApiPayload(null);
        }

      } catch (err) {
        setError("Lỗi xử lý file dữ liệu.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [categoryId]);

  return (
    <div className="w-full bg-white min-h-screen font-inter antialiased py-10 px-6">
      <div className="max-w-[1700px] mx-auto">
        
        {/* HEADER */}
        <div className="mb-14 text-center">
          <h1 className="text-5xl font-[900] mb-8 uppercase text-black tracking-tighter">
            Thống kê số liệu bình chọn
          </h1>
          <div className="flex justify-center">
            <CategorySelector onSelect={setCategoryId} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {!categoryId ? (
            <div className="bg-gray-50 rounded-[3rem] border border-dashed border-gray-300 p-20 text-center">
              <p className="text-neutral-400 font-[900] uppercase text-sm tracking-widest">
                Vui lòng chọn hạng mục để hiển thị ma trận dữ liệu.
              </p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="animate-spin w-12 h-12 border-4 border-black border-t-transparent rounded-full mb-6"></div>
              <p className="text-black font-[900] uppercase text-[12px] tracking-[0.3em]">Đang đồng bộ dữ liệu...</p>
            </div>
          ) : !apiPayload ? (
            <div className="bg-red-50 rounded-[3rem] border border-red-100 p-20 text-center">
              <p className="text-red-500 font-bold uppercase tracking-widest">
                Dữ liệu chưa sẵn sàng hoặc file JSON bị lỗi cấu trúc.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* BẢNG LỊCH SỬ */}
              <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-200 shadow-sm">
                <div className="py-6 bg-black text-white text-center">
                  <h2 className="text-[16px] font-[900] uppercase tracking-[0.2em]">Nhật ký chi tiết</h2>
                </div>
                <div className="p-4 md:p-8">
                   {/* Thêm check an toàn ở đây luôn */}
                   {apiPayload.data ? <History apiPayload={apiPayload} /> : <p>Lỗi mảng dữ liệu</p>}
                </div>
              </div>

              {/* BIỂU ĐỒ */}
              <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-200 shadow-sm">
                <div className="py-6 bg-[#f1f3f5] text-neutral-600 text-center border-b border-gray-200">
                  <h2 className="text-[16px] font-[900] uppercase tracking-[0.2em]">Xu hướng tăng trưởng</h2>
                </div>
                <div className="p-8">
                   <Charts apiPayload={apiPayload} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
