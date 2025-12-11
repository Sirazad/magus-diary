package com.rpgdiary.configuration;

import com.rpgdiary.converter.CalendarConfigToDTOConverter;
import com.rpgdiary.converter.CalendarTypeToDTOConverter;
import com.rpgdiary.converter.ParticipantDTOToParticipantConverter;
import com.rpgdiary.converter.ParticipantNotableDateToDTOConverter;
import com.rpgdiary.converter.ParticipantNotableEventToCalendarEventDtoConverter;
import com.rpgdiary.converter.ParticipantToDTOConverter;
import com.rpgdiary.converter.PartyNotableDateToDTOConverter;
import com.rpgdiary.converter.PartyNotableEventToCalendarEventDtoConverter;
import com.rpgdiary.converter.PartyToDTOConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.format.support.FormattingConversionService;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig {

    private final CalendarConfigToDTOConverter calendarConfigToDTOConverter = new CalendarConfigToDTOConverter();
    private final CalendarTypeToDTOConverter calendarTypeToDTOConverter = new CalendarTypeToDTOConverter();
    private final ParticipantNotableEventToCalendarEventDtoConverter participantNotableEventToCalendarEventDtoConverter = new ParticipantNotableEventToCalendarEventDtoConverter();
    private final PartyNotableEventToCalendarEventDtoConverter partyNotableEventToCalendarEventDtoConverter = new PartyNotableEventToCalendarEventDtoConverter();
    private final ParticipantToDTOConverter participantToDTOConverter = new ParticipantToDTOConverter();
    private final ParticipantNotableDateToDTOConverter participantNotableDateToDTOConverter = new ParticipantNotableDateToDTOConverter();
    private final PartyToDTOConverter partyToDTOConverter = new PartyToDTOConverter();
    private final ParticipantDTOToParticipantConverter participantDTOToParticipantConverter = new ParticipantDTOToParticipantConverter();
    private final PartyNotableDateToDTOConverter partyNotableDateToDTOConverter = new PartyNotableDateToDTOConverter();

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
        conversionService.addConverter(participantDTOToParticipantConverter);
        conversionService.addConverter(partyNotableDateToDTOConverter);

        return conversionService;
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}
