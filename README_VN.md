# StudyFlow System - Hướng dẫn chạy

## 🎯 Giới thiệu

StudyFlow là một hệ thống quản lý học tập với:
- **Frontend**: React 19 + Vite + Ant Design 5 + Recharts
- **Backend**: Java Spring Boot 3 + MongoDB
- **Database**: MongoDB
- **API**: REST API 20+ endpoints

## 📋 Yêu cầu

- Node.js 16+ 
- Java 21+
- Maven 3.8+
- Docker & Docker Compose (tuỳ chọn, dùng để MongoDB)

## 🚀 Cách chạy hệ thống

### Cách 1: Chạy MongoDB với Docker Compose (Khuyến nghị)

```bash
# Từ thư mục gốc (studyflow-system)
docker-compose up -d

# MongoDB sẽ chạy trên: mongodb://localhost:27017
# MongoDB Express (UI): http://localhost:8081
#   - Username: admin
#   - Password: admin
```

### Cách 2: Cài đặt MongoDB local

Nếu không dùng Docker, cài MongoDB local và chắc chắn nó chạy trên `localhost:27017`

---

## ⚙️ Chạy Backend (Spring Boot)

```bash
cd studyflow-backend/studyflow-backend

# Biên dịch và chạy
mvn clean install
mvn spring-boot:run

# Hoặc chỉ chạy (nếu đã build trước)
mvn spring-boot:run

# Backend sẽ chạy tại: http://localhost:8080
# API Base URL: http://localhost:8080/api
```

### API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/tasks` | Lấy tất cả tasks |
| POST | `/api/tasks` | Tạo task mới |
| PUT | `/api/tasks/{id}` | Cập nhật task |
| DELETE | `/api/tasks/{id}` | Xoá task |
| GET | `/api/tasks/status/{status}` | Lọc task theo trạng thái |
| GET | `/api/dashboard` | Lấy thống kê cơ bản |
| GET | `/api/dashboard/status-stats` | Thống kê trạng thái |
| GET | `/api/dashboard/study-time` | Thời gian học theo ngày |
| GET | `/api/dashboard/tasks-by-subject` | Số task theo môn học |
| GET | `/api/dashboard/study-trend` | Xu hướng tasks 30 ngày |
| GET | `/api/dashboard/performance` | Dữ liệu hiệu suất |
| GET/POST | `/api/subjects` | CRUD Môn học |
| GET/POST | `/api/sessions` | CRUD Study Sessions |

---

## 🎨 Chạy Frontend (React + Vite)

```bash
cd studyflow-frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Frontend sẽ chạy tại: http://localhost:5173
```

---

## 📊 Database Structure

### Collections MongoDB

1. **tasks**
   ```json
   {
     "_id": "ObjectId",
     "title": "Tiêu đề task",
     "deadline": "Date",
     "priority": "HIGH|MEDIUM|LOW",
     "status": "PENDING|COMPLETED",
     "subjectId": "Tên môn học"
   }
   ```

2. **subjects**
   ```json
   {
     "_id": "ObjectId",
     "name": "Tên môn học"
   }
   ```

3. **study_sessions**
   ```json
   {
     "_id": "ObjectId",
     "subjectId": "Tên môn học",
     "startTime": "Date",
     "endTime": "Date"
   }
   ```

---

## 🔧 Troubleshooting

### Backend không kết nối được MongoDB

**Error**: `Connection refused: localhost:27017`

**Solution**:
```bash
# Kiểm tra MongoDB chạy chưa
docker-compose ps

# Nếu chưa chạy
docker-compose up -d mongodb

# Hoặc chạy MongoDB local:
mongod
```

### Frontend không gọi API được

**Error**: CORS errors hoặc `Failed to fetch from http://localhost:8080/api`

**Solution**:
- Đảm bảo Backend đang chạy trên `http://localhost:8080`
- Kiểm tra `src/services/api.js` có đúng `baseURL`
- Backend đã có `@CrossOrigin` trên tất cả controllers

### Port đã bị sử dụng

```bash
# Nếu port 8080 bị chiếm:
# Sửa trong application.properties: server.port=8081

# Nếu port 5173 bị chiếm:
npm run dev -- --port 5174

# Nếu port 27017 (MongoDB) bị chiếm:
docker-compose down
docker-compose up -d
```

---

## ✅ Kiểm tra hệ thống

### 1. MongoDB đang chạy?
```bash
curl mongodb://localhost:27017
# Hoặc truy cập: http://localhost:8081
```

### 2. Backend đang chạy?
```bash
curl http://localhost:8080/api/tasks
# Phải return: []  (empty array)
```

### 3. Frontend đang chạy?
```
Mở: http://localhost:5173
Phải thấy StudyFlow Dashboard
```

---

## 🛑 Dừng hệ thống

```bash
# Dừng MongoDB & Mongo Express
docker-compose down

# Hoặc Ctrl+C ở mỗi terminal
```

---

## 📝 Tạo dữ liệu test

### Tạo task mới (POST)
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Bài tập Toán",
    "priority": "HIGH",
    "status": "PENDING",
    "subjectId": "Toán học",
    "deadline": "2025-06-01T23:59:00"
  }'
```

### Tạo subject
```bash
curl -X POST http://localhost:8080/api/subjects \
  -H "Content-Type: application/json" \
  -d '{"name": "Toán học"}'
```

### Tạo study session
```bash
curl -X POST http://localhost:8080/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "subjectId": "Toán học",
    "startTime": "2025-06-01T08:00:00",
    "endTime": "2025-06-01T10:00:00"
  }'
```

---

## 🎓 Tính năng chính

✅ **Quản lý Tasks**: Tạo, cập nhật, xoá, lọc theo trạng thái
✅ **Dashboard**: 4 metrics + 5 biểu đồ phân tích
✅ **Phân tích chi tiết**: Xu hướng 30 ngày, hiệu suất, thời gian học
✅ **Quản lý môn học**: CRUD Subjects
✅ **Theo dõi học tập**: Ghi lại sessions học
✅ **Responsive UI**: Hoạt động tốt trên desktop & mobile
✅ **REST API**: 20+ endpoints, dữ liệu JSON

---

## 📞 Liên hệ hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. MongoDB có chạy không? → `docker-compose ps`
2. Backend compile ok? → Xem logs trong terminal
3. Frontend gọi API ok? → Kiểm tra Console > Network tab
4. Tường lửa có chặn port không? → Mở ports 8080, 5173, 27017

---

**Happy Learning! 🚀📚**
