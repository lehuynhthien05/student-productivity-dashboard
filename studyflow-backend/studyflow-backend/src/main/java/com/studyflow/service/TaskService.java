package com.studyflow.service;

import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Service;

import com.studyflow.model.Task;
import com.studyflow.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository repo;

    public TaskService(TaskRepository repo) {
        this.repo = repo;
    }

    public List<Task> getAllTasks() {
        return repo.findAll();
    }

    public Task createTask(Task task) {
        Date now = new Date();

        if (task.getCreatedAt() == null) {
            task.setCreatedAt(now);
        }
        task.setUpdatedAt(now);

        if ("COMPLETED".equalsIgnoreCase(task.getStatus())) {
            task.setCompletedAt(task.getCompletedAt() != null ? task.getCompletedAt() : now);
        } else {
            task.setCompletedAt(null);
        }

        return repo.save(task);
    }

    public void deleteTask(String id) {
        repo.deleteById(id);
    }

    public List<Task> getByStatus(String status) {
    return repo.findByStatus(status);
}

public List<Task> getOverdue() {
    return repo.findByDeadlineBeforeAndStatusNot(new Date(), "COMPLETED");
}

public Task updateTask(String id, Task newTask) {
    Task old = repo.findById(id).orElseThrow();
    Date now = new Date();

    old.setTitle(newTask.getTitle());
    old.setDeadline(newTask.getDeadline());
    old.setPriority(newTask.getPriority());
    old.setStatus(newTask.getStatus());
    old.setSubjectId(newTask.getSubjectId());
    old.setCreatedAt(old.getCreatedAt() != null ? old.getCreatedAt() : now);
    old.setUpdatedAt(now);

    if ("COMPLETED".equalsIgnoreCase(newTask.getStatus())) {
        old.setCompletedAt(old.getCompletedAt() != null ? old.getCompletedAt() : now);
    } else {
        old.setCompletedAt(null);
    }

    return repo.save(old);
}
}