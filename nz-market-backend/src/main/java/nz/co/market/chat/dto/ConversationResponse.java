package nz.co.market.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nz.co.market.chat.entity.Message;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    
    private UUID id;
    private ItemDto item;
    private UserDto otherUser;
    private MessageDto lastMessage;
    private Long unreadCount;
    private ZonedDateTime createdAt;
    private ZonedDateTime lastMessageAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDto {
        private UUID id;
        private String title;
        private String imageUrl;
        private String price;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto {
        private UUID id;
        private String displayName;
        private String avatarUrl;
        private String location;
        private Double rating;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MessageDto {
        private UUID id;
        private String content;
        private Message.MessageType type;
        private ZonedDateTime createdAt;
        private ZonedDateTime readAt;
    }
}
