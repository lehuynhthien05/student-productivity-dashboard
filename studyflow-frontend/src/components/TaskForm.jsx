import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/form.css";

export default function TaskForm({ onCreated, editTask, clearEdit }) {
  const [form, setForm] = useState({
    title: "",
    priority: "MEDIUM",
    status: "PENDING",
    subjectId: "",
    deadline: "",
  });

  useEffect(() => {
    if (editTask) {
      setForm({
        ...editTask,
        deadline: editTask.deadline?.slice(0, 16),
      });
    }
  }, [editTask]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.deadline) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const payload = {
      ...form,
      deadline: new Date(form.deadline),
    };

    if (editTask) {
      API.put(`/tasks/${editTask.id}`, payload).then(() => {
        alert("Cập nhật thành công!");
        clearEdit();
        onCreated();
      });
    } else {
      API.post("/tasks", payload).then(() => {
        alert("Tạo thành công!");
        onCreated();
      });
    }

    setForm({
      title: "",
      priority: "MEDIUM",
      status: "PENDING",
      subjectId: "",
      deadline: "",
    });
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <span style={{ fontSize: "1.5rem" }}>➕</span>
        <h3>{editTask ? "Chỉnh sửa nhiệm vụ" : "Tạo nhiệm vụ"}</h3>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label>Tiêu đề nhiệm vụ</label>
          <input
            type="text"
            name="title"
            placeholder="Nhập tiêu đề nhiệm vụ"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Môn học</label>
          <input
            type="text"
            name="subjectId"
            placeholder="Ví dụ: Toán, Lập trình, Tiếng Anh"
            value={form.subjectId}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ưu tiên</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="LOW">Thấp</option>
              <option value="MEDIUM">Trung bình</option>
              <option value="HIGH">Cao</option>
            </select>
          </div>

          <div className="form-group">
            <label>Trạng thái</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="PENDING">Đang chờ</option>
              <option value="COMPLETED">Hoàn thành</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Hạn chót</label>
          <input
            type="datetime-local"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          {editTask ? "Cập nhật" : "+ Thêm nhiệm vụ"}
        </button>
      </form>
    </div>
  );
}