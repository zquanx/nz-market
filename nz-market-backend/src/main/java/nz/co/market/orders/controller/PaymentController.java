package nz.co.market.orders.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.orders.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payments", description = "Payment processing endpoints")
public class PaymentController {
    
    private final OrderService orderService;
    
    @PostMapping("/stripe/webhook")
    @Operation(summary = "Stripe webhook endpoint")
    public ResponseEntity<Void> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signature) {
        
        log.info("Received Stripe webhook");
        orderService.handleStripeWebhook(payload, signature);
        return ResponseEntity.ok().build();
    }
}
