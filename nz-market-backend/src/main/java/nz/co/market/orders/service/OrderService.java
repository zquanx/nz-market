package nz.co.market.orders.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.auth.entity.User;
import nz.co.market.orders.dto.*;
import nz.co.market.orders.entity.Order;
import nz.co.market.orders.entity.Payment;
import nz.co.market.orders.mapper.OrderMapper;
import nz.co.market.orders.repository.OrderRepository;
import nz.co.market.orders.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderMapper orderMapper;
    
    @Value("${app.stripe.secret-key}")
    private String stripeSecretKey;
    
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request, User buyer) {
        // Validate item exists and is available
        // This would typically involve checking the item repository
        // For now, we'll create a mock order
        
        Order order = Order.builder()
                .item(null) // Would be fetched from item repository
                .buyer(buyer)
                .seller(null) // Would be fetched from item
                .priceAtOrder(BigDecimal.valueOf(100.00)) // Would be from item
                .escrow(request.getEscrow())
                .shippingAddressId(request.getShippingAddressId())
                .status(Order.OrderStatus.PENDING)
                .build();
        
        order = orderRepository.save(order);
        log.info("Created order {} for user {}", order.getId(), buyer.getEmail());
        
        return orderMapper.toResponse(order);
    }
    
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(UUID orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        // Check if user has access to this order
        if (!order.getBuyer().getId().equals(user.getId()) && 
            !order.getSeller().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        return orderMapper.toResponse(order);
    }
    
    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrders(UUID userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return orders.map(orderMapper::toResponse);
    }
    
    @Transactional
    public PaymentIntentResponse createPaymentIntent(UUID orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getBuyer().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("Order is not in pending status");
        }
        
        try {
            Stripe.apiKey = stripeSecretKey;
            
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(order.getPriceAtOrder().multiply(BigDecimal.valueOf(100)).longValue()) // Convert to cents
                    .setCurrency("nzd")
                    .putMetadata("order_id", orderId.toString())
                    .build();
            
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            
            // Create payment record
            Payment payment = Payment.builder()
                    .order(order)
                    .provider(Payment.PaymentProvider.STRIPE)
                    .amount(order.getPriceAtOrder())
                    .currency("NZD")
                    .status(Payment.PaymentStatus.INIT)
                    .payloadJson(paymentIntent.toJson())
                    .build();
            
            paymentRepository.save(payment);
            
            return PaymentIntentResponse.builder()
                    .clientSecret(paymentIntent.getClientSecret())
                    .paymentIntentId(paymentIntent.getId())
                    .amount(paymentIntent.getAmount())
                    .currency(paymentIntent.getCurrency())
                    .build();
                    
        } catch (StripeException e) {
            log.error("Failed to create payment intent for order {}", orderId, e);
            throw new RuntimeException("Failed to create payment intent", e);
        }
    }
    
    @Transactional
    public void handleStripeWebhook(String payload, String signature) {
        // This would typically involve verifying the webhook signature
        // and processing the payment status update
        log.info("Received Stripe webhook: {}", payload);
        // Implementation would go here
    }
    
    @Transactional
    public void cancelOrder(UUID orderId, User user) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (!order.getBuyer().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }
        
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new RuntimeException("Cannot cancel order in current status");
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        log.info("Cancelled order {} by user {}", orderId, user.getEmail());
    }
}
