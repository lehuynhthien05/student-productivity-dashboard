package com.studyflow.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.studyflow.model.Task;

import java.util.Date;


public interface TaskRepository extends MongoRepository<Task, String> {
// filter theo status
    List<Task> findByStatus(String status);

    // overdue tasks
    List<Task> findByDeadlineBeforeAndStatusNot(Date date, String status);
}