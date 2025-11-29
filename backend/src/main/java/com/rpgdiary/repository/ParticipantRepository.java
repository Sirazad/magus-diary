package com.rpgdiary.repository;

import com.rpgdiary.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    Participant findByName(String name);

    List<Participant> findByType(String type);

    List<Participant> findAllByOrderByName();

}
