package com.rpgdiary.repository;

import com.rpgdiary.model.CalendarType;
import com.rpgdiary.model.ParticipantNotableDate;
import com.rpgdiary.model.Party;
import com.rpgdiary.model.PartyNotableDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartyNotableDateRepository extends JpaRepository<PartyNotableDate, Long>, QuerydslPredicateExecutor<PartyNotableDate> {

    List<PartyNotableDate> findByPartyAndCalendarTypeAndYear(
            Party party, CalendarType calendarType, Integer year);

    List<PartyNotableDate> findByPartyAndCalendarType(
            Party party, CalendarType calendarType);

    PartyNotableDate findByPartyAndCalendarTypeAndYearAndDay(
            Party party, CalendarType calendarType, Integer year, int day);

    List<PartyNotableDate> findByCalendarTypeAndYearIsNullAndIsRecurringTrue(
            CalendarType calendarType);

    List<PartyNotableDate> findByParty(Party party);

    @Query("SELECT pnd FROM PartyNotableDate pnd " +
            "WHERE pnd.calendarType = :calendarType " +
            "AND pnd.yearStart <= :year AND pnd.yearEnd >= :year")
    List<? extends PartyNotableDate> findByCalendarTypeAndYearIncluded(
            @Param("calendarType") CalendarType calendarType,
            @Param("year") Integer year);
}
