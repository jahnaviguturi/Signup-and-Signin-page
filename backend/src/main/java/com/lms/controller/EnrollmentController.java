package com.lms.controller;

import com.lms.model.Enrollment;
import com.lms.repository.EnrollmentRepository;
import com.lms.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/enroll")
public class EnrollmentController {
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @PostMapping
    public ResponseEntity<?> enrollInCourse(@RequestBody Map<String, Long> payload) {
        Long courseId = payload.get("courseId");
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getId();

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            return ResponseEntity.badRequest().body("Error: Already enrolled in this course!");
        }

        Enrollment enrollment = Enrollment.builder()
                .userId(userId)
                .courseId(courseId)
                .enrolledAt(LocalDateTime.now())
                .build();

        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok("Enrolled successfully!");
    }

    @GetMapping("/my-courses")
    public List<Enrollment> getMyEnrollments() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return enrollmentRepository.findByUserId(userDetails.getId());
    }

    @GetMapping("/status/{courseId}")
    public ResponseEntity<?> getEnrollmentStatus(@PathVariable Long courseId) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        boolean isEnrolled = enrollmentRepository.existsByUserIdAndCourseId(userDetails.getId(), courseId);
        return ResponseEntity.ok(Map.of("enrolled", isEnrolled));
    }
}
