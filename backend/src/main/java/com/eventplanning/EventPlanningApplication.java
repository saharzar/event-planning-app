package com.eventplanning;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class EventPlanningApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventPlanningApplication.class, args);
	}

}
