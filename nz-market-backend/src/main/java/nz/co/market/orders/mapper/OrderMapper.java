package nz.co.market.orders.mapper;

import nz.co.market.orders.dto.OrderResponse;
import nz.co.market.orders.entity.Order;
import nz.co.market.orders.entity.Payment;
import nz.co.market.orders.entity.Shipment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    
    OrderMapper INSTANCE = Mappers.getMapper(OrderMapper.class);
    
    @Mapping(target = "item", ignore = true)
    @Mapping(target = "buyer", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "currency", constant = "NZD")
    @Mapping(target = "payments", ignore = true)
    @Mapping(target = "shipments", ignore = true)
    OrderResponse toResponse(Order order);
    
    @Mapping(target = "provider", source = "provider")
    @Mapping(target = "status", source = "status")
    OrderResponse.PaymentDto toPaymentDto(Payment payment);
    
    @Mapping(target = "status", source = "status")
    OrderResponse.ShipmentDto toShipmentDto(Shipment shipment);
}
