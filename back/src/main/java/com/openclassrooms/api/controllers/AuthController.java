package com.openclassrooms.api.controllers;

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
        try {
            if (userService.emailExists(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body("Cet email est déjà utilisé");
            }

            String token = userService.register(
                request.getName(),
                request.getEmail(),
                request.getPassword()
            );
            RegisterResponseDTO registerResponseDTO = new RegisterResponseDTO(token);
            return ResponseEntity.ok(registerResponseDTO);
            
        } catch (Exception e) {
            System.out.println("Erreur lors de l'enregistrement: " + e.getMessage());
            return ResponseEntity.badRequest()
                .body("Erreur lors de l'enregistrement: " + e.getMessage());
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
        String password = credentials.getPassword();

        try {
            String token = userService.authenticate(email, password);
            return ResponseEntity.ok(java.util.Collections.singletonMap("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Collections.singletonMap("error", "Invalid credentials"));
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
        UserDTO userDTO = userService.getCurrentUser(email);
        return ResponseEntity.ok(userDTO);
    }
}





