package com.studyflow.model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "tasks")
public class Task {

    @Id
    private String id;

    private String title;
    private Date deadline;
    private String priority;
    private String status;
    private String subjectId;
    private Date createdAt;
    private Date updatedAt;
    private Date completedAt;
}