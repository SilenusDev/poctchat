package com.openclassrooms.api.configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.openclassrooms.api.models.Role;
import com.openclassrooms.api.services.UserService;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);
    
    private final UserService userService;

    public DataInitializer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Starting data initialization...");
        
        // Créer un utilisateur admin par défaut si il n'existe pas
        try {
            if (!userService.emailExists("admin@admin.com")) {
                logger.info("Creating default admin user...");
                userService.register("Admin", "admin@admin.com", "Admin@123", Role.ADMIN);
                logger.info("Default admin user created successfully");
            } else {
                logger.info("Admin user already exists, skipping creation");
            }
        } catch (Exception e) {
            logger.error("Failed to create default admin user: {}", e.getMessage());
        }

        // Créer un utilisateur client de test si il n'existe pas
        try {
            if (!userService.emailExists("user@user.com")) {
                logger.info("Creating default client user...");
                userService.register("User", "user@user.com", "User@123", Role.CLIENT);
                logger.info("Default client user created successfully");
            } else {
                logger.info("Client user already exists, skipping creation");
            }
        } catch (Exception e) {
            logger.error("Failed to create default client user: {}", e.getMessage());
        }
        
        logger.info("Data initialization completed");
    }
}
