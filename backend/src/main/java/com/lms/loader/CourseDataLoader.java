package com.lms.loader;

import com.lms.model.*;
import com.lms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Arrays;

@Component
public class CourseDataLoader implements CommandLineRunner {

    @Autowired
    private CourseRepository courseRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (courseRepository.count() == 0) {
            loadJavaCourse();
            loadPythonCourse();
            loadReactCourse();
            loadDSACourse();
            loadSQLCourse();
            loadWebDevCourse();
            loadMLCourse();
            loadDataAnalyticsCourse();
        }
    }

    private void loadJavaCourse() {
        Course course = createCourse("Java Programming Masterclass", 
            "A comprehensive guide to Java from beginner to advanced.", 
            "https://img.youtube.com/vi/A74TOX803D0/maxresdefault.jpg", 
            "Java Programming");
        
        Section s1 = createSection(course, "Introduction to Java");
        createLesson(s1, "What is Java?", "A74TOX803D0", "15:00", 1);
        createLesson(s1, "Setting up Development Environment", "mG4id6fN6Y0", "10:00", 2);
        
        Section s2 = createSection(course, "Core Concepts");
        createLesson(s2, "Variables and Data Types", "98_Rre89n24", "12:00", 3);
        createLesson(s2, "Control Flow Statements", "ozP669EIkA8", "18:00", 4);
        
        courseRepository.save(course);
    }

    private void loadPythonCourse() {
        Course course = createCourse("Python for Everyone", 
            "The perfect starting point for your coding journey with Python.", 
            "https://img.youtube.com/vi/rfscVS0vtbw/maxresdefault.jpg", 
            "Python Programming");
        
        Section s1 = createSection(course, "Getting Started");
        createLesson(s1, "Python Installation", "rfscVS0vtbw", "08:00", 1);
        
        Section s2 = createSection(course, "Basics");
        createLesson(s2, "Functions and Modules", "8nGNzdX46Is", "25:00", 2);
        
        courseRepository.save(course);
    }

    private void loadReactCourse() {
        Course course = createCourse("Modern React Development", 
            "Build professional UI using React and modern hooks.", 
            "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg", 
            "React Development");
        
        Section s1 = createSection(course, "Foundations");
        createLesson(s1, "Introduction to React", "bMknfKXIFA8", "20:00", 1);
        createLesson(s1, "Understanding JSX", "hQAHSlTtcmY", "15:00", 2);
        
        courseRepository.save(course);
    }

    private void loadDSACourse() {
        Course course = createCourse("Data Structures & Algorithms", 
            "Master the fundamentals of problem solving manually.", 
            "https://img.youtube.com/vi/RBSGKlAvoiM/maxresdefault.jpg", 
            "Data Structures & Algorithms");
        
        Section s1 = createSection(course, "Complexity");
        createLesson(s1, "Big O Notation", "RBSGKlAvoiM", "30:00", 1);
        
        courseRepository.save(course);
    }

    private void loadSQLCourse() {
        Course course = createCourse("SQL & Databases for Beginners", 
            "Learn relational databases and SQL queries from scratch.", 
            "https://img.youtube.com/vi/HXV3zeQKqGY/maxresdefault.jpg", 
            "SQL & Databases");
        
        Section s1 = createSection(course, "SQL Basics");
        createLesson(s1, "Relational Database Design", "HXV3zeQKqGY", "25:00", 1);
        
        courseRepository.save(course);
    }

    private void loadWebDevCourse() {
        Course course = createCourse("Full Stack Web Development", 
            "The complete guide to building modern web applications.", 
            "https://img.youtube.com/vi/zJSY8tJY_67/maxresdefault.jpg", 
            "Web Development");
        
        Section s1 = createSection(course, "HTML & CSS");
        createLesson(s1, "Modern CSS Layouts", "zJSY8tJY_67", "40:00", 1);
        
        courseRepository.save(course);
    }

    private void loadMLCourse() {
        Course course = createCourse("Machine Learning Fundamentals", 
            "Understand the math and logic behind AI.", 
            "https://img.youtube.com/vi/NWONeJKn6vc/maxresdefault.jpg", 
            "Machine Learning");
        
        Section s1 = createSection(course, "Introduction");
        createLesson(s1, "What is Machine Learning?", "NWONeJKn6vc", "22:00", 1);
        
        courseRepository.save(course);
    }

    private void loadDataAnalyticsCourse() {
        Course course = createCourse("Data Analytics with Excel & SQL", 
            "Turning data into insights for business decisions.", 
            "https://img.youtube.com/vi/rG7P82sK7eU/maxresdefault.jpg", 
            "Data Analytics");
        
        Section s1 = createSection(course, "Basics");
        createLesson(s1, "Introduction to Data Analytics", "rG7P82sK7eU", "18:00", 1);
        
        courseRepository.save(course);
    }

    private Course createCourse(String title, String desc, String thumb, String cat) {
        return Course.builder()
                .title(title)
                .description(desc)
                .thumbnail(thumb)
                .category(cat)
                .instructorId(1L)
                .sections(new ArrayList<>())
                .build();
    }

    private Section createSection(Course course, String title) {
        Section section = Section.builder()
                .title(title)
                .course(course)
                .lessons(new ArrayList<>())
                .build();
        course.getSections().add(section);
        return section;
    }

    private void createLesson(Section section, String title, String videoId, String duration, int order) {
        Lesson lesson = Lesson.builder()
                .title(title)
                .youtubeVideoId(videoId)
                .duration(duration)
                .orderNumber(order)
                .section(section)
                .build();
        section.getLessons().add(lesson);
    }
}
