package com.kontora.backend.products;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<ProductResponse> findAllActive() {
        return repository.findByActiveTrueOrderByIdDesc()
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductResponse findById(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado"
                ));

        return ProductResponse.from(product);
    }

    public ProductResponse create(ProductRequest request) {
        if (repository.existsBySku(request.sku())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un producto con ese SKU"
            );
        }

        Product product = new Product(
                request.name(),
                request.sku(),
                request.description(),
                request.price(),
                request.stock()
        );

        Product savedProduct = repository.save(product);

        return ProductResponse.from(savedProduct);
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado"
                ));

        product.update(
                request.name(),
                request.description(),
                request.price(),
                request.stock()
        );

        Product updatedProduct = repository.save(product);

        return ProductResponse.from(updatedProduct);
    }

    public void deactivate(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Producto no encontrado"
                ));

        product.deactivate();
        repository.save(product);
    }
}