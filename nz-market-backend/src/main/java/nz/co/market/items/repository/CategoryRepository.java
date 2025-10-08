package nz.co.market.items.repository;

import nz.co.market.items.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    
    Optional<Category> findBySlug(String slug);
    
    List<Category> findByParentIsNullOrderBySortOrder();
    
    List<Category> findByParentIdOrderBySortOrder(UUID parentId);
    
    @Query("SELECT c FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Category> searchByName(@Param("query") String query);
}
