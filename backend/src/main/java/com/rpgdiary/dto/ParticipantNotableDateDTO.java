package com.rpgdiary.dto;

import com.rpgdiary.model.PartyNotableDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantNotableDateDTO {
    private Long id;
    private Long participantId;
    private String calendarTypeCode;
    private Integer year;
    private int day;
    private Integer dayEnd;
    private String eventName;
    private String description;
    private boolean isRecurring;
    private Integer yearStart;
    private Integer yearEnd;

    public static Builder builder() {
        return new Builder();
    }

    @NoArgsConstructor
    public static class Builder {
        private Long id;
        private Long participantId;
        private String calendarTypeCode;
        private Integer year;
        private int day;
        private Integer dayEnd;
        private String eventName;
        private String description;
        private boolean isRecurring;
        private Integer yearStart;
        private Integer yearEnd;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder participantId(Long participantId) {
            this.participantId = participantId;
            return this;
        }

        public Builder calendarTypeCode(String calendarTypeCode) {
            this.calendarTypeCode = calendarTypeCode;
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

        public Builder dayEnd(Integer dayEnd) {
            this.dayEnd = dayEnd;
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

        public Builder yearStart(Integer yearStart) {
            this.yearStart = yearStart;
            return this;
        }

        public Builder yearEnd(Integer yearEnd) {
            this.yearEnd = yearEnd;
            return this;
        }

        public ParticipantNotableDateDTO build() {
            return new ParticipantNotableDateDTO(
                    id,
                    participantId,
                    calendarTypeCode,
                    year,
                    day,
                    dayEnd,
                    eventName,
                    description,
                    isRecurring,
                    yearStart,
                    yearEnd
            );
        }
    }
}