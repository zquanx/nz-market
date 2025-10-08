package nz.co.market.orders.repository;

import nz.co.market.orders.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    
    Page<Order> findByBuyerIdOrderByCreatedAtDesc(UUID buyerId, Pageable pageable);
    
    Page<Order> findBySellerIdOrderByCreatedAtDesc(UUID sellerId, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE " +
           "(o.buyer.id = :userId OR o.seller.id = :userId) " +
           "ORDER BY o.createdAt DESC")
    Page<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE o.item.id = :itemId AND o.status = 'PENDING'")
    List<Order> findPendingOrdersByItemId(@Param("itemId") UUID itemId);
    
    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' AND o.createdAt < :cutoffTime")
    List<Order> findExpiredPendingOrders(@Param("cutoffTime") java.time.ZonedDateTime cutoffTime);
}
