package nz.co.market.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import nz.co.market.common.entity.BaseEntity;

import java.time.ZonedDateTime;

@Entity
@Table(name = "email_verification_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class EmailVerificationToken extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(unique = true, nullable = false)
    private String token;
    
    @Column(name = "expires_at", nullable = false)
    private ZonedDateTime expiresAt;
}
