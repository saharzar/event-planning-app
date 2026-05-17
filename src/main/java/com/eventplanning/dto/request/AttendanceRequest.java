package com.eventplanning.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class AttendanceRequest {

    @NotNull(message = "Event ID cannot be null")
    private Long eventId;
}