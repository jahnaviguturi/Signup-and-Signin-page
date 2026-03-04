package com.lms.controller;

import com.lms.model.Progress;
import com.lms.repository.ProgressRepository;
import com.lms.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    @Autowired
    private ProgressRepository progressRepository;

    @PostMapping("/complete")
    public ResponseEntity<?> completeLesson(@RequestBody Map<String, Long> payload) {
        Long courseId = payload.get("courseId");
        Long lessonId = payload.get("lessonId");
        
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getId();

        Optional<Progress> existingProgress = progressRepository.findByUserIdAndLessonId(userId, lessonId);
        
        Progress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.setStatus("COMPLETED");
            progress.setLastWatchedAt(LocalDateTime.now());
        } else {
            progress = Progress.builder()
                    .userId(userId)
                    .courseId(courseId)
                    .lessonId(lessonId)
                    .status("COMPLETED")
                    .lastWatchedAt(LocalDateTime.now())
                    .build();
        }

        progressRepository.save(progress);

        return ResponseEntity.ok("Progress updated successfully!");
    }

    @GetMapping("/course/{courseId}")
    public List<Progress> getCourseProgress(@PathVariable Long courseId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return progressRepository.findByUserIdAndCourseId(userDetails.getId(), courseId);
    }

    @GetMapping("/resume/{courseId}")
    public ResponseEntity<?> resumeLastWatched(@PathVariable Long courseId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return progressRepository.findFirstByUserIdAndCourseIdOrderByLastWatchedAtDesc(userDetails.getId(), courseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
