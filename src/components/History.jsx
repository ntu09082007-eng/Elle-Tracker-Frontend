import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import candidatesData from "../info/candidates.json";

export default function History({ apiPayload }) {
  const [rows, setRows] = useState([]);
  const [sortAsc, setSortAsc] = useState(false);
  const [filterByRange, setFilterByRange] = useState(0); //Lọc theo số bản ghi cách nhau bao nhiêu phút
  const [filterByDate, setFilterByDate] = useState(null); // Lọc theo từ ngày cụ thể đến hiện tại
  const [lastVote, setLastVote] = useState(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 }); // Phạm vi hiển thị
  const tableRef = useRef(null);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    if (!apiPayload) return;
    setRows(apiPayload.data);
  }, [apiPayload]);

  const candidateNames = React.useMemo(() => {
    const set = new Set();
    for (const r of rows) {
      if (!r?.candidates) continue;
      for (const c of r.candidates) set.add(c.name);
    }
    const allNames = Array.from(set);

    // Lấy danh sách priority names
    const priorityNames = candidatesData.priority.map((p) => p.name);

    // Tách priority và normal
    const priorityCandidates = [];
    const normalCandidates = [];

    allNames.forEach((name) => {
      if (priorityNames.includes(name)) {
        priorityCandidates.push(name);
      } else {
        normalCandidates.push(name);
      }
    });

    // Xếp priority trước, normal sau
    return [...priorityCandidates, ...normalCandidates];
  }, [rows]);

  const filteredRows = rows.filter((r) => {
    // Mặc định không lọc
    if (filterByRange === 0 && !filterByDate) return true;

    // Lọc theo khoảng thời gian cách nhau
    const time =
      new Date(r.recordedAt).getMinutes() +
      new Date(r.recordedAt).getHours() * 60;
    const firstTime =
      new Date(rows[0].recordedAt).getMinutes() +
      new Date(rows[0].recordedAt).getHours() * 60;
    const timeDiff = firstTime - time;

    // Lọc theo từ ngày cụ thể đến hiện tại
    if (filterByDate) {
      // Parse theo local timezone, không phải UTC
      const [year, month, day] = filterByDate.split("-").map(Number);
      const fromDate = new Date(year, month - 1, day, 0, 0, 0, 0);
      const recordedAtDate = new Date(r.recordedAt);
      return (
        recordedAtDate >= fromDate &&
        (timeDiff % filterByRange === 0 || filterByRange === 0)
      );
    }
    return timeDiff % filterByRange === 0;
  });

  const sortedRows = [...filteredRows].sort((a, b) => {
    const t1 = new Date(a.recordedAt).getTime();
    const t2 = new Date(b.recordedAt).getTime();
    return sortAsc ? t1 - t2 : t2 - t1;
  });

  // Virtual scrolling
  const displayedRows = sortedRows.slice(visibleRange.start, visibleRange.end);

  // Xử lý scroll để load thêm dữ liệu
  const handleScroll = (e) => {
    const container = e.target;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollPosition = scrollTop + clientHeight;
    const threshold = 100; // Khoảng cách trigger (px)

    // Scroll xuống - load thêm
    if (scrollPosition >= scrollHeight - threshold) {
      setVisibleRange((prev) => {
        const newEnd = Math.min(prev.end + ITEMS_PER_PAGE, sortedRows.length);
        return { ...prev, end: newEnd };
      });
    }

    // Scroll lên - load thêm phía trên
    if (scrollTop < threshold && visibleRange.start > 0) {
      setVisibleRange((prev) => {
        const newStart = Math.max(prev.start - ITEMS_PER_PAGE, 0);
        return { start: newStart, end: prev.end };
      });
    }
  };

  // Reset visible range khi filter/sort thay đổi
  useEffect(() => {
    setVisibleRange({ start: 0, end: 20 });
  }, [sortAsc, filterByRange, filterByDate]);

  const toggleSort = () => setSortAsc((prev) => !prev);
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
      <div className="bg-gray-900 p-5">
        <h2 className="text-2xl font-bold text-white text-center">
          Lịch sử bình chọn
        </h2>
      </div>

      <div className="p-5">
        <div className="mb-5 space-y-3">
          <label className="text-sm font-semibold text-gray-700 block">
            Lọc theo thời gian giữa 2 bản ghi và từ ngày:
          </label>
          <div className="flex flex-wrap gap-3">
            <select
              value={filterByRange}
              onChange={(e) => setFilterByRange(Number(e.target.value))}
              className="flex-1 min-w-[150px] px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 font-medium"
            >
              <option value={0}>Tất cả (10 phút)</option>
              <option value={30}>30 phút</option>
              <option value={60}>1 tiếng</option>
              <option value={120}>2 tiếng</option>
              <option value={240}>4 tiếng</option>
              <option value={360}>6 tiếng</option>
              <option value={720}>12 tiếng</option>
              <option value={1440}>1 ngày</option>
            </select>

            <input
              className="flex-1 min-w-[150px] px-4 py-2 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 font-medium"
              type="date"
              lang="vi"
              value={filterByDate || ""}
              max={new Date().toLocaleDateString("en-CA")}
              onChange={(e) => setFilterByDate(e.target.value || null)}
            />
          </div>
        </div>
        {filteredRows.length > 0 && (
          <div
            ref={tableRef}
            onScroll={handleScroll}
            className="max-h-[390px] overflow-y-auto border-2 rounded-xl shadow-inner"
          >
            <table className="min-w-full table-auto text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 sticky top-0 z-10">
                  <th
                    className="px-4 py-3 text-left cursor-pointer select-none hover:bg-gray-200 transition-colors font-semibold text-gray-800 w-[180px]"
                    onClick={toggleSort}
                  >
                    Thời gian{" "}
                    <span className="text-xs ml-1">{sortAsc ? "▲" : "▼"}</span>
                  </th>
                  {candidateNames.map((name) => {
                    const isHighlighted = candidatesData.priority.some(
                      (p) => p.name === name
                    );
                    return (
                      <th
                        key={name}
                        className={`px-4 py-3 text-center font-semibold min-w-[150px] ${
                          isHighlighted
                            ? "bg-rose-100 text-rose-700"
                            : "text-gray-800"
                        }`}
                      >
                        {name}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {displayedRows.map((r, index) => {
                  // Tìm index của bản ghi này trong sortedRows
                  const actualIndex = sortedRows.findIndex(
                    (row) => row.recordedAt === r.recordedAt
                  );
                  // Lấy bản ghi trước đó (theo thứ tự sắp xếp)
                  const previousRow = sortedRows[actualIndex + 1];

                  return (
                    <tr
                      key={r.recordedAt}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-700">
                        {new Date(r.recordedAt).toLocaleString("vi-VN", {
                          timeStyle: "short",
                          dateStyle: "short",
                        })}
                      </td>

                      {candidateNames.map((cn) => {
                        const candidate = (r.candidates || []).find(
                          (c) => c.name === cn
                        );

                        const isHighlighted = candidatesData.priority.some(
                          (p) => p.name === cn
                        );

                        // Tính voteDiff dựa trên dữ liệu đã lọc
                        let voteDiff = 0;
                        if (candidate && previousRow) {
                          const prevCandidate = (
                            previousRow.candidates || []
                          ).find((c) => c.name === cn);
                          if (prevCandidate) {
                            voteDiff =
                              candidate.totalVotes - prevCandidate.totalVotes;
                          }
                        }

                        return (
                          <td
                            key={cn}
                            className={`px-4 py-3 text-center font-semibold ${
                              isHighlighted
                                ? "bg-rose-50 text-rose-700"
                                : "text-gray-900"
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span>
                                {candidate
                                  ? candidate.totalVotes.toLocaleString()
                                  : "-"}
                              </span>
                              {voteDiff > 0 && (
                                <span className="text-xs text-green-600 font-medium">
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
        )}
      </div>
    </div>
  );
}
