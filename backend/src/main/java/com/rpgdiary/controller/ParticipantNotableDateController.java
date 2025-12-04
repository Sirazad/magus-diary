package com.rpgdiary.controller;

import com.rpgdiary.dto.ParticipantNotableDateDTO;
import com.rpgdiary.service.ParticipantService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/participant-notable-dates")
@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class ParticipantNotableDateController {

    private final ParticipantService participantService;

    @GetMapping("/participant/{participantId}/calendar/{calendarTypeCode}")
    public ResponseEntity<List<ParticipantNotableDateDTO>> getNotableDatesByParticipantAndCalendar(
            @PathVariable Long participantId,
            @PathVariable String calendarTypeCode) {
        return ResponseEntity.ok(participantService.getParticipantNotableDates(
                participantId, calendarTypeCode));
    }

    @PostMapping
    public ResponseEntity<ParticipantNotableDateDTO> createNotableDate(
            @RequestBody ParticipantNotableDateDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(participantService.addNotableDate(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotableDate(@PathVariable Long id) {
        participantService.deleteNotableDate(id);
        return ResponseEntity.noContent().build();
    }
}