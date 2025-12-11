package com.rpgdiary.converter;

import com.rpgdiary.dto.PartyNotableDateDTO;
import com.rpgdiary.model.PartyNotableDate;
import org.jspecify.annotations.Nullable;
import org.springframework.core.convert.converter.Converter;

public class PartyNotableDateToDTOConverter implements Converter<PartyNotableDate, PartyNotableDateDTO> {
    @Override
    public @Nullable PartyNotableDateDTO convert(PartyNotableDate from) {
        return PartyNotableDateDTO.build()
                .id(from.getId())
                .day(from.getDay())
                .year(from.getYear())
                .dayEnd(from.getDayEnd())
                .yearEnd(from.getYearEnd())
                .yearStart(from.getYearStart())
                .eventName(from.getEventName())
                .description(from.getDescription())
                .isRecurring(from.isRecurring())
                .partyId(from.getParty() != null ? from.getParty().getId() : null)
                .calendarTypeCode(from.getCalendarType() != null ? from.getCalendarType().getCode() : null)
                .build();
    }
}