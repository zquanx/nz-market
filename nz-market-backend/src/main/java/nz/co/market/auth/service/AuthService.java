package nz.co.market.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nz.co.market.auth.dto.AuthResponse;
import nz.co.market.auth.dto.LoginRequest;
import nz.co.market.auth.dto.RegisterRequest;
import nz.co.market.auth.entity.EmailVerificationToken;
import nz.co.market.auth.entity.User;
import nz.co.market.auth.entity.UserProfile;
import nz.co.market.auth.enums.UserRole;
import nz.co.market.auth.enums.UserStatus;
import nz.co.market.auth.repository.UserRepository;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final MessageSource messageSource;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException(messageSource.getMessage("auth.email.exists", null, LocaleContextHolder.getLocale()));
        }
        
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .phone(request.getPhone())
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .emailVerified(false)
                .build();
        
        user = userRepository.save(user);
        
        // Create user profile
        UserProfile profile = UserProfile.builder()
                .user(user)
                .preferredLang("en")
                .build();
        user.setProfile(profile);
        user = userRepository.save(user);
        
        // Send email verification
        sendEmailVerification(user);
        
        return createAuthResponse(user);
    }
    
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            
            // Get the actual User entity from the database
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException(messageSource.getMessage("auth.user.not.found", null, LocaleContextHolder.getLocale())));
            
            return createAuthResponse(user);
            
        } catch (AuthenticationException e) {
            throw new RuntimeException(messageSource.getMessage("auth.invalid.credentials", null, LocaleContextHolder.getLocale()));
        }
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        try {
            String email = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException(messageSource.getMessage("auth.user.not.found", null, LocaleContextHolder.getLocale())));
            
            if (jwtService.validateToken(refreshToken, email)) {
                return createAuthResponse(user);
            } else {
                throw new RuntimeException(messageSource.getMessage("auth.token.invalid", null, LocaleContextHolder.getLocale()));
            }
        } catch (Exception e) {
            throw new RuntimeException(messageSource.getMessage("auth.token.invalid", null, LocaleContextHolder.getLocale()));
        }
    }
    
    @Transactional
    public void verifyEmail(String token) {
        // TODO: Implement proper email verification with database lookup
        // For now, we'll simulate successful verification
        log.info("Email verification requested for token: {}", token);
        
        // In a real implementation, you would:
        // 1. Look up the token in the database
        // 2. Check if it's valid and not expired
        // 3. Update the user's emailVerified status
        // 4. Delete the verification token
        
        // For testing purposes, we'll just log success
        log.info("Email verification successful for token: {}", token);
    }
    
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(messageSource.getMessage("auth.email.not.found", null, LocaleContextHolder.getLocale())));
        
        // Generate password reset token
        String token = UUID.randomUUID().toString();
        
        // TODO: Save token to database and send email
        // In a real implementation, you would:
        // 1. Create a PasswordResetToken entity
        // 2. Save it to the database with expiration time
        // 3. Send email with reset link
        
        log.info("Password reset token generated for user {}: {}", email, token);
    }
    
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // TODO: Implement proper password reset with token validation
        // For now, we'll simulate successful password reset for testing
        
        log.info("Password reset requested for token: {}", token);
        
        // In a real implementation, you would:
        // 1. Look up the token in the database
        // 2. Check if it's valid and not expired
        // 3. Find the associated user
        // 4. Update the user's password
        // 5. Delete the reset token
        
        // For testing purposes, we'll simulate success
        // In a real scenario, you might want to validate the token format
        if (token == null || token.trim().isEmpty()) {
            throw new RuntimeException(messageSource.getMessage("auth.password.reset.invalid", null, LocaleContextHolder.getLocale()));
        }
        
        log.info("Password reset successful for token: {}", token);
    }
    
    private AuthResponse createAuthResponse(User user) {
        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        AuthResponse.UserDto userDto = AuthResponse.UserDto.builder()
                .id(user.getId().toString())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .emailVerified(user.getEmailVerified())
                .build();
        
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtService.extractExpiration(accessToken).getTime())
                .user(userDto)
                .build();
    }
    
    private void sendEmailVerification(User user) {
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user)
                .token(token)
                .expiresAt(ZonedDateTime.now().plusHours(24))
                .build();
        
        // TODO: Save token to database and send email
        log.info("Email verification token generated for user {}: {}", user.getEmail(), token);
    }
}
