package nz.co.market.orders.mapper;

import javax.annotation.processing.Generated;
import nz.co.market.orders.dto.OrderResponse;
import nz.co.market.orders.entity.Order;
import nz.co.market.orders.entity.Payment;
import nz.co.market.orders.entity.Shipment;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-10T14:30:09+1300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class OrderMapperImpl implements OrderMapper {

    @Override
    public OrderResponse toResponse(Order order) {
        if ( order == null ) {
            return null;
        }

        OrderResponse.OrderResponseBuilder orderResponse = OrderResponse.builder();

        orderResponse.createdAt( order.getCreatedAt() );
        orderResponse.escrow( order.getEscrow() );
        orderResponse.id( order.getId() );
        orderResponse.priceAtOrder( order.getPriceAtOrder() );
        orderResponse.shippingAddressId( order.getShippingAddressId() );
        orderResponse.status( order.getStatus() );
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
        paymentDto.amount( payment.getAmount() );
        paymentDto.createdAt( payment.getCreatedAt() );
        paymentDto.currency( payment.getCurrency() );
        paymentDto.id( payment.getId() );

        return paymentDto.build();
    }

    @Override
    public OrderResponse.ShipmentDto toShipmentDto(Shipment shipment) {
        if ( shipment == null ) {
            return null;
        }

        OrderResponse.ShipmentDto.ShipmentDtoBuilder shipmentDto = OrderResponse.ShipmentDto.builder();

        shipmentDto.status( shipment.getStatus() );
        shipmentDto.carrier( shipment.getCarrier() );
        shipmentDto.deliveredAt( shipment.getDeliveredAt() );
        shipmentDto.id( shipment.getId() );
        shipmentDto.shippedAt( shipment.getShippedAt() );
        shipmentDto.trackingNo( shipment.getTrackingNo() );

        return shipmentDto.build();
    }
}
