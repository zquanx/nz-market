package nz.co.market.orders.repository;

import nz.co.market.orders.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    
    @Query("SELECT p FROM Payment p WHERE p.order.id = :orderId AND p.status = 'SUCCEEDED'")
    Optional<Payment> findSuccessfulPaymentByOrderId(@Param("orderId") UUID orderId);
    
    @Query("SELECT p FROM Payment p WHERE p.payloadJson LIKE %:stripePaymentIntentId%")
    Optional<Payment> findByStripePaymentIntentId(@Param("stripePaymentIntentId") String stripePaymentIntentId);
}
