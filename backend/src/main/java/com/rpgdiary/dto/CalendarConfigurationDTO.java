package com.rpgdiary.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CalendarConfigurationDTO {
    private Long id;
    private String calendarTypeCodeName;
    private String calendarTypeCode;
    private int monthNumber;
    private String monthName;
    private int dayStart;
    private int dayEnd;
    private String season;
    private String god;
}
