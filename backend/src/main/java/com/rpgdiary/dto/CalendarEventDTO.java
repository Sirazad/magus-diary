package com.rpgdiary.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CalendarEventDTO {
    private Long id;
    private Long partyId;
    private String eventName;
    private String description;
    private String type;
    private String relatedEntity;
    private int dayStart;
    private Integer dayEnd;
    private boolean isRecurring;
}
