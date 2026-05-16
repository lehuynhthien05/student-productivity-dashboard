package com.studyflow.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "study_sessions")
public class StudySession {

    @Id
    private String id;

    private String subjectId;
    private Date startTime;
    private Date endTime;
}