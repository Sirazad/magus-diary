package com.rpgdiary.exception;

public class ParticipantNotFoundException extends RuntimeException{

    public ParticipantNotFoundException(String source) {
        super("Participant was not found with the following data: " + source);
    }
}
