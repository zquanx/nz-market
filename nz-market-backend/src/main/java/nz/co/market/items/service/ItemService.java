package nz.co.market.items.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.auth.entity.User;
import nz.co.market.items.dto.CreateItemRequest;
import nz.co.market.items.dto.ItemResponse;
import nz.co.market.items.dto.ItemSearchRequest;
import nz.co.market.items.entity.Category;
import nz.co.market.items.entity.Item;
import nz.co.market.items.entity.ItemImage;
import nz.co.market.items.entity.Tag;
import nz.co.market.items.enums.ItemStatus;
import nz.co.market.items.mapper.ItemMapper;
import nz.co.market.items.repository.CategoryRepository;
import nz.co.market.items.repository.ItemRepository;
import nz.co.market.items.repository.TagRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemService {
    
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final ItemMapper itemMapper;
    
    @Transactional
    public ItemResponse createItem(CreateItemRequest request, User seller) {
        log.info("Creating item: {} by user: {}", request.getTitle(), seller.getEmail());
        
        Item item = Item.builder()
                .seller(seller)
                .title(request.getTitle())
                .description(request.getDescription())
                .priceNzd(request.getPriceNzd())
                .condition(request.getCondition())
                .quantity(request.getQuantity())
                .tradeMethod(request.getTradeMethod())
                .locationCity(request.getLocationCity())
                .lat(request.getLat())
                .lng(request.getLng())
                .status(ItemStatus.ACTIVE)
                .build();
        
        // Set category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            item.setCategory(category);
        }
        
        // Set tags if provided
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            item.setTags(tags);
        }
        
        // Set images if provided
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            final Item finalItem = item;
            List<ItemImage> images = request.getImageUrls().stream()
                    .map(url -> ItemImage.builder()
                            .item(finalItem)
                            .url(url)
                            .sortOrder(request.getImageUrls().indexOf(url))
                            .build())
                    .collect(Collectors.toList());
            item.setImages(images);
        }
        
        item = itemRepository.save(item);
        return itemMapper.toResponse(item);
    }
    
    @Transactional(readOnly = true)
    public ItemResponse getItemById(UUID id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        // Increment view count
        item.setViewCount(item.getViewCount() + 1);
        itemRepository.save(item);
        
        return itemMapper.toResponse(item);
    }
    
    @Transactional(readOnly = true)
    public Page<ItemResponse> searchItems(ItemSearchRequest request) {
        Sort sort = Sort.by(
                Sort.Direction.fromString(request.getSortDirection()),
                request.getSortBy()
        );
        
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);
        
        Page<Item> items = itemRepository.searchItems(
                request.getKeyword(),
                request.getCategoryId(),
                request.getMinPrice(),
                request.getMaxPrice(),
                request.getCity(),
                ItemStatus.ACTIVE,
                pageable
        );
        
        return items.map(itemMapper::toResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<ItemResponse> getUserItems(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Item> items = itemRepository.findBySellerIdAndStatus(userId, ItemStatus.ACTIVE, pageable);
        return items.map(itemMapper::toResponse);
    }
    
    @Transactional(readOnly = true)
    public List<ItemResponse> getLatestItems(int limit) {
        List<Item> items = itemRepository.findLatestActiveItems(limit);
        return items.stream()
                .map(itemMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ItemResponse> getMostViewedItems(int limit) {
        List<Item> items = itemRepository.findMostViewedItems(limit);
        return items.stream()
                .map(itemMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public ItemResponse updateItem(UUID itemId, CreateItemRequest request, User user) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        // Check if user is authorized to update this item
        if (!item.getSeller().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Not authorized to update this item");
        }
        
        // Update item fields
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setPriceNzd(request.getPriceNzd());
        item.setCondition(request.getCondition());
        item.setQuantity(request.getQuantity());
        item.setTradeMethod(request.getTradeMethod());
        item.setLocationCity(request.getLocationCity());
        item.setLat(request.getLat());
        item.setLng(request.getLng());
        
        // Update category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            item.setCategory(category);
        }
        
        // Update tags if provided
        if (request.getTagIds() != null && !request.getTagIds().isEmpty()) {
            List<Tag> tags = tagRepository.findAllById(request.getTagIds());
            item.setTags(tags);
        }
        
        // Update images if provided
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            // Clear existing images
            item.getImages().clear();
            
            // Add new images
            final Item finalItem = item;
            List<ItemImage> images = request.getImageUrls().stream()
                    .map(url -> ItemImage.builder()
                            .item(finalItem)
                            .url(url)
                            .sortOrder(request.getImageUrls().indexOf(url))
                            .build())
                    .collect(Collectors.toList());
            item.setImages(images);
        }
        
        item = itemRepository.save(item);
        return itemMapper.toResponse(item);
    }
    
    @Transactional
    public void deleteItem(UUID itemId, User user) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        if (!item.getSeller().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Not authorized to delete this item");
        }
        
        item.setStatus(ItemStatus.INACTIVE);
        itemRepository.save(item);
    }
}
