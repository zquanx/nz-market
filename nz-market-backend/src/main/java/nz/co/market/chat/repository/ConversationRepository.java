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
    
    @Query("SELECT c FROM Conversation c WHERE c.item.id = :itemId AND c.buyerId = :buyerId AND c.sellerId = :sellerId")
    Optional<Conversation> findByItemIdAndBuyerIdAndSellerId(@Param("itemId") UUID itemId, 
                                                             @Param("buyerId") UUID buyerId, 
                                                             @Param("sellerId") UUID sellerId);
    
    @Query("SELECT c FROM Conversation c WHERE (c.buyerId = :userId OR c.sellerId = :userId) ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByBuyerIdOrSellerIdOrderByLastMessageAtDesc(@Param("userId") UUID userId, 
                                                                       @Param("userId") UUID userId2);
}