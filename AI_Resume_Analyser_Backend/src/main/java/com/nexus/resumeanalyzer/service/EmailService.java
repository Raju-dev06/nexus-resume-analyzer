package com.nexus.resumeanalyzer.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify Your Email - Nexus Resume Analyzer");

            // Assuming React frontend is running on localhost:5173 for local dev
            String verificationUrl = "http://localhost:5173/verify-email?token=" + token;

            String htmlMsg = "<h3>Welcome to Nexus AI Resume Analyzer!</h3>"
                    + "<p>Please click the link below to verify your email address and activate your account:</p>"
                    + "<a href='" + verificationUrl + "'>Verify My Account</a>"
                    + "<br/><p>If you didn't request this, please ignore this email.</p>";

            helper.setText(htmlMsg, true);
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Log the error but don't crash, perhaps throw a custom exception
        }
    }
}
