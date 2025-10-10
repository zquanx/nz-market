package nz.co.market.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    
    private UUID id;
    private UUID conversationId;
    private UUID senderId;
    private String content;
    private ChatMessageRequest.MessageType messageType;
    private String imageUrl;
    private ZonedDateTime createdAt;
    private ZonedDateTime readAt;
}
