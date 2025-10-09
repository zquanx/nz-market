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
    date = "2025-10-09T21:28:42+1300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
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
        itemResponse.id( item.getId() );
        itemResponse.title( item.getTitle() );
        itemResponse.description( item.getDescription() );
        itemResponse.priceNzd( item.getPriceNzd() );
        itemResponse.currency( item.getCurrency() );
        itemResponse.condition( item.getCondition() );
        itemResponse.quantity( item.getQuantity() );
        itemResponse.status( item.getStatus() );
        itemResponse.tradeMethod( item.getTradeMethod() );
        itemResponse.locationCity( item.getLocationCity() );
        itemResponse.lat( item.getLat() );
        itemResponse.lng( item.getLng() );
        itemResponse.viewCount( item.getViewCount() );
        itemResponse.createdAt( item.getCreatedAt() );
        itemResponse.updatedAt( item.getUpdatedAt() );
        itemResponse.tags( tagListToTagDtoList( item.getTags() ) );
        itemResponse.images( itemImageListToImageDtoList( item.getImages() ) );

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

    protected ItemResponse.ImageDto itemImageToImageDto(ItemImage itemImage) {
        if ( itemImage == null ) {
            return null;
        }

        ItemResponse.ImageDto.ImageDtoBuilder imageDto = ItemResponse.ImageDto.builder();

        imageDto.id( itemImage.getId() );
        imageDto.url( itemImage.getUrl() );
        imageDto.sortOrder( itemImage.getSortOrder() );

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
}
