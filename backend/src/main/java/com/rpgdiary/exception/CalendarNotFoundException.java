package com.rpgdiary.exception;

public class CalendarNotFoundException extends RuntimeException {

    public CalendarNotFoundException(String calendarCode) {
        super("Calendar type not found with code: " + calendarCode);
    }
}
