package nz.co.market.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatMessageRequest {
    
    @NotBlank(message = "Message content is required")
    private String content;
    
    @NotNull(message = "Message type is required")
    private MessageType messageType;
    
    private String imageUrl;
    
    public enum MessageType {
        TEXT, IMAGE, SYSTEM
    }
}
