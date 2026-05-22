package com.eventplanning.scheduler;

import com.eventplanning.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class EventArchivingTask {

    private final EventRepository eventRepository;


    @Transactional
    @Scheduled(cron = "0 0 0 * * ?")
    public void archiveExpiredEvents() {
        LocalDate today = LocalDate.now();

        int updated = eventRepository.archiveExpiredEvents(today);

        if (updated > 0) {
            log.info("Nightly archiving complete: {} expired events archived as of {}", updated, today);
        } else {
            log.debug("Nightly archiving: no expired events found to archive as of {}", today);
        }
    }
}
