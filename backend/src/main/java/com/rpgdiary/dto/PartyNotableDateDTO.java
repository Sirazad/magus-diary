package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartyNotableDateDTO {
    private Integer id;
    private Integer partyId;
    private String calendarTypeCode;
    private Integer year;
    private int day;
    private Integer dayEnd;
    private String eventName;
    private String description;
    private boolean isRecurring;
    private Integer yearStart;
    private Integer yearEnd;
}