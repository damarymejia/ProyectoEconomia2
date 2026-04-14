package com.tiendahn.controller;

import com.tiendahn.model.Product;
// import com.tiendahn.repository.ProductRepository; // Comentado
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    // private final ProductRepository repo; // Comentado para evitar error de inyección

    @GetMapping
    public List<Product> getAll() { 
        return new ArrayList<>(); 
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return new Product(); // Devuelve un objeto vacío
    }

    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return new ArrayList<>();
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String q) {
        return new ArrayList<>();
    }

    @PostMapping
    public Product create(@RequestBody Product product) { 
        return product; 
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return product;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { 
        
    }
}
