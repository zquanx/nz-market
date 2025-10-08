package nz.co.market.items.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import nz.co.market.auth.entity.User;
import nz.co.market.common.entity.BaseEntity;
import nz.co.market.items.enums.ItemCondition;
import nz.co.market.items.enums.ItemStatus;
import nz.co.market.items.enums.TradeMethod;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Item extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Column(name = "price_nzd", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceNzd;
    
    @Column(nullable = false, length = 3)
    @Builder.Default
    private String currency = "NZD";
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCondition condition;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ItemStatus status = ItemStatus.ACTIVE;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "trade_method", nullable = false)
    private TradeMethod tradeMethod;
    
    @Column(name = "location_city", length = 100)
    private String locationCity;
    
    @Column(precision = 10, scale = 8)
    private BigDecimal lat;
    
    @Column(precision = 11, scale = 8)
    private BigDecimal lng;
    
    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Integer viewCount = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ItemImage> images = new ArrayList<>();
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "item_tags",
        joinColumns = @JoinColumn(name = "item_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private List<Tag> tags = new ArrayList<>();
}
