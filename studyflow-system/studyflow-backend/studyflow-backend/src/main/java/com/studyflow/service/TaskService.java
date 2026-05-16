package com.studyflow.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.studyflow.model.Task;
import com.studyflow.repository.TaskRepository;
import java.util.Date;
@Service
public class TaskService {

    private final TaskRepository repo;
    private final SimpMessagingTemplate template;

    public TaskService(TaskRepository repo, SimpMessagingTemplate template) {
        this.repo = repo;
        this.template = template;
    }

    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    public Task createTask(Task task) {
        Task saved = repo.save(task);
        try {
            java.util.Map<String, Object> ev = new java.util.HashMap<>();
            ev.put("action", "created");
            ev.put("task", saved);
            template.convertAndSend("/topic/tasks", ev);
        } catch (Exception e) {
            // ignore messaging errors
        }
        return saved;
    }

    public void deleteTask(String id) {
        repo.deleteById(id);
        try {
            java.util.Map<String, Object> ev = new java.util.HashMap<>();
            ev.put("action", "deleted");
            ev.put("id", id);
            template.convertAndSend("/topic/tasks", ev);
        } catch (Exception e) {
            // ignore
        }
    }

    public List<Task> getByStatus(String status) {
    return repo.findByStatus(status);
}

public List<Task> getOverdue() {
    return repo.findByDeadlineBeforeAndStatusNot(new Date(), "COMPLETED");
}

public Task updateTask(String id, Task newTask) {
    Task old = repo.findById(id).orElseThrow();

    old.setTitle(newTask.getTitle());
    old.setDeadline(newTask.getDeadline());
    old.setPriority(newTask.getPriority());
    old.setStatus(newTask.getStatus());
    old.setSubjectId(newTask.getSubjectId());

    Task saved = repo.save(old);
    try {
        java.util.Map<String, Object> ev = new java.util.HashMap<>();
        ev.put("action", "updated");
        ev.put("task", saved);
        template.convertAndSend("/topic/tasks", ev);
    } catch (Exception e) {
        // ignore
    }
    return saved;
}
}