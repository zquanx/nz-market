package nz.co.market.chat.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.auth.entity.User;
import nz.co.market.chat.dto.*;
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
@SecurityRequirement(name = "bearerAuth")
public class ChatController {
    
    private final ChatService chatService;
    
    @GetMapping("/conversations")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get user conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(@AuthenticationPrincipal User user) {
        log.info("Getting conversations for user: {}", user.getEmail());
        List<ConversationResponse> conversations = chatService.getUserConversations(user.getId());
        return ResponseEntity.ok(conversations);
    }
    
    @PostMapping("/conversations")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Create a new conversation")
    public ResponseEntity<ConversationResponse> createConversation(
            @Valid @RequestBody CreateConversationRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Creating conversation for item {} with user {}", request.getItemId(), user.getEmail());
        ConversationResponse conversation = chatService.createConversation(request, user);
        return ResponseEntity.ok(conversation);
    }
    
    @GetMapping("/conversations/{conversationId}/messages")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get conversation messages")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @PathVariable UUID conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User user) {
        log.info("Getting messages for conversation {} by user {}", conversationId, user.getEmail());
        Page<MessageResponse> messages = chatService.getConversationMessages(conversationId, user.getId(), page, size);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/conversations/{conversationId}/messages")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Send a message")
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable UUID conversationId,
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal User user) {
        log.info("Sending message in conversation {} by user {}", conversationId, user.getEmail());
        MessageResponse message = chatService.sendMessage(conversationId, request, user);
        return ResponseEntity.ok(message);
    }
    
    @PostMapping("/conversations/{conversationId}/read")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Mark messages as read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable UUID conversationId,
            @AuthenticationPrincipal User user) {
        log.info("Marking messages as read in conversation {} by user {}", conversationId, user.getEmail());
        chatService.markMessagesAsRead(conversationId, user.getId());
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/conversations/{conversationId}/unread-count")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get unread message count")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable UUID conversationId,
            @AuthenticationPrincipal User user) {
        Long unreadCount = chatService.getUnreadMessageCount(conversationId, user.getId());
        return ResponseEntity.ok(unreadCount);
    }
}
