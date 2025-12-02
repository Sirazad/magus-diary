package com.rpgdiary.converter;

import com.rpgdiary.dto.ParticipantDTO;
import com.rpgdiary.model.Participant;
import org.jspecify.annotations.Nullable;
import org.springframework.core.convert.converter.Converter;

public class ParticipantToDTOConverter implements Converter<Participant, ParticipantDTO> {

    @Override
    public @Nullable ParticipantDTO convert(Participant from) {
        return ParticipantDTO.builder()
                .id(from.getId())
                .description(from.getDescription())
                .name(from.getName())
                .type(from.getType())
                .build();
    }
}
