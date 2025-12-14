package com.rpgdiary.converter;

import com.rpgdiary.dto.ParticipantNotableDateDTO;
import com.rpgdiary.model.ParticipantNotableDate;
import org.springframework.core.convert.converter.Converter;

public class ParticipantNotableDateToDTOConverter implements Converter<ParticipantNotableDate, ParticipantNotableDateDTO> {

    //TODO participantId?
    @Override
    public ParticipantNotableDateDTO convert(ParticipantNotableDate from) {
        Long participantId = from.getParticipant() != null ? from.getParticipant().getId() : null;
        String calendarTypeCode = from.getCalendarType() != null ? from.getCalendarType().getCode() : null;
        return ParticipantNotableDateDTO.builder()
                .id(from.getId())
                .participantId(participantId)
                .calendarTypeCode(calendarTypeCode)
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
