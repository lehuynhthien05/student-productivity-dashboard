import "./styles/index.css";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import StatusChart from "./components/StatusChart";
import StudyTimeChart from "./components/StudyTimeChart";
import TasksBySubjectChart from "./components/TasksBySubjectChart";
import PerformanceRadarChart from "./components/PerformanceRadarChart";
import StudyTrendChart from "./components/StudyTrendChart";
import StudyHeatmapChart from "./components/StudyHeatmapChart";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import "./styles/app.css";

function App() {
  const [reload, setReload] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const refresh = () => setReload(!reload);
  const clearEdit = () => setEditTask(null);

  return (
    <div className="app-container">
      {/* Dashboard Header */}
      <Dashboard />

      {/* Analytics Section */}
      <div className="analytics-section">
        <div className="section-intro">
          <span className="section-eyebrow">Visual analytics canvas</span>
          <h2 className="section-title">Phân tích dữ liệu</h2>
          <p className="section-description">
            Từ trạng thái công việc, phân bổ môn học, đến hành vi học tập theo thời gian, mọi biểu đồ đều được thiết kế để trả lời một câu hỏi: dữ liệu đang nói gì về cách học của bạn?
          </p>
          <div className="section-highlight">
            Biểu đồ D3 heatmap và các chart Recharts cùng tạo nên một lớp quan sát: từ tổng quan, phân rã theo môn, đến nhịp học theo khung giờ.
          </div>
        </div>
        <div className="charts-grid">
          <div className="chart-col-2">
            <StatusChart />
          </div>
          <div className="chart-col-2">
            <StudyTimeChart />
          </div>
        </div>

        <div className="charts-grid">
          <TasksBySubjectChart />
          <PerformanceRadarChart />
        </div>

        <div className="charts-grid full">
          <StudyTrendChart />
        </div>

        <div className="charts-grid full">
          <StudyHeatmapChart />
        </div>
      </div>

      {/* Task Management Section */}
      <div className="task-management-section">
        <div className="section-intro">
          <span className="section-eyebrow">Action layer</span>
          <h2 className="section-title">Quản lý nhiệm vụ</h2>
          <p className="section-description">
            Sau khi nhìn thấy mẫu dữ liệu, bạn có thể can thiệp ngay tại đây: thêm, sửa, hoàn thành hoặc xoá nhiệm vụ mà không mất mạch phân tích.
          </p>
        </div>
        <div className="task-container">
          <TaskForm onCreated={refresh} editTask={editTask} clearEdit={clearEdit} />
          <TaskList reload={reload} onEdit={setEditTask} />
        </div>
      </div>
    </div>
  );
}

export default App;