package com.rpgdiary.repository;

import com.rpgdiary.model.Party;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartyRepository extends JpaRepository<Party, Long> {

    Party findByName(String name);

    List<Party> findAllByOrderByName();
}
