package com.tiendahn.controller;

import com.tiendahn.model.Product;
import com.tiendahn.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductRepository repo;

    @GetMapping
    public List<Product> getAll() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    @GetMapping("/category/{category}")
    public List<Product> getByCategory(@PathVariable String category) {
        return repo.findByCategory(category);
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String q) {
        return repo.findByNameContainingIgnoreCase(q);
    }

    @PostMapping
    public Product create(@RequestBody Product product) { return repo.save(product); }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return repo.save(product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}