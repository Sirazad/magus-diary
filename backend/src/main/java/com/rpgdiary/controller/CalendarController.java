package com.rpgdiary.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rpgdiary.dto.CalendarConfigurationDTO;
import com.rpgdiary.dto.CalendarDateDTO;
import com.rpgdiary.dto.CalendarTypeDTO;
import com.rpgdiary.service.CalendarService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/calendar")
// @CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping("/types")
    public ResponseEntity<List<CalendarTypeDTO>> getAllCalendarTypes() {
        return ResponseEntity.ok(calendarService.getAllCalendarTypes());
    }

    @GetMapping("/types/{code}")
    public ResponseEntity<CalendarTypeDTO> getCalendarTypeByCode(@PathVariable String code) {
        return ResponseEntity.ok(calendarService.getCalendarTypeByCode(code));
    }

    @GetMapping("/config/{calendarTypeCode}")
    public ResponseEntity<List<CalendarConfigurationDTO>> getCalendarConfiguration(
            @PathVariable String calendarTypeCode) {
        return ResponseEntity.ok(calendarService.getCalendarConfiguration(calendarTypeCode));
    }

    @GetMapping("/config/{calendarTypeCode}/{monthNumber}")
    public ResponseEntity<CalendarConfigurationDTO> getMonthConfiguration(
            @PathVariable String calendarTypeCode, @PathVariable int monthNumber) {
        return ResponseEntity.ok(calendarService.getMonthConfiguration(calendarTypeCode, monthNumber));
    }

    @GetMapping("/{calendarTypeCode}/{year}/{day}")
    public ResponseEntity<CalendarDateDTO> getCalendarDate(
            @PathVariable String calendarTypeCode, @PathVariable int year, @PathVariable int day) {
        return ResponseEntity.ok(calendarService.getCalendarDate(calendarTypeCode, year, day));
    }

    @GetMapping("/types/{code}/months")
    public ResponseEntity<Integer> getMonthCountForCalendarType(@PathVariable String code) {
        Integer monthCount = calendarService.getMonthCountForCalendarType(code);
        return ResponseEntity.ok(monthCount);
    }
}
