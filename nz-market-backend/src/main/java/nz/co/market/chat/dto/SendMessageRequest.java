package nz.co.market.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import nz.co.market.chat.entity.Message;

@Data
public class SendMessageRequest {
    
    @NotNull(message = "Message type is required")
    private Message.MessageType type;
    
    @NotBlank(message = "Message content is required")
    private String content;
}
