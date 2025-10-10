package nz.co.market.chat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.auth.entity.User;
import nz.co.market.chat.dto.ChatMessageRequest;
import nz.co.market.chat.dto.ChatMessageResponse;
import nz.co.market.chat.dto.ConversationResponse;
import nz.co.market.chat.dto.CreateConversationRequest;
import nz.co.market.chat.entity.Conversation;
import nz.co.market.chat.entity.ChatMessage;
import nz.co.market.chat.repository.ConversationRepository;
import nz.co.market.chat.repository.ChatMessageRepository;
import nz.co.market.items.entity.Item;
import nz.co.market.items.repository.ItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final ItemRepository itemRepository;
    
    @Transactional
    public ConversationResponse createConversation(CreateConversationRequest request, User user) {
        // Find the item
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        // Check if conversation already exists
        Conversation existingConversation = conversationRepository
                .findByItemIdAndBuyerIdAndSellerId(request.getItemId(), request.getBuyerId(), request.getSellerId())
                .orElse(null);
        
        if (existingConversation != null) {
            return mapToConversationResponse(existingConversation);
        }
        
        // Create new conversation
        Conversation conversation = Conversation.builder()
                .item(item)
                .buyerId(request.getBuyerId())
                .sellerId(request.getSellerId())
                .createdAt(ZonedDateTime.now())
                .lastMessageAt(ZonedDateTime.now())
                .build();
        
        conversation = conversationRepository.save(conversation);
        return mapToConversationResponse(conversation);
    }
    
    @Transactional(readOnly = true)
    public List<ConversationResponse> getUserConversations(UUID userId) {
        List<Conversation> conversations = conversationRepository.findByBuyerIdOrSellerIdOrderByLastMessageAtDesc(userId, userId);
        return conversations.stream()
                .map(this::mapToConversationResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<ChatMessageResponse> getConversationMessages(UUID conversationId, UUID userId, int page, int size) {
        // Verify user has access to this conversation
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        if (!conversation.getBuyerId().equals(userId) && !conversation.getSellerId().equals(userId)) {
            throw new RuntimeException("Not authorized to view this conversation");
        }
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessage> messages = chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId, pageable);
        
        return messages.map(this::mapToMessageResponse);
    }
    
    @Transactional
    public ChatMessageResponse sendMessage(UUID conversationId, ChatMessageRequest request, User user) {
        // Verify user has access to this conversation
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        if (!conversation.getBuyerId().equals(user.getId()) && !conversation.getSellerId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to send messages in this conversation");
        }
        
        // Create message
        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .senderId(user.getId())
                .content(request.getContent())
                .messageType(request.getMessageType())
                .imageUrl(request.getImageUrl())
                .createdAt(ZonedDateTime.now())
                .build();
        
        message = chatMessageRepository.save(message);
        
        // Update conversation last message time
        conversation.setLastMessageAt(ZonedDateTime.now());
        conversationRepository.save(conversation);
        
        return mapToMessageResponse(message);
    }
    
    @Transactional
    public void markConversationAsRead(UUID conversationId, UUID userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        if (!conversation.getBuyerId().equals(userId) && !conversation.getSellerId().equals(userId)) {
            throw new RuntimeException("Not authorized to modify this conversation");
        }
        
        // Mark messages as read
        List<ChatMessage> unreadMessages = chatMessageRepository.findUnreadMessagesInConversation(conversationId, userId);
        for (ChatMessage message : unreadMessages) {
            message.setReadAt(ZonedDateTime.now());
        }
        chatMessageRepository.saveAll(unreadMessages);
    }
    
    private ConversationResponse mapToConversationResponse(Conversation conversation) {
        return ConversationResponse.builder()
                .id(conversation.getId())
                .itemId(conversation.getItem().getId())
                .itemTitle(conversation.getItem().getTitle())
                .buyerId(conversation.getBuyerId())
                .sellerId(conversation.getSellerId())
                .createdAt(conversation.getCreatedAt())
                .lastMessageAt(conversation.getLastMessageAt())
                .build();
    }
    
    private ChatMessageResponse mapToMessageResponse(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSenderId())
                .content(message.getContent())
                .messageType(message.getMessageType())
                .imageUrl(message.getImageUrl())
                .createdAt(message.getCreatedAt())
                .readAt(message.getReadAt())
                .build();
    }
}