package nz.co.market.chat.repository;

import nz.co.market.chat.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    
    Page<ChatMessage> findByConversationIdOrderByCreatedAtAsc(UUID conversationId, Pageable pageable);
    
    @Query("SELECT m FROM ChatMessage m WHERE m.conversation.id = :conversationId AND m.senderId != :userId AND m.readAt IS NULL")
    List<ChatMessage> findUnreadMessagesInConversation(@Param("conversationId") UUID conversationId, 
                                                       @Param("userId") UUID userId);
}
