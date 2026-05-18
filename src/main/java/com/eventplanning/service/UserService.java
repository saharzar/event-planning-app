package com.eventplanning.service;

import com.eventplanning.dto.request.LoginRequest;
import com.eventplanning.dto.request.RegisterRequest;
import com.eventplanning.dto.response.UserResponse;
import com.eventplanning.entity.User;
import com.eventplanning.exception.EmailAlreadyExistsException;
import com.eventplanning.exception.ResourceNotFoundException;
import com.eventplanning.exception.UnauthorizedException;
import com.eventplanning.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already in use: " + request.getEmail());
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // plain text for now, can add hashing later

        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    public UserResponse login(LoginRequest request, HttpSession session) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResourceNotFoundException("Invalid password");
        }

        session.setAttribute("userId", user.getId());
        return mapToResponse(user);
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }

    public User getSessionUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            throw new UnauthorizedException("You must be logged in");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Session user not found"));
    }

    public UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        return response;
    }
}