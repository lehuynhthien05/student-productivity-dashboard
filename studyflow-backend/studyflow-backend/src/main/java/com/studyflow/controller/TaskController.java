package com.studyflow.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyflow.model.Task;
import com.studyflow.service.TaskService;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    // GET ALL
    @GetMapping
    public List<Task> getAll() {
        return service.getAllTasks();
    }

    // CREATE
    @PostMapping
    public Task create(@RequestBody Task task) {
        return service.createTask(task);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Task update(@PathVariable String id, @RequestBody Task task) {
        return service.updateTask(id, task);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.deleteTask(id);
    }

    // FILTER BY STATUS
    @GetMapping("/status/{status}")
    public List<Task> getByStatus(@PathVariable String status) {
        return service.getByStatus(status);
    }

    // OVERDUE
    @GetMapping("/overdue")
    public List<Task> getOverdue() {
        return service.getOverdue();
    }
}