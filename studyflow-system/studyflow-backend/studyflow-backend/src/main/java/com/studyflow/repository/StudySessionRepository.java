package com.studyflow.repository;

import com.studyflow.model.StudySession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface StudySessionRepository extends MongoRepository<StudySession, String> {

    List<StudySession> findBySubjectId(String subjectId);
}