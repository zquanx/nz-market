package nz.co.market.orders.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import nz.co.market.common.entity.BaseEntity;

import java.math.BigDecimal;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Payment extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentProvider provider = PaymentProvider.STRIPE;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(nullable = false, length = 3)
    @Builder.Default
    private String currency = "NZD";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.INIT;
    
    @Column(name = "payload_json", columnDefinition = "jsonb")
    private String payloadJson;
    
    public enum PaymentProvider {
        STRIPE
    }
    
    public enum PaymentStatus {
        INIT, SUCCEEDED, FAILED, REFUNDED
    }
}
