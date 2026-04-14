package com.tiendahn.controller;

import com.tiendahn.model.Order;
import com.tiendahn.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderRepository repo;

    @GetMapping
    public List<Order> getAll() { return repo.findAll(); }

    @GetMapping("/customer/{email}")
    public List<Order> getByCustomer(@PathVariable String email) {
        return repo.findByCustomerEmail(email);
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return repo.save(order);
    }
}