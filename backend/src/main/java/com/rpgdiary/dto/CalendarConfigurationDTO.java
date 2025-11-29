package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalendarConfigurationDTO {
    private Integer id;
    private String calendarTypeCode;
    private int monthNumber;
    private String monthName;
    private int dayStart;
    private int dayEnd;
    private String season;
    private String god;
}
