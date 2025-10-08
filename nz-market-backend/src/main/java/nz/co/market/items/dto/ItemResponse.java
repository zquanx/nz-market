package nz.co.market.items.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nz.co.market.items.enums.ItemCondition;
import nz.co.market.items.enums.ItemStatus;
import nz.co.market.items.enums.TradeMethod;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
    
    private UUID id;
    private String title;
    private String description;
    private BigDecimal priceNzd;
    private String currency;
    private ItemCondition condition;
    private Integer quantity;
    private ItemStatus status;
    private TradeMethod tradeMethod;
    private String locationCity;
    private BigDecimal lat;
    private BigDecimal lng;
    private Integer viewCount;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    
    private SellerDto seller;
    private CategoryDto category;
    private List<TagDto> tags;
    private List<ImageDto> images;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SellerDto {
        private UUID id;
        private String displayName;
        private String avatarUrl;
        private String location;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryDto {
        private UUID id;
        private String name;
        private String slug;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TagDto {
        private UUID id;
        private String name;
        private String slug;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageDto {
        private UUID id;
        private String url;
        private Integer sortOrder;
    }
}
