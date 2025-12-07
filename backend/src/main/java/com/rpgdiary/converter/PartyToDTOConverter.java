package com.rpgdiary.converter;

import com.rpgdiary.dto.PartyDTO;
import com.rpgdiary.model.Participant;
import com.rpgdiary.model.Party;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.convert.converter.Converter;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
public class PartyToDTOConverter implements Converter<Party, PartyDTO> {
    @Override
    public PartyDTO convert(Party from) {
        log.info("Converting Party entity with id {} to PartyDTO", from.getId());
        Set<Long> members = from.getMembers()
                .stream()
                .map(Participant::getId)
                .collect(Collectors.toSet());
        return PartyDTO.builder()
                .id(from.getId())
                .name(from.getName())
                .description(from.getDescription())
                .memberIds(members)
                .build();
    }
}
