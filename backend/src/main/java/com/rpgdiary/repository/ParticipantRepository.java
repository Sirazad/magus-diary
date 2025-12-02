package com.rpgdiary.repository;

import com.rpgdiary.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {

    Optional<Participant> findByName(String name);

    List<Participant> findByType(String type);

    List<Participant> findAllByOrderByName();

}
