package com.rpgdiary.converter;

import org.springframework.core.convert.converter.Converter;

import com.rpgdiary.dto.CalendarEventDTO;
import com.rpgdiary.model.PartyNotableDate;

public class PartyNotableEventToCalendarEventDtoConverter implements Converter<PartyNotableDate, CalendarEventDTO> {

    @Override
    public CalendarEventDTO convert(PartyNotableDate from) {
        return CalendarEventDTO.builder()
                .id(from.getId())
                .eventName(from.getEventName())
                .type(from.getCalendarType().getCode())
                .description(from.getDescription())
                .dayStart(from.getDay())
                .dayEnd(from.getDayEnd())
                .isRecurring(from.isRecurring())
                .build();
    }
}
