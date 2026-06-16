package com.nexus.resumeanalyzer.controller;

import com.nexus.resumeanalyzer.dto.AuthResponse;
import com.nexus.resumeanalyzer.dto.LoginRequest;
import com.nexus.resumeanalyzer.dto.RegisterRequest;
import com.nexus.resumeanalyzer.entity.User;
import com.nexus.resumeanalyzer.security.CustomUserDetailsService;
import com.nexus.resumeanalyzer.security.JwtUtil;
import com.nexus.resumeanalyzer.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        User user = userService.registerUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(
                AuthResponse.builder()
                        .message("Registration successful.")
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .isAuthenticated(false)
                        .build()
        );
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        Optional<User> userOpt = userService.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = userOpt.get();

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .message("Sign in successful.")
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .isAuthenticated(true)
                        .token(jwt)
                        .build()
        );
    }
}
