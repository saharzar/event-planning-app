package com.eventplanning.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventRequest {

    @NotBlank(message = "Event title cannot be empty")
    private String title;

    private String description;

    @NotBlank(message = "Location cannot be empty")
    private String location;

    @NotBlank(message = "Category cannot be empty")
    private String category;

    @NotNull(message = "Date cannot be null")
    @FutureOrPresent(message = "Date cannot be in the past")
    private LocalDate date;

    @NotNull(message = "Time cannot be null")
    private LocalTime time;
}