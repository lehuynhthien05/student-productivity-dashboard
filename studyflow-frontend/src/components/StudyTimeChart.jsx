import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// Mock data
const MOCK_DATA = [
  { name: "T2", "Thời gian học (phút)": 45 },
  { name: "T3", "Thời gian học (phút)": 60 },
  { name: "T4", "Thời gian học (phút)": 30 },
  { name: "T5", "Thời gian học (phút)": 90 },
  { name: "T6", "Thời gian học (phút)": 50 },
  { name: "T7", "Thời gian học (phút)": 75 },
  { name: "CN", "Thời gian học (phút)": 40 },
];

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      <span>{payload[0].value} phút học</span>
    </div>
  );
}

export default function StudyTimeChart() {
  const [data, setData] = useState(MOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalize = (raw) => {
    // raw can be: {T2: 45, T3: 30, ...} OR [{ name: 'T2', minutes: 45 }, ...] OR [{ day: 'T2', value:45 }, ...]
    if (!raw) return [];

    if (Array.isArray(raw)) {
      return DAYS.map((d) => {
        const hit = raw.find(
          (r) => r.name === d || r.day === d || r.dayOfWeek === d || r.weekday === d
        );
        const val = hit ? (hit["Thời gian học (phút)"] ?? hit.minutes ?? hit.value ?? hit.count ?? 0) : 0;
        return { name: d, "Thời gian học (phút)": val };
      });
    }

    if (typeof raw === "object") {
      // assume map of day->minutes
      return DAYS.map((d) => ({ name: d, "Thời gian học (phút)": Number(raw[d] ?? 0) }));
    }

    return [];
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/dashboard/study-time");
      const studyData = res?.data ?? res;
      const chartData = normalize(studyData);
      // If all zeros and no meaningful data, keep mock only if API returned empty
      const hasReal = chartData.some((it) => it["Thời gian học (phút)"] > 0);
      if (hasReal) setData(chartData);
      else if (Array.isArray(studyData) && studyData.length > 0) setData(chartData);
      // otherwise keep existing/mock
    } catch (err) {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 60000); // refresh every 60s
    return () => clearInterval(id);
  }, []);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-kicker">Weekly rhythm</p>
          <h3>Thời gian học (phút)</h3>
        </div>
        <div className="chart-stat">
          <span>Average intensity</span>
          <strong>{Math.round(data.reduce((sum, item) => sum + item["Thời gian học (phút)"], 0) / Math.max(data.length, 1))} min</strong>
          <button className="action-btn refresh-btn" onClick={fetchData} title="Làm mới" style={{marginLeft: 8}}>
            ↻
          </button>
        </div>
      </div>
      {loading && <div style={{padding: 12, color: 'var(--text-light)'}}>Đang tải dữ liệu...</div>}
      {error && <div style={{padding: 12, color: 'var(--danger)'}}>{error}</div>}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "rgba(148, 163, 184, 0.24)" }} tickLine={false} />
          <YAxis stroke="#94a3b8" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "rgba(148, 163, 184, 0.24)" }} tickLine={false} />
          <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(59, 130, 246, 0.08)" }} />
          <Bar dataKey="Thời gian học (phút)" fill="url(#studyTimeGradient)" radius={[10, 10, 0, 0]} />
          <defs>
            <linearGradient id="studyTimeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}