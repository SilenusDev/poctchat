package com.openclassrooms.api.controllers;

import com.openclassrooms.api.dto.ConversationDTO;
import com.openclassrooms.api.models.User;
import com.openclassrooms.api.models.Role;
import com.openclassrooms.api.models.Conversation;
import com.openclassrooms.api.repositories.ConversationRepository;
import com.openclassrooms.api.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;
import com.openclassrooms.api.dto.MessageDTO;
import com.openclassrooms.api.models.Message;
import com.openclassrooms.api.repositories.MessageRepository;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private static final Logger logger = LoggerFactory.getLogger(ConversationController.class);

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;

    public ConversationController(ConversationRepository conversationRepository, UserRepository userRepository, PasswordEncoder passwordEncoder, MessageRepository messageRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.messageRepository = messageRepository;
    }

    @Operation(summary = "Get my conversations", description = "Retourne les conversations de l'utilisateur authentifié par date descendante")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conversations récupérées",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ConversationDTO.class))),
            @ApiResponse(responseCode = "401", description = "Non autorisé",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "500", description = "Erreur serveur",
                    content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/my")
    public ResponseEntity<List<ConversationDTO>> getMyConversations(Authentication authentication) {
        String email = authentication.getName();
        MDC.put("operation", "get_my_conversations");
        MDC.put("email", email);
        try {
            logger.info("Retrieving conversations for current user: {}", email);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<ConversationDTO> results = conversationRepository.findConversationsByUserId(user.getId())
                    .stream()
                    .map(ConversationDTO::fromEntity)
                    .collect(Collectors.toList());

            logger.debug("Found {} conversations for {}", results.size(), email);
            return ResponseEntity.ok(results);
        } finally {
            MDC.clear();
        }
    }

    @Operation(summary = "Get conversation details", description = "Retourne les détails d'une conversation avec les informations des utilisateurs")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conversation récupérée",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ConversationDTO.class))),
            @ApiResponse(responseCode = "404", description = "Conversation non trouvée"),
            @ApiResponse(responseCode = "403", description = "Accès interdit")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ConversationDTO> getConversation(Authentication authentication, @org.springframework.web.bind.annotation.PathVariable Long id) {
        String email = authentication.getName();
        MDC.put("operation", "get_conversation");
        MDC.put("email", email);
        MDC.put("conversationId", String.valueOf(id));
        
        try {
            logger.info("Retrieving conversation {} for user: {}", id, email);
            
            Conversation conversation = conversationRepository.findById(id).orElse(null);
            if (conversation == null) {
                logger.warn("Conversation {} not found", id);
                return ResponseEntity.notFound().build();
            }
            
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null || (!conversation.getUser1().getId().equals(user.getId()) && !conversation.getUser2().getId().equals(user.getId()))) {
                logger.warn("User {} not authorized to access conversation {}", email, id);
                return ResponseEntity.status(403).build();
            }
            
            logger.debug("Conversation {} retrieved successfully for user {}", id, email);
            return ResponseEntity.ok(ConversationDTO.fromEntity(conversation));
        } finally {
            MDC.clear();
        }
    }

    @Operation(summary = "Get conversation messages", description = "Retourne l'historique des messages d'une conversation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Messages récupérés",
                    content = @Content(mediaType = "application/json")),
            @ApiResponse(responseCode = "404", description = "Conversation non trouvée")
    })

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageDTO>> getMessages(Authentication authentication, @org.springframework.web.bind.annotation.PathVariable Long id) {
        // Vérifie que la conversation existe et que l'utilisateur y participe
        Conversation conv = conversationRepository.findById(id).orElse(null);
        if (conv == null) return ResponseEntity.notFound().build();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || (!conv.getUser1().getId().equals(user.getId()) && !conv.getUser2().getId().equals(user.getId()))) {
            return ResponseEntity.status(403).build();
        }
        List<Message> messages = messageRepository.findByConversationIdOrderBySentAtAsc(id);
        List<MessageDTO> dto = messages.stream().map(MessageDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Contact support", description = "Crée ou retourne la conversation avec un administrateur (support)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Conversation de support retournée",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = ConversationDTO.class))),
            @ApiResponse(responseCode = "404", description = "Aucun administrateur trouvé",
                    content = @Content(mediaType = "application/json"))
    })
    @PostMapping("/contact-support")
    public ResponseEntity<ConversationDTO> contactSupport(Authentication authentication) {
        String email = authentication.getName();
        MDC.put("operation", "contact_support");
        MDC.put("email", email);
        try {
            User current = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<User> admins = userRepository.findByRole(Role.ADMIN);
            final User adminUser;
            if (admins.isEmpty()) {
                User newAdmin = new User();
                newAdmin.setUsername("Support");
                newAdmin.setEmail("support@local");
                newAdmin.setPassword(passwordEncoder.encode("support1234"));
                newAdmin.setRole(Role.ADMIN);
                newAdmin.setCreated_at(java.time.LocalDateTime.now());
                adminUser = userRepository.save(newAdmin);
            } else {
                adminUser = admins.get(0);
            }

            Conversation conversation = conversationRepository
                    .findConversationBetweenUsers(current.getId(), adminUser.getId())
                    .orElseGet(() -> {
                        Conversation c = new Conversation();
                        c.setUser1(current);
                        c.setUser2(adminUser);
                        c.setCreatedAt(java.time.LocalDateTime.now());
                        return conversationRepository.save(c);
                    });

            return ResponseEntity.ok(ConversationDTO.fromEntity(conversation));
        } finally {
            MDC.clear();
        }
    }
}


