package nz.co.market.chat.mapper;

import java.util.UUID;
import javax.annotation.processing.Generated;
import nz.co.market.auth.entity.User;
import nz.co.market.chat.dto.ConversationResponse;
import nz.co.market.chat.dto.MessageResponse;
import nz.co.market.chat.entity.Conversation;
import nz.co.market.chat.entity.Message;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-08T13:46:39+1300",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.1 (Oracle Corporation)"
)
@Component
public class ChatMapperImpl implements ChatMapper {

    @Override
    public ConversationResponse toConversationResponse(Conversation conversation, UUID currentUserId) {
        if ( conversation == null && currentUserId == null ) {
            return null;
        }

        ConversationResponse.ConversationResponseBuilder conversationResponse = ConversationResponse.builder();

        if ( conversation != null ) {
            conversationResponse.id( conversation.getId() );
            conversationResponse.createdAt( conversation.getCreatedAt() );
            conversationResponse.lastMessageAt( conversation.getLastMessageAt() );
        }
        conversationResponse.unreadCount( (long) 0L );

        return conversationResponse.build();
    }

    @Override
    public MessageResponse toMessageResponse(Message message) {
        if ( message == null ) {
            return null;
        }

        MessageResponse.MessageResponseBuilder messageResponse = MessageResponse.builder();

        messageResponse.senderId( messageSenderId( message ) );
        messageResponse.id( message.getId() );
        messageResponse.content( message.getContent() );
        messageResponse.type( message.getType() );
        messageResponse.createdAt( message.getCreatedAt() );
        messageResponse.readAt( message.getReadAt() );

        return messageResponse.build();
    }

    private UUID messageSenderId(Message message) {
        if ( message == null ) {
            return null;
        }
        User sender = message.getSender();
        if ( sender == null ) {
            return null;
        }
        UUID id = sender.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }
}
