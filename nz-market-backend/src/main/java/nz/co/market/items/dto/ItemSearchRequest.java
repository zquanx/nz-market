package nz.co.market.items.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class ItemSearchRequest {
    
    private String keyword;
    private UUID categoryId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String city;
    private String sortBy = "createdAt"; // createdAt, price, viewCount
    private String sortDirection = "desc"; // asc, desc
    private int page = 0;
    private int size = 20;
}
