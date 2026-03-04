package com.lms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
public class LmsBackendApplication {
    private static final Logger logger = LoggerFactory.getLogger(LmsBackendApplication.class);

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(LmsBackendApplication.class, args);
        
        String dbUrl = context.getEnvironment().getProperty("DB_URL");
        String dbUser = context.getEnvironment().getProperty("DB_USER");
        
        logger.info("Application started with DB_URL: {}", dbUrl);
        logger.info("Application started with DB_USER: {}", dbUser);
        
        if (dbUrl == null || dbUrl.isEmpty()) {
            logger.warn("DB_URL environment variable is missing! Please check your .env file or environment settings.");
        }
    }
}
