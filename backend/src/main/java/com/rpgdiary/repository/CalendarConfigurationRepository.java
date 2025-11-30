package com.rpgdiary.repository;

import com.rpgdiary.model.CalendarConfiguration;
import com.rpgdiary.model.CalendarType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CalendarConfigurationRepository extends JpaRepository<CalendarConfiguration, Long> {

    List<CalendarConfiguration> findByCalendarTypeOrderByMonthNumber(CalendarType calendarType);

    Optional<CalendarConfiguration> findByCalendarTypeAndMonthNumber(CalendarType calendarType, int monthNumber);

    List<CalendarConfiguration> findByCalendarType(CalendarType calendarType);
}
