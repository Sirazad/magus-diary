package com.rpgdiary.model;

import static jakarta.persistence.GenerationType.IDENTITY;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "parties")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Party {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "party_participants",
            joinColumns = @JoinColumn(name = "party_id"),
            inverseJoinColumns = @JoinColumn(name = "participant_id"))
    @EqualsAndHashCode.Exclude
    private Set<Participant> members = new HashSet<>();

    @OneToMany(mappedBy = "party", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PartyNotableDate> notableDates = new HashSet<>();
}
