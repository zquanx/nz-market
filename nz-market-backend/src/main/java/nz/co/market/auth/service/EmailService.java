package nz.co.market.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    public void sendEmailVerification(String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Verify your email - NZ Market");
            message.setText("Please click the following link to verify your email: " +
                    "http://localhost:3000/verify-email?token=" + token);
            
            mailSender.send(message);
            log.info("Email verification sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email verification to: {}", to, e);
        }
    }
    
    public void sendPasswordReset(String to, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Reset your password - NZ Market");
            message.setText("Please click the following link to reset your password: " +
                    "http://localhost:3000/reset-password?token=" + token);
            
            mailSender.send(message);
            log.info("Password reset email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", to, e);
        }
    }
}
