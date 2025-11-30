package com.rpgdiary.converter;

import com.rpgdiary.dto.CalendarEventDTO;
import com.rpgdiary.model.PartyNotableDate;
import org.springframework.core.convert.converter.Converter;

public class PartyNotableEventToCalendarEventDtoConverter implements Converter<PartyNotableDate, CalendarEventDTO>  {

    @Override
    public CalendarEventDTO convert(PartyNotableDate from) {
        return CalendarEventDTO.builder()
                .id(from.getId())
                .eventName(from.getEventName())
                .description(from.getDescription())
                .type(from.getCalendarType().getCode())
                .description(from.getDescription())
                .dayStart(from.getDay())
                .dayEnd(from.getDayEnd())
                .isRecurring(from.isRecurring())
                .build();
    }
}
