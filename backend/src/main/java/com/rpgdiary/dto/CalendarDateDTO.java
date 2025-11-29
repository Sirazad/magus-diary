package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalendarDateDTO {
    private String calendarTypeCode;
    private int year;
    private int day;
    private int dayOfWeek;
    private String monthName;
    private int monthNumber;
    private String season;
    private String godName;
    private List<CalendarEventDTO> holidays;
    private List<CalendarEventDTO> participantNotableDates;
    private List<CalendarEventDTO> partyNotableDates;
}
