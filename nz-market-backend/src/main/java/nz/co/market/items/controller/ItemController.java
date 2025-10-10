package nz.co.market.items.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.auth.entity.User;
import nz.co.market.items.dto.CreateItemRequest;
import nz.co.market.items.dto.ItemResponse;
import nz.co.market.items.dto.ItemSearchRequest;
import nz.co.market.items.service.ItemService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Items", description = "Item management endpoints")
public class ItemController {
    
    private final ItemService itemService;
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create a new item")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ItemResponse> createItem(
            @Valid @RequestBody CreateItemRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Creating item: {} by user: {}", request.getTitle(), user.getEmail());
        ItemResponse response = itemService.createItem(request, user);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get item by ID")
    public ResponseEntity<ItemResponse> getItem(@PathVariable UUID id) {
        ItemResponse response = itemService.getItemById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search items")
    public ResponseEntity<Page<ItemResponse>> searchItems(ItemSearchRequest request) {
        Page<ItemResponse> response = itemService.searchItems(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/latest")
    @Operation(summary = "Get latest items")
    public ResponseEntity<List<ItemResponse>> getLatestItems(
            @RequestParam(defaultValue = "10") int limit) {
        List<ItemResponse> response = itemService.getLatestItems(limit);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/popular")
    @Operation(summary = "Get most viewed items")
    public ResponseEntity<List<ItemResponse>> getMostViewedItems(
            @RequestParam(defaultValue = "10") int limit) {
        List<ItemResponse> response = itemService.getMostViewedItems(limit);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/my-items")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get current user's items")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Page<ItemResponse>> getMyItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User user) {
        Page<ItemResponse> response = itemService.getUserItems(user.getId(), page, size);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Update item")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable UUID id,
            @Valid @RequestBody CreateItemRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Updating item: {} by user: {}", id, user.getEmail());
        ItemResponse response = itemService.updateItem(id, request, user);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Delete item")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteItem(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        itemService.deleteItem(id, user);
        return ResponseEntity.ok().build();
    }
}
