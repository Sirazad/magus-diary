package com.rpgdiary.service;

import java.util.List;

import com.rpgdiary.dto.ParticipantDTO;
import com.rpgdiary.dto.ParticipantNotableDateDTO;

public interface ParticipantService {

    List<ParticipantDTO> getAllParticipants();

    ParticipantDTO getParticipantById(Long id);

    ParticipantDTO createParticipant(ParticipantDTO dto);

    ParticipantDTO updateParticipant(Long id, ParticipantDTO dto);

    void deleteParticipant(Long id);

    List<ParticipantDTO> getParticipantsByType(String type);

    List<ParticipantNotableDateDTO> getParticipantNotableDates(Long participantId, String calendarTypeCode);

    List<ParticipantNotableDateDTO> getDateForTimeRangeAndParticipant(
            Long participantId, String calendarTypeCode, int year, int startDate, int endDate);

    ParticipantNotableDateDTO addNotableDate(ParticipantNotableDateDTO dto);

    void deleteNotableDate(Long notableDateId);
}
