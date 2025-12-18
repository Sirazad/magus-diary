package com.rpgdiary.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PartyDTO {
    private Long id;
    private String name;
    private String description;
    private Set<Long> memberIds;
}
