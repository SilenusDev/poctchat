package com.openclassrooms.api.repositories;

import com.openclassrooms.api.models.Conversation;
import com.openclassrooms.api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    /**
     * Find conversation between two users (regardless of order)
     */
    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.user1.id = :user1Id AND c.user2.id = :user2Id) OR " +
           "(c.user1.id = :user2Id AND c.user2.id = :user1Id)")
    Optional<Conversation> findConversationBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
    
    /**
     * Find all conversations for a specific user
     */
    @Query("SELECT c FROM Conversation c WHERE c.user1.id = :userId OR c.user2.id = :userId ORDER BY c.createdAt DESC")
    List<Conversation> findConversationsByUserId(@Param("userId") Long userId);
    
    /**
     * Find conversations where user is user1
     */
    List<Conversation> findByUser1OrderByCreatedAtDesc(User user1);
    
    /**
     * Find conversations where user is user2
     */
    List<Conversation> findByUser2OrderByCreatedAtDesc(User user2);
    
    /**
     * Find conversations by user1 ID
     */
    List<Conversation> findByUser1IdOrderByCreatedAtDesc(Long user1Id);
    
    /**
     * Find conversations by user2 ID
     */
    List<Conversation> findByUser2IdOrderByCreatedAtDesc(Long user2Id);
    
    /**
     * Count conversations for a user
     */
    @Query("SELECT COUNT(c) FROM Conversation c WHERE c.user1.id = :userId OR c.user2.id = :userId")
    Long countConversationsByUserId(@Param("userId") Long userId);
    
    /**
     * Find conversation between two users with specific title
     */
    @Query("SELECT c FROM Conversation c WHERE " +
           "((c.user1.id = :user1Id AND c.user2.id = :user2Id) OR " +
           "(c.user1.id = :user2Id AND c.user2.id = :user1Id)) AND " +
           "c.titre = :titre")
    Optional<Conversation> findConversationBetweenUsersWithTitle(@Param("user1Id") Long user1Id, 
                                                                @Param("user2Id") Long user2Id, 
                                                                @Param("titre") com.openclassrooms.api.models.ConversationTitre titre);
}
