import { useEffect, useState } from "react";
import API from "../services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      <span>Đã tạo: {payload.find((item) => item.dataKey === "Đã tạo")?.value || 0}</span>
      <span>Hoàn thành: {payload.find((item) => item.dataKey === "Hoàn thành")?.value || 0}</span>
    </div>
  );
}

function parseTrendDate(value) {
  const [month, day] = value.split("/").map(Number);
  return new Date(2026, (month || 1) - 1, day || 1).getTime();
}

export default function StudyTrendChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/dashboard/study-trend").then((res) => {
      const trendData = res.data || {};
      const chartData = Object.entries(trendData).map(([date, values]) => ({
        date,
        "Đã tạo": values.created || 0,
        "Hoàn thành": values.completed || 0,
      }));
      
      if (chartData.length === 0) {
        // Mock data
        const mockData = [];
        for (let i = 0; i < 30; i++) {
          mockData.push({
            date: `${6 + Math.floor(i / 7)}/${4 + i}`,
            "Đã tạo": Math.floor(Math.random() * 20),
            "Hoàn thành": Math.floor(Math.random() * 15),
          });
        }
        setData(mockData);
      } else {
        setData(chartData);
      }
    });
  }, []);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-kicker">Trend line</p>
          <h3>Xu hướng nhiệm vụ</h3>
        </div>
        <select className="chart-filter">
          <option>Biểu độ vùng</option>
          <option>30 ngày</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.65} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "rgba(148, 163, 184, 0.24)" }} tickLine={false} />
          <YAxis stroke="#94a3b8" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "rgba(148, 163, 184, 0.24)" }} tickLine={false} />
          <Tooltip content={<DarkTooltip />} cursor={{ stroke: "rgba(148, 163, 184, 0.18)" }} />
          <Legend wrapperStyle={{ color: "#cbd5e1" }} iconType="circle" />
          <Area
            type="monotone"
            dataKey="Đã tạo"
            stroke="#38bdf8"
            fillOpacity={1}
            fill="url(#colorCreated)"
          />
          <Area
            type="monotone"
            dataKey="Hoàn thành"
            stroke="#a78bfa"
            fillOpacity={1}
            fill="url(#colorCompleted)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
