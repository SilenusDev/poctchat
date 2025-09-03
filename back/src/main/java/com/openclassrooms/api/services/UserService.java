package com.openclassrooms.api.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.openclassrooms.api.dto.UserDTO;
import com.openclassrooms.api.dto.UserUpdateDTO;
import com.openclassrooms.api.dto.ConversationDTO;
import com.openclassrooms.api.mappers.UserMapper;
import com.openclassrooms.api.models.User;
import com.openclassrooms.api.models.Role;
import com.openclassrooms.api.models.Conversation;
import com.openclassrooms.api.repositories.UserRepository;
import com.openclassrooms.api.repositories.ConversationRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    public UserService(AuthenticationManager authenticationManager,
                      JWTService jwtService,
                      PasswordEncoder passwordEncoder,
                      UserRepository userRepository,
                      ConversationRepository conversationRepository,
                      UserMapper userMapper) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
        this.userMapper = userMapper;
    }

    public String register(String username, String email, String password) {
        return register(username, email, password, Role.CLIENT);
    }
    
    public String register(String username, String email, String password, Role role) {
        logger.info("Starting user registration process for email: {} with role: {}", email, role);
        MDC.put("operation", "user_registration");
        MDC.put("email", email);
        MDC.put("role", role.name());
        
        try {
            if (userRepository.findByEmail(email).isPresent()) {
                logger.warn("Registration failed - email already exists: {}", email);
                throw new RuntimeException("Email déjà utilisé");
            }

            logger.debug("Creating new user entity for username: {} and email: {} with role: {}", username, email, role);
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            user.setCreated_at(LocalDateTime.now());

            logger.debug("Saving user to database for email: {}", email);
            userRepository.save(user);
            
            logger.info("User successfully registered with email: {} and role: {}, generating JWT token", email, role);
            String token = jwtService.generateSimpleToken(user.getEmail());
            
            logger.info("Registration completed successfully for email: {} with role: {}", email, role);
            return token;
            
        } catch (RuntimeException e) {
            logger.error("Registration failed for email: {} - Error: {}", email, e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error during registration for email: {} - Error: {}", email, e.getMessage(), e);
            throw new RuntimeException("Registration failed due to unexpected error", e);
        } finally {
            MDC.clear();
        }
    }

    public boolean emailExists(String email) {
        logger.debug("Checking if email exists: {}", email);
        boolean exists = userRepository.findByEmail(email).isPresent();
        logger.debug("Email {} exists: {}", email, exists);
        return exists;
    }

    public String authenticate(String email, String password) {
        logger.info("Starting authentication process for email: {}", email);
        MDC.put("operation", "user_authentication");
        MDC.put("email", email);
        
        try {
            logger.debug("Attempting authentication with AuthenticationManager for email: {}", email);
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            if (authentication.isAuthenticated()) {
                logger.info("Authentication successful for email: {}, generating JWT token", email);
                String token = jwtService.generateToken(authentication);
                logger.info("JWT token generated successfully for email: {}", email);
                return token;
            } else {
                logger.warn("Authentication failed - user not authenticated for email: {}", email);
                throw new RuntimeException("Invalid credentials");
            }
        } catch (org.springframework.security.core.AuthenticationException e) {
            logger.warn("Authentication failed for email: {} - Spring Security error: {}", email, e.getClass().getSimpleName());
            throw new RuntimeException("Invalid credentials");
        } catch (Exception e) {
            logger.error("Unexpected error during authentication for email: {} - Error: {}", email, e.getMessage(), e);
            throw new RuntimeException("Authentication failed due to unexpected error");
        } finally {
            MDC.clear();
        }
    }

    public Optional<UserDTO> getUserById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return Optional.of(UserDTO.fromEntity(user));
        }
        return Optional.empty();
    }

    public UserDTO getCurrentUser(String email) {
        logger.info("Retrieving current user data for email: {}", email);
        MDC.put("operation", "get_current_user");
        MDC.put("email", email);
        
        try {
            logger.debug("Searching for user by email: {}", email);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> {
                        logger.warn("User not found for email: {}", email);
                        return new RuntimeException("User not found");
                    });

            logger.debug("User found, retrieving conversations for user ID: {}", user.getId());
            List<Conversation> conversations = conversationRepository.findConversationsByUserId(user.getId());
            List<ConversationDTO> conversationDTOs = conversations.stream()
                    .map(ConversationDTO::fromEntity)
                    .collect(Collectors.toList());

            logger.debug("Found {} conversations for user: {}", conversations.size(), email);
            UserDTO userDTO = userMapper.toDTO(user);
            userDTO.setConversations(conversationDTOs);
            
            logger.info("Successfully retrieved user data for email: {} with {} conversations", email, conversations.size());
            return userDTO;
            
        } catch (Exception e) {
            logger.error("Failed to retrieve current user for email: {} - Error: {}", email, e.getMessage(), e);
            throw e;
        } finally {
            MDC.clear();
        }
    }

    // Assure-toi que cette méthode existe bien
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }



    public Optional<UserUpdateDTO> updateUser(UserUpdateDTO userUpdateDTO) {
        logger.info("Starting user update process for user ID: {}", userUpdateDTO.getId());
        MDC.put("operation", "user_update");
        MDC.put("userId", String.valueOf(userUpdateDTO.getId()));
        
        try {
            Optional<User> userOptional = userRepository.findById(userUpdateDTO.getId());
        
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                logger.debug("User found for update, current email: {}", user.getEmail());
        
                // Log field updates
                if (userUpdateDTO.getUsername() != null) {
                    logger.debug("Updating username from '{}' to '{}'", user.getUsername(), userUpdateDTO.getUsername());
                    user.setUsername(userUpdateDTO.getUsername());
                }
                
                if (userUpdateDTO.getEmail() != null) {
                    logger.debug("Updating email from '{}' to '{}'", user.getEmail(), userUpdateDTO.getEmail());
                    user.setEmail(userUpdateDTO.getEmail());
                }
                
                if (userUpdateDTO.getPassword() != null && !userUpdateDTO.getPassword().isEmpty()) {
                    logger.debug("Updating password for user ID: {}", userUpdateDTO.getId());
                    user.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
                }
        
                try {
                    userRepository.save(user);
                    logger.info("User successfully updated for ID: {}", userUpdateDTO.getId());
                    return Optional.of(userUpdateDTO);
                } catch (Exception e) {
                    logger.error("Failed to save user updates for ID: {} - Error: {}", userUpdateDTO.getId(), e.getMessage(), e);
                    throw e;
                }
            } else {
                logger.warn("User not found for update with ID: {}", userUpdateDTO.getId());
                return Optional.empty();
            }
        } finally {
            MDC.clear();
        }
    }
}

