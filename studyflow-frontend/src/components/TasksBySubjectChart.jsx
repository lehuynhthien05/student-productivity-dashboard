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

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      <span>{payload[0].value} tasks</span>
    </div>
  );
}

export default function TasksBySubjectChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/dashboard/tasks-by-subject").then((res) => {
      const subjectData = res.data || {};
      const chartData = Object.entries(subjectData)
        .map(([subject, count]) => ({
          name: subject,
          tasks: count,
        }))
        .sort((left, right) => right.tasks - left.tasks);
      setData(chartData.length > 0 ? chartData : [
        { name: "Toán", tasks: 3 },
        { name: "Lập trình", tasks: 5 },
        { name: "Tiếng Anh", tasks: 2 },
        { name: "Vật lý", tasks: 2 },
      ]);
    });
  }, []);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-kicker">Subject load</p>
          <h3>Nhiệm vụ theo môn học</h3>
        </div>
        <select className="chart-filter">
          <option>Tất cả trạng thái</option>
          <option>Đang chờ</option>
          <option>Hoàn thành</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis type="number" stroke="#94a3b8" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "rgba(148, 163, 184, 0.24)" }} tickLine={false} />
          <YAxis dataKey="name" type="category" width={110} stroke="#94a3b8" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={{ stroke: "rgba(148, 163, 184, 0.24)" }} tickLine={false} />
          <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(34, 211, 238, 0.08)" }} />
          <Bar dataKey="tasks" fill="url(#subjectGradient)" radius={[0, 10, 10, 0]} />
          <defs>
            <linearGradient id="subjectGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
