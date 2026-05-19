package com.eventplanning.service;

import com.eventplanning.dto.response.AttendanceResponse;
import com.eventplanning.entity.Attendance;
import com.eventplanning.entity.Event;
import com.eventplanning.entity.User;
import com.eventplanning.exception.AlreadyJoinedException;
import com.eventplanning.exception.ResourceNotFoundException;
import com.eventplanning.exception.UnauthorizedException;
import com.eventplanning.repository.AttendanceRepository;
import com.eventplanning.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EventRepository eventRepository;
    private final UserService userService;
    private final EventService eventService;

    // Join event
    public AttendanceResponse joinEvent(Long eventId, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot join your own event");
        }

        if (attendanceRepository.existsByUserIdAndEventId(currentUser.getId(), eventId)) {
            throw new AlreadyJoinedException("You have already joined this event");
        }

        Attendance attendance = new Attendance();
        attendance.setUser(currentUser);
        attendance.setEvent(event);
        attendance.setJoinedAt(LocalDateTime.now());

        return mapToResponse(attendanceRepository.save(attendance));
    }

    // List participants of an event
    public List<AttendanceResponse> getParticipants(Long eventId, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getOrganizer().getId().equals(currentUser.getId())) {

            throw new UnauthorizedException("Only the event owner can see participants");
        }

        return attendanceRepository.findByEventId(eventId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponse> getMyJoinedEvents(User currentUser) {
        return attendanceRepository.findByUserId(currentUser.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public boolean hasJoined(Long eventId, User currentUser) {
        return attendanceRepository.existsByUserIdAndEventId(currentUser.getId(), eventId);
    }

    public long getAttendeeCount(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        return attendanceRepository.countByEventId(eventId);
    }

    @Transactional
    public void leaveEvent(Long eventId, User currentUser) {
        Attendance attendance = attendanceRepository
                .findByUserIdAndEventId(currentUser.getId(), eventId)
                .orElseThrow(() -> new ResourceNotFoundException("You have not joined this event"));
        attendanceRepository.delete(attendance);
        attendanceRepository.flush();
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        AttendanceResponse response = new AttendanceResponse();
        response.setId(attendance.getId());
        response.setUser(userService.mapToResponse(attendance.getUser()));
        response.setEvent(eventService.mapToResponse(attendance.getEvent()));
        response.setJoinedAt(attendance.getJoinedAt());
        return response;
    }
}