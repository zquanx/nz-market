package nz.co.market.chat.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.auth.entity.User;
import nz.co.market.chat.dto.*;
import nz.co.market.chat.entity.Conversation;
import nz.co.market.chat.entity.Message;
import nz.co.market.chat.mapper.ChatMapper;
import nz.co.market.chat.repository.ConversationRepository;
import nz.co.market.chat.repository.MessageRepository;
import nz.co.market.items.entity.Item;
import nz.co.market.items.repository.ItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ItemRepository itemRepository;
    private final ChatMapper chatMapper;
    private final SimpMessagingTemplate messagingTemplate;
    
    @Transactional(readOnly = true)
    public List<ConversationResponse> getUserConversations(UUID userId) {
        List<Conversation> conversations = conversationRepository.findByUserIdOrderByLastMessageAtDesc(userId);
        return conversations.stream()
                .map(conv -> chatMapper.toConversationResponse(conv, userId))
                .toList();
    }
    
    @Transactional
    public ConversationResponse createConversation(CreateConversationRequest request, User currentUser) {
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        User peerUser = item.getSeller();
        if (peerUser.getId().equals(currentUser.getId())) {
            throw new RuntimeException("Cannot create conversation with yourself");
        }
        
        // Check if conversation already exists
        Optional<Conversation> existingConversation = conversationRepository
                .findByItemIdAndBuyerIdAndSellerId(request.getItemId(), currentUser.getId(), peerUser.getId());
        
        if (existingConversation.isPresent()) {
            return chatMapper.toConversationResponse(existingConversation.get(), currentUser.getId());
        }
        
        Conversation conversation = Conversation.builder()
                .item(item)
                .buyer(currentUser)
                .seller(peerUser)
                .build();
        
        conversation = conversationRepository.save(conversation);
        return chatMapper.toConversationResponse(conversation, currentUser.getId());
    }
    
    @Transactional(readOnly = true)
    public Page<MessageResponse> getConversationMessages(UUID conversationId, UUID userId, int page, int size) {
        Conversation conversation = conversationRepository.findByIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Message> messages = messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable);
        
        return messages.map(chatMapper::toMessageResponse);
    }
    
    @Transactional
    public MessageResponse sendMessage(UUID conversationId, SendMessageRequest request, User sender) {
        Conversation conversation = conversationRepository.findByIdAndUserId(conversationId, sender.getId())
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .type(request.getType())
                .content(request.getContent())
                .build();
        
        message = messageRepository.save(message);
        
        // Update conversation last message time
        conversation.setLastMessageAt(ZonedDateTime.now());
        conversationRepository.save(conversation);
        
        // Send WebSocket message
        MessageResponse messageResponse = chatMapper.toMessageResponse(message);
        messagingTemplate.convertAndSend("/topic/conversations/" + conversationId, messageResponse);
        
        log.info("Message sent in conversation {} by user {}", conversationId, sender.getId());
        return messageResponse;
    }
    
    @Transactional
    public void markMessagesAsRead(UUID conversationId, UUID userId) {
        Conversation conversation = conversationRepository.findByIdAndUserId(conversationId, userId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        List<Message> unreadMessages = messageRepository.findUnreadMessages(conversationId, userId);
        
        ZonedDateTime now = ZonedDateTime.now();
        unreadMessages.forEach(message -> message.setReadAt(now));
        messageRepository.saveAll(unreadMessages);
        
        log.info("Marked {} messages as read in conversation {} for user {}", 
                unreadMessages.size(), conversationId, userId);
    }
    
    @Transactional(readOnly = true)
    public Long getUnreadMessageCount(UUID conversationId, UUID userId) {
        return messageRepository.countUnreadMessages(conversationId, userId);
    }
}
