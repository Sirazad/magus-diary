package com.rpgdiary.converter;

import org.jspecify.annotations.Nullable;
import org.springframework.core.convert.converter.Converter;

import com.rpgdiary.dto.ParticipantDTO;
import com.rpgdiary.model.Participant;

public class ParticipantDTOToParticipantConverter implements Converter<ParticipantDTO, Participant> {

    @Override
    public @Nullable Participant convert(ParticipantDTO from) {
        return Participant.builder()
                .id(from.getId())
                .description(from.getDescription())
                .name(from.getName())
                .type(from.getType())
                .build();
    }
}
