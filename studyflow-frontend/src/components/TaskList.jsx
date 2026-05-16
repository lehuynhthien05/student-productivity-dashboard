import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/list.css";

export default function TaskList({ reload, onEdit }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchTasks();
    // polling every 15 seconds for realtime-like updates
    const interval = setInterval(fetchTasks, 15000);
    return () => clearInterval(interval);
  }, [filter, reload]);

  const fetchTasks = () => {
    if (filter === "ALL") {
      API.get("/tasks").then((res) => setTasks(res.data || [])).catch(() => setTasks([]));
    } else {
      API.get(`/tasks/status/${filter}`).then((res) =>
        setTasks(res.data || [])
      ).catch(() => setTasks([]));
    }
  };

  const completeTask = (task) => {
    API.put(`/tasks/${task.id}`, {
      ...task,
      status: "COMPLETED",
    }).then(fetchTasks);
  };

  const deleteTask = (id) => {
    if (!confirm("Bạn có chắc muốn xoá?")) return;
    API.delete(`/tasks/${id}`).then(fetchTasks);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      HIGH: "#ef4444",
      MEDIUM: "#f59e0b",
      LOW: "#3b82f6",
    };
    return colors[priority] || "#64748b";
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { text: "Đang chờ", bg: "#fef3c7", color: "#d97706" },
      COMPLETED: { text: "Hoàn thành", bg: "#d1fae5", color: "#059669" },
    };
    return badges[status] || { text: status, bg: "#f0f0f0", color: "#64748b" };
  };

  return (
    <div className="task-list-card">
      <div className="list-header">
        <div>
          <h3>Danh sách nhiệm vụ</h3>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
          onClick={() => setFilter("ALL")}
        >
          Tất cả
        </button>
        <button
          className={`filter-btn ${filter === "PENDING" ? "active" : ""}`}
          onClick={() => setFilter("PENDING")}
        >
          Đang chờ
        </button>
        <button
          className={`filter-btn ${filter === "COMPLETED" ? "active" : ""}`}
          onClick={() => setFilter("COMPLETED")}
        >
          Hoàn thành
        </button>
      </div>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-state">Chưa có nhiệm vụ nào</div>
        ) : (
          tasks.map((task) => {
            const statusBadge = getStatusBadge(task.status);
            return (
              <div key={task.id} className="task-item">
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className="subject">{task.subjectId}</span>
                    <span
                      className="priority"
                      style={{ color: getPriorityColor(task.priority) }}
                    >
                      {task.priority}
                    </span>
                    <span
                      className="status-badge"
                      style={{ background: statusBadge.bg, color: statusBadge.color }}
                    >
                      {statusBadge.text}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  {task.status !== "COMPLETED" && (
                    <button
                      className="action-btn complete-btn"
                      onClick={() => completeTask(task)}
                      title="Hoàn thành"
                    >
                      ✅
                    </button>
                  )}
                  <button
                    className="action-btn edit-btn"
                    onClick={() => onEdit(task)}
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteTask(task.id)}
                    title="Xoá"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}