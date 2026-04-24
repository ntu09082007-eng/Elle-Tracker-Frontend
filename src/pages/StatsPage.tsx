// src/pages/StatsPage.tsx
import { useEffect, useState } from "react";
import CategorySelector from "../components/CategorySelector";
import Charts from "../components/Charts";
import History from "../components/History";
import Error from "../components/Error";
import finalHistory1 from "../info/final_history_1.json";
import finalHistory2 from "../info/final_history_2.json";

export default function StatsPage() {
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  interface CandidateHistory {
    name: string;
    totalVotes: number;
    votesDiff?: number;
    growthRate?: number;
  }

  interface HistoryEntry {
    recordedAt: string;
    candidates: CandidateHistory[];
  }

  interface ApiHistory {
    categoryName: string;
    data: HistoryEntry[];
  }

  const [apiPayload, setApiPayload] = useState<ApiHistory | null>(null);

  // Lấy dữ liệu từ api
  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);

    if (categoryId === "w27-82w27-80w27-83w27-79w27-78w27-81") {
      setTimeout(() => {
        setApiPayload(finalHistory1.data);
        setLoading(false);
      }, 500);
    } else if (categoryId === "w28-64w28-63w28-62w28-65w28-60w28-86") {
      setTimeout(() => {
        setApiPayload(finalHistory2.data);
        setLoading(false);
      }, 500);
    }
  }, [categoryId]);

  return (
    <div className="px-4 md:px-8 py-10 max-w-[95%] mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Thống kê số liệu bình chọn
        </h1>
        <div className="flex justify-center">
          <CategorySelector onSelect={setCategoryId} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {!categoryId ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              Vui lòng chọn hạng mục để hiển thị dữ liệu.
            </p>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải dữ liệu…</p>
          </div>
        ) : error ? (
          <Error message={error} />
        ) : !apiPayload ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              Không có dữ liệu. Vui lòng chờ thời gian để hệ thống cập nhật.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <History apiPayload={apiPayload} />
            <Charts apiPayload={apiPayload} />
          </div>
        )}
      </div>
    </div>
  );
}
