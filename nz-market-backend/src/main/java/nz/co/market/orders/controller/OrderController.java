package nz.co.market.orders.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.auth.entity.User;
import nz.co.market.orders.dto.*;
import nz.co.market.orders.service.OrderService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Orders", description = "Order management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create a new order")
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Creating order for item {} by user {}", request.getItemId(), user.getEmail());
        OrderResponse order = orderService.createOrder(request, user);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get order by ID")
    public ResponseEntity<OrderResponse> getOrder(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        OrderResponse order = orderService.getOrderById(id, user);
        return ResponseEntity.ok(order);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get user orders")
    public ResponseEntity<Page<OrderResponse>> getUserOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User user) {
        Page<OrderResponse> orders = orderService.getUserOrders(user.getId(), page, size);
        return ResponseEntity.ok(orders);
    }
    
    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create payment intent for order")
    public ResponseEntity<PaymentIntentResponse> createPaymentIntent(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        PaymentIntentResponse paymentIntent = orderService.createPaymentIntent(id, user);
        return ResponseEntity.ok(paymentIntent);
    }
    
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Cancel order")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        orderService.cancelOrder(id, user);
        return ResponseEntity.ok().build();
    }
}
