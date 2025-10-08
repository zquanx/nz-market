package nz.co.market.chat.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateConversationRequest {
    
    @NotNull(message = "Item ID is required")
    private UUID itemId;
    
    @NotNull(message = "Peer user ID is required")
    private UUID peerUserId;
}
