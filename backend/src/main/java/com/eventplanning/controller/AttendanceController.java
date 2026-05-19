package com.eventplanning.controller;

import com.eventplanning.dto.response.AttendanceResponse;
import com.eventplanning.entity.User;
import com.eventplanning.service.AttendanceService;
import com.eventplanning.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserService userService;

    // Join event
    @PostMapping("/{eventId}/join")
    public ResponseEntity<AttendanceResponse> joinEvent(
            @PathVariable Long eventId,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        AttendanceResponse response = attendanceService.joinEvent(eventId, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get participants of an event
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<AttendanceResponse>> getParticipants(
            @PathVariable Long eventId,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(attendanceService.getParticipants(eventId, currentUser));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AttendanceResponse>> getMyJoinedEvents(HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(attendanceService.getMyJoinedEvents(currentUser));
    }

    @GetMapping("/{eventId}/joined")
    public ResponseEntity<Boolean> hasJoined(
            @PathVariable Long eventId,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        return ResponseEntity.ok(attendanceService.hasJoined(eventId, currentUser));
    }

    @GetMapping("/{eventId}/count")
    public ResponseEntity<Long> getAttendeeCount(@PathVariable Long eventId) {
        return ResponseEntity.ok(attendanceService.getAttendeeCount(eventId));
    }

    @DeleteMapping("/{eventId}/leave")
    public ResponseEntity<String> leaveEvent(
            @PathVariable Long eventId,
            HttpSession session) {
        User currentUser = userService.getSessionUser(session);
        attendanceService.leaveEvent(eventId, currentUser);
        return ResponseEntity.ok("Left event successfully");
    }
}