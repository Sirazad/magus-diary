package com.rpgdiary.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rpgdiary.dto.ParticipantDTO;
import com.rpgdiary.service.ParticipantService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/participants")
// @CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;

    @GetMapping
    public ResponseEntity<List<ParticipantDTO>> getAllParticipants() {
        return ResponseEntity.ok(participantService.getAllParticipants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParticipantDTO> getParticipantById(@PathVariable Long id) {
        return ResponseEntity.ok(participantService.getParticipantById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ParticipantDTO>> getParticipantsByType(@PathVariable String type) {
        return ResponseEntity.ok(participantService.getParticipantsByType(type));
    }

    @PostMapping
    public ResponseEntity<ParticipantDTO> createParticipant(@RequestBody ParticipantDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(participantService.createParticipant(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParticipantDTO> updateParticipant(@PathVariable Long id, @RequestBody ParticipantDTO dto) {
        return ResponseEntity.ok(participantService.updateParticipant(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable Long id) {
        participantService.deleteParticipant(id);
        return ResponseEntity.noContent().build();
    }
}
