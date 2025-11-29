package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEventDTO {
    private Integer id;
    private String eventName;
    private String description;
    private String type; // "holiday", "participant", "party"
    private String relatedEntity; // participant or party name
    private int dayStart;
    private Integer dayEnd;
    private boolean isRecurring;
}
