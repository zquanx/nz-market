package nz.co.market.chat.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.auth.entity.User;
import nz.co.market.chat.dto.ChatMessageRequest;
import nz.co.market.chat.dto.ChatMessageResponse;
import nz.co.market.chat.dto.ConversationResponse;
import nz.co.market.chat.dto.CreateConversationRequest;
import nz.co.market.chat.service.ChatService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Chat", description = "Chat and messaging endpoints")
public class ChatController {
    
    private final ChatService chatService;
    
    @PostMapping("/conversations")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create a new conversation")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ConversationResponse> createConversation(
            @Valid @RequestBody CreateConversationRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Creating conversation for item: {} by user: {}", request.getItemId(), user.getEmail());
        ConversationResponse response = chatService.createConversation(request, user);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/conversations")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get user's conversations")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<ConversationResponse>> getConversations(
            @AuthenticationPrincipal User user) {
        List<ConversationResponse> conversations = chatService.getUserConversations(user.getId());
        return ResponseEntity.ok(conversations);
    }
    
    @GetMapping("/conversations/{conversationId}/messages")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get messages in a conversation")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Page<ChatMessageResponse>> getMessages(
            @PathVariable UUID conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User user) {
        Page<ChatMessageResponse> messages = chatService.getConversationMessages(conversationId, user.getId(), page, size);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/conversations/{conversationId}/messages")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Send a message")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @PathVariable UUID conversationId,
            @Valid @RequestBody ChatMessageRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Sending message in conversation: {} by user: {}", conversationId, user.getEmail());
        ChatMessageResponse response = chatService.sendMessage(conversationId, request, user);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/conversations/{conversationId}/read")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Mark conversation as read")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> markAsRead(
            @PathVariable UUID conversationId,
            @AuthenticationPrincipal User user) {
        chatService.markConversationAsRead(conversationId, user.getId());
        return ResponseEntity.ok().build();
    }
    
}