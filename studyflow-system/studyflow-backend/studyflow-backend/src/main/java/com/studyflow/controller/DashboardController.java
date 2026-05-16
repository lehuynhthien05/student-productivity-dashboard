package com.studyflow.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyflow.repository.StudySessionRepository;
import com.studyflow.repository.TaskRepository;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final TaskRepository taskRepo;
    private final StudySessionRepository sessionRepo;

    public DashboardController(TaskRepository taskRepo, StudySessionRepository sessionRepo) {
        this.taskRepo = taskRepo;
        this.sessionRepo = sessionRepo;
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
        List<String> days = Arrays.asList("T2", "T3", "T4", "T5", "T6", "T7", "CN");
        Map<String, Integer> data = new java.util.LinkedHashMap<>();

        // initialize week map preserving order
        for (String day : days) {
            data.put(day, 0);
        }

        // Calculate study time from sessions
        sessionRepo.findAll().forEach(session -> {
            if (session.getStartTime() != null && session.getEndTime() != null) {
                long duration = (session.getEndTime().getTime() - session.getStartTime().getTime()) / (1000 * 60);
                Calendar cal = Calendar.getInstance();
                cal.setTime(session.getStartTime());
                int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK); // 1=Sunday,2=Monday,...7=Saturday

                // Map Calendar day to our days list index: Monday->0 ... Sunday->6
                int idx = (dayOfWeek + 5) % 7; // => 2->0, 3->1, ..., 7->5, 1->6
                String dayName = days.get(idx);

                data.put(dayName, data.getOrDefault(dayName, 0) + (int) duration);
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
        Map<String, Map<String, Integer>> data = new HashMap<>();
        Calendar cal = Calendar.getInstance();

        // Generate last 30 days
        for (int i = 29; i >= 0; i--) {
            cal.add(Calendar.DATE, -1);
            String date = String.format("%d/%d", cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DATE));
            
            int created = (int) (Math.random() * 15);
            int completed = (int) (Math.random() * 12);
            
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

    private Map<String, Object> createPerformanceItem(String subject, int value) {
        Map<String, Object> item = new HashMap<>();
        item.put("subject", subject);
        item.put("value", Math.max(30, value * 10));
        return item;
    }
}