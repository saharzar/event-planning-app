package com.eventplanning.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AttendanceResponse {
    private Long id;
    private UserResponse user;
    private EventResponse event;
    private LocalDateTime joinedAt;
}