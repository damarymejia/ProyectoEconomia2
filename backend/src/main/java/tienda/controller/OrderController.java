package com.tiendahn.controller;

import com.tiendahn.model.Order;
// import com.tiendahn.repository.OrderRepository; <-- Comentado
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList; // Para devolver una lista vacía
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    // private final OrderRepository repo; <-- Comentado para evitar error de inyección

    @GetMapping
    public List<Order> getAll() { 
        // Devolvemos una lista vacía para que no explote
        return new ArrayList<>(); 
    }

    @GetMapping("/customer/{email}")
    public List<Order> getByCustomer(@PathVariable String email) {
        // Devolvemos lista vacía
        return new ArrayList<>();
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        // Simulamos la creación de la orden
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        System.out.println("Simulación: Orden creada para " + order.getOrderNumber());
        
    
        return order; 
    }
}
