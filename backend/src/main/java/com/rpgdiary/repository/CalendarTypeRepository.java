package com.rpgdiary.repository;

import com.rpgdiary.model.CalendarType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarTypeRepository extends JpaRepository<CalendarType, String> {

    CalendarType findByCode(String code);

    List<CalendarType> findAllByOrderByCode();
}
