package com.rpgdiary.model;

import static jakarta.persistence.GenerationType.IDENTITY;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "party_notable_date")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartyNotableDate {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "party_id", nullable = false)
    private Party party;

    @ManyToOne
    @JoinColumn(name = "calendar_type_code", nullable = false)
    private CalendarType calendarType;

    @Column(nullable = true)
    private Integer year;

    @Column(nullable = false)
    private int day;

    @Column(nullable = true)
    private Integer dayEnd;

    @Column(nullable = false, length = 255)
    private String eventName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean isRecurring = false;

    @Column(nullable = true)
    private Integer yearStart;

    @Column(nullable = true)
    private Integer yearEnd;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public static PartyNotableDateBuilder builder() {
        return new PartyNotableDateBuilder();
    }

    @NoArgsConstructor
    public static class PartyNotableDateBuilder {
        private Long id;
        private Party party;
        private CalendarType calendarType;
        private Integer year;
        private int day;
        private Integer dayEnd;
        private String eventName;
        private String description;
        private boolean isRecurring = false;
        private Integer yearStart;
        private Integer yearEnd;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PartyNotableDateBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PartyNotableDateBuilder party(Party party) {
            this.party = party;
            return this;
        }

        public PartyNotableDateBuilder calendarType(CalendarType calendarType) {
            this.calendarType = calendarType;
            return this;
        }

        public PartyNotableDateBuilder year(Integer year) {
            this.year = year;
            return this;
        }

        public PartyNotableDateBuilder day(Integer day) {
            this.day = day;
            return this;
        }

        public PartyNotableDateBuilder dayEnd(Integer dayEnd) {
            this.dayEnd = dayEnd;
            return this;
        }

        public PartyNotableDateBuilder eventName(String eventName) {
            this.eventName = eventName;
            return this;
        }

        public PartyNotableDateBuilder description(String description) {
            this.description = description;
            return this;
        }

        public PartyNotableDateBuilder isRecurring(boolean isRecurring) {
            this.isRecurring = isRecurring;
            return this;
        }

        public PartyNotableDateBuilder yearStart(Integer yearStart) {
            this.yearStart = yearStart;
            return this;
        }

        public PartyNotableDateBuilder yearEnd(Integer yearEnd) {
            this.yearEnd = yearEnd;
            return this;
        }

        public PartyNotableDateBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public PartyNotableDateBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public PartyNotableDate build() {
            return new PartyNotableDate(
                    id,
                    party,
                    calendarType,
                    year,
                    day,
                    dayEnd,
                    eventName,
                    description,
                    isRecurring,
                    yearStart,
                    yearEnd,
                    createdAt,
                    updatedAt);
        }
    }
}
