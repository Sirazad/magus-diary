package com.rpgdiary.service;

import com.rpgdiary.dto.CalendarConfigurationDTO;
import com.rpgdiary.dto.CalendarDateDTO;
import com.rpgdiary.dto.CalendarEventDTO;
import com.rpgdiary.dto.CalendarTypeDTO;
import com.rpgdiary.exception.CalendarNotFoundException;
import com.rpgdiary.model.CalendarConfiguration;
import com.rpgdiary.model.CalendarType;
import com.rpgdiary.model.ParticipantNotableDate;
import com.rpgdiary.model.PartyNotableDate;
import com.rpgdiary.repository.CalendarConfigurationRepository;
import com.rpgdiary.repository.CalendarTypeRepository;
import com.rpgdiary.repository.ParticipantNotableDateRepository;
import com.rpgdiary.repository.PartyNotableDateRepository;
import lombok.AllArgsConstructor;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CalendarServiceImpl implements CalendarService {

    private final CalendarTypeRepository calendarTypeRepository;
    private final CalendarConfigurationRepository calendarConfigurationRepository;
    private final ParticipantNotableDateRepository participantNotableDateRepository;
    private final PartyNotableDateRepository partyNotableDateRepository;
    private final ConversionService converter;

    @Override
    public List<CalendarTypeDTO> getAllCalendarTypes() {
        return calendarTypeRepository.findAllByOrderByCode()
                .stream()
                .map(this::convert)
                .toList();
    }

    @Override
    public CalendarTypeDTO getCalendarTypeByCode(String code) {
        return convert(calendarTypeRepository.findById(code)
                .orElseThrow(() -> new CalendarNotFoundException(code))
        );

    }

    @Override
    public List<CalendarConfigurationDTO> getCalendarConfiguration(String calendarTypeCode) {
        CalendarType calendarType = calendarTypeRepository.findById(calendarTypeCode)
                .orElseThrow(() -> new CalendarNotFoundException(calendarTypeCode));

        return calendarConfigurationRepository.findByCalendarTypeOrderByMonthNumber(calendarType)
                .stream()
                .map(this::convert)
                .toList();
    }

    @Override
    public CalendarConfigurationDTO getMonthConfiguration(String calendarTypeCode, int monthNumber) {
        CalendarType calendarType = calendarTypeRepository.findById(calendarTypeCode)
                .orElseThrow(() -> new CalendarNotFoundException(calendarTypeCode));

        return convert(calendarConfigurationRepository
                .findByCalendarTypeAndMonthNumber(calendarType, monthNumber)
                .orElseThrow(() -> new java.util.NoSuchElementException(
                        "Month configuration not found for calendar: " + calendarTypeCode +
                                ", month: " + monthNumber
                )));
    }

    @Override
    public CalendarDateDTO getCalendarDate(String calendarTypeCode, int year, int day) {
        CalendarType calendarType = calendarTypeRepository.findById(calendarTypeCode)
                .orElseThrow(() -> new CalendarNotFoundException(calendarTypeCode));

        if (day < 1 || day > calendarType.getDaysPerYear()) {
            throw new IllegalArgumentException(
                    "Day " + day + " is outside calendar range (1-" + calendarType.getDaysPerYear() + ")"
            );
        }

        CalendarConfiguration calendarConfiguration = calendarConfigurationRepository
                .findByCalendarType(calendarType)
                .stream()
                .filter(config -> day >= config.getDayStart() && day <= config.getDayEnd())
                .findFirst()
                .orElseThrow(() -> new java.util.NoSuchElementException(
                        "Month configuration not found for day: " + day
                ));

        int dayOfWeek = ((day - 1) % calendarType.getDaysPerWeek()) + 1;

        List<CalendarEventDTO> holidays = getHolidaysForDate(calendarType, year, day);
        List<CalendarEventDTO> participantEvents = getParticipantEventsForDate(calendarType, year, day);
        List<CalendarEventDTO> partyEvents = getPartyEventsForDate(calendarType, year, day);

        return CalendarDateDTO.builder()
                .calendarTypeCode(calendarTypeCode)
                .year(year)
                .day(day)
                .dayOfWeek(dayOfWeek)
                .monthName(calendarConfiguration.getMonthName())
                .monthNumber(calendarConfiguration.getMonthNumber())
                .season(calendarConfiguration.getSeason())
                .godName(calendarConfiguration.getGod())
                .holidays(holidays)
                .participantNotableDates(participantEvents)
                .partyNotableDates(partyEvents)
                .build();
    }

    private List<CalendarEventDTO> getHolidaysForDate(CalendarType calendarType, int year, int day) {
        List<ParticipantNotableDate> holidays = participantNotableDateRepository
                .findByCalendarTypeAndYearIsNullAndIsRecurringTrue(calendarType);

        List<ParticipantNotableDate> holidaysWithYear = participantNotableDateRepository
                .findByCalendarTypeAndYearIncluded(calendarType, year);

        holidays.addAll(holidaysWithYear);

        return holidays.stream()
                .filter(h -> isDateInRange(day, h.getDay(), h.getDayEnd()))
                .map(this::convert)
                .toList();
    }

    private List<CalendarEventDTO> getParticipantEventsForDate(CalendarType calendarType, int year, int day) {
        List<ParticipantNotableDate> events = participantNotableDateRepository
                .findByCalendarTypeAndYearIsNullAndIsRecurringTrue(calendarType);

        events.addAll(participantNotableDateRepository
                .findByCalendarTypeAndYearIncluded(calendarType, year));

        return events.stream()
                .filter(event -> event.getYear() == null || event.getYear() == year)
                .filter(event -> isDateInRange(day, event.getDay(), event.getDayEnd()))
                .map(this::convert)
                .toList();
    }

    private List<CalendarEventDTO> getPartyEventsForDate(CalendarType calendarType, int year, int day) {
        List<PartyNotableDate> events = partyNotableDateRepository
                .findByCalendarTypeAndYearIsNullAndIsRecurringTrue(calendarType);

        events.addAll(partyNotableDateRepository
                .findByCalendarTypeAndYearIncluded(calendarType, year));

        return events.stream()
                .filter(event -> isDateInRange(day, event.getDay(), event.getDayEnd()))
                .map(this::convert)
                .toList();
    }

    private boolean isDateInRange(int day, int dayStart, Integer dayEnd) {
        if (dayEnd == null) {
            return day == dayStart;
        }
        return day >= dayStart && day <= dayEnd;
    }

    private CalendarConfigurationDTO convert(CalendarConfiguration source) {
        return converter.convert(source, CalendarConfigurationDTO.class);
    }

    private CalendarTypeDTO convert(CalendarType source) {
        return converter.convert(source, CalendarTypeDTO.class);
    }

    private CalendarEventDTO convert(ParticipantNotableDate source) {
        return converter.convert(source, CalendarEventDTO.class);
    }

    private CalendarEventDTO convert(PartyNotableDate source) {
        return converter.convert(source, CalendarEventDTO.class);
    }
}