// Tính toán tốc độ tăng trưởng bình chọn và ước tính thời gian để đuổi kịp
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CategorySelector from "../components/CategorySelector";
import CandidateSelector from "../components/CandidateSelector";
import TimeRangeSelector from "../components/TimeRangeSelector";
import Error from "../components/Error";

interface PredictionResult {
  tracking?: string;
  trackingVote?: number;
  trackingRate?: number;
  leader?: string;
  leaderVote?: number;
  leaderRate?: number;
  rateDiff?: number;
  canCatchUp?: boolean;
  isLeader?: boolean;
  message?: string;
}

export default function PredictionPage() {
  const [categoryId, setCategoryId] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidateId, setCandidateId] = useState(0);
  const [timeRange, setTimeRange] = useState(10);
  const BE_URL = import.meta.env.VITE_BE_URL || "http://localhost:3000";

  // Set candidateId mặc định dựa trên categoryId
  useEffect(() => {
    if (categoryId === "w27-82w27-80w27-83w27-79w27-78w27-81") {
      setCandidateId(83);
    } else if (categoryId === "w28-64w28-63w28-62w28-65w28-60w28-86") {
      setCandidateId(62);
    }
  }, [categoryId]);

  const apiUrl = useMemo(() => {
    if (!candidateId) return null;
    return `${BE_URL}/stats/time-to-catch-up/?candidateId=${encodeURIComponent(
      candidateId
    )}&timeRange=${timeRange}`;
  }, [candidateId, timeRange, BE_URL]);

  useEffect(() => {
    if (!apiUrl) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    axios
      .get(apiUrl)
      .then((resp) => {
        if (!mounted) return;
        setResult(
          resp.data && resp.data.data ? resp.data.data : resp.data || null
        );
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  // Derive useful computed values and human-friendly ETA.
  // Assumptions: leaderRate / trackingRate are in "votes per minute" (or same time unit).
  const computed = useMemo(() => {
    if (!result) return null;

    const {
      trackingVote,
      trackingRate,
      leaderVote,
      leaderRate,
      rateDiff: apiRateDiff,
      canCatchUp: apiCanCatchUp,
      message: apiMessage,
    } = result;

    const leaderVotes = Number(leaderVote || 0);
    const trackingVotes = Number(trackingVote || 0);

    // prefer server-provided rateDiff if present, otherwise compute from leaderRate - trackingRate
    let rateDiff = typeof apiRateDiff === "number" ? apiRateDiff : undefined;
    if (rateDiff === undefined) {
      const lRate = Number(leaderRate || 0);
      const tRate = Number(trackingRate || 0);
      rateDiff = lRate - tRate;
    }

    const votesToCatch = Math.max(0, leaderVotes - trackingVotes);

    let minutesToCatch = null;
    let canCatchUp = apiCanCatchUp;
    if (typeof rateDiff === "number" && rateDiff > 0) {
      minutesToCatch = votesToCatch / rateDiff; // minutes (if rates are votes/min)
      canCatchUp = canCatchUp === undefined ? true : Boolean(canCatchUp);
    } else {
      // cannot catch up if rateDiff <= 0
      minutesToCatch = null;
      canCatchUp = canCatchUp === undefined ? false : Boolean(canCatchUp);
    }

    function toHuman(mins: number | null) {
      if (mins === null || mins === undefined || !isFinite(mins)) return "—";
      if (mins < 1) return `${Math.ceil(mins * 60)} giây`;
      if (mins < 60) return `${Math.ceil(mins)} phút`;
      if (mins < 60 * 24) return `${(mins / 60).toFixed(1)} giờ`;
      return `${(mins / (60 * 24)).toFixed(1)} ngày`;
    }

    return {
      rateDiff,
      votesToCatch,
      minutesToCatch,
      canCatchUp,
      humanETA: minutesToCatch ? toHuman(minutesToCatch) : "Không thể ước tính",
      apiMessage,
    };
  }, [result]);

  return (
    <div className="px-4 md:px-8 py-10 max-w-[98%] mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold  mb-8">
          Dự đoán thời gian bắt kịp
        </h1>
        <div className="flex flex-col items-center gap-6">
          <CategorySelector onSelect={setCategoryId} />

          {categoryId && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-4xl">
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                  Chọn ứng viên muốn theo dõi:
                </label>
                <CandidateSelector
                  onSelect={setCandidateId}
                  categoryId={categoryId}
                  selectedId={candidateId}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                  Khoảng thời gian phân tích:
                </label>
                <TimeRangeSelector onSelect={setTimeRange} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {!categoryId ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              Vui lòng chọn hạng mục để hiển thị dự đoán.
            </p>
          </div>
        ) : error ? (
          <Error message={error} />
        ) : loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tính toán…</p>
          </div>
        ) : !result ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              Không có dữ liệu. Vui lòng thử lại sau.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                {result.isLeader ? (
                  <div className="bg-gray-50 rounded-xl p-6 border-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Ứng viên đang theo dõi
                        </div>
                        <div className="font-bold text-2xl text-gray-800 mb-3">
                          {result.tracking || "-"}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 shadow-sm">
                            <span className="text-sm text-gray-600">
                              Tổng bình chọn:
                            </span>
                            <span className="font-semibold">
                              {result.trackingVote?.toLocaleString?.() ??
                                result.trackingVote}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2 shadow-sm">
                            <span className="text-sm text-gray-600">
                              Tốc độ tăng:
                            </span>
                            <span className="font-semibold">
                              {result.trackingRate ?? "-"} lượt/phút
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-3">🏆</div>
                          <div className="text-xl font-bold text-green-700">
                            Đang dẫn đầu!
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            {result.tracking} đang ở vị trí số 1
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 shadow-md">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Ứng viên đang theo dõi
                        </div>
                        <div className="font-bold text-xl text-gray-800 mb-3">
                          {result.tracking || "-"}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm">
                            <span className="text-sm text-gray-600">
                              Tổng bình chọn:
                            </span>
                            <span className="font-semibold">
                              {result.trackingVote?.toLocaleString?.() ??
                                result.trackingVote}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm">
                            <span className="text-sm text-gray-600">
                              Tốc độ tăng:
                            </span>
                            <span className="font-semibold">
                              {result.trackingRate ?? "-"} lượt/phút
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 shadow-md">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                          Đang dẫn đầu
                        </div>
                        <div className="font-bold text-xl text-gray-800 mb-3">
                          {result.leader || "-"}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm">
                            <span className="text-sm text-gray-600">
                              Tổng bình chọn:
                            </span>
                            <span className="font-semibold">
                              {result.leaderVote?.toLocaleString?.() ??
                                result.leaderVote}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm">
                            <span className="text-sm text-gray-600">
                              Tốc độ tăng:
                            </span>
                            <span className="font-semibold">
                              {result.leaderRate ?? "-"} lượt/phút
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border-2 border-gray-200 shadow-md mb-6">
                      <h3 className="font-bold text-lg text-gray-800 mb-4">
                        Phân tích & Dự đoán
                      </h3>
                      <div
                        className={`grid grid-cols-1 gap-4 ${
                          !computed?.canCatchUp
                            ? "sm:grid-cols-3"
                            : "lg:grid-cols-4 sm:grid-cols-2"
                        }`}
                      >
                        <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">
                            Chênh lệch số phiếu
                          </div>
                          <div className="text-2xl font-bold">
                            {computed?.votesToCatch?.toLocaleString?.() ??
                              computed?.votesToCatch ??
                              "-"}
                          </div>
                          <div className="text-xs text-gray-500">lượt</div>
                        </div>
                        <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                          <div className="text-xs text-gray-500 mb-1">
                            Chênh lệch tốc độ
                          </div>
                          <div className="text-2xl font-bold">
                            {computed?.rateDiff ?? "-"}
                          </div>
                          <div className="text-xs text-gray-500">lượt/phút</div>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-3 shadow-sm ${
                            computed?.canCatchUp ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          <div className="text-xs text-gray-500 mb-1">
                            Có thể bắt kịp?
                          </div>
                          <div
                            className={`text-2xl font-bold ${
                              computed?.canCatchUp
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {computed?.canCatchUp ? "Có" : "Không"}
                          </div>
                        </div>
                        {computed?.canCatchUp && (
                          <div className="bg-green-50 rounded-lg px-4 py-3 shadow-sm">
                            <div className="text-xs text-gray-500 mb-1">
                              Thời gian ước tính
                            </div>
                            <div className="text-2xl font-bold text-green-700">
                              {computed?.humanETA ?? "-"}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6 h-fit">
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-700">
                      Chú thích:
                    </span>{" "}
                    <br />- Khoảng thời gian phân tích là khoảng thời gian tính
                    từ bản ghi gần nhất đến bản ghi trước đó (ví dụ: 10 phút gần
                    nhất). Tốc độ tăng trưởng bình chọn được tính dựa trên sự
                    chênh lệch số phiếu trong khoảng thời gian này.
                    <br /> - Dự đoán chỉ mang tính chất tham khảo và có thể thay
                    đổi tùy theo xu hướng bình chọn thực tế.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
