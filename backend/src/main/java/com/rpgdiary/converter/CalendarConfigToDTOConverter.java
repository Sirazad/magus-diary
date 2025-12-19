package com.rpgdiary.converter;

import org.jspecify.annotations.Nullable;
import org.springframework.core.convert.converter.Converter;

import com.rpgdiary.dto.CalendarConfigurationDTO;
import com.rpgdiary.model.CalendarConfiguration;

public class CalendarConfigToDTOConverter implements Converter<CalendarConfiguration, CalendarConfigurationDTO> {

    @Override
    public @Nullable CalendarConfigurationDTO convert(CalendarConfiguration from) {
        return CalendarConfigurationDTO.builder()
                .id(from.getId())
                .god(from.getGod())
                .calendarTypeCode(from.getCalendarType().getCode())
                .calendarTypeCodeName(from.getCalendarType().getName())
                .dayEnd(from.getDayEnd())
                .dayStart(from.getDayStart())
                .season(from.getSeason())
                .monthName(from.getMonthName())
                .monthNumber(from.getMonthNumber())
                .build();
    }
}
