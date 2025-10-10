package nz.co.market.chat.mapper;

import nz.co.market.chat.dto.ChatMessageResponse;
import nz.co.market.chat.dto.ConversationResponse;
import nz.co.market.chat.entity.ChatMessage;
import nz.co.market.chat.entity.Conversation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ChatMapper {
    
    ChatMapper INSTANCE = Mappers.getMapper(ChatMapper.class);
    
    @Mapping(target = "itemId", source = "item.id")
    @Mapping(target = "itemTitle", source = "item.title")
    ConversationResponse toConversationResponse(Conversation conversation);
    
    @Mapping(target = "conversationId", source = "conversation.id")
    ChatMessageResponse toChatMessageResponse(ChatMessage message);
}
