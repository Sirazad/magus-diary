package com.rpgdiary.repository;

import com.rpgdiary.model.CalendarType;
import com.rpgdiary.model.Participant;
import com.rpgdiary.model.ParticipantNotableDate;
import org.springframework.data.jpa.repository.JpaRepository;
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

    List<ParticipantNotableDate> findByParticipant(Participant participant);

}
