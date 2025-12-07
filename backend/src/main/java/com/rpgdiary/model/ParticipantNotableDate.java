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
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "participant_notable_date")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantNotableDate {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;

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

    public static Builder builder() {
        return new ParticipantNotableDate.Builder();
    }


    public static class Builder {
        private Long id;
        private Participant participant;
        private CalendarType calendarType;
        private Integer year;
        private int day;
        private Integer dayEnd;
        private String eventName;
        private String description;
        private boolean isRecurring = false;
        private Integer yearStart;
        private Integer yearEnd;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder participant(Participant participant) {
            this.participant = participant;
            return this;
        }

        public Builder dayEnd (Integer dayEnd) {
            this.dayEnd = dayEnd;
            return this;
        }

        public Builder calendarType(CalendarType calendarType) {
            this.calendarType = calendarType;
            return this;
        }

        public Builder eventName(String eventName) {
            this.eventName = eventName;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder isRecurring(boolean isRecurring) {
            this.isRecurring = isRecurring;
            return this;
        }

        public Builder yearEnd(Integer yearEnd) {
            this.yearEnd = yearEnd;
            return this;
        }

        public Builder yearStart(Integer yearStart) {
            this.yearStart = yearStart;
            return this;
        }

        public Builder year(Integer year) {
            this.year = year;
            return this;
        }

        public Builder day(int day) {
            this.day = day;
            return this;
        }

        public ParticipantNotableDate build() {
            ParticipantNotableDate date = new ParticipantNotableDate();
            date.setId(this.id);
            date.setParticipant(this.participant);
            date.setCalendarType(this.calendarType);
            date.setYear(this.year);
            date.setDay(this.day);
            date.setDayEnd(this.dayEnd);
            date.setEventName(this.eventName);
            date.setDescription(this.description);
            date.setRecurring(this.isRecurring);
            date.setYearStart(this.yearStart);
            date.setYearEnd(this.yearEnd);
            return date;}
    }
}