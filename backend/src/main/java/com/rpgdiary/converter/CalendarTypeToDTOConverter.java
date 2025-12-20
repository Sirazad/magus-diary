package com.rpgdiary.converter;

import org.jspecify.annotations.Nullable;
import org.springframework.core.convert.converter.Converter;

import com.rpgdiary.dto.CalendarTypeDTO;
import com.rpgdiary.model.CalendarType;

public class CalendarTypeToDTOConverter implements Converter<CalendarType, CalendarTypeDTO> {
    @Override
    public @Nullable CalendarTypeDTO convert(CalendarType from) {
        return CalendarTypeDTO.builder()
                .code(from.getCode())
                .name(from.getName())
                .daysPerWeek(from.getDaysPerWeek())
                .daysPerYear(from.getDaysPerYear())
                .build();
    }
}
