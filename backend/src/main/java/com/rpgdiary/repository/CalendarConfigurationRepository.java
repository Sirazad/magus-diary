package com.rpgdiary.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rpgdiary.model.CalendarConfiguration;
import com.rpgdiary.model.CalendarType;

@Repository
public interface CalendarConfigurationRepository extends JpaRepository<CalendarConfiguration, Long> {

    List<CalendarConfiguration> findByCalendarTypeOrderByMonthNumber(CalendarType calendarType);

    Optional<CalendarConfiguration> findByCalendarTypeAndMonthNumber(CalendarType calendarType, int monthNumber);

    List<CalendarConfiguration> findByCalendarType(CalendarType calendarType);

    Integer countByCalendarType(CalendarType calendarType);
}
