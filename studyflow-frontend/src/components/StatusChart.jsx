import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#fbbf24", "#10b981", "#ef4444"];

// Mock data
const MOCK_DATA = [
  { name: "Pending", value: 3 },
  { name: "Completed", value: 2 },
  { name: "Overdue", value: 1 },
];

function DarkTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <strong>{payload[0].name}</strong>
      <span>{payload[0].value} tasks</span>
    </div>
  );
}

export default function StatusChart() {
  const [data, setData] = useState(MOCK_DATA);

  useEffect(() => {
    API.get("/dashboard/status-stats").then((res) => {
      const statsData = res.data;
      if (statsData && (statsData.PENDING > 0 || statsData.COMPLETED > 0)) {
        const chartData = [
          { name: "Pending", value: statsData.PENDING || 0 },
          { name: "Completed", value: statsData.COMPLETED || 0 },
          { name: "Overdue", value: statsData.OVERDUE || 0 },
        ];
        setData(chartData);
      }
    }).catch(() => {
      // Keep mock data on error
    });
  }, []);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <p className="chart-kicker">Risk snapshot</p>
          <h3>Tổng quan trạng thái</h3>
        </div>
        <div className="chart-stat">
          <span>Pie distribution</span>
          <strong>{data.reduce((sum, item) => sum + item.value, 0)} tasks</strong>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={72}
            outerRadius={102}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip content={<DarkTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value) => <span style={{ color: "#cbd5e1" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="legend-custom">
        <div className="legend-item">
          <span className="legend-color pending"></span> Pending
        </div>
        <div className="legend-item">
          <span className="legend-color completed"></span> Completed
        </div>
        <div className="legend-item">
          <span className="legend-color overdue"></span> Overdue
        </div>
      </div>
    </div>
  );
}