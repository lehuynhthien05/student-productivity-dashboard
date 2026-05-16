package com.studyflow.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyflow.model.StudySession;
import com.studyflow.model.Task;
import com.studyflow.repository.StudySessionRepository;
import com.studyflow.repository.SubjectRepository;
import com.studyflow.repository.TaskRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final TaskRepository taskRepo;
    private final StudySessionRepository sessionRepo;
    private final SubjectRepository subjectRepo;

    public DashboardController(TaskRepository taskRepo, StudySessionRepository sessionRepo, SubjectRepository subjectRepo) {
        this.taskRepo = taskRepo;
        this.sessionRepo = sessionRepo;
        this.subjectRepo = subjectRepo;
    }

    // ===== BASIC STATS =====
    @GetMapping
    public Map<String, Object> stats() {
        long total = taskRepo.count();
        long completed = taskRepo.findByStatus("COMPLETED").size();
        long pending = taskRepo.findByStatus("PENDING").size();

        Map<String, Object> data = new HashMap<>();
        data.put("total", total);
        data.put("completed", completed);
        data.put("pending", pending);

        return data;
    }

    // ===== DASHBOARD OVERVIEW =====
    @GetMapping("/overview")
    public Map<String, Object> overview() {
        long totalTasks = taskRepo.count();
        long completedTasks = taskRepo.findByStatus("COMPLETED").size();
        long pendingTasks = taskRepo.findByStatus("PENDING").size();
        long overdueTasks = taskRepo.findByDeadlineBeforeAndStatusNot(new Date(), "COMPLETED").size();
        long totalSessions = sessionRepo.count();
        long totalSubjects = subjectRepo.count();

        int totalStudyMinutes = calculateTotalStudyMinutes(sessionRepo.findAll());
        int averageSessionMinutes = totalSessions == 0 ? 0 : totalStudyMinutes / (int) totalSessions;
        double completionRate = totalTasks == 0 ? 0 : Math.round((completedTasks * 1000.0 / totalTasks)) / 10.0;

        Map<String, Object> data = new HashMap<>();
        data.put("totalTasks", totalTasks);
        data.put("completedTasks", completedTasks);
        data.put("pendingTasks", pendingTasks);
        data.put("overdueTasks", overdueTasks);
        data.put("totalSessions", totalSessions);
        data.put("totalSubjects", totalSubjects);
        data.put("totalStudyMinutes", totalStudyMinutes);
        data.put("averageSessionMinutes", averageSessionMinutes);
        data.put("completionRate", completionRate);
        data.put("activeSubjects", countActiveSubjects());

        return data;
    }

    // ===== STATUS STATS =====
    @GetMapping("/status-stats")
    public Map<String, Long> statusStats() {
        Map<String, Long> data = new HashMap<>();

        long pending = taskRepo.findByStatus("PENDING").size();
        long completed = taskRepo.findByStatus("COMPLETED").size();
        long overdue = taskRepo.findByDeadlineBeforeAndStatusNot(new Date(), "COMPLETED").size();

        data.put("PENDING", pending);
        data.put("COMPLETED", completed);
        data.put("OVERDUE", overdue);

        return data;
    }

    // ===== STUDY TIME BY DAY OF WEEK =====
    @GetMapping("/study-time")
    public Map<String, Integer> studyTime() {
        Map<String, Integer> data = new LinkedHashMap<>();
        List<String> days = Arrays.asList("T2", "T3", "T4", "T5", "T6", "T7", "CN");
        
        for (String day : days) {
            data.put(day, 0);
        }

        // Calculate study time from sessions
        sessionRepo.findAll().forEach(session -> {
            if (session.getStartTime() != null && session.getEndTime() != null) {
                long duration = (session.getEndTime().getTime() - session.getStartTime().getTime()) / (1000 * 60);
                Calendar cal = Calendar.getInstance();
                cal.setTime(session.getStartTime());
                int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
                String dayName = days.get(dayOfWeek - 2); // Convert to Vietnamese day format
                
                if (dayOfWeek > 1 && dayOfWeek < 8) {
                    data.put(dayName, data.getOrDefault(dayName, 0) + (int) duration);
                }
            }
        });

        return data;
    }

    // ===== TASKS BY SUBJECT =====
    @GetMapping("/tasks-by-subject")
    public Map<String, Integer> tasksBySubject() {
        Map<String, Integer> data = new HashMap<>();

        taskRepo.findAll().forEach(task -> {
            String subject = task.getSubjectId() != null ? task.getSubjectId() : "Không có môn";
            data.put(subject, data.getOrDefault(subject, 0) + 1);
        });

        return data;
    }

    // ===== STUDY TREND (Created vs Completed) =====
    @GetMapping("/study-trend")
    public Map<String, Map<String, Integer>> studyTrend() {
        Map<String, Map<String, Integer>> data = new LinkedHashMap<>();
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat formatter = new SimpleDateFormat("M/d");
        List<Task> tasks = taskRepo.findAll();

        Map<String, Integer> createdByDate = new HashMap<>();
        Map<String, Integer> completedByDate = new HashMap<>();

        for (Task task : tasks) {
            if (task.getCreatedAt() != null) {
                String createdDate = formatter.format(task.getCreatedAt());
                createdByDate.put(createdDate, createdByDate.getOrDefault(createdDate, 0) + 1);
            }

            if (task.getCompletedAt() != null) {
                String completedDate = formatter.format(task.getCompletedAt());
                completedByDate.put(completedDate, completedByDate.getOrDefault(completedDate, 0) + 1);
            }
        }

        // Generate last 30 days
        for (int i = 29; i >= 0; i--) {
            Calendar point = (Calendar) cal.clone();
            point.add(Calendar.DATE, -i);
            String date = formatter.format(point.getTime());

            int created = createdByDate.getOrDefault(date, 0);
            int completed = completedByDate.getOrDefault(date, 0);
            
            Map<String, Integer> dayData = new HashMap<>();
            dayData.put("created", created);
            dayData.put("completed", completed);
            data.put(date, dayData);
        }

        return data;
    }

    // ===== PERFORMANCE DATA =====
    @GetMapping("/performance")
    public List<Map<String, Object>> performance() {
        List<Map<String, Object>> data = new ArrayList<>();
        
        long pending = taskRepo.findByStatus("PENDING").size();
        long completed = taskRepo.findByStatus("COMPLETED").size();
        long overdue = taskRepo.findByDeadlineBeforeAndStatusNot(new Date(), "COMPLETED").size();
        long total = taskRepo.count();

        data.add(createPerformanceItem("Quá hạn", (int) overdue));
        data.add(createPerformanceItem("Đang chờ", (int) pending));
        data.add(createPerformanceItem("Hoàn thành", (int) completed));
        data.add(createPerformanceItem("Tổng", (int) total));
        
        return data;
    }

    private int calculateTotalStudyMinutes(List<StudySession> sessions) {
        int total = 0;

        for (StudySession session : sessions) {
            if (session.getStartTime() != null && session.getEndTime() != null) {
                total += (int) ((session.getEndTime().getTime() - session.getStartTime().getTime()) / (1000 * 60));
            }
        }

        return total;
    }

    private long countActiveSubjects() {
        Set<String> subjects = new HashSet<>();

        taskRepo.findAll().forEach(task -> {
            if (task.getSubjectId() != null && !task.getSubjectId().isBlank()) {
                subjects.add(task.getSubjectId());
            }
        });

        sessionRepo.findAll().forEach(session -> {
            if (session.getSubjectId() != null && !session.getSubjectId().isBlank()) {
                subjects.add(session.getSubjectId());
            }
        });

        return subjects.size();
    }

    private Map<String, Object> createPerformanceItem(String subject, int value) {
        Map<String, Object> item = new HashMap<>();
        item.put("subject", subject);
        item.put("value", Math.max(30, value * 10));
        return item;
    }
}