package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartyDTO {
    private Integer id;
    private String name;
    private String description;
    private Set<Integer> memberIds;
}
