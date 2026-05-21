package com.eventplanning.repository;

import com.eventplanning.entity.Event;
import com.eventplanning.entity.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
    Page<Event> findByTitleContainingIgnoreCaseAndStatus(String title, EventStatus status, Pageable pageable);
    List<Event> findByOrganizerId(Long organizerId);

    @Query("SELECT e FROM Event e WHERE (e.status = 'PUBLISHED' OR e.status = 'SUSPENDED') AND e.date < :cutoffDate")
    List<Event> findExpiredActiveEvents(@Param("cutoffDate") LocalDate cutoffDate);

    @Modifying
    @Query("UPDATE Event e SET e.status = 'ARCHIVED' WHERE (e.status = 'PUBLISHED' OR e.status = 'SUSPENDED') AND e.date < :cutoffDate")
    int archiveExpiredEvents(@Param("cutoffDate") LocalDate cutoffDate);
}