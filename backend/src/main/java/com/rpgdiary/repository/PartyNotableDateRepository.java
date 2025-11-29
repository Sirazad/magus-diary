package com.rpgdiary.repository;

import com.rpgdiary.model.CalendarType;
import com.rpgdiary.model.Party;
import com.rpgdiary.model.PartyNotableDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartyNotableDateRepository extends JpaRepository<PartyNotableDate, Long> {

    List<PartyNotableDate> findByPartyAndCalendarTypeAndYear(
            Party party, CalendarType calendarType, Integer year);

    List<PartyNotableDate> findByPartyAndCalendarType(
            Party party, CalendarType calendarType);

    PartyNotableDate findByPartyAndCalendarTypeAndYearAndDay(
            Party party, CalendarType calendarType, Integer year, int day);

    List<PartyNotableDate> findByCalendarTypeAndYearIsNullAndIsRecurringTrue(
            CalendarType calendarType);

    List<PartyNotableDate> findByParty(Party party);
}
