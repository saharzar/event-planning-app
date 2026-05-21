package com.eventplanning.repository;

import com.eventplanning.entity.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    List<Participation> findByEventId(Long eventId);

    List<Participation> findByUserId(Long userId);

    long countByEventId(Long eventId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);

    @Query("SELECT p FROM Participation p WHERE p.user.id = :userId AND p.event.id = :eventId")
    Optional<Participation> findByUserIdAndEventId(@Param("userId") Long userId, @Param("eventId") Long eventId);

    /**
     * Upcoming joined events: event is PUBLISHED or SUSPENDED, date >= today.
     */
    @Query("SELECT p FROM Participation p JOIN FETCH p.event e " +
           "WHERE p.user.id = :userId " +
           "AND (e.status = 'PUBLISHED' OR e.status = 'SUSPENDED') " +
           "AND e.date >= :currentDate " +
           "ORDER BY e.date ASC, e.time ASC")
    List<Participation> findUpcomingJoinedEvents(@Param("userId") Long userId,
                                                  @Param("currentDate") LocalDate currentDate);

    /**
     * Past or archived joined events: event is ARCHIVED OR date < today.
     */
    @Query("SELECT p FROM Participation p JOIN FETCH p.event e " +
           "WHERE p.user.id = :userId " +
           "AND (e.status = 'ARCHIVED' OR e.date < :currentDate) " +
           "ORDER BY e.date DESC, e.time DESC")
    List<Participation> findPastOrArchivedJoinedEvents(@Param("userId") Long userId,
                                                        @Param("currentDate") LocalDate currentDate);
}
