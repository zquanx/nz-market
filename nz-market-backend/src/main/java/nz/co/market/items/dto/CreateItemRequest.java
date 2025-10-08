package nz.co.market.items.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import nz.co.market.items.enums.ItemCondition;
import nz.co.market.items.enums.TradeMethod;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
public class CreateItemRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @DecimalMax(value = "999999.99", message = "Price must not exceed 999,999.99")
    private BigDecimal priceNzd;
    
    @NotNull(message = "Condition is required")
    private ItemCondition condition;
    
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 999, message = "Quantity must not exceed 999")
    private Integer quantity = 1;
    
    @NotNull(message = "Trade method is required")
    private TradeMethod tradeMethod;
    
    @Size(max = 100, message = "Location city must not exceed 100 characters")
    private String locationCity;
    
    @DecimalMin(value = "-90.0", message = "Invalid latitude")
    @DecimalMax(value = "90.0", message = "Invalid latitude")
    private BigDecimal lat;
    
    @DecimalMin(value = "-180.0", message = "Invalid longitude")
    @DecimalMax(value = "180.0", message = "Invalid longitude")
    private BigDecimal lng;
    
    private UUID categoryId;
    
    @Size(max = 10, message = "Maximum 10 tags allowed")
    private List<UUID> tagIds;
    
    @Size(max = 10, message = "Maximum 10 images allowed")
    private List<String> imageUrls;
}
