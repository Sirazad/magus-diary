package com.rpgdiary.exception;

public class PartyNotFoundException extends RuntimeException {

    public PartyNotFoundException(String source) {
        super("Party was not found with the following data: " + source);
    }
}
