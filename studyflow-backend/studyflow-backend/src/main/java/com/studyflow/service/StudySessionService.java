package com.studyflow.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.studyflow.model.StudySession;
import com.studyflow.repository.StudySessionRepository;

@Service
public class StudySessionService {

    private final StudySessionRepository repo;

    public StudySessionService(StudySessionRepository repo) {
        this.repo = repo;
    }

    public List<StudySession> getAll() {
        return repo.findAll();
    }

    public StudySession getById(String id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("StudySession not found"));
    }

    public StudySession create(StudySession s) {
        return repo.save(s);
    }

    public StudySession update(String id, StudySession newSession) {
        StudySession session = repo.findById(id).orElseThrow(() -> new RuntimeException("StudySession not found"));
        session.setSubjectId(newSession.getSubjectId());
        session.setStartTime(newSession.getStartTime());
        session.setEndTime(newSession.getEndTime());
        return repo.save(session);
    }

    public void delete(String id) {
        repo.deleteById(id);
    }

    public List<StudySession> getBySubject(String subjectId) {
        return repo.findBySubjectId(subjectId);
    }
}