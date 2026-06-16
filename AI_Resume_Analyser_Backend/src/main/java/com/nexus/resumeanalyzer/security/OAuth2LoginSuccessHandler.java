package com.nexus.resumeanalyzer.security;

import com.nexus.resumeanalyzer.entity.User;
import com.nexus.resumeanalyzer.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // New user, create them
            User newUser = User.builder()
                    .email(email)
                    .username(name != null ? name : email.split("@")[0])
                    .password("") // No password for OAuth users
                    .role("USER")
                    .isVerified(true) // Google emails are already verified
                    .provider("GOOGLE")
                    .providerId(googleId)
                    .build();
            userRepository.save(newUser);
        } else {
            // Update provider if they previously signed up locally (optional, but good practice)
            User existingUser = userOpt.get();
            if ("LOCAL".equals(existingUser.getProvider())) {
                existingUser.setProvider("GOOGLE");
                existingUser.setProviderId(googleId);
                existingUser.setIsVerified(true);
                userRepository.save(existingUser);
            }
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String jwt = jwtUtil.generateToken(userDetails);

        // Redirect back to React frontend with token
        // We use a query parameter. The React frontend will catch this and save it to localStorage.
        response.sendRedirect("http://localhost:5173/oauth2/redirect?token=" + jwt);
    }
}
