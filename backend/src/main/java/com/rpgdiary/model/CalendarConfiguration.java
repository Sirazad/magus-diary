package com.rpgdiary.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "calendar_configuration")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CalendarConfiguration {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name ="calendar_type_code", nullable = false)
    private CalendarType calendarType;

    @Column(nullable = false)
    private int monthNumber;

    @Column(nullable = false)
    private String monthName;

    @Column(nullable = false)
    private int dayStart;

    @Column(nullable = false)
    private int dayEnd;

    private String season;

    private String god;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
