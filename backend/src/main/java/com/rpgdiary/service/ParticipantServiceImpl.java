package com.rpgdiary.service;

import com.rpgdiary.dto.ParticipantDTO;
import com.rpgdiary.dto.ParticipantNotableDateDTO;
import com.rpgdiary.exception.CalendarNotFoundException;
import com.rpgdiary.exception.ParticipantNotFoundException;
import com.rpgdiary.model.CalendarType;
import com.rpgdiary.model.Participant;
import com.rpgdiary.model.ParticipantNotableDate;
import com.rpgdiary.repository.CalendarTypeRepository;
import com.rpgdiary.repository.ParticipantNotableDateRepository;
import com.rpgdiary.repository.ParticipantRepository;
import lombok.AllArgsConstructor;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ParticipantServiceImpl implements ParticipantService {

    private final ParticipantRepository participantRepository;
    private final ParticipantNotableDateRepository participantNotableDateRepository;
    private final CalendarTypeRepository calendarTypeRepository;
    private final ConversionService converter;

    @Override
    public List<ParticipantDTO> getAllParticipants() {
        return participantRepository.findAllByOrderByName()
                .stream()
                .map(this::convert)
                .toList();
    }

    @Override
    public ParticipantDTO getParticipantById(Long id) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new ParticipantNotFoundException("id: " +id));
        return convert(participant);
    }

    @Override
    public ParticipantDTO createParticipant(ParticipantDTO request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Participant name cannot be empty");
        }

        Participant participant = Participant.builder()
                        .name(request.getName())
                        .type(request.getType())
                        .description(request.getDescription())
                        .build();
        if(participantRepository.findByName(participant.getName()).isPresent()) {
            throw new IllegalStateException(
                    "Participant with name '" + participant.getName() + "' already exists"
            );
        }

        return convert(participantRepository.save(participant));
    }

    @Override
    public ParticipantDTO updateParticipant(Long id, ParticipantDTO request) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new ParticipantNotFoundException("id: " + id));

        if (request.getName() != null && !request.getName().isBlank()) {
            participant.setName(request.getName());
        }

        if (request.getType() != null) {
            participant.setType(request.getType());
        }

        if (request.getDescription() != null) {
            participant.setDescription(request.getDescription());
        }

        return convert(participantRepository.save(participant));
    }

    @Override
    public void deleteParticipant(Long id) {
        Participant participant = participantRepository.findById(id)
                .orElseThrow(() -> new ParticipantNotFoundException("id: " + id));
        participantRepository.delete(participant);
    }

    @Override
    public List<ParticipantDTO> getParticipantsByType(String type) {
        return participantRepository.findByType(type)
                .stream()
                .map(this::convert)
                .toList();
    }

    @Override
    public List<ParticipantNotableDateDTO> getParticipantNotableDates(Long participantId, String calendarTypeCode) {
        Participant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ParticipantNotFoundException("id: " + participantId));

        CalendarType calendarType = calendarTypeRepository.findById(calendarTypeCode)
                .orElseThrow(() -> new CalendarNotFoundException(calendarTypeCode));

        return participantNotableDateRepository.findByParticipantAndCalendarType(participant, calendarType)
                .stream()
                .map(this::convert)
                .toList();
    }

    @Override
    public ParticipantNotableDateDTO addNotableDate(ParticipantNotableDateDTO request) {
        Participant participant = participantRepository.findById(request.getParticipantId())
                .orElseThrow(() -> new ParticipantNotFoundException("id: " + request.getParticipantId()));

        CalendarType calendarType = calendarTypeRepository.findById(request.getCalendarTypeCode())
                .orElseThrow(() -> new CalendarNotFoundException(request.getCalendarTypeCode()));

        ParticipantNotableDate date = ParticipantNotableDate.builder()
                .calendarType(calendarType)
                .participant(participant)
                .year(request.getYear())
                .day(request.getDay())
                .dayEnd(request.getDayEnd())
                .eventName(request.getEventName())
                .description(request.getDescription())
                .isRecurring(request.isRecurring())
                .yearStart(request.getYearStart())
                .yearEnd(request.getYearEnd())
                .build();

        return convert(participantNotableDateRepository.save(date));
    }

    @Override
    public void deleteNotableDate(Long notableDateId) {
        ParticipantNotableDate date = participantNotableDateRepository.findById(notableDateId)
                .orElseThrow(() -> new java.util.NoSuchElementException(
                        "Notable date not found with id: " + notableDateId
                ));
        participantNotableDateRepository.delete(date);
    }

    private ParticipantDTO convert(Participant source) {
        return converter.convert(source, ParticipantDTO.class);
    }
    private ParticipantNotableDateDTO convert(ParticipantNotableDate source) {
        return converter.convert(source, ParticipantNotableDateDTO.class);
    }
}
