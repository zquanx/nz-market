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
public class MessageResponse {
    
    private UUID id;
    private UUID senderId;
    private String content;
    private Message.MessageType type;
    private ZonedDateTime createdAt;
    private ZonedDateTime readAt;
}
