package nz.co.market.items.mapper;

import nz.co.market.items.dto.ItemResponse;
import nz.co.market.items.entity.Item;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ItemMapper {
    
    ItemMapper INSTANCE = Mappers.getMapper(ItemMapper.class);
    
    @Mapping(target = "seller.id", source = "seller.id")
    @Mapping(target = "seller.displayName", source = "seller.displayName")
    @Mapping(target = "seller.avatarUrl", source = "seller.avatarUrl")
    @Mapping(target = "seller.location", source = "seller.profile.location")
    @Mapping(target = "category.id", source = "category.id")
    @Mapping(target = "category.name", source = "category.name")
    @Mapping(target = "category.slug", source = "category.slug")
    ItemResponse toResponse(Item item);
}
