package com.rpgdiary.converter;

import org.springframework.core.convert.converter.Converter;

import com.rpgdiary.dto.CalendarEventDTO;
import com.rpgdiary.model.ParticipantNotableDate;

public class ParticipantNotableEventToCalendarEventDtoConverter
        implements Converter<ParticipantNotableDate, CalendarEventDTO> {

    @Override
    public CalendarEventDTO convert(ParticipantNotableDate from) {
        return CalendarEventDTO.builder()
                .id(from.getId())
                .eventName(from.getEventName())
                .description(from.getDescription())
                .type(from.getCalendarType().getCode())
                .dayStart(from.getDay())
                .dayEnd(from.getDayEnd())
                .isRecurring(from.isRecurring())
                .build();
    }
}
