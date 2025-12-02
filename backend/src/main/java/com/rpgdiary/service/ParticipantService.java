package com.rpgdiary.service;

import com.rpgdiary.dto.ParticipantDTO;
import com.rpgdiary.dto.ParticipantNotableDateDTO;

import java.util.List;

public interface ParticipantService {

    List<ParticipantDTO> getAllParticipants();

    ParticipantDTO getParticipantById(Long id);

    ParticipantDTO createParticipant(ParticipantDTO dto);

    ParticipantDTO updateParticipant(Long id, ParticipantDTO dto);

    void deleteParticipant(Long id);

    List<ParticipantDTO> getParticipantsByType(String type);

    List<ParticipantNotableDateDTO> getParticipantNotableDates(Long participantId, String calendarTypeCode);

    ParticipantNotableDateDTO addNotableDate(ParticipantNotableDateDTO dto);

    void deleteNotableDate(Long notableDateId);
}
