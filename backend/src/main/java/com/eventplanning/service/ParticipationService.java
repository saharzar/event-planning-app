package com.eventplanning.service;

import com.eventplanning.dto.response.ParticipationResponse;
import com.eventplanning.entity.Event;
import com.eventplanning.entity.Participation;
import com.eventplanning.entity.User;
import com.eventplanning.entity.EventStatus;
import com.eventplanning.exception.AlreadyJoinedException;
import com.eventplanning.exception.ResourceNotFoundException;
import com.eventplanning.exception.UnauthorizedException;
import com.eventplanning.exception.UnauthorizedOperationException;
import com.eventplanning.repository.EventRepository;
import com.eventplanning.repository.ParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final EventRepository eventRepository;
    private final UserService userService;
    private final EventService eventService;

    public ParticipationResponse joinEvent(Long eventId, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (event.getStatus() == EventStatus.ARCHIVED) {
            throw new UnauthorizedOperationException("Cannot join an archived event");
        }

        if (event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You cannot join your own event");
        }

        if (participationRepository.existsByUserIdAndEventId(currentUser.getId(), eventId)) {
            throw new AlreadyJoinedException("You have already joined this event");
        }

        Participation participation = new Participation();
        participation.setUser(currentUser);
        participation.setEvent(event);
        participation.setJoinedAt(LocalDateTime.now());

        return mapToResponse(participationRepository.save(participation));
    }

    public List<ParticipationResponse> getParticipants(Long eventId, User currentUser) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        if (!event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only the event owner can see participants");
        }

        return participationRepository.findByEventId(eventId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Returns only upcoming joined events (PUBLISHED or SUSPENDED status, date >= today).
     */
    public List<ParticipationResponse> getMyUpcomingJoinedEvents(User currentUser) {
        return participationRepository
                .findUpcomingJoinedEvents(currentUser.getId(), LocalDate.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Returns past or archived joined events (ARCHIVED status or date < today).
     */
    public List<ParticipationResponse> getMyPastOrArchivedJoinedEvents(User currentUser) {
        return participationRepository
                .findPastOrArchivedJoinedEvents(currentUser.getId(), LocalDate.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public boolean hasJoined(Long eventId, User currentUser) {
        return participationRepository.existsByUserIdAndEventId(currentUser.getId(), eventId);
    }

    public long getAttendeeCount(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Event not found with id: " + eventId);
        }
        return participationRepository.countByEventId(eventId);
    }

    @Transactional
    public void leaveEvent(Long eventId, User currentUser) {
        Participation participation = participationRepository
                .findByUserIdAndEventId(currentUser.getId(), eventId)
                .orElseThrow(() -> new ResourceNotFoundException("You have not joined this event"));

        participationRepository.delete(participation);
        participationRepository.flush();
    }

    private ParticipationResponse mapToResponse(Participation participation) {
        ParticipationResponse response = new ParticipationResponse();
        response.setId(participation.getId());
        response.setUser(userService.mapToResponse(participation.getUser()));
        response.setEvent(eventService.mapToResponse(participation.getEvent()));
        response.setJoinedAt(participation.getJoinedAt());
        return response;
    }
}
