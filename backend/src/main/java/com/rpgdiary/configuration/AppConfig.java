package com.rpgdiary.configuration;

import com.rpgdiary.converter.CalendarConfigToDTOConverter;
import com.rpgdiary.converter.CalendarTypeToDTOConverter;
import com.rpgdiary.converter.ParticipantNotableDateToDTOConverter;
import com.rpgdiary.converter.ParticipantNotableEventToCalendarEventDtoConverter;
import com.rpgdiary.converter.ParticipantToDTOConverter;
import com.rpgdiary.converter.PartyNotableEventToCalendarEventDtoConverter;
import com.rpgdiary.converter.PartyToDTOConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.format.support.FormattingConversionService;

@Configuration
public class AppConfig {

    private final CalendarConfigToDTOConverter calendarConfigToDTOConverter = new CalendarConfigToDTOConverter();
    private final CalendarTypeToDTOConverter calendarTypeToDTOConverter = new CalendarTypeToDTOConverter();
    private final ParticipantNotableEventToCalendarEventDtoConverter participantNotableEventToCalendarEventDtoConverter = new ParticipantNotableEventToCalendarEventDtoConverter();
    private final PartyNotableEventToCalendarEventDtoConverter partyNotableEventToCalendarEventDtoConverter = new PartyNotableEventToCalendarEventDtoConverter();
    private final ParticipantToDTOConverter participantToDTOConverter = new ParticipantToDTOConverter();
    private final ParticipantNotableDateToDTOConverter participantNotableDateToDTOConverter = new ParticipantNotableDateToDTOConverter();
    private final PartyToDTOConverter partyToDTOConverter = new PartyToDTOConverter();

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
        conversionService.addConverter(partyToDTOConverter);

        return conversionService;
    }
}
