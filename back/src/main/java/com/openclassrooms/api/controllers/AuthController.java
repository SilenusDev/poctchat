package com.openclassrooms.api.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.openclassrooms.api.dto.LoginRequestDTO;
import com.openclassrooms.api.dto.RegisterRequest;
import com.openclassrooms.api.dto.RegisterResponseDTO;
import com.openclassrooms.api.dto.UserDTO;
import com.openclassrooms.api.models.ErrorResponse;
import com.openclassrooms.api.services.UserService;
// import com.openclassrooms.api.services.SubjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

   
    @Operation(summary = "Register a new user", description = "Registers a new user and returns a JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User registered successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = RegisterRequest.class),
            examples = @ExampleObject(
                name = "Register Example",
                value = "{\"name\": \"user\", \"email\": \"test@user.com\", \"password\": \"user1234\"}"
            )
        )
    ) RegisterRequest request) {
        MDC.put("operation", "user_registration");
        MDC.put("email", request.getEmail());
        
        logger.info("Registration attempt for email: {}", request.getEmail());
        
        try {
            if (userService.emailExists(request.getEmail())) {
                logger.warn("SECURITY_EVENT: Registration failed - email already exists: {}", request.getEmail());
                return ResponseEntity.badRequest()
                    .body("Cet email est déjà utilisé");
            }

            logger.debug("Creating new user with name: {} and email: {}", request.getName(), request.getEmail());
            String token = userService.register(
                request.getName(),
                request.getEmail(),
                request.getPassword()
            );
            RegisterResponseDTO registerResponseDTO = new RegisterResponseDTO(token);
            logger.info("SECURITY_EVENT: User registered successfully: {}", request.getEmail());
            return ResponseEntity.ok(registerResponseDTO);
            
        } catch (Exception e) {
            logger.error("SECURITY_EVENT: Registration failed for email: {} - Error: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body("Erreur lors de l'enregistrement: " + e.getMessage());
        } finally {
            MDC.clear();
        }
    }

    @Operation(summary = "Login a user", description = "Authenticates a user and returns a JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User logged in successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "401", description = "Invalid credentials",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class))),
        @ApiResponse(responseCode = "500", description = "Internal server error",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Map.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody @io.swagger.v3.oas.annotations.parameters.RequestBody(
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = LoginRequestDTO.class),
            examples = @ExampleObject(
                name = "Login Example",
                value = "{\"email\": \"user@user.com\", \"password\": \"User@1234\"}"
            )
        )
    ) LoginRequestDTO credentials) {
        String email = credentials.getEmail();
        MDC.put("operation", "user_login");
        MDC.put("email", email);
        
        logger.info("SECURITY_EVENT: Login attempt for email: {}", email);
        logger.debug("Processing authentication for user: {}", email);

        try {
            String token = userService.authenticate(email, credentials.getPassword());
            logger.info("SECURITY_EVENT: Login successful for email: {}", email);
            return ResponseEntity.ok(java.util.Collections.singletonMap("token", token));
        } catch (RuntimeException e) {
            logger.warn("SECURITY_EVENT: Login failed for email: {} - Reason: {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Collections.singletonMap("error", "Invalid credentials"));
        } finally {
            MDC.clear();
        }
    }

    @Operation(summary = "Get current user", description = "Returns the current authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User details retrieved successfully",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorResponse.class))),    
        @ApiResponse(responseCode = "500", description = "Internal server error",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class)))
    })
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        MDC.put("operation", "get_current_user");
        MDC.put("email", email);
        
        logger.info("Getting current user info for email: {}", email);
        logger.debug("Fetching user details and conversations for: {}", email);
        
        try {
            UserDTO userDTO = userService.getCurrentUser(email);
            logger.debug("Successfully retrieved user info for: {}", email);
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            logger.error("Failed to get current user for email: {} - Error: {}", email, e.getMessage(), e);
            throw e;
        } finally {
            MDC.clear();
        }
    }
}





