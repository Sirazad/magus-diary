package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantDTO {
    private Integer id;
    private String name;
    private String type;
    private String description;
}
