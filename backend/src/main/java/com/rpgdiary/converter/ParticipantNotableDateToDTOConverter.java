package com.rpgdiary.converter;

import com.rpgdiary.dto.ParticipantNotableDateDTO;
import com.rpgdiary.model.ParticipantNotableDate;
import org.springframework.core.convert.converter.Converter;

public class ParticipantNotableDateToDTOConverter implements Converter<ParticipantNotableDate, ParticipantNotableDateDTO> {

    //TODO participantId?
    @Override
    public ParticipantNotableDateDTO convert(ParticipantNotableDate from) {
        return ParticipantNotableDateDTO.builder()
                .id(from.getId())
//                .participantId(from.getPartycipant().getId())
                .calendarTypeCode(from.getCalendarType().getCode())
                .year(from.getYear())
                .day(from.getDay())
                .dayEnd(from.getDayEnd())
                .eventName(from.getEventName())
                .description(from.getDescription())
                .isRecurring(from.isRecurring())
                .yearStart(from.getYearStart())
                .yearEnd(from.getYearEnd())
                .build();
    }
}
