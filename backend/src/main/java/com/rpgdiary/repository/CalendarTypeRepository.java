package com.rpgdiary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rpgdiary.model.CalendarType;

@Repository
public interface CalendarTypeRepository extends JpaRepository<CalendarType, String> {

    CalendarType findByCode(String code);

    List<CalendarType> findAllByOrderByCode();
}
