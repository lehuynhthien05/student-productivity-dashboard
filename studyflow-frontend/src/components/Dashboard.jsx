import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/dashboard.css";
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  ListTodo,
  Timer,
  TriangleAlert,
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalSessions: 0,
    totalSubjects: 0,
    totalStudyMinutes: 0,
    averageSessionMinutes: 0,
    completionRate: 0,
    activeSubjects: 0,
  });

  const totalStudyHours = Math.round((data.totalStudyMinutes || 0) / 60);
  const dataFootprint = (data.totalTasks || 0) + (data.totalSessions || 0) + (data.totalSubjects || 0);
  const loadPerSubject = data.totalSubjects > 0 ? Math.round((data.totalTasks || 0) / data.totalSubjects) : 0;

  useEffect(() => {
    API.get("/dashboard/overview").then((res) => {
      if (res.data) {
        setData(res.data);
      }
    }).catch(() => {
      // Keep mock data on error
    });
  }, []);

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-badge">Data Science and Data Visualization</p>
            <h1 className="hero-title">StudyFlow Intelligence Dashboard</h1>
            <p className="hero-description">
              Dashboard này kể câu chuyện từ dữ liệu thật: số nhiệm vụ đang tồn đọng,
              nhịp học theo tuần, phân bổ theo môn, và các tín hiệu giúp bạn ra quyết định học tập tốt hơn.
            </p>

            <div className="hero-pills">
              <span className="hero-pill">{data.totalTasks || 0} tasks</span>
              <span className="hero-pill">{data.totalSubjects || 0} subjects</span>
              <span className="hero-pill">{data.totalSessions || 0} sessions</span>
              <span className="hero-pill hero-pill--accent">{data.completionRate || 0}% completion</span>
            </div>

            <div className="hero-stories">
              <div className="story-card">
                <span className="story-label">Data footprint</span>
                <strong>{dataFootprint}</strong>
                <p>điểm dữ liệu đang được theo dõi</p>
              </div>
              <div className="story-card story-card--accent">
                <span className="story-label">Completion signal</span>
                <strong>{data.completionRate || 0}%</strong>
                <p>tỉ lệ hoàn thành thể hiện mức độ tiến bộ</p>
              </div>
              <div className="story-card">
                <span className="story-label">Study rhythm</span>
                <strong>{totalStudyHours}h</strong>
                <p>tổng thời gian học được ghi nhận</p>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="illustration">
              <div className="orb orb-one"></div>
              <div className="orb orb-two"></div>
              <div className="desk"></div>
              <div className="computer"></div>
              <div className="books"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="metrics-grid">
        <MetricCard
          icon={<ListTodo size={24} />}
          title="Tổng nhiệm vụ"
          value={data.totalTasks || 0}
          note="Tất cả đầu việc trong hệ thống"
          color="#7c3aed"
        />
        <MetricCard
          icon={<Clock3 size={24} />}
          title="Đang chờ"
          value={data.pendingTasks || 0}
          note="Cần ưu tiên xử lý"
          color="#f59e0b"
        />
        <MetricCard
          icon={<CheckCircle2 size={24} />}
          title="Hoàn thành"
          value={data.completedTasks || 0}
          note={`${data.completionRate || 0}% completion rate`}
          color="#10b981"
        />
        <MetricCard
          icon={<TriangleAlert size={24} />}
          title="Quá hạn"
          value={data.overdueTasks || 0}
          note="Cần theo dõi ngay"
          color="#ef4444"
        />
        <MetricCard
          icon={<BookOpen size={24} />}
          title="Môn học"
          value={data.totalSubjects || 0}
          note={`${data.activeSubjects || 0} môn đang hoạt động · ${loadPerSubject} task / môn`}
          color="#06b6d4"
        />
        <MetricCard
          icon={<Timer size={24} />}
          title="Giờ học"
          value={totalStudyHours}
          note={`${data.averageSessionMinutes || 0} phút / buổi`}
          color="#0ea5e9"
        />
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, note, color }) {
  return (
    <div className="metric-card">
      <div className="metric-icon" style={{ background: `linear-gradient(135deg, ${color} 0%, rgba(255,255,255,0.2) 100%)` }}>
        {icon}
      </div>
      <div className="metric-content">
        <p className="metric-title">{title}</p>
        <h3 className="metric-value">{value}</h3>
        <p className="metric-note">{note}</p>
      </div>
    </div>
  );
}