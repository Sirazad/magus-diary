package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class CalendarTypeDTO {
    private String code;
    private String name;
    private int daysPerYear;
    private int daysPerWeek;
}
