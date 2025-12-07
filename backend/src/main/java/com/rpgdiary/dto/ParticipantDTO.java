package com.rpgdiary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantDTO {
    private Long id;
    private String name;
    private String type;
    private String description;


    public static ParticipantDTOBuilder builder() {
        return new ParticipantDTOBuilder();
    }

    public static class ParticipantDTOBuilder {
        private Long id;
        private String name;
        private String type;
        private String description;

        public ParticipantDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ParticipantDTOBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ParticipantDTOBuilder type(String type) {
            this.type = type;
            return this;
        }

        public ParticipantDTOBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ParticipantDTO build() {
            return new ParticipantDTO(id, name, type, description);
        }
    }
}
