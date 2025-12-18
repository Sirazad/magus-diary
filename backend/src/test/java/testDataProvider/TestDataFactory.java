package testDataProvider;

import com.rpgdiary.dto.ParticipantNotableDateDTO;
import com.rpgdiary.dto.PartyDTO;
import com.rpgdiary.model.Participant;
import com.rpgdiary.model.ParticipantNotableDate;
import com.rpgdiary.model.Party;
import com.rpgdiary.model.PartyNotableDate;
import net.datafaker.Faker;
import org.springframework.data.util.Pair;

import java.util.ArrayList;
import java.util.List;

public class TestDataFactory {
    private static final Faker faker = new Faker();

    public static Pair<Party, PartyDTO> createPartyEntity() {
        var party = new Party();
        party.setId(faker.number().randomNumber());
        party.setName(faker.team().name());
        party.setDescription(faker.lorem().sentence());
        var partyDTO = PartyDTO.builder().
                id(party.getId()).
                name(party.getName()).
                description(party.getDescription()).
                build();
        return Pair.of(party, partyDTO);
    }

    public static List<Pair<Party, PartyDTO>> createPartyEntityList(int count) {
        List<Pair<Party, PartyDTO>> parties = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            parties.add(createPartyEntity());
        }
        return parties;
    }

    public static Participant createParticipantEntity() {
        Participant participant = new Participant();
        participant.setId(faker.number().randomNumber());
        participant.setName(faker.name().fullName());
        participant.setDescription(faker.lorem().sentence());
        participant.setType(faker.options().option("JK", "NJK", "calendar"));
        return participant;
    }

    public static List<Participant> createParticipantEntityList(int count) {
        List<Participant> participants = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            participants.add(createParticipantEntity());
        }
        return participants;
    }

    public static PartyNotableDate createPartyNotableDateEntity() {
        var notableDate = new PartyNotableDate();
        notableDate.setId(faker.number().randomNumber());
        notableDate.setDescription(faker.lorem().sentence());
        notableDate.setDay(faker.number().numberBetween(1, 620));
        notableDate.setYear(faker.number().numberBetween(0, 4000));
        notableDate.setEventName(faker.lorem().sentence(3));
        notableDate.setParty(createPartyEntity().getFirst());
        return notableDate;
    }

    public static List<PartyNotableDate> createPartyNotableDateEntityList(int count) {
        List<PartyNotableDate> notableDates = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            notableDates.add(createPartyNotableDateEntity());
        }
        return notableDates;
    }

    public static Pair<ParticipantNotableDate, ParticipantNotableDateDTO> createParticipantNotableDateEntity() {
        var notableDate = new ParticipantNotableDate();
        var notableDateDTO = new ParticipantNotableDateDTO();
        notableDate.setId(faker.number().randomNumber());
        notableDateDTO.setId(notableDate.getId());
        notableDate.setDescription(faker.lorem().sentence());
        notableDateDTO.setDescription(notableDate.getDescription());
        notableDate.setDay(faker.number().numberBetween(1, 620));
        notableDateDTO.setDay(notableDate.getDay());
        notableDate.setYear(faker.number().numberBetween(0, 4000));
        notableDateDTO.setYear(notableDate.getYear());
        notableDate.setEventName(faker.lorem().sentence(3));
        notableDateDTO.setEventName(notableDate.getEventName());
        notableDate.setParticipant(createParticipantEntity());
        notableDateDTO.setParticipantId(notableDate.getParticipant().getId());
        return Pair.of(notableDate, notableDateDTO);
    }

    public static List<Pair<ParticipantNotableDate, ParticipantNotableDateDTO>> createParticipantNotableDateEntityList(int count) {
        List<Pair<ParticipantNotableDate, ParticipantNotableDateDTO>> notableDates = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            notableDates.add(createParticipantNotableDateEntity());
        }
        return notableDates;
    }


}
