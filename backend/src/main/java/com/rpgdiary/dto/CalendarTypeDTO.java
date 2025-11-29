package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalendarTypeDTO {
    private String code;
    private String name;
    private int daysPerYear;
    private int daysPerWeek;
}
