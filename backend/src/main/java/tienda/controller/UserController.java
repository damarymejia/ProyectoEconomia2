package com.tiendahn.controller;

import com.tiendahn.model.User;
import com.tiendahn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserRepository repo;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return repo.save(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        Optional<User> user = repo.findByEmail(body.get("email"));
        if (user.isPresent() && user.get().getPassword().equals(body.get("password"))) {
            return Map.of("success", true, "user", user.get());
        }
        return Map.of("success", false, "message", "Credenciales invalidas");
    }
}