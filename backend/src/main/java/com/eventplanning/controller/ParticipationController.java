package com.eventplanning.controller;

import com.eventplanning.dto.response.ParticipationResponse;
import com.eventplanning.entity.User;
import com.eventplanning.service.ParticipationService;
import com.eventplanning.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participation")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;
    private final UserService userService;

    @PostMapping("/{eventId}/join")
    public ResponseEntity<ParticipationResponse> joinEvent(
            @PathVariable Long eventId,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        ParticipationResponse response = participationService.joinEvent(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<ParticipationResponse>> getParticipants(
            @PathVariable Long eventId,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(participationService.getParticipants(eventId, currentUser));
    }

    @GetMapping("/my/upcoming")
    public ResponseEntity<List<ParticipationResponse>> getMyUpcomingJoinedEvents(HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(participationService.getMyUpcomingJoinedEvents(currentUser));
    }

    @GetMapping("/my/archived")
    public ResponseEntity<List<ParticipationResponse>> getMyPastOrArchivedJoinedEvents(HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(participationService.getMyPastOrArchivedJoinedEvents(currentUser));
    }

    @GetMapping("/{eventId}/joined")
    public ResponseEntity<Boolean> hasJoined(
            @PathVariable Long eventId,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(participationService.hasJoined(eventId, currentUser));
    }

    @GetMapping("/{eventId}/count")
    public ResponseEntity<Long> getAttendeeCount(@PathVariable Long eventId) {
        return ResponseEntity.ok(participationService.getAttendeeCount(eventId));
    }

    @DeleteMapping("/{eventId}/leave")
    public ResponseEntity<String> leaveEvent(
            @PathVariable Long eventId,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        participationService.leaveEvent(eventId, currentUser);
        return ResponseEntity.ok("Left event successfully");
    }
}
