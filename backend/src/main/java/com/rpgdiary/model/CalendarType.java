package com.rpgdiary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "calendar_types")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CalendarType {

    @Id
    @Column(length = 50)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private int daysPerWeek;

    @Column(nullable = false)
    private int daysPerYear;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
