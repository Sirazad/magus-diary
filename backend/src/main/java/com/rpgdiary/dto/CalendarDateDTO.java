package com.rpgdiary.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
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