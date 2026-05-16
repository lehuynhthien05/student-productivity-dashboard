package com.studyflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.studyflow.model.Subject;
import com.studyflow.repository.SubjectRepository;

@Service
public class SubjectService {

    private final SubjectRepository repo;

    public SubjectService(SubjectRepository repo) {
        this.repo = repo;
    }

    public List<Subject> getAll() {
        return repo.findAll();
    }

    public Subject getById(String id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Subject not found"));
    }

    public Subject create(Subject subject) {
        return repo.save(subject);
    }

    public Subject update(String id, Subject newSubject) {
        Subject subject = repo.findById(id).orElseThrow(() -> new RuntimeException("Subject not found"));
        subject.setName(newSubject.getName());
        return repo.save(subject);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}