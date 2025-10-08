package nz.co.market.items.repository;

import nz.co.market.items.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {
    
    Optional<Tag> findBySlug(String slug);
    
    @Query("SELECT t FROM Tag t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Tag> searchByName(@Param("query") String query);
    
    @Query("SELECT t FROM Tag t ORDER BY t.name")
    List<Tag> findAllOrderByName();
}
