package com.lms.repository;

import com.lms.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUserIdAndCourseId(Long userId, Long courseId);
    Optional<Progress> findByUserIdAndLessonId(Long userId, Long lessonId);
    Optional<Progress> findFirstByUserIdAndCourseIdOrderByLastWatchedAtDesc(Long userId, Long courseId);
}
