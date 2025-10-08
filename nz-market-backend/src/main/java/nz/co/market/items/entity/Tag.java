package nz.co.market.items.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import nz.co.market.common.entity.BaseEntity;

@Entity
@Table(name = "tags")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Tag extends BaseEntity {
    
    @Column(nullable = false, length = 50)
    private String name;
    
    @Column(unique = true, nullable = false, length = 50)
    private String slug;
}
