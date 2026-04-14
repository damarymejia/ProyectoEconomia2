package com.tiendahn.controller;

import com.tiendahn.model.User;
// import com.tiendahn.repository.UserRepository; // Comentado
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    // private final UserRepository repo; // Comentado

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return user; // Devuelve el usuario que se intentó registrar
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        // Simulación: Acepta cualquier login para que puedas mostrar el frontend
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login simulado con éxito");
        return response;
    }
}
