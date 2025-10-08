package nz.co.market.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import nz.co.market.auth.entity.User;
import nz.co.market.common.entity.BaseEntity;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Report extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private ReportTargetType targetType;
    
    @Column(name = "target_id", nullable = false)
    private UUID targetId;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ReportStatus status = ReportStatus.OPEN;
    
    @Column(name = "resolved_at")
    private ZonedDateTime resolvedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private User resolvedBy;
    
    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;
    
    public enum ReportTargetType {
        ITEM, USER, MESSAGE
    }
    
    public enum ReportStatus {
        OPEN, RESOLVED, DISMISSED
    }
}
