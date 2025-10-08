package nz.co.market.admin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import nz.co.market.auth.entity.User;
import nz.co.market.common.entity.BaseEntity;

import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AuditLog extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private User actor;
    
    @Column(nullable = false, length = 100)
    private String action;
    
    @Column(name = "target_type", nullable = false, length = 50)
    private String targetType;
    
    @Column(name = "target_id", nullable = false)
    private UUID targetId;
    
    @Column(name = "metadata_json", columnDefinition = "jsonb")
    private String metadataJson;
}
