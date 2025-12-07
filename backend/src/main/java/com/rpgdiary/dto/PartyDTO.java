package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
public class PartyDTO {
    private Long id;
    private String name;
    private String description;
    private Set<Long> memberIds;
}
