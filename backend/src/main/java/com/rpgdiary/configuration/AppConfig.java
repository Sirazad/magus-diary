package com.rpgdiary.configuration;

import com.rpgdiary.converter.CalendarConfigToDTOConverter;
import com.rpgdiary.converter.CalendarTypeToDTOConverter;
import com.rpgdiary.converter.ParticipantNotableDateToDTOConverter;
import com.rpgdiary.converter.ParticipantNotableEventToCalendarEventDtoConverter;
import com.rpgdiary.converter.ParticipantToDTOConverter;
import com.rpgdiary.converter.PartyNotableEventToCalendarEventDtoConverter;
import com.rpgdiary.dto.ParticipantNotableDateDTO;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.support.FormattingConversionService;

@Configuration
@AllArgsConstructor
public class AppConfig {

    private final CalendarConfigToDTOConverter calendarConfigToDTOConverter;
    private final CalendarTypeToDTOConverter calendarTypeToDTOConverter;
    private final ParticipantNotableEventToCalendarEventDtoConverter participantNotableEventToCalendarEventDtoConverter;
    private final PartyNotableEventToCalendarEventDtoConverter partyNotableEventToCalendarEventDtoConverter;
    private final ParticipantToDTOConverter participantToDTOConverter;
    private final ParticipantNotableDateToDTOConverter participantNotableDateToDTOConverter;

    @Bean
    @Lazy
    public FormattingConversionService converter() {
        FormattingConversionService conversionService = new FormattingConversionService();

        conversionService.addConverter(calendarConfigToDTOConverter);
        conversionService.addConverter(calendarTypeToDTOConverter);
        conversionService.addConverter(participantNotableEventToCalendarEventDtoConverter);
        conversionService.addConverter(partyNotableEventToCalendarEventDtoConverter);
        conversionService.addConverter(participantToDTOConverter);
        conversionService.addConverter(participantNotableDateToDTOConverter);

        return conversionService;
    }
}
