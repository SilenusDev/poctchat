package com.openclassrooms.api.repositories;

import com.openclassrooms.api.models.Message;
import com.openclassrooms.api.models.Conversation;
import com.openclassrooms.api.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    /**
     * Find messages by conversation ordered by sent date
     */
    List<Message> findByConversationOrderBySentAtAsc(Conversation conversation);
    
    /**
     * Find messages by conversation ID ordered by sent date
     */
    List<Message> findByConversationIdOrderBySentAtAsc(Long conversationId);
    
    /**
     * Find messages by sender
     */
    List<Message> findBySenderOrderBySentAtDesc(User sender);
    
    /**
     * Find messages by sender ID
     */
    List<Message> findBySenderIdOrderBySentAtDesc(Long senderId);
    
    /**
     * Find recent messages in a conversation (limit)
     */
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.sent_at DESC")
    List<Message> findRecentMessagesByConversationId(@Param("conversationId") Long conversationId);
    
    /**
     * Find messages containing specific content (case insensitive)
     */
    @Query("SELECT m FROM Message m WHERE LOWER(m.content) LIKE LOWER(CONCAT('%', :content, '%')) ORDER BY m.sent_at DESC")
    List<Message> findByContentContainingIgnoreCase(@Param("content") String content);
    
    /**
     * Find messages sent after a specific date
     */
    List<Message> findBySentAtAfterOrderBySentAtAsc(LocalDateTime dateTime);
    
    /**
     * Find messages in a conversation sent after a specific date
     */
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId AND m.sent_at > :dateTime ORDER BY m.sent_at ASC")
    List<Message> findByConversationIdAndSentAtAfter(@Param("conversationId") Long conversationId, @Param("dateTime") LocalDateTime dateTime);
    
    /**
     * Count messages in a conversation
     */
    Long countByConversationId(Long conversationId);
    
    /**
     * Count messages by sender
     */
    Long countBySenderId(Long senderId);
    
    /**
     * Find last message in a conversation
     */
    @Query("SELECT m FROM Message m WHERE m.conversation.id = :conversationId ORDER BY m.sent_at DESC LIMIT 1")
    Message findLastMessageByConversationId(@Param("conversationId") Long conversationId);
}
