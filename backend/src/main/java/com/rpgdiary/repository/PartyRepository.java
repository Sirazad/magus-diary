package com.rpgdiary.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rpgdiary.model.Party;

@Repository
public interface PartyRepository extends JpaRepository<Party, Long> {

    Optional<Party> findByName(String name);

    List<Party> findAllByOrderByName();
}
