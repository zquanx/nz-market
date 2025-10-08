package nz.co.market.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import nz.co.market.common.entity.BaseEntity;

@Entity
@Table(name = "user_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class UserProfile extends BaseEntity {
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    @Column(length = 255)
    private String location;
    
    @Column(name = "preferred_lang", length = 10)
    @Builder.Default
    private String preferredLang = "en";
    
    @Column(length = 100)
    private String wechat;
    
    @Column(length = 100)
    private String telegram;
}
