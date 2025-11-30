package com.rpgdiary.configuration;

import com.rpgdiary.converter.CalendarConfigToDTOConverter;
import com.rpgdiary.converter.CalendarTypeToDTOConverter;
import com.rpgdiary.converter.ParticipantNotableEventToCalendarEventDtoConverter;
import com.rpgdiary.converter.PartyNotableEventToCalendarEventDtoConverter;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.format.support.FormattingConversionService;

@Configuration
@AllArgsConstructor
public class AppConfig {

    private final CalendarConfigToDTOConverter calendarConfigToDTOConverter;
    private final CalendarTypeToDTOConverter calendarTypeToDTOConverter;
    private final ParticipantNotableEventToCalendarEventDtoConverter participantNotableEventToCalendarEventDtoConverter;
    private final PartyNotableEventToCalendarEventDtoConverter partyNotableEventToCalendarEventDtoConverter;


    @Bean
    @Lazy
    public FormattingConversionService converter() {
        FormattingConversionService conversionService = new FormattingConversionService();

        conversionService.addConverter(calendarConfigToDTOConverter);
        conversionService.addConverter(calendarTypeToDTOConverter);
        conversionService.addConverter(participantNotableEventToCalendarEventDtoConverter);
        conversionService.addConverter(partyNotableEventToCalendarEventDtoConverter);

        return conversionService;
    }
}
