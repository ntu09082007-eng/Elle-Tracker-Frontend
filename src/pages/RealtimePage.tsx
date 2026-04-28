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
      // 🛠 GỌI LINK BACKEND XỊN
      const response = await axios.get("https://elle-tracker-backend.onrender.com/realtime");
      
      let payloadData = response.data.data || response.data;
      if (!Array.isArray(payloadData)) return;

      const currentDiff: any = {};
      payloadData.forEach((item: any) => {
        const prev = prevVotesRef.current[item.id] ?? 0;
        if (prev > 0 && item.totalVotes > prev) currentDiff[item.id] = item.totalVotes - prev;
        prevVotesRef.current[item.id] = item.totalVotes;
      });

      setVoteDiff(currentDiff);
      const grouped: any = {};
      payloadData.forEach((item: any) => {
        const key = item.categoryName || item.categoryId || "Khác";
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(item);
      });

      Object.values(grouped).forEach((list: any) => list.sort((a: any, b: any) => b.totalVotes - a.totalVotes));
      setData(grouped);
      setLoading(false);
    } catch (e) { console.error("Lỗi gọi số rồi bà nội!"); }
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
