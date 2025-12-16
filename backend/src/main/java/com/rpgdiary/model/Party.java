package com.rpgdiary.model;

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
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Table(name = "parties")
@Data
@EqualsAndHashCode(exclude = {"members", "notableDates"})
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
            inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    private Set<Participant> members = new HashSet<>();

    @OneToMany(mappedBy = "party", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<PartyNotableDate> notableDates = new HashSet<>();




    public static PartyBuilder builder() {
        return new PartyBuilder();
    }

    @NoArgsConstructor
    @Getter
    @Setter
    public static class PartyBuilder {
        String name;
        private String description;
        private Set<Participant> members;
        private Long id;


        public PartyBuilder name(String name) {
            this.name = name;
            return this;
        }

        public PartyBuilder description(String description) {
            this.description = description;
            return this;
        }

        public PartyBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PartyBuilder members(Set<Participant> members) {
            this.members = members;
            return this;
        }
        public Party build() {
            Party party = new Party();
            party.setName(this.name);
            party.setDescription(this.description);
            party.setMembers(members);
            party.setId(this.id);
            return party;
        }
    }

}
