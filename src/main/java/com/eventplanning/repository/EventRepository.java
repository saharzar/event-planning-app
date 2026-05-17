package com.eventplanning.repository;

import com.eventplanning.entity.Event;
import com.eventplanning.entity.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
    Page<Event> findByTitleContainingIgnoreCaseAndStatus(String title, EventStatus status, Pageable pageable);
    List<Event> findByOrganizerId(Long organizerId);
}