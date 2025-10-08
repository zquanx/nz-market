package nz.co.market.admin.repository;

import nz.co.market.admin.entity.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ReportRepository extends JpaRepository<Report, UUID> {
    
    Page<Report> findByStatusOrderByCreatedAtDesc(Report.ReportStatus status, Pageable pageable);
    
    long countByStatus(Report.ReportStatus status);
    
    @Query("SELECT r FROM Report r WHERE " +
           "r.targetType = :targetType AND " +
           "r.targetId = :targetId AND " +
           "r.status = 'OPEN'")
    Page<Report> findOpenReportsByTarget(@Param("targetType") Report.ReportTargetType targetType, 
                                        @Param("targetId") UUID targetId, 
                                        Pageable pageable);
}
