package com.rpgdiary.controller;

import com.rpgdiary.dto.PartyDTO;
import com.rpgdiary.service.PartyService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping("/api/parties")
//@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
@Slf4j
public class PartyController {

    private final PartyService partyService;

    @GetMapping
    public ResponseEntity<List<PartyDTO>> getAllParties() {
        log.info("Received request to get all parties");
        return ResponseEntity.ok(partyService.getAllParties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartyDTO> getPartyById(@PathVariable Long id) {
        return ResponseEntity.ok(partyService.getPartyById(id));
    }

    @PostMapping
    public ResponseEntity<PartyDTO> createParty(@RequestBody PartyDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(partyService.createParty(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PartyDTO> updateParty(
            @PathVariable Long id,
            @RequestBody PartyDTO dto) {
        return ResponseEntity.ok(partyService.updateParty(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParty(@PathVariable Long id) {
        partyService.deleteParty(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{partyId}/members/{participantId}")
    public ResponseEntity<Void> addMemberToParty(
            @PathVariable Long partyId,
            @PathVariable Long participantId) {
        partyService.addMemberToParty(partyId, participantId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{partyId}/members/{participantId}")
    public ResponseEntity<PartyDTO> removeMemberFromParty(
            @PathVariable Long partyId,
            @PathVariable Long participantId) {
        partyService.removeMemberFromParty(partyId, participantId);
        return ResponseEntity.noContent().build();
    }
}