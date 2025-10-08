package nz.co.market.chat.repository;

import nz.co.market.chat.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    
    @Query("SELECT c FROM Conversation c WHERE " +
           "(c.buyer.id = :userId OR c.seller.id = :userId) " +
           "ORDER BY c.lastMessageAt DESC NULLS LAST, c.createdAt DESC")
    List<Conversation> findByUserIdOrderByLastMessageAtDesc(@Param("userId") UUID userId);
    
    @Query("SELECT c FROM Conversation c WHERE " +
           "c.item.id = :itemId AND " +
           "((c.buyer.id = :buyerId AND c.seller.id = :sellerId) OR " +
           "(c.buyer.id = :sellerId AND c.seller.id = :buyerId))")
    Optional<Conversation> findByItemIdAndBuyerIdAndSellerId(
            @Param("itemId") UUID itemId,
            @Param("buyerId") UUID buyerId,
            @Param("sellerId") UUID sellerId
    );
    
    @Query("SELECT c FROM Conversation c WHERE " +
           "c.id = :conversationId AND " +
           "(c.buyer.id = :userId OR c.seller.id = :userId)")
    Optional<Conversation> findByIdAndUserId(@Param("conversationId") UUID conversationId, @Param("userId") UUID userId);
}
