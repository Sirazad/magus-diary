package com.rpgdiary.service;

import com.rpgdiary.dto.CalendarConfigurationDTO;
import com.rpgdiary.dto.CalendarDateDTO;
import com.rpgdiary.dto.CalendarTypeDTO;

import java.util.List;

public interface CalendarService {


    List<CalendarTypeDTO> getAllCalendarTypes();

    CalendarTypeDTO getCalendarTypeByCode(String code);

    List<CalendarConfigurationDTO> getCalendarConfiguration(String calendarTypeCode);

    CalendarConfigurationDTO getMonthConfiguration(String calendarTypeCode, int monthNumber);

    CalendarDateDTO getCalendarDate(String calendarTypeCode, int year, int day);

    Integer getMonthCountForCalendarType(String code);
}
