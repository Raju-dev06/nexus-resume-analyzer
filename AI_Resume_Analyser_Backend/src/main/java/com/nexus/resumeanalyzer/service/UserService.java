package com.nexus.resumeanalyzer.service;

import com.nexus.resumeanalyzer.entity.User;
import com.nexus.resumeanalyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public User registerUser(String username, String email, String password, String role) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username is already taken.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        String verificationToken = java.util.UUID.randomUUID().toString();

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password)) // BCrypt hash — never plain text
                .role(role != null && !role.isBlank() ? role : "USER")
                .isVerified(false)
                .verificationToken(verificationToken)
                .provider("LOCAL")
                .build();

        user = userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), verificationToken);
        return user;
    }

    public boolean verifyEmail(String token) {
        Optional<User> userOpt = userRepository.findByVerificationToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setIsVerified(true);
            user.setVerificationToken(null); // Clear the token
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean validateCredentials(String email, String rawPassword) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) return false;
        // BCrypt secure comparison — never .equals()
        return passwordEncoder.matches(rawPassword, userOpt.get().getPassword());
    }
}
