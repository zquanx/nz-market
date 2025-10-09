package nz.co.market.items.repository;

import nz.co.market.items.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {

    Optional<Favorite> findByUserIdAndItemId(UUID userId, UUID itemId);

    boolean existsByUserIdAndItemId(UUID userId, UUID itemId);

    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.item.id = :itemId")
    long countByItemId(@Param("itemId") UUID itemId);

    void deleteByUserIdAndItemId(UUID userId, UUID itemId);
}
