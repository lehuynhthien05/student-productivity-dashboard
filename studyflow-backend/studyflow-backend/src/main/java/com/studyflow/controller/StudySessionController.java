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

import com.studyflow.model.StudySession;
import com.studyflow.service.StudySessionService;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin
public class StudySessionController {

    private final StudySessionService service;

    public StudySessionController(StudySessionService service) {
        this.service = service;
    }

    // GET ALL
    @GetMapping
    public List<StudySession> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public StudySession getById(@PathVariable String id) {
        return service.getById(id);
    }

    // CREATE
    @PostMapping
    public StudySession create(@RequestBody StudySession s) {
        return service.create(s);
    }

    // UPDATE
    @PutMapping("/{id}")
    public StudySession update(@PathVariable String id, @RequestBody StudySession s) {
        return service.update(id, s);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    // GET BY SUBJECT
    @GetMapping("/subject/{subjectId}")
    public List<StudySession> getBySubject(@PathVariable String subjectId) {
        return service.getBySubject(subjectId);
    }
}