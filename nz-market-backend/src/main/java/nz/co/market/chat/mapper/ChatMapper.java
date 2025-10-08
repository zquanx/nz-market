package nz.co.market.chat.mapper;

import nz.co.market.chat.dto.ConversationResponse;
import nz.co.market.chat.dto.MessageResponse;
import nz.co.market.chat.entity.Conversation;
import nz.co.market.chat.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface ChatMapper {
    
    ChatMapper INSTANCE = Mappers.getMapper(ChatMapper.class);
    
    @Mapping(target = "item", ignore = true)
    @Mapping(target = "otherUser", ignore = true)
    @Mapping(target = "lastMessage", ignore = true)
    @Mapping(target = "unreadCount", constant = "0L")
    ConversationResponse toConversationResponse(Conversation conversation, UUID currentUserId);
    
    @Mapping(target = "senderId", source = "sender.id")
    MessageResponse toMessageResponse(Message message);
    
    default nz.co.market.auth.entity.User getOtherUser(Conversation conversation, UUID currentUserId) {
        if (conversation.getBuyer().getId().equals(currentUserId)) {
            return conversation.getSeller();
        } else {
            return conversation.getBuyer();
        }
    }
    
    @org.mapstruct.Named("getLastMessage")
    default ConversationResponse.MessageDto getLastMessage(java.util.List<Message> messages) {
        if (messages == null || messages.isEmpty()) {
            return null;
        }
        
        Message lastMessage = messages.stream()
                .max((m1, m2) -> m1.getCreatedAt().compareTo(m2.getCreatedAt()))
                .orElse(null);
        
        if (lastMessage == null) {
            return null;
        }
        
        return ConversationResponse.MessageDto.builder()
                .id(lastMessage.getId())
                .content(lastMessage.getContent())
                .type(lastMessage.getType())
                .createdAt(lastMessage.getCreatedAt())
                .readAt(lastMessage.getReadAt())
                .build();
    }
}
