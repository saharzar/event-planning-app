package com.eventplanning.controller;

import com.eventplanning.dto.request.EventRequest;
import com.eventplanning.dto.response.EventResponse;
import com.eventplanning.entity.User;
import com.eventplanning.service.EventService;
import com.eventplanning.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserService userService;

    // Create event
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        EventResponse response = eventService.createEvent(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all published events with pagination
    @GetMapping
    public ResponseEntity<Page<EventResponse>> getPublishedEvents(Pageable pageable) {
        return ResponseEntity.ok(eventService.getPublishedEvents(pageable));
    }

    // Search events by title
    @GetMapping("/search")
    public ResponseEntity<Page<EventResponse>> searchEvents(
            @RequestParam String title,
            Pageable pageable) {
        return ResponseEntity.ok(eventService.searchEvents(title, pageable));
    }

    // Get event by id
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // Get my events
    @GetMapping("/my")
    public ResponseEntity<List<EventResponse>> getMyEvents(HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(eventService.getMyEvents(currentUser));
    }

    // Update event
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(eventService.updateEvent(id, request, currentUser));
    }

    // Delete event
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(
            @PathVariable Long id,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        eventService.deleteEvent(id, currentUser);
        return ResponseEntity.ok("Event deleted successfully");
    }

    // Publish event
    @PatchMapping("/{id}/publish")
    public ResponseEntity<EventResponse> publishEvent(
            @PathVariable Long id,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(eventService.publishEvent(id, currentUser));
    }

    // Toggle suspend / resume event
    @PatchMapping("/{id}/toggle-suspend")
    public ResponseEntity<EventResponse> toggleSuspendEvent(
            @PathVariable Long id,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(eventService.toggleSuspendEvent(id, currentUser));
    }

    // Archive event
    @PatchMapping("/{id}/archive")
    public ResponseEntity<EventResponse> archiveEvent(
            @PathVariable Long id,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(eventService.archiveEvent(id, currentUser));
    }
}