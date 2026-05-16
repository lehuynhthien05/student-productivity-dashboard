package com.studyflow;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.studyflow.model.StudySession;
import com.studyflow.model.Subject;
import com.studyflow.model.Task;
import com.studyflow.repository.StudySessionRepository;
import com.studyflow.repository.SubjectRepository;
import com.studyflow.repository.TaskRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TaskRepository taskRepo;
    private final SubjectRepository subjectRepo;
    private final StudySessionRepository sessionRepo;

    public DataSeeder(TaskRepository taskRepo, SubjectRepository subjectRepo, StudySessionRepository sessionRepo) {
        this.taskRepo = taskRepo;
        this.subjectRepo = subjectRepo;
        this.sessionRepo = sessionRepo;
    }

    @Override
    public void run(String... args) {
        if (taskRepo.count() > 0 || subjectRepo.count() > 0 || sessionRepo.count() > 0) {
            return;
        }

        seedSubjects();
        seedTasks();
        seedSessions();
    }

    private void seedSubjects() {
        List<String> names = Arrays.asList(
            "Toán học",
            "Lập trình",
            "Khoa học dữ liệu",
            "Tiếng Anh",
            "Thống kê",
            "Thiết kế trực quan",
            "Cơ sở dữ liệu",
            "Phân tích kinh doanh"
        );

        for (String name : names) {
            Subject subject = new Subject();
            subject.setName(name);
            subjectRepo.save(subject);
        }
    }

    private void seedTasks() {
        List<SeedTask> tasks = new ArrayList<>();
        tasks.add(new SeedTask("Dashboard wireframe", "Thiết kế trực quan", "HIGH", "COMPLETED", -12, -10));
        tasks.add(new SeedTask("Thu thập dữ liệu khảo sát", "Khoa học dữ liệu", "HIGH", "COMPLETED", -11, -8));
        tasks.add(new SeedTask("Vẽ biểu đồ xu hướng", "Lập trình", "MEDIUM", "COMPLETED", -9, -6));
        tasks.add(new SeedTask("Làm sạch dữ liệu CSV", "Khoa học dữ liệu", "HIGH", "COMPLETED", -8, -5));
        tasks.add(new SeedTask("Phân tích correlation", "Thống kê", "HIGH", "PENDING", -7, -1));
        tasks.add(new SeedTask("Viết report chương 1", "Phân tích kinh doanh", "MEDIUM", "PENDING", -6, 2));
        tasks.add(new SeedTask("Tối ưu biểu đồ D3", "Lập trình", "HIGH", "PENDING", -5, 3));
        tasks.add(new SeedTask("Ôn tập xác suất", "Thống kê", "LOW", "COMPLETED", -14, -11));
        tasks.add(new SeedTask("Luyện SQL JOIN", "Cơ sở dữ liệu", "MEDIUM", "COMPLETED", -10, -7));
        tasks.add(new SeedTask("Viết mô tả insight", "Thiết kế trực quan", "MEDIUM", "PENDING", -4, 4));
        tasks.add(new SeedTask("Học từ vựng chuyên ngành", "Tiếng Anh", "LOW", "COMPLETED", -13, -9));
        tasks.add(new SeedTask("Kiểm tra số liệu dashboard", "Phân tích kinh doanh", "HIGH", "PENDING", -3, 5));
        tasks.add(new SeedTask("Ôn mô hình hồi quy", "Thống kê", "HIGH", "COMPLETED", -15, -12));
        tasks.add(new SeedTask("Tạo bản nháp báo cáo", "Khoa học dữ liệu", "MEDIUM", "PENDING", -2, 6));
        tasks.add(new SeedTask("Hoàn thiện slide thuyết trình", "Thiết kế trực quan", "HIGH", "PENDING", -1, 7));
        tasks.add(new SeedTask("Review data pipeline", "Lập trình", "HIGH", "COMPLETED", -16, -13));
        tasks.add(new SeedTask("Ôn tập công thức", "Toán học", "LOW", "PENDING", -5, 1));
        tasks.add(new SeedTask("Thiết kế storyboard", "Thiết kế trực quan", "MEDIUM", "COMPLETED", -17, -14));

        for (SeedTask seed : tasks) {
            Task task = new Task();
            task.setTitle(seed.title);
            task.setSubjectId(seed.subjectId);
            task.setPriority(seed.priority);
            task.setStatus(seed.status);
            task.setCreatedAt(daysFromNow(seed.createdOffsetDays));
            task.setUpdatedAt(daysFromNow(seed.updatedOffsetDays));
            task.setDeadline(daysFromNow(seed.updatedOffsetDays + 1));
            if ("COMPLETED".equals(seed.status)) {
                task.setCompletedAt(daysFromNow(seed.updatedOffsetDays));
            }
            taskRepo.save(task);
        }
    }

    private void seedSessions() {
        List<SeedSession> sessions = Arrays.asList(
            new SeedSession("Khoa học dữ liệu", 1, 8, 50),
            new SeedSession("Thống kê", 1, 14, 25),
            new SeedSession("Lập trình", 2, 19, 30),
            new SeedSession("Thiết kế trực quan", 2, 20, 15),
            new SeedSession("Cơ sở dữ liệu", 3, 9, 0),
            new SeedSession("Phân tích kinh doanh", 3, 16, 40),
            new SeedSession("Tiếng Anh", 4, 7, 20),
            new SeedSession("Toán học", 4, 18, 10),
            new SeedSession("Khoa học dữ liệu", 5, 20, 5),
            new SeedSession("Lập trình", 5, 21, 25),
            new SeedSession("Thống kê", 6, 10, 35),
            new SeedSession("Thiết kế trực quan", 6, 15, 50),
            new SeedSession("Phân tích kinh doanh", 7, 8, 40),
            new SeedSession("Cơ sở dữ liệu", 7, 20, 5)
        );

        for (SeedSession seed : sessions) {
            StudySession session = new StudySession();
            session.setSubjectId(seed.subjectId);

            Calendar start = Calendar.getInstance();
            start.add(Calendar.DATE, -seed.daysAgo);
            start.set(Calendar.HOUR_OF_DAY, seed.hour);
            start.set(Calendar.MINUTE, seed.minute);
            start.set(Calendar.SECOND, 0);
            start.set(Calendar.MILLISECOND, 0);

            Calendar end = (Calendar) start.clone();
            end.add(Calendar.MINUTE, 60 + (seed.daysAgo % 3) * 20);

            session.setStartTime(start.getTime());
            session.setEndTime(end.getTime());
            sessionRepo.save(session);
        }
    }

    private Date daysFromNow(int daysOffset) {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, daysOffset);
        return calendar.getTime();
    }

    private static final class SeedTask {
        private final String title;
        private final String subjectId;
        private final String priority;
        private final String status;
        private final int createdOffsetDays;
        private final int updatedOffsetDays;

        private SeedTask(String title, String subjectId, String priority, String status, int createdOffsetDays, int updatedOffsetDays) {
            this.title = title;
            this.subjectId = subjectId;
            this.priority = priority;
            this.status = status;
            this.createdOffsetDays = createdOffsetDays;
            this.updatedOffsetDays = updatedOffsetDays;
        }
    }

    private static final class SeedSession {
        private final String subjectId;
        private final int daysAgo;
        private final int hour;
        private final int minute;

        private SeedSession(String subjectId, int daysAgo, int hour, int minute) {
            this.subjectId = subjectId;
            this.daysAgo = daysAgo;
            this.hour = hour;
            this.minute = minute;
        }
    }
}