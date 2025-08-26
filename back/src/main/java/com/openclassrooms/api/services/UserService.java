package com.openclassrooms.api.services;

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


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper; // Ajout de la dépendance

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
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.CLIENT); // Default role for new users
        user.setCreated_at(LocalDateTime.now());

        userRepository.save(user);

        return jwtService.generateSimpleToken(user.getEmail());
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public String authenticate(String email, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            if (authentication.isAuthenticated()) {
                return jwtService.generateToken(authentication);
            } else {
                throw new RuntimeException("Invalid credentials");
            }
        } catch (Exception e) {
            throw new RuntimeException("Invalid credentials");
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
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get user conversations
        List<Conversation> conversations = conversationRepository.findConversationsByUserId(user.getId());
        List<ConversationDTO> conversationDTOs = conversations.stream()
                .map(ConversationDTO::fromEntity)
                .collect(Collectors.toList());

        // Create UserDTO with conversations
        UserDTO userDTO = userMapper.toDTO(user);
        userDTO.setConversations(conversationDTOs);
        
        return userDTO;
    }

    // Assure-toi que cette méthode existe bien
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }



    public Optional<UserUpdateDTO> updateUser(UserUpdateDTO userUpdateDTO) {
        Optional<User> userOptional = userRepository.findById(userUpdateDTO.getId());
    
        if (userOptional.isPresent()) {
            User user = userOptional.get();
    
            // Mise à jour des champs username et email si non null
            if (userUpdateDTO.getUsername() != null) {
                user.setUsername(userUpdateDTO.getUsername());
            }
            
            if (userUpdateDTO.getEmail() != null) {
                user.setEmail(userUpdateDTO.getEmail());
            }
            
            // Mise à jour du mot de passe si non null ou non vide
            if (userUpdateDTO.getPassword() != null && !userUpdateDTO.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userUpdateDTO.getPassword()));
            }
    
            try {
                userRepository.save(user);
                return Optional.of(userUpdateDTO);
            } catch (Exception e) {
                throw e;
            }
        } else {
            return Optional.empty();
        }
    }
}

