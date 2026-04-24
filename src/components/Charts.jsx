// src/components/VoteChart.jsx
import { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
import candidates from "../info/candidates.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

const COLORS = [
  "#e60e0eff",
  "#d6179dff",
  "#22c55e",
  "#21b2e6ff",
  "#f39d1bff",
  "#3d15dbff",
];

export default function Charts({ apiPayload }) {
  const [chartData, setChartData] = useState(null);
  const [growthChartData, setGrowthChartData] = useState(null);
  const [latestTime, setLatestTime] = useState(null);
  const [showGrowth, setShowGrowth] = useState(false);
  const chartRef = useRef(null);
  const growthChartRef = useRef(null);

  useEffect(() => {
    if (!apiPayload) return;
    const row = apiPayload.data;

    // Lấy danh sách ứng viên từ candidates.json, priority trước, normal sau
    const priorityNames = candidates.priority.map((p) => p.name);
    const normalNames = candidates.normal.map((n) => n.name);

    // Kết hợp, lọc chỉ lấy những ứng viên có trong dữ liệu
    const candidateNames = [...priorityNames, ...normalNames].filter((name) => {
      return row[0]?.candidates.some((c) => c.name === name);
    });

    // Đảo ngược để hiển thị theo thời gian tăng dần
    const reversedData = [...row].reverse();

    // Chuẩn bị dữ liệu cho Chart.js
    const datasets = candidateNames.map((name, index) => {
      const data = reversedData.map((record) => {
        const candidate = record.candidates.find((c) => c.name === name);
        return {
          x: new Date(record.recordedAt),
          y: candidate ? candidate.totalVotes : 0,
        };
      });

      return {
        label: name,
        data: data,
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: window.innerWidth >= 768 ? 5 : 0,
        tension: 0.4,
      };
    });

    const chartConfig = {
      labels: reversedData.map((r) => new Date(r.recordedAt)),
      datasets: datasets,
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            font: {
              size: 15,
              weight: 500,
            },
            usePointStyle: true,
            pointStyle: "circle",
            pointStyleWidth: 8,
            boxHeight: 6,
          },
          onClick: () => {}, // Disable click to toggle
        },
        tooltip: {
          enabled: window.innerWidth > 1024,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleFont: {
            size: 13,
          },
          bodyFont: {
            size: 13,
          },
          padding: 12,
          displayColors: true,
          callbacks: {
            title: function (context) {
              const date = new Date(context[0].parsed.x);
              return date.toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            },
            label: function (context) {
              return " " + context.parsed.y.toLocaleString() + " phiếu";
            },
          },
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
          pan: {
            enabled: true,
            mode: "x",
          },
          limits: {
            x: { min: "original", max: "original" },
          },
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            tooltipFormat: "dd/MM HH:mm",
            displayFormats: {
              hour: "dd/MM HH:mm",
              day: "dd/MM",
              month: "MM/yyyy",
              year: "yyyy",
            },
            unit: "hour",
          },
          ticks: {
            font: {
              size: window.innerWidth > 1024 ? 14 : 10,
            },
            color: "#42454cff",
            maxTicksLimit: window.innerWidth > 1024 ? 8 : 4,
            autoSkip: true,
          },
          grid: {
            color: "#e5e7eb",
            drawOnChartArea: true,
            drawTicks: true,
          },
        },
        y: {
          ticks: {
            font: {
              size: 12,
            },
            color: "#6b7280",
            callback: function (value) {
              if (value >= 1000) {
                return value / 1000 + "k";
              }
              return value.toLocaleString();
            },
          },
          title: {
            display: true,
            text: "Phiếu",
            font: {
              size: 12,
              weight: "bold",
            },
            color: "#50545cff",
          },
          grid: {
            color: "#e5e7eb",
            drawOnChartArea: true,
          },
        },
      },
    };

    setChartData({ data: chartConfig, options: options });
    setLatestTime(row[0]?.recordedAt || null);

    // Tạo biểu đồ tốc độ tăng trưởng
    const growthDatasets = candidateNames.map((name, index) => {
      const data = reversedData
        .map((record) => {
          const candidate = record.candidates.find((c) => c.name === name);
          if (!candidate) return null;

          // Sử dụng growthRate từ API
          const growthRate = candidate.growthRate || 0;

          return {
            x: new Date(record.recordedAt),
            y: growthRate,
          };
        })
        .filter((item) => item !== null);

      return {
        label: name,
        data: data,
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: COLORS[index % COLORS.length],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: window.innerWidth > 1024 ? 5 : 0,
        tension: 0.4,
      };
    });

    const growthChartConfig = {
      labels: reversedData.slice(1).map((r) => new Date(r.recordedAt)),
      datasets: growthDatasets,
    };

    const growthOptions = {
      ...options,
      scales: {
        ...options.scales,
        y: {
          ...options.scales.y,
          ticks: {
            ...options.scales.y.ticks,
            callback: function (value) {
              return value;
            },
          },
          title: {
            display: true,
            text: "Phiếu/phút",
            font: {
              size: 12,
              weight: "bold",
            },
            color: "#50545cff",
          },
        },
      },
      plugins: {
        ...options.plugins,
        tooltip: {
          ...options.plugins.tooltip,
          callbacks: {
            ...options.plugins.tooltip.callbacks,
            label: function (context) {
              return " " + context.parsed.y.toFixed(1) + " phiếu/phút";
            },
          },
        },
      },
    };

    setGrowthChartData({ data: growthChartConfig, options: growthOptions });
  }, [apiPayload]);

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
    if (growthChartRef.current) {
      growthChartRef.current.resetZoom();
    }
  };

  if (!chartData) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
      <div className="bg-gray-900 p-5">
        <h2 className="text-2xl font-bold text-white text-center">
          Biểu đồ thống kê
        </h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-3 mb-6">
          {/*Thông tin cập nhật */}
          <div className="flex items-center justify-center text-sm text-gray-600 text-center bg-gray-100 py-3 px-4 rounded-lg font-medium shadow-sm">
            {latestTime &&
              `Cập nhật lần cuối: ${new Date(latestTime).toLocaleString(
                "vi-VN"
              )}`}
          </div>

          {/* Chọn đồ thị và đặt lại */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex justify-center items-center gap-2 bg-gray-100 p-1 rounded-lg shadow-sm flex-1">
              <button
                onClick={() => setShowGrowth(false)}
                className={`flex-1 px-3 py-2 rounded-md font-semibold text-sm transition-all ${
                  !showGrowth
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-transparent text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tổng phiếu
              </button>
              <button
                onClick={() => setShowGrowth(true)}
                className={`flex-1 px-3 py-2 rounded-md font-semibold text-sm transition-all ${
                  showGrowth
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-transparent text-gray-600 hover:bg-gray-200"
                }`}
              >
                Tốc độ
              </button>
            </div>

            <button
              onClick={handleResetZoom}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
            >
              Đặt lại thu phóng
            </button>
          </div>
        </div>

        {/* Hiển thị biểu đồ dựa trên trạng thái */}
        <div style={{ minHeight: "550px", paddingTop: "20px" }}>
          {!showGrowth
            ? chartData && (
                <Line
                  ref={chartRef}
                  data={chartData.data}
                  options={chartData.options}
                />
              )
            : growthChartData && (
                <Line
                  ref={growthChartRef}
                  data={growthChartData.data}
                  options={growthChartData.options}
                />
              )}
        </div>
      </div>
    </div>
  );
}
