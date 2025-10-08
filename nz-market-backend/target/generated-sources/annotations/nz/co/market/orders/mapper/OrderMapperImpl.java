package nz.co.market.orders.mapper;

import javax.annotation.processing.Generated;
import nz.co.market.orders.dto.OrderResponse;
import nz.co.market.orders.entity.Order;
import nz.co.market.orders.entity.Payment;
import nz.co.market.orders.entity.Shipment;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-08T13:46:39+1300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderResponse toResponse(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderResponse.OrderResponseBuilder orderResponse = OrderResponse.builder();

        orderResponse.id( order.getId() );
        orderResponse.priceAtOrder( order.getPriceAtOrder() );
        orderResponse.status( order.getStatus() );
        orderResponse.escrow( order.getEscrow() );
        orderResponse.shippingAddressId( order.getShippingAddressId() );
        orderResponse.createdAt( order.getCreatedAt() );
        orderResponse.updatedAt( order.getUpdatedAt() );

        orderResponse.currency( "NZD" );

        return orderResponse.build();
    }

    @Override
    public OrderResponse.PaymentDto toPaymentDto(Payment payment) {
        if ( payment == null ) {
            return null;
        }

        OrderResponse.PaymentDto.PaymentDtoBuilder paymentDto = OrderResponse.PaymentDto.builder();

        paymentDto.provider( payment.getProvider() );
        paymentDto.status( payment.getStatus() );
        paymentDto.id( payment.getId() );
        paymentDto.amount( payment.getAmount() );
        paymentDto.currency( payment.getCurrency() );
        paymentDto.createdAt( payment.getCreatedAt() );

        return paymentDto.build();
    }

    @Override
    public OrderResponse.ShipmentDto toShipmentDto(Shipment shipment) {
        if ( shipment == null ) {
            return null;
        }

        OrderResponse.ShipmentDto.ShipmentDtoBuilder shipmentDto = OrderResponse.ShipmentDto.builder();

        shipmentDto.status( shipment.getStatus() );
        shipmentDto.id( shipment.getId() );
        shipmentDto.carrier( shipment.getCarrier() );
        shipmentDto.trackingNo( shipment.getTrackingNo() );
        shipmentDto.shippedAt( shipment.getShippedAt() );
        shipmentDto.deliveredAt( shipment.getDeliveredAt() );

        return shipmentDto.build();
    }
}
