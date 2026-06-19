const API_URL = import.meta.env.VITE_API_URL;

export type Product = {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  price: number;
  stock: number;
  active: boolean;
};

export type ProductRequest = {
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error en la petición");
  }

  return response.json();
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);
  return handleResponse<Product[]>(response);
}

export async function createProduct(product: ProductRequest): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return handleResponse<Product>(response);
}

export async function updateProduct(
  id: number,
  product: ProductRequest
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return handleResponse<Product>(response);
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error eliminando producto");
  }
}