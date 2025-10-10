package nz.co.market.items.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import nz.co.market.auth.entity.User;
import nz.co.market.auth.entity.UserProfile;
import nz.co.market.items.dto.ItemResponse;
import nz.co.market.items.entity.Category;
import nz.co.market.items.entity.Item;
import nz.co.market.items.entity.ItemImage;
import nz.co.market.items.entity.Tag;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-10T14:30:09+1300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class ItemMapperImpl implements ItemMapper {

    @Override
    public ItemResponse toResponse(Item item) {
        if ( item == null ) {
            return null;
        }

        ItemResponse.ItemResponseBuilder itemResponse = ItemResponse.builder();

        itemResponse.seller( userToSellerDto( item.getSeller() ) );
        itemResponse.category( categoryToCategoryDto( item.getCategory() ) );
        itemResponse.condition( item.getCondition() );
        itemResponse.createdAt( item.getCreatedAt() );
        itemResponse.currency( item.getCurrency() );
        itemResponse.description( item.getDescription() );
        itemResponse.id( item.getId() );
        itemResponse.images( itemImageListToImageDtoList( item.getImages() ) );
        itemResponse.lat( item.getLat() );
        itemResponse.lng( item.getLng() );
        itemResponse.locationCity( item.getLocationCity() );
        itemResponse.priceNzd( item.getPriceNzd() );
        itemResponse.quantity( item.getQuantity() );
        itemResponse.status( item.getStatus() );
        itemResponse.tags( tagListToTagDtoList( item.getTags() ) );
        itemResponse.title( item.getTitle() );
        itemResponse.tradeMethod( item.getTradeMethod() );
        itemResponse.updatedAt( item.getUpdatedAt() );
        itemResponse.viewCount( item.getViewCount() );

        return itemResponse.build();
    }

    private String userProfileLocation(User user) {
        if ( user == null ) {
            return null;
        }
        UserProfile profile = user.getProfile();
        if ( profile == null ) {
            return null;
        }
        String location = profile.getLocation();
        if ( location == null ) {
            return null;
        }
        return location;
    }

    protected ItemResponse.SellerDto userToSellerDto(User user) {
        if ( user == null ) {
            return null;
        }

        ItemResponse.SellerDto.SellerDtoBuilder sellerDto = ItemResponse.SellerDto.builder();

        sellerDto.id( user.getId() );
        sellerDto.displayName( user.getDisplayName() );
        sellerDto.avatarUrl( user.getAvatarUrl() );
        sellerDto.location( userProfileLocation( user ) );

        return sellerDto.build();
    }

    protected ItemResponse.CategoryDto categoryToCategoryDto(Category category) {
        if ( category == null ) {
            return null;
        }

        ItemResponse.CategoryDto.CategoryDtoBuilder categoryDto = ItemResponse.CategoryDto.builder();

        categoryDto.id( category.getId() );
        categoryDto.name( category.getName() );
        categoryDto.slug( category.getSlug() );

        return categoryDto.build();
    }

    protected ItemResponse.ImageDto itemImageToImageDto(ItemImage itemImage) {
        if ( itemImage == null ) {
            return null;
        }

        ItemResponse.ImageDto.ImageDtoBuilder imageDto = ItemResponse.ImageDto.builder();

        imageDto.id( itemImage.getId() );
        imageDto.sortOrder( itemImage.getSortOrder() );
        imageDto.url( itemImage.getUrl() );

        return imageDto.build();
    }

    protected List<ItemResponse.ImageDto> itemImageListToImageDtoList(List<ItemImage> list) {
        if ( list == null ) {
            return null;
        }

        List<ItemResponse.ImageDto> list1 = new ArrayList<ItemResponse.ImageDto>( list.size() );
        for ( ItemImage itemImage : list ) {
            list1.add( itemImageToImageDto( itemImage ) );
        }

        return list1;
    }

    protected ItemResponse.TagDto tagToTagDto(Tag tag) {
        if ( tag == null ) {
            return null;
        }

        ItemResponse.TagDto.TagDtoBuilder tagDto = ItemResponse.TagDto.builder();

        tagDto.id( tag.getId() );
        tagDto.name( tag.getName() );
        tagDto.slug( tag.getSlug() );

        return tagDto.build();
    }

    protected List<ItemResponse.TagDto> tagListToTagDtoList(List<Tag> list) {
        if ( list == null ) {
            return null;
        }

        List<ItemResponse.TagDto> list1 = new ArrayList<ItemResponse.TagDto>( list.size() );
        for ( Tag tag : list ) {
            list1.add( tagToTagDto( tag ) );
        }

        return list1;
    }
}
