package com.eventplanning.service;

import com.eventplanning.dto.request.EventRequest;
import com.eventplanning.dto.response.EventResponse;
import com.eventplanning.entity.Event;
import com.eventplanning.entity.EventStatus;
import com.eventplanning.entity.User;
import com.eventplanning.exception.ResourceNotFoundException;
import com.eventplanning.exception.UnauthorizedException;
import com.eventplanning.exception.UnauthorizedOperationException;
import com.eventplanning.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserService userService;

    // Create event
    public EventResponse createEvent(EventRequest request, User organizer) {
        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setImageUrl(normalizeImageUrl(request.getImageUrl()));
        event.setOrganizerDisplayName(trimToNull(request.getOrganizerDisplayName()));
        event.setExtraImages(serializeExtraImages(request.getExtraImages()));
        event.setStatus(EventStatus.DRAFT);
        event.setOrganizer(organizer);

        return mapToResponse(eventRepository.save(event));
    }

    // Get published + archived events for browsing
    public Page<EventResponse> getPublishedEvents(Pageable pageable) {
        return eventRepository.findByStatusIn(List.of(EventStatus.PUBLISHED, EventStatus.ARCHIVED), pageable)
                .map(this::mapToResponse);
    }

    // Search published + archived events by title
    public Page<EventResponse> searchEvents(String title, Pageable pageable) {
        return eventRepository.findByTitleContainingIgnoreCaseAndStatusIn(
                title, List.of(EventStatus.PUBLISHED, EventStatus.ARCHIVED), pageable)
                .map(this::mapToResponse);
    }

    // Get event by id
    public EventResponse getEventById(Long id) {
        Event event = findEventById(id);
        return mapToResponse(event);
    }

    // Get my events
    public List<EventResponse> getMyEvents(User organizer) {
        return eventRepository.findByOrganizerId(organizer.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Update event
    public EventResponse updateEvent(Long id, EventRequest request, User currentUser) {
        Event event = findEventById(id);
        checkOwnership(event, currentUser);
        checkNotArchived(event);

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setImageUrl(normalizeImageUrl(request.getImageUrl()));
        event.setOrganizerDisplayName(trimToNull(request.getOrganizerDisplayName()));
        event.setExtraImages(serializeExtraImages(request.getExtraImages()));

        return mapToResponse(eventRepository.save(event));
    }

    // Delete event
    public void deleteEvent(Long id, User currentUser) {
        Event event = findEventById(id);
        checkOwnership(event, currentUser);
        eventRepository.delete(event);
    }

    // Publish event:
    public EventResponse publishEvent(Long id, User currentUser) {
        Event event = findEventById(id);
        checkOwnership(event, currentUser);
        checkNotArchived(event);

        if (event.getStatus() != EventStatus.DRAFT) {
            throw new UnauthorizedOperationException(
                "Only draft events can be published. Current status: " + event.getStatus());
        }

        event.setStatus(EventStatus.PUBLISHED);
        return mapToResponse(eventRepository.save(event));
    }

    // Toggle suspend/resume
    public EventResponse toggleSuspendEvent(Long id, User currentUser) {
        Event event = findEventById(id);
        checkOwnership(event, currentUser);
        checkNotArchived(event);

        if (event.getStatus() == EventStatus.PUBLISHED) {
            event.setStatus(EventStatus.SUSPENDED);
        } else if (event.getStatus() == EventStatus.SUSPENDED) {
            event.setStatus(EventStatus.PUBLISHED);
        } else {
            throw new UnauthorizedOperationException(
                "Only published or suspended events can be toggled. Current status: " + event.getStatus());
        }

        return mapToResponse(eventRepository.save(event));
    }

    // Archive event
    public EventResponse archiveEvent(Long id, User currentUser) {
        Event event = findEventById(id);
        checkOwnership(event, currentUser);
        checkNotArchived(event);

        if (event.getStatus() == EventStatus.ARCHIVED) {
            throw new UnauthorizedOperationException("Event is already archived.");
        }

        event.setStatus(EventStatus.ARCHIVED);
        return mapToResponse(eventRepository.save(event));
    }



    private Event findEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    private void checkOwnership(Event event, User currentUser) {
        if (!event.getOrganizer().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not the owner of this event");
        }
    }

    private void checkNotArchived(Event event) {
        if (event.getStatus() == EventStatus.ARCHIVED) {
            throw new UnauthorizedOperationException(
                "Archived events cannot be modified or published.");
        }
    }

    public EventResponse mapToResponse(Event event) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setTitle(event.getTitle());
        response.setDescription(event.getDescription());
        response.setLocation(event.getLocation());
        response.setCategory(event.getCategory());
        response.setDate(event.getDate());
        response.setTime(event.getTime());
        response.setStatus(event.getStatus());
        response.setImageUrl(event.getImageUrl());
        response.setOrganizerDisplayName(event.getOrganizerDisplayName());
        response.setExtraImages(deserializeExtraImages(event.getExtraImages()));
        response.setOrganizer(userService.mapToResponse(event.getOrganizer()));
        return response;
    }

    private String normalizeImageUrl(String imageUrl) {
        if (imageUrl == null) {
            return null;
        }
        String trimmed = imageUrl.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String serializeExtraImages(java.util.List<String> images) {
        if (images == null || images.isEmpty()) return null;
        return String.join(",,", images.stream().map(s -> s == null ? "" : s).toList());
    }

    private java.util.List<String> deserializeExtraImages(String raw) {
        if (raw == null || raw.isBlank()) return java.util.Collections.emptyList();
        return java.util.Arrays.stream(raw.split(",,"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(java.util.stream.Collectors.toList());
    }
}