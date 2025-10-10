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
public class ConversationResponse {
    
    private UUID id;
    private UUID itemId;
    private String itemTitle;
    private UUID buyerId;
    private UUID sellerId;
    private ZonedDateTime createdAt;
    private ZonedDateTime lastMessageAt;
    
}
