package nz.co.market.chat.config;

import lombok.RequiredArgsConstructor;
import nz.co.market.chat.security.WebSocketAuthInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    private final WebSocketAuthInterceptor webSocketAuthInterceptor;
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple message broker for destinations prefixed with "/topic"
        config.enableSimpleBroker("/topic");
        // Set the application destination prefix
        config.setApplicationDestinationPrefixes("/app");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register the "/ws" endpoint for WebSocket connections
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
    
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        // Add authentication interceptor
        registration.interceptors(webSocketAuthInterceptor);
    }
}
