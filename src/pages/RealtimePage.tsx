import { useState, useRef, useEffect } from "react";
import candidatesData from "../info/candidates.json";
import Error from "../components/Error";
import finalResult from "../info/final_result.json";

interface Candidate {
  id: number;
  name: string;
  categoryId: string;
  categoryName: string;
  totalVotes: number;
}

interface ApiResponse {
  updatedAt: string;
  data: Candidate[];
}

export default function RealtimePage() {
  const [data, setData] = useState<Record<string, Candidate[]>>({});
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const prevVotesRef = useRef<Record<number, number>>({});

  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const payload = finalResult as ApiResponse;
      setConnectionError(null);

      if (!payload || !payload.data) {
        setIsLoading(false);
        return;
      }

      setUpdatedAt(new Date(payload.updatedAt));

      const payloadData = Array.isArray(payload.data)
        ? (payload.data as Candidate[])
        : [];

      const diff: Record<number, number> = {};
      payloadData.forEach((item) => {
        const previousVoteCount = prevVotesRef.current[item.id] ?? 0;
        diff[item.id] = item.totalVotes - previousVoteCount;
        prevVotesRef.current[item.id] = item.totalVotes;
      });

      const grouped = payloadData.reduce<Record<string, Candidate[]>>(
        (acc, item) => {
          const key = item.categoryName || "Khác";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        },
        {}
      );

      Object.keys(grouped).forEach((category) => {
        grouped[category].sort((a, b) => b.totalVotes - a.totalVotes);
      });

      setData(grouped);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading final results:", error);
      setConnectionError("Không thể đọc dữ liệu kết quả cuối cùng.");
      setIsLoading(false);
    }
    // run once on mount
  }, []);

  return (
    <div className="px-4 xl:px-8 py-10 max-w-[98%] mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2">
          Kết quả bình chọn chung cuộc
        </h1>
        {isLoading && !updatedAt && !connectionError ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md flex-wrap justify-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            <span className="text-gray-600">Đang tải dữ liệu...</span>
          </div>
        ) : connectionError ? (
          <Error message={connectionError} />
        ) : updatedAt ? (
          <>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md flex-wrap justify-center">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-700 text-sm md:text-base">
                Cập nhật lần cuối lúc:{" "}
                <span className="font-semibold text-gray-900">
                  {new Date(updatedAt).toLocaleString("vi-VN")}
                </span>
              </span>
            </div>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full max-w-7xl mx-auto w-full">
        {Object.entries(data).map(([category, candidates], idx) => (
          <div
            key={category}
            className="bg-white rounded-2xl shadow-lg transition-all duration-300 overflow-hidden"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="bg-gray-900 p-5">
              <h2 className="text-xl font-bold text-white text-center">
                {category}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left font-semibold text-gray-700 w-2/3">
                      Ứng viên
                    </th>
                    <th className="p-3 text-center font-semibold text-gray-700">
                      Tổng bình chọn
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {candidates.map((c, index) => {
                    const isHighlighted = candidatesData.priority.some(
                      (p) => p.name === c.name
                    );
                    return (
                      <tr
                        key={c.id}
                        className={`transition-colors duration-200 ${
                          isHighlighted
                            ? "bg-red-50 hover:bg-red-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {index < 3 && (
                              <span className="text-sm font-bold text-amber-700">
                                #{index + 1}
                              </span>
                            )}
                            <span
                              className={`font-medium break-words ${
                                isHighlighted
                                  ? "text-rose-700 font-semibold"
                                  : "text-gray-800"
                              }`}
                            >
                              {c.name || "Không rõ"}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`p-3 text-center font-semibold whitespace-nowrap ${
                            isHighlighted ? "text-rose-700" : "text-gray-900"
                          }`}
                        >
                          {c.totalVotes.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
