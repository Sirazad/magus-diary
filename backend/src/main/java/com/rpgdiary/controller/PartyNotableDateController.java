package com.rpgdiary.controller;

import com.rpgdiary.dto.PartyNotableDateDTO;
import com.rpgdiary.service.PartyService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/party-notable-dates")
//@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class PartyNotableDateController {

    private final PartyService partyService;

    @GetMapping("/{id}")
    public ResponseEntity<PartyNotableDateDTO> getNotableDateById(@PathVariable Long id) {
        return ResponseEntity.ok(partyService.getPartyNotableDateById(id));
    }

    @GetMapping("/party/{partyId}/calendar/{calendarTypeCode}")
    public ResponseEntity<List<PartyNotableDateDTO>> getNotableDatesByPartyAndCalendar(
            @PathVariable Long partyId,
            @PathVariable String calendarTypeCode) {
        return ResponseEntity.ok(partyService.getPartyNotableDates(
                partyId, calendarTypeCode));
    }

    @PostMapping
    public ResponseEntity<PartyNotableDateDTO> createNotableDate(
            @RequestBody PartyNotableDateDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(partyService.addNotableDate(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PartyNotableDateDTO> updateNotableDate(
            @PathVariable Long id,
            @RequestBody PartyNotableDateDTO request) {
        return ResponseEntity.ok(partyService.updateNotableDate(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotableDate(@PathVariable Long id) {
        partyService.deleteNotableDate(id);
        return ResponseEntity.noContent().build();
    }
}