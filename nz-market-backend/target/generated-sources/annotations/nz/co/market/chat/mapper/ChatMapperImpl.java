package nz.co.market.chat.mapper;

import java.util.UUID;
import javax.annotation.processing.Generated;
import nz.co.market.chat.dto.ChatMessageRequest;
import nz.co.market.chat.dto.ChatMessageResponse;
import nz.co.market.chat.dto.ConversationResponse;
import nz.co.market.chat.entity.ChatMessage;
import nz.co.market.chat.entity.Conversation;
import nz.co.market.items.entity.Item;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-10T14:43:53+1300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class ChatMapperImpl implements ChatMapper {

    @Override
    public ConversationResponse toConversationResponse(Conversation conversation) {
        if ( conversation == null ) {
            return null;
        }

        ConversationResponse.ConversationResponseBuilder conversationResponse = ConversationResponse.builder();

        conversationResponse.itemId( conversationItemId( conversation ) );
        conversationResponse.itemTitle( conversationItemTitle( conversation ) );
        conversationResponse.buyerId( conversation.getBuyerId() );
        conversationResponse.createdAt( conversation.getCreatedAt() );
        conversationResponse.id( conversation.getId() );
        conversationResponse.lastMessageAt( conversation.getLastMessageAt() );
        conversationResponse.sellerId( conversation.getSellerId() );

        return conversationResponse.build();
    }

    @Override
    public ChatMessageResponse toChatMessageResponse(ChatMessage message) {
        if ( message == null ) {
            return null;
        }

        ChatMessageResponse.ChatMessageResponseBuilder chatMessageResponse = ChatMessageResponse.builder();

        chatMessageResponse.conversationId( messageConversationId( message ) );
        chatMessageResponse.content( message.getContent() );
        chatMessageResponse.createdAt( message.getCreatedAt() );
        chatMessageResponse.id( message.getId() );
        chatMessageResponse.imageUrl( message.getImageUrl() );
        chatMessageResponse.messageType( messageTypeToMessageType( message.getMessageType() ) );
        chatMessageResponse.readAt( message.getReadAt() );
        chatMessageResponse.senderId( message.getSenderId() );

        return chatMessageResponse.build();
    }

    private UUID conversationItemId(Conversation conversation) {
        if ( conversation == null ) {
            return null;
        }
        Item item = conversation.getItem();
        if ( item == null ) {
            return null;
        }
        UUID id = item.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String conversationItemTitle(Conversation conversation) {
        if ( conversation == null ) {
            return null;
        }
        Item item = conversation.getItem();
        if ( item == null ) {
            return null;
        }
        String title = item.getTitle();
        if ( title == null ) {
            return null;
        }
        return title;
    }

    private UUID messageConversationId(ChatMessage chatMessage) {
        if ( chatMessage == null ) {
            return null;
        }
        Conversation conversation = chatMessage.getConversation();
        if ( conversation == null ) {
            return null;
        }
        UUID id = conversation.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    protected ChatMessageRequest.MessageType messageTypeToMessageType(ChatMessage.MessageType messageType) {
        if ( messageType == null ) {
            return null;
        }

        ChatMessageRequest.MessageType messageType1;

        switch ( messageType ) {
            case IMAGE: messageType1 = ChatMessageRequest.MessageType.IMAGE;
            break;
            case SYSTEM: messageType1 = ChatMessageRequest.MessageType.SYSTEM;
            break;
            case TEXT: messageType1 = ChatMessageRequest.MessageType.TEXT;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + messageType );
        }

        return messageType1;
    }
}
