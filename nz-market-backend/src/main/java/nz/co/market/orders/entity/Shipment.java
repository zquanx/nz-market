package nz.co.market.orders.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import nz.co.market.common.entity.BaseEntity;

import java.time.ZonedDateTime;

@Entity
@Table(name = "shipments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Shipment extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(length = 100)
    private String carrier;
    
    @Column(name = "tracking_no", length = 100)
    private String trackingNo;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ShipmentStatus status = ShipmentStatus.PENDING;
    
    @Column(name = "shipped_at")
    private ZonedDateTime shippedAt;
    
    @Column(name = "delivered_at")
    private ZonedDateTime deliveredAt;
    
    public enum ShipmentStatus {
        PENDING, SHIPPED, DELIVERED
    }
}
