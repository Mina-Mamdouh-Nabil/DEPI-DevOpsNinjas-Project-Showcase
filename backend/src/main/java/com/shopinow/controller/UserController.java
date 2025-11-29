package com.shopinow.controller;

import com.shopinow.dto.UserDto;
import com.shopinow.model.User;
import com.shopinow.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    
    private final AuthService authService;
    
    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(authService.getUserProfile(user));
    }
}


