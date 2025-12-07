package com.rpgdiary.service;

import com.rpgdiary.dto.PartyDTO;
import com.rpgdiary.dto.PartyNotableDateDTO;
import com.rpgdiary.exception.CalendarNotFoundException;
import com.rpgdiary.exception.ParticipantNotFoundException;
import com.rpgdiary.exception.PartyNotFoundException;
import com.rpgdiary.model.Party;
import com.rpgdiary.model.Participant;
import com.rpgdiary.model.PartyNotableDate;
import com.rpgdiary.model.CalendarType;
import com.rpgdiary.repository.PartyRepository;
import com.rpgdiary.repository.ParticipantRepository;
import com.rpgdiary.repository.PartyNotableDateRepository;
import com.rpgdiary.repository.CalendarTypeRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.Nullable;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class PartyServiceImpl implements PartyService {

    private final PartyRepository partyRepository;
    private final ParticipantRepository participantRepository;
    private final PartyNotableDateRepository partyNotableDateRepository;
    private final CalendarTypeRepository calendarTypeRepository;
    private final ConversionService converter;

    //TODO change validation level to method call in controller with @Valid annotation

    @Override
    @Transactional(readOnly = true)
    public List<PartyDTO> getAllParties() {

        List<PartyDTO> parties = partyRepository.findAllByOrderByName()
                .stream()
                .map(this::convert)
                .toList();

        log.info("Retrieved {} parties", parties.size());
        return parties;
    }

    @Override
    public PartyDTO getPartyById(Long id) {
        Party party = partyRepository.findById(id)
                .orElseThrow(() -> new PartyNotFoundException("id: " + id));
        log.info("Retrieved party with id {}", id);
        return convert(party);
    }

    @Override
    public PartyDTO createParty(PartyDTO request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Party name cannot be empty");
        }

        checkPartyExistence(request.getName());

        Party party = Party.builder()
                .name(request.getName())
                .description(request.getDescription())
                .members(new HashSet<>())
                .build();

        log.info("Creating party with name {}", request.getName());
        return convert(partyRepository.save(party));
    }

    private void checkPartyExistence(String name) {
        partyRepository.findByName(name)
                .ifPresent( p -> {
                    throw new IllegalStateException(
                            "Party with name '" + name + "' already exists"
                    );
                });
    }

    @Override
    public PartyDTO updateParty(Long id, PartyDTO request) {
        Party party = partyRepository.findById(id)
                .orElseThrow(() -> new PartyNotFoundException("id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            checkPartyExistence(request.getName());
            party.setName(request.getName());
        }
        if (request.getDescription() != null) {
            party.setDescription(request.getDescription());
        }

        log.info("Updating party with id {}, to content {}", id, party);
        return convert(partyRepository.save(party));
    }

    @Override
    public void deleteParty(Long id) {
        Party party = partyRepository.findById(id)
                .orElseThrow(() -> new PartyNotFoundException("id: " + id));
        log.info("Deleting party with id {}", id);
        partyRepository.delete(party);
    }

    @Override
    public void addMemberToParty(Long partyId, Long participantId) {
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new PartyNotFoundException("id: " + partyId));

        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ParticipantNotFoundException("id: " + participantId));

        party.getMembers().add(participant);
        log.info("Adding participant with name {} to party {}", participant.getName(), party.getName());
        partyRepository.save(party);
    }

    @Override
    public void removeMemberFromParty(Long partyId, Long participantId) {
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new PartyNotFoundException("id: " + partyId));

        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ParticipantNotFoundException("id: " + participantId));

        party.getMembers().remove(participant);
        log.info("Removing participant with name {} from party {}", participant.getName(), party.getName());
        partyRepository.save(party);
    }

    @Override
    public List<PartyNotableDateDTO> getPartyNotableDates(Long partyId, String calendarTypeCode) {
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new PartyNotFoundException("id: " + partyId));

        CalendarType calendarType = calendarTypeRepository.findById(calendarTypeCode)
                .orElseThrow(() -> new CalendarNotFoundException(calendarTypeCode));

        return partyNotableDateRepository.findByPartyAndCalendarType(party, calendarType)
                .stream()
                .map(this::convert)
                .toList();
    }

    @Override
    public PartyNotableDateDTO addNotableDate(PartyNotableDateDTO request) {
        Party party = partyRepository.findById(request.getPartyId())
                .orElseThrow(() -> new PartyNotFoundException("id: " + request.getPartyId()));

        CalendarType calendarType = calendarTypeRepository.findById(request.getCalendarTypeCode())
                .orElseThrow(() -> new CalendarNotFoundException(request.getCalendarTypeCode()));

        PartyNotableDate date = PartyNotableDate.builder()
                .party(party)
                .calendarType(calendarType)
                .day(request.getDay())
                .dayEnd(request.getDayEnd())
                .eventName(request.getEventName())
                .description(request.getDescription())
                .year(request.getYear())
                .yearStart(request.getYearStart())
                .yearEnd(request.getYearEnd())
                .isRecurring(request.isRecurring())
                .build();

        return convert(partyNotableDateRepository.save(date));
    }

    @Override
    public void deleteNotableDate(Long notableDateId) {
        PartyNotableDate notableDate = partyNotableDateRepository.findById(notableDateId)
                .orElseThrow(() -> new java.util.NoSuchElementException(
                        "Notable date not found with id: " + notableDateId
                ));
        partyNotableDateRepository.delete(notableDate);
    }

    @Override
    public @Nullable PartyNotableDateDTO getPartyNotableDateById(Long notableDateId) {
        PartyNotableDate notableDate = partyNotableDateRepository.findById(notableDateId)
                .orElseThrow(() -> new java.util.NoSuchElementException(
                        "Notable date not found with id: " + notableDateId
                ));
        return convert(notableDate);
    }

    @Override
    public @Nullable PartyNotableDateDTO updateNotableDate(Long id, PartyNotableDateDTO request) {
        return partyNotableDateRepository.findById(id)
                .map(notableDate -> {
                    if (request.getDay() != 0) {
                        notableDate.setDay(request.getDay());
                    }
                    if (request.getDayEnd() != null) {
                        notableDate.setDayEnd(request.getDayEnd());
                    }
                    if (request.getEventName() != null) {
                        notableDate.setEventName(request.getEventName());
                    }
                    if (request.getDescription() != null) {
                        notableDate.setDescription(request.getDescription());
                    }
                    if (request.getYear() != null) {
                        notableDate.setYear(request.getYear());
                    }
                    if (request.getYearStart() != null) {
                        notableDate.setYearStart(request.getYearStart());
                    }
                    if (request.getYearEnd() != null) {
                        notableDate.setYearEnd(request.getYearEnd());
                    }
                    notableDate.setRecurring(request.isRecurring());

                    return convert(partyNotableDateRepository.save(notableDate));
                })
                .orElseThrow(() -> new java.util.NoSuchElementException(
                        "Notable date not found with id: " + id
                ));
    }

    private PartyDTO convert(Party party) {
        return converter.convert(party, PartyDTO.class);
    }

    private PartyNotableDateDTO convert(PartyNotableDate notableDate) {
        return converter.convert(notableDate, PartyNotableDateDTO.class);
    }
}