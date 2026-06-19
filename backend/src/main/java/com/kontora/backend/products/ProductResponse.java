package com.kontora.backend.products;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String sku,
        String description,
        BigDecimal price,
        Integer stock,
        Boolean active
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSku(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getActive()
        );
    }
}