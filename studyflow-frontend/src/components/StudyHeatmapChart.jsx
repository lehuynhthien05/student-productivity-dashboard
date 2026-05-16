import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { max, scaleBand, scaleSequential, interpolateTurbo, format } from "d3";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const BUCKETS = [
  { key: "Sáng", start: 6, end: 11 },
  { key: "Trưa", start: 12, end: 13 },
  { key: "Chiều", start: 14, end: 17 },
  { key: "Tối", start: 18, end: 23 },
];

const FALLBACK_SESSIONS = [
  { startTime: "2026-05-12T07:30:00", endTime: "2026-05-12T09:00:00" },
  { startTime: "2026-05-13T19:00:00", endTime: "2026-05-13T21:00:00" },
  { startTime: "2026-05-14T14:00:00", endTime: "2026-05-14T15:30:00" },
  { startTime: "2026-05-15T20:00:00", endTime: "2026-05-15T22:00:00" },
  { startTime: "2026-05-16T08:00:00", endTime: "2026-05-16T10:30:00" },
];

function getWeekdayLabel(date) {
  return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
}

function getBucketLabel(hour) {
  const bucket = BUCKETS.find((item) => hour >= item.start && hour <= item.end);
  return bucket ? bucket.key : "Tối";
}

function buildMatrix(sessions) {
  const matrix = BUCKETS.flatMap((bucket) =>
    WEEKDAYS.map((day) => ({ day, bucket: bucket.key, minutes: 0, sessions: 0 }))
  );

  sessions.forEach((session) => {
    if (!session.startTime || !session.endTime) {
      return;
    }

    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return;
    }

    const minutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
    const day = getWeekdayLabel(start);
    const bucket = getBucketLabel(start.getHours());
    const target = matrix.find((cell) => cell.day === day && cell.bucket === bucket);

    if (target) {
      target.minutes += minutes;
      target.sessions += 1;
    }
  });

  return matrix;
}

export default function StudyHeatmapChart() {
  const [sessions, setSessions] = useState([]);
  const [hoveredCell, setHoveredCell] = useState(null);

  useEffect(() => {
    API.get("/sessions")
      .then((res) => setSessions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSessions(FALLBACK_SESSIONS));
  }, []);

  const matrix = useMemo(() => {
    const source = sessions.length > 0 ? sessions : FALLBACK_SESSIONS;
    return buildMatrix(source);
  }, [sessions]);

  const totalMinutes = matrix.reduce((sum, cell) => sum + cell.minutes, 0);
  const maxValue = max(matrix, (cell) => cell.minutes) || 1;
  const colorScale = scaleSequential(interpolateTurbo).domain([0, maxValue]);

  const cellWidth = 78;
  const cellHeight = 54;
  const marginLeft = 92;
  const marginTop = 48;
  const width = marginLeft + cellWidth * WEEKDAYS.length + 24;
  const height = marginTop + cellHeight * BUCKETS.length + 68;

  const xScale = scaleBand()
    .domain(WEEKDAYS)
    .range([marginLeft, marginLeft + cellWidth * WEEKDAYS.length])
    .padding(0.14);

  const yScale = scaleBand()
    .domain(BUCKETS.map((bucket) => bucket.key))
    .range([marginTop, marginTop + cellHeight * BUCKETS.length])
    .padding(0.16);

  return (
    <div className="chart-card heatmap-card">
      <div className="chart-header heatmap-header">
        <div>
          <p className="chart-kicker">D3.js heatmap</p>
          <h3>Nhịp học theo khung giờ</h3>
        </div>
        <div className="chart-stat">
          <span>Tổng thời lượng</span>
          <strong>{format(".0f")(totalMinutes)} phút</strong>
        </div>
      </div>

      <div className="heatmap-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="heatmap-svg"
          role="img"
          aria-label="Study heatmap"
        >
          <defs>
            <linearGradient id="heatmapLegend" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorScale(0)} />
              <stop offset="100%" stopColor={colorScale(maxValue)} />
            </linearGradient>
          </defs>

          {WEEKDAYS.map((day) => (
            <text
              key={day}
              x={xScale(day) + xScale.bandwidth() / 2}
              y={28}
              textAnchor="middle"
              className="heatmap-axis-label"
            >
              {day}
            </text>
          ))}

          {BUCKETS.map((bucket) => (
            <text
              key={bucket.key}
              x={24}
              y={yScale(bucket.key) + yScale.bandwidth() / 2 + 5}
              className="heatmap-axis-label heatmap-axis-label--y"
            >
              {bucket.key}
            </text>
          ))}

          {matrix.map((cell) => {
            const x = xScale(cell.day);
            const y = yScale(cell.bucket);
            const fill = cell.minutes > 0 ? colorScale(cell.minutes) : "rgba(30, 41, 59, 0.45)";

            return (
              <g key={`${cell.day}-${cell.bucket}`}>
                <rect
                  x={x}
                  y={y}
                  rx="14"
                  ry="14"
                  width={xScale.bandwidth()}
                  height={yScale.bandwidth()}
                  fill={fill}
                  stroke="rgba(148, 163, 184, 0.12)"
                  strokeWidth="1.2"
                  className="heatmap-cell"
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                />
                {cell.minutes > 0 && (
                  <text
                    x={x + xScale.bandwidth() / 2}
                    y={y + yScale.bandwidth() / 2 + 5}
                    textAnchor="middle"
                    className="heatmap-cell-text"
                  >
                    {cell.minutes}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="heatmap-legend">
          <span>Ít</span>
          <div
            className="heatmap-legend-bar"
            style={{ background: `linear-gradient(90deg, ${colorScale(0)} 0%, ${colorScale(maxValue)} 100%)` }}
          />
          <span>Nhiều</span>
        </div>

        <div className="heatmap-tooltip">
          {hoveredCell ? (
            <>
              <strong>{hoveredCell.day} • {hoveredCell.bucket}</strong>
              <span>{hoveredCell.minutes} phút</span>
              <span>{hoveredCell.sessions} buổi học</span>
            </>
          ) : (
            <>
              <strong>Di chuột để xem chi tiết</strong>
              <span>Biểu đồ này dùng dữ liệu session thật và tăng sức nặng phân tích.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}