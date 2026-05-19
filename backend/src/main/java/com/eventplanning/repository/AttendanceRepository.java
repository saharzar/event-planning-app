package com.eventplanning.repository;

import com.eventplanning.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEventId(Long eventId);
    List<Attendance> findByUserId(Long userId);
    long countByEventId(Long eventId);
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    @Query("SELECT a FROM Attendance a WHERE a.user.id = :userId AND a.event.id = :eventId")
    java.util.Optional<Attendance> findByUserIdAndEventId(@Param("userId") Long userId, @Param("eventId") Long eventId);
}