package com.rpgdiary.service;


import com.rpgdiary.exception.PartyNotFoundException;
import com.rpgdiary.repository.CalendarTypeRepository;
import com.rpgdiary.repository.ParticipantRepository;
import com.rpgdiary.repository.PartyNotableDateRepository;
import com.rpgdiary.repository.PartyRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.convert.ConversionService;
import testDataProvider.TestDataFactory;

import static java.util.Collections.emptyList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PartyServiceImplTest {

    @Mock private PartyRepository partyRepository;
    @Mock private ParticipantRepository participantRepository;
    @Mock private PartyNotableDateRepository partyNotableDateRepository;
    @Mock private CalendarTypeRepository calendarTypeRepository;
    @Mock private ConversionService converter;
    @InjectMocks PartyServiceImpl underTest;

    @Test
    @DisplayName("context loads successfully")
    void contextLoads() {
    }

    @Test
    @DisplayName("getAllParties returns parties when they exist")
    void getAllParties_shouldReturnParties_whenPartiesExist() {
        // GIVEN
        var parties = TestDataFactory.createPartyEntityList(3);
        var partyEntities = parties.stream().map(p -> p.getFirst()).toList();
        var partyDTOs = parties.stream().map(p -> p.getSecond()).toList();
        when(partyRepository.findAllByOrderByName()).thenReturn(partyEntities);
        when(converter.convert(partyEntities.get(0), com.rpgdiary.dto.PartyDTO.class))
                .thenReturn(parties.get(0).getSecond());
        when(converter.convert(partyEntities.get(1), com.rpgdiary.dto.PartyDTO.class))
                .thenReturn(parties.get(1).getSecond());
        when(converter.convert(partyEntities.get(2), com.rpgdiary.dto.PartyDTO.class))
                .thenReturn(parties.get(2).getSecond());

        // WHEN
        var result = underTest.getAllParties();

        // THEN
        assertEquals(parties.size(), result.size());
        assertEquals(partyDTOs, result);
    }

    @Test
    @DisplayName("getAllParties returns empty list when no parties exist")
    void getAllParties_shouldReturnEmptyList_whenNoPartiesExist() {
        // GIVEN
        when(partyRepository.findAllByOrderByName()).thenReturn(emptyList());

        // WHEN
        var result = underTest.getAllParties();

        // THEN
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getPartyById returns party when it exists")
    void getPartyById_shouldReturnParty_whenPartyExists() {
        // GIVEN
        var partyPair = TestDataFactory.createPartyEntity();
        var partyEntity = partyPair.getFirst();
        var partyDTO = partyPair.getSecond();
        when(partyRepository.findById(partyEntity.getId())).thenReturn(java.util.Optional.of(partyEntity));
        when(converter.convert(partyEntity, com.rpgdiary.dto.PartyDTO.class)).thenReturn(partyDTO);

        // WHEN
        var result = underTest.getPartyById(partyEntity.getId());

        // THEN
        assertEquals(partyDTO, result);
    }

    @Test
    @DisplayName("getPartyById returns throws PartyNotFoundException when party does not exist")
    void getPartyById_shouldThrowPartyNotFoundException_whenPartyDoesNotExist() {
        // GIVEN
        var nonExistentPartyId = 1L;
        var expectedException = new PartyNotFoundException("id: " + nonExistentPartyId);
        when(partyRepository.findById(nonExistentPartyId)).thenReturn(java.util.Optional.empty());

        // WHEN
        var result = assertThrows(PartyNotFoundException.class, () -> underTest.getPartyById(nonExistentPartyId));

        // THEN
        assertEquals(expectedException.getMessage(), result.getMessage());
        }
}