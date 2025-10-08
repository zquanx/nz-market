package nz.co.market.admin.repository;

import nz.co.market.admin.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    
    Page<AuditLog> findByActorIdOrderByCreatedAtDesc(UUID actorId, Pageable pageable);
    
    @Query("SELECT a FROM AuditLog a WHERE " +
           "a.targetType = :targetType AND " +
           "a.targetId = :targetId " +
           "ORDER BY a.createdAt DESC")
    Page<AuditLog> findByTargetOrderByCreatedAtDesc(@Param("targetType") String targetType, 
                                                   @Param("targetId") UUID targetId, 
                                                   Pageable pageable);
    
    @Query("SELECT a FROM AuditLog a WHERE " +
           "a.createdAt >= :startDate AND " +
           "a.createdAt <= :endDate " +
           "ORDER BY a.createdAt DESC")
    Page<AuditLog> findByDateRange(@Param("startDate") ZonedDateTime startDate, 
                                  @Param("endDate") ZonedDateTime endDate, 
                                  Pageable pageable);
}
