package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartyNotableDateDTO {
    private Long id;
    private Long partyId;
    private String calendarTypeCode;
    private Integer year;
    private int day;
    private Integer dayEnd;
    private String eventName;
    private String description;
    private boolean isRecurring;
    private Integer yearStart;
    private Integer yearEnd;

    public static Builder build() {
        return new Builder();
    }

    @NoArgsConstructor
    public static class Builder {
        private Long id;
        private Long partyId;
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

        public Builder partyId(Long partyId) {
            this.partyId = partyId;
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

        public PartyNotableDateDTO build() {
            return new PartyNotableDateDTO(
                    id,
                    partyId,
                    calendarTypeCode,
                    year,
                    day,
                    dayEnd,
                    eventName,
                    description,
                    isRecurring,
                    yearStart,
                    yearEnd);
        }
    }
}
