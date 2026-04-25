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

  // Mặc định ứng viên cho hạng mục cụ thể
  useEffect(() => {
    if (categoryId === "w27-82w27-80w27-83w27-79w27-78w27-81") {
      setCandidateId(83);
    } else if (categoryId === "w28-64w28-63w28-62w28-65w28-60w28-86") {
      setCandidateId(62);
    }
  }, [categoryId]);

  const apiUrl = useMemo(() => {
    if (!candidateId) return null;
    return `${BE_URL}/stats/time-to-catch-up/?candidateId=${encodeURIComponent(candidateId)}&timeRange=${timeRange}`;
  }, [candidateId, timeRange, BE_URL]);

  useEffect(() => {
    if (!apiUrl) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    axios.get(apiUrl)
      .then((resp) => {
        if (!mounted) return;
        setResult(resp.data?.data || resp.data || null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || String(err));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [apiUrl]);

  const computed = useMemo(() => {
    if (!result || result.isLeader) return null;

    const leaderVotes = Number(result.leaderVote || 0);
    const trackingVotes = Number(result.trackingVote || 0);
    const lRate = Number(result.leaderRate || 0);
    const tRate = Number(result.trackingRate || 0);

    // netGain: Tốc độ bạn nhanh hơn đối thủ bao nhiêu?
    const netGain = tRate - lRate;
    const votesToCatch = Math.max(0, leaderVotes - trackingVotes);
    
    let minutesToCatch = null;
    let canCatchUp = false;

    if (netGain > 0) {
      minutesToCatch = votesToCatch / netGain;
      canCatchUp = true;
    }

    function toHuman(mins: number | null) {
      if (mins === null || !isFinite(mins)) return "—";
      if (mins < 1) return `${Math.ceil(mins * 60)} giây`;
      if (mins < 60) return `${Math.ceil(mins)} phút`;
      if (mins < 60 * 24) return `${(mins / 60).toFixed(1)} giờ`;
      return `${(mins / (60 * 24)).toFixed(1)} ngày`;
    }

    return {
      netGain,
      votesToCatch,
      humanETA: canCatchUp ? toHuman(minutesToCatch) : "Không thể đuổi kịp với tốc độ hiện tại",
      canCatchUp
    };
  }, [result]);

  return (
    <div className="w-full bg-white min-h-screen font-inter antialiased py-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        
        {/* HEADER */}
        <div className="mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-[900] mb-6 uppercase text-black tracking-tighter">
            Dự đoán thời gian bắt kịp
          </h1>
          
          <div className="flex flex-col items-center gap-6 bg-[#f1f3f5] p-8 rounded-[3rem] border border-gray-200">
            <CategorySelector onSelect={setCategoryId} />
            {categoryId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                <div className="space-y-2">
                  <label className="text-[12px] font-[900] uppercase text-neutral-500 tracking-wider">Ứng viên theo dõi</label>
                  <CandidateSelector onSelect={setCandidateId} categoryId={categoryId} selectedId={candidateId} />
                </div>
                <div className="space-y-2">
                  <label className="text-[12px] font-[900] uppercase text-neutral-500 tracking-wider">Khoảng phân tích (Phút)</label>
                  <TimeRangeSelector onSelect={setTimeRange} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RESULTS AREA */}
        {!categoryId ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-300">
            <p className="text-neutral-400 font-medium">Vui lòng chọn hạng mục để bắt đầu phân tích dữ liệu.</p>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="font-bold text-black uppercase text-sm tracking-widest">Đang tính toán ma trận...</p>
          </div>
        ) : error ? (
          <Error message={error} />
        ) : !result ? (
          <div className="text-center py-20 bg-red-50 rounded-[3rem] border border-red-100">
            <p className="text-red-500 font-bold">Không tìm thấy dữ liệu đối đầu.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {result.isLeader ? (
              /* GIAO DIỆN KHI ĐANG DẪN ĐẦU */
              <div className="bg-black rounded-[3rem] p-12 text-center text-white shadow-2xl">
                <div className="text-6xl mb-6">👑</div>
                <h2 className="text-3xl font-[900] uppercase mb-2">{result.tracking}</h2>
                <p className="text-neutral-400 font-bold tracking-widest uppercase text-sm mb-8">Đang thống trị bảng xếp hạng</p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-neutral-900 p-4 rounded-2xl">
                    <div className="text-xs text-neutral-500 uppercase mb-1">Tổng vote</div>
                    <div className="text-xl font-black">{result.trackingVote?.toLocaleString()}</div>
                  </div>
                  <div className="bg-neutral-900 p-4 rounded-2xl">
                    <div className="text-xs text-neutral-500 uppercase mb-1">Tốc độ</div>
                    <div className="text-xl font-black">{result.trackingRate} <span className="text-xs text-neutral-500">v/m</span></div>
                  </div>
                </div>
              </div>
            ) : (
              /* GIAO DIỆN KHI ĐANG ĐUỔI KỊP */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cột Trái: Bạn */}
                <div className="bg-white border border-gray-200 rounded-[3rem] overflow-hidden">
                  <div className="bg-[#f1f3f5] py-4 text-center border-b border-gray-200">
                    <span className="text-[12px] font-[900] uppercase text-neutral-600">Bạn đang theo dõi</span>
                  </div>
                  <div className="p-8 text-center">
                    <div className="text-2xl font-[900] mb-4 uppercase">{result.tracking}</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500">Tổng bình chọn</span>
                        <span className="font-black">{result.trackingVote?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500">Tốc độ hiện tại</span>
                        <span className="font-black text-blue-600">{result.trackingRate} v/m</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cột Giữa: Kết quả dự đoán */}
                <div className={`rounded-[3.5rem] p-8 text-center flex flex-col justify-center items-center shadow-xl border-4 ${computed?.canCatchUp ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="text-[10px] font-[900] uppercase tracking-[0.3em] mb-4 text-neutral-400">Kết quả dự đoán</div>
                  <div className={`text-4xl font-[900] mb-4 ${computed?.canCatchUp ? 'text-green-700' : 'text-red-700'}`}>
                    {computed?.canCatchUp ? computed.humanETA : "KHÓ ĐUỔI KỊP"}
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed px-4">
                    {computed?.canCatchUp 
                      ? `Với tốc độ nhanh hơn đối thủ ${computed.netGain.toFixed(1)} lượt/phút, bạn sẽ bắt kịp trong thời gian tới.`
                      : "Đối thủ đang tăng trưởng nhanh hơn hoặc bằng bạn. Cần tăng tốc ngay!"}
                  </p>
                </div>

                {/* Cột Phải: Leader */}
                <div className="bg-white border border-gray-200 rounded-[3rem] overflow-hidden">
                  <div className="bg-black py-4 text-center">
                    <span className="text-[12px] font-[900] uppercase text-white">Đối thủ dẫn đầu</span>
                  </div>
                  <div className="p-8 text-center">
                    <div className="text-2xl font-[900] mb-4 uppercase">{result.leader}</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500">Khoảng cách</span>
                        <span className="font-black text-red-600">-{computed?.votesToCatch?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-500">Tốc độ đối thủ</span>
                        <span className="font-black">{result.leaderRate} v/m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CHÚ THÍCH */}
            <div className="bg-neutral-50 rounded-[2.5rem] p-8 border border-gray-100">
              <div className="text-[11px] font-[900] uppercase text-neutral-400 mb-4 tracking-widest">Lưu ý hệ thống</div>
              <ul className="text-sm text-neutral-500 space-y-2 list-disc list-inside">
                <li>Phân tích dựa trên dữ liệu biến động trong <b>{timeRange} phút</b> gần nhất.</li>
                <li>Dự đoán mang tính chất tham khảo, chưa bao gồm các yếu tố bùng nổ (push vote) bất ngờ.</li>
                <li>Kết quả sẽ thay đổi liên tục theo thời gian thực mỗi khi bạn tải lại trang.</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
