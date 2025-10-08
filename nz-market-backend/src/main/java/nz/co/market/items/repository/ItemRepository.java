package nz.co.market.items.repository;

import nz.co.market.items.entity.Item;
import nz.co.market.items.enums.ItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface ItemRepository extends JpaRepository<Item, UUID> {
    
    Page<Item> findByStatus(ItemStatus status, Pageable pageable);
    
    Page<Item> findBySellerIdAndStatus(UUID sellerId, ItemStatus status, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE " +
           "(:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR i.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR i.priceNzd >= :minPrice) AND " +
           "(:maxPrice IS NULL OR i.priceNzd <= :maxPrice) AND " +
           "(:city IS NULL OR LOWER(i.locationCity) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "i.status = :status")
    Page<Item> searchItems(@Param("keyword") String keyword,
                          @Param("categoryId") UUID categoryId,
                          @Param("minPrice") BigDecimal minPrice,
                          @Param("maxPrice") BigDecimal maxPrice,
                          @Param("city") String city,
                          @Param("status") ItemStatus status,
                          Pageable pageable);
    
    @Query("SELECT i FROM Item i JOIN i.tags t WHERE t.id = :tagId AND i.status = :status")
    Page<Item> findByTagIdAndStatus(@Param("tagId") UUID tagId, @Param("status") ItemStatus status, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.id IN " +
           "(SELECT f.item.id FROM Favorite f WHERE f.user.id = :userId)")
    Page<Item> findFavoriteItemsByUserId(@Param("userId") UUID userId, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE i.status = 'PENDING_APPROVAL'")
    Page<Item> findPendingApprovalItems(Pageable pageable);
    
    @Query(value = "SELECT * FROM items WHERE status = 'ACTIVE' ORDER BY created_at DESC LIMIT :limit", nativeQuery = true)
    List<Item> findLatestActiveItems(@Param("limit") int limit);
    
    @Query(value = "SELECT * FROM items WHERE status = 'ACTIVE' ORDER BY view_count DESC LIMIT :limit", nativeQuery = true)
    List<Item> findMostViewedItems(@Param("limit") int limit);
}
