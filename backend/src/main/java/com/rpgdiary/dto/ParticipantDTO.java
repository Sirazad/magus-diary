package com.rpgdiary.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ParticipantDTO {
    private Long id;
    private String name;
    private String type;
    private String description;
}
