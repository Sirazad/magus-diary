package com.rpgdiary.service;

import com.rpgdiary.dto.PartyDTO;
import com.rpgdiary.dto.PartyNotableDateDTO;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface PartyService {

    List<PartyDTO> getAllParties();

    PartyDTO getPartyById(Long id);

    PartyDTO createParty(PartyDTO dto);

    PartyDTO updateParty(Long id, PartyDTO dto);

    void deleteParty(Long id);

    void addMemberToParty(Long partyId, Long participantId);

    void removeMemberFromParty(Long partyId, Long participantId);

    List<PartyNotableDateDTO> getPartyNotableDates(Long partyId, String calendarTypeCode);

    PartyNotableDateDTO addNotableDate(PartyNotableDateDTO dto);

    void deleteNotableDate(Long notableDateId);

    @Nullable PartyNotableDateDTO getPartyNotableDateById(Long id);

    @Nullable PartyNotableDateDTO updateNotableDate(Long id, PartyNotableDateDTO request);

    List<PartyNotableDateDTO> getDateForTimeRangeAndParty(Long partyId, String calendarTypeCode, int year, int startDate, int endDate);
}
