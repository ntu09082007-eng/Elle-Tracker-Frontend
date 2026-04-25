import React, { useEffect, useState, useMemo } from "react";
import candidatesData from "../info/candidates.json";

export default function History({ apiPayload }) {
  const [rows, setRows] = useState([]);
  const [sortAsc, setSortAsc] = useState(false);
  const [filterByRange, setFilterByRange] = useState(0); 
  const [filterByDate, setFilterByDate] = useState(null); 
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const ITEMS_PER_PAGE = 20;

  // 🛠 FIX 1: Normalize dữ liệu ngay khi nhận Prop
  useEffect(() => {
    // Nếu apiPayload là { data: [...] } thì lấy data, nếu bản thân nó là mảng thì lấy luôn
    const rawData = apiPayload?.data || (Array.isArray(apiPayload) ? apiPayload : []);
    setRows(Array.isArray(rawData) ? rawData : []);
  }, [apiPayload]);

  // 🛠 FIX 2: Safe mapping cho tên ứng viên
  const candidateNames = useMemo(() => {
    const safeRows = Array.isArray(rows) ? rows : [];
    const set = new Set();
    
    safeRows.forEach(r => {
      r?.candidates?.forEach(c => {
        if (c?.name) set.add(c.name);
      });
    });

    const allNames = Array.from(set);
    const priorityNames = candidatesData?.priority?.map((p) => p.name) || [];

    const priorityCandidates = allNames.filter(name => priorityNames.includes(name));
    const normalCandidates = allNames.filter(name => !priorityNames.includes(name));

    return [...priorityCandidates, ...normalCandidates];
  }, [rows]);

  // 🛠 FIX 3: Safe Filter logic
  const filteredRows = useMemo(() => {
    const safeRows = Array.isArray(rows) ? rows : [];
    return safeRows.filter((r) => {
      if (!r?.recordedAt) return false;
      
      const recordedDate = new Date(r.recordedAt);
      if (isNaN(recordedDate.getTime())) return false; // Ngày không hợp lệ

      // Lọc theo ngày
      if (filterByDate) {
        const [year, month, day] = filterByDate.split("-").map(Number);
        const fromDate = new Date(year, month - 1, day, 0, 0, 0, 0);
        if (recordedDate < fromDate) return false;
      }

      // Lọc theo khoảng cách phút
      if (filterByRange > 0) {
        const minutesTotal = recordedDate.getHours() * 60 + recordedDate.getMinutes();
        if (minutesTotal % filterByRange !== 0) return false;
      }

      return true;
    });
  }, [rows, filterByRange, filterByDate]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const t1 = new Date(a.recordedAt).getTime();
      const t2 = new Date(b.recordedAt).getTime();
      return sortAsc ? t1 - t2 : t2 - t1;
    });
  }, [filteredRows, sortAsc]);

  const displayedRows = sortedRows.slice(visibleRange.start, visibleRange.end);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setVisibleRange((prev) => ({
        ...prev,
        end: Math.min(prev.end + ITEMS_PER_PAGE, sortedRows.length)
      }));
    }
  };

  useEffect(() => {
    setVisibleRange({ start: 0, end: 20 });
  }, [sortAsc, filterByRange, filterByDate, categoryId]); // Reset khi đổi hạng mục

  return (
    <div className="bg-white rounded-[3rem] border border-gray-200 overflow-hidden shadow-sm h-full">
      {/* HEADER ĐEN CHỮ TRẮNG */}
      <div className="bg-black py-6 text-center">
        <h2 className="text-[17px] font-[900] text-white uppercase tracking-[0.25em]">
          Nhật ký dữ liệu chi tiết
        </h2>
      </div>

      <div className="p-8">
        {/* BỘ LỌC ĐỒNG BỘ STYLE */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-[900] uppercase text-neutral-400 tracking-widest ml-4">
              Mật độ ghi nhận
            </label>
            <select
              value={filterByRange}
              onChange={(e) => setFilterByRange(Number(e.target.value))}
              className="w-full px-6 py-3 bg-[#f1f3f5] border-2 border-transparent rounded-2xl font-black text-black outline-none cursor-pointer hover:bg-gray-200 transition-colors appearance-none text-center"
            >
              <option value={0}>Tất cả (10 phút)</option>
              <option value={30}>30 phút</option>
              <option value={60}>1 tiếng</option>
              <option value={1440}>1 ngày</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-[900] uppercase text-neutral-400 tracking-widest ml-4">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              value={filterByDate || ""}
              onChange={(e) => setFilterByDate(e.target.value || null)}
              className="w-full px-6 py-3 bg-[#f1f3f5] border-2 border-transparent rounded-2xl font-black text-black outline-none cursor-pointer text-center"
            />
          </div>
        </div>

        {/* BẢNG DỮ LIỆU */}
        {sortedRows.length > 0 ? (
          <div
            onScroll={handleScroll}
            className="max-h-[500px] overflow-y-auto rounded-[2rem] border border-gray-200 custom-scrollbar"
          >
            <table className="w-full border-collapse table-fixed bg-white">
              <thead className="sticky top-0 z-20">
                <tr className="bg-[#f1f3f5] text-neutral-600">
                  <th
                    className="py-5 px-6 text-left font-[900] uppercase text-[12px] border-b border-gray-200 cursor-pointer hover:text-black transition-colors"
                    onClick={() => setSortAsc(!sortAsc)}
                  >
                    Thời gian {sortAsc ? "▲" : "▼"}
                  </th>
                  {candidateNames.map((name) => {
                    const isPriority = candidatesData?.priority?.some(p => p.name === name);
                    return (
                      <th
                        key={name}
                        className={`py-5 px-6 text-center font-[900] uppercase text-[12px] border-b border-gray-200 truncate ${
                          isPriority ? "bg-yellow-100 text-yellow-800" : ""
                        }`}
                      >
                        {name}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {displayedRows.map((r) => {
                  const actualIndex = sortedRows.findIndex(row => row.recordedAt === r.recordedAt);
                  const previousRow = sortedRows[actualIndex + 1];

                  return (
                    <tr key={r.recordedAt} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap font-bold text-neutral-700 text-[13px]">
                        {new Date(r.recordedAt).toLocaleString("vi-VN", {
                          hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: '2-digit'
                        })}
                      </td>

                      {candidateNames.map((cn) => {
                        const candidate = r.candidates?.find(c => c.name === cn);
                        const isPriority = candidatesData?.priority?.some(p => p.name === cn);

                        let voteDiff = 0;
                        if (candidate && previousRow) {
                          const prevCandidate = previousRow.candidates?.find(c => c.name === cn);
                          if (prevCandidate) {
                            voteDiff = (candidate.totalVotes || 0) - (prevCandidate.totalVotes || 0);
                          }
                        }

                        return (
                          <td key={cn} className={`py-4 px-6 text-center ${isPriority ? "bg-yellow-50/30" : ""}`}>
                            <div className="flex flex-col items-center">
                              <span className="text-[15px] font-[900] text-black">
                                {candidate?.totalVotes?.toLocaleString() || "-"}
                              </span>
                              {voteDiff > 0 && (
                                <span className="text-[11px] font-[900] text-green-600 mt-0.5">
                                  +{voteDiff.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-neutral-400 font-black uppercase text-[12px] tracking-widest">
              Không tìm thấy bản ghi nào trong phạm vi này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
