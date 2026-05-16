import { useEffect, useState } from "react";
import API from "../services/api";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function DarkTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <strong>{payload[0].payload.subject}</strong>
      <span>{payload[0].value}</span>
    </div>
  );
}

export default function PerformanceRadarChart() {
  const [data, setData] = useState([
    { subject: "Quá hạn", value: 30 },
    { subject: "Trung bình", value: 60 },
    { subject: "Thông thường", value: 50 },
    { subject: "Đang chờ", value: 80 },
    { subject: "Hoàn thành", value: 65 },
    { subject: "Căn cứ", value: 45 },
  ]);

  useEffect(() => {
    API.get("/dashboard/performance").then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setData(res.data);
      }
    });
  }, []);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-kicker">Performance profile</p>
          <h3>Phân bổ nhiệm vụ</h3>
        </div>
        <select className="chart-filter">
          <option>Biểu đồ vòng</option>
          <option>Biểu đồ cột</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(148, 163, 184, 0.22)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
          <PolarRadiusAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={{ stroke: "rgba(148, 163, 184, 0.18)" }} />
          <Radar
            name="Giá trị"
            dataKey="value"
            stroke="#22d3ee"
            fill="url(#radarFill)"
            fillOpacity={0.85}
          />
          <Tooltip content={<DarkTooltip />} />
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0.28} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
