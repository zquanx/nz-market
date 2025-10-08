package nz.co.market.orders.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateOrderRequest {
    
    @NotNull(message = "Item ID is required")
    private UUID itemId;
    
    private Boolean escrow = false;
    
    private UUID shippingAddressId;
}
