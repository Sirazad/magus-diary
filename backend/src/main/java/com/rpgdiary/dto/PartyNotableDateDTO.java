package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
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
}
