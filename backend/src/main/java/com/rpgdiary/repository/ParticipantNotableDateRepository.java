package com.rpgdiary.repository;

import com.rpgdiary.model.CalendarType;
import com.rpgdiary.model.Participant;
import com.rpgdiary.model.ParticipantNotableDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantNotableDateRepository extends JpaRepository<ParticipantNotableDate, Long> {

    List<ParticipantNotableDate> findByParticipantAndCalendarTypeAndYear(
            Participant participant, CalendarType calendarType, Integer year);

    List<ParticipantNotableDate> findByParticipantAndCalendarType(
            Participant participant, CalendarType calendarType);

    ParticipantNotableDate findByParticipantAndCalendarTypeAndYearAndDay(
            Participant participant, CalendarType calendarType, Integer year, int day);

    List<ParticipantNotableDate> findByCalendarTypeAndYearIsNullAndIsRecurringTrue(
            CalendarType calendarType);

    @Query("SELECT pnd FROM ParticipantNotableDate pnd " +
            "WHERE pnd.calendarType = :calendarType " +
            "AND pnd.yearStart <= :year AND pnd.yearEnd >= :year")
    List<ParticipantNotableDate> findByCalendarTypeAndYearIncluded(
            @Param("calendarType") CalendarType calendarType,
            @Param("year") Integer year);

    List<ParticipantNotableDate> findByParticipant(Participant participant);
}
