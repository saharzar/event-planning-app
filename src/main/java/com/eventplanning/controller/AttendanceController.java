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
}