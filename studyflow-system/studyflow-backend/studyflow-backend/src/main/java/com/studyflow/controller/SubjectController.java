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

import com.studyflow.model.Subject;
import com.studyflow.service.SubjectService;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin
public class SubjectController {

    private final SubjectService service;

    public SubjectController(SubjectService service) {
        this.service = service;
    }

    // GET ALL
    @GetMapping
    public List<Subject> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Subject getById(@PathVariable String id) {
        return service.getById(id);
    }

    // CREATE
    @PostMapping
    public Subject create(@RequestBody Subject subject) {
        return service.create(subject);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Subject update(@PathVariable String id, @RequestBody Subject subject) {
        return service.update(id, subject);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}