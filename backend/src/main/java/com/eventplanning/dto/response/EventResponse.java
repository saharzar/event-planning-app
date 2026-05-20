package com.eventplanning.dto.response;

import com.eventplanning.entity.EventStatus;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private String category;
    private LocalDate date;
    private LocalTime time;
    private EventStatus status;
    private String imageUrl;
    private String organizerDisplayName;
    private java.util.List<String> extraImages;
    private UserResponse organizer;
}