package nz.co.market.orders.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nz.co.market.orders.entity.Order;
import nz.co.market.orders.entity.Payment;
import nz.co.market.orders.entity.Shipment;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    
    private UUID id;
    private ItemDto item;
    private UserDto buyer;
    private UserDto seller;
    private BigDecimal priceAtOrder;
    private String currency;
    private Order.OrderStatus status;
    private Boolean escrow;
    private UUID shippingAddressId;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private List<PaymentDto> payments;
    private List<ShipmentDto> shipments;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDto {
        private UUID id;
        private String title;
        private String imageUrl;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private UUID id;
        private String displayName;
        private String avatarUrl;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentDto {
        private UUID id;
        private Payment.PaymentProvider provider;
        private BigDecimal amount;
        private String currency;
        private Payment.PaymentStatus status;
        private ZonedDateTime createdAt;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShipmentDto {
        private UUID id;
        private String carrier;
        private String trackingNo;
        private Shipment.ShipmentStatus status;
        private ZonedDateTime shippedAt;
        private ZonedDateTime deliveredAt;
    }
}
