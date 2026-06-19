import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "./api/productsApi";

import type {
  Product,
  ProductRequest,
} from "./api/productsApi";

import "./App.css";
const emptyForm: ProductRequest = {
  name: "",
  sku: "",
  description: "",
  price: 0,
  stock: 0,
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductRequest>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    field: keyof ProductRequest,
    value: string | number
  ) {
    setForm({
      ...form,
      [field]: value,
    });
  }

  function validateForm(): boolean {
    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return false;
    }

    if (!form.sku.trim()) {
      setError("El SKU es obligatorio.");
      return false;
    }

    if (form.price <= 0) {
      setError("El precio debe ser mayor a cero.");
      return false;
    }

    if (form.stock < 0) {
      setError("El stock no puede ser negativo.");
      return false;
    }

    return true;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      if (editingId === null) {
        await createProduct(form);
        setMessage("Producto creado correctamente.");
      } else {
        await updateProduct(editingId, form);
        setMessage("Producto actualizado correctamente.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError("No se pudo guardar el producto. Verifica el SKU o la API.");
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description ?? "",
      price: Number(product.price),
      stock: product.stock,
    });

    setMessage("");
    setError("");
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "¿Deseas desactivar este producto?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
      setMessage("Producto desactivado correctamente.");
      setError("");
      await loadProducts();
    } catch (err) {
      setError("No se pudo desactivar el producto.");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setMessage("");
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="page">
      <section className="card">
        <h1>Gestión POC - Productos</h1>
        <p className="subtitle">
          Prueba de concepto con React, Spring Boot, PostgreSQL y Docker.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-grid">
            <div className="field">
              <label>Nombre</label>
              <input
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="Ej: Granizado de mora"
              />
            </div>

            <div className="field">
              <label>SKU</label>
              <input
                value={form.sku}
                onChange={(event) =>
                  updateField("sku", event.target.value)
                }
                placeholder="Ej: GR-MORA-001"
                disabled={editingId !== null}
              />
            </div>

            <div className="field">
              <label>Precio</label>
              <input
                type="number"
                value={form.price}
                onChange={(event) =>
                  updateField("price", Number(event.target.value))
                }
                min="0"
              />
            </div>

            <div className="field">
              <label>Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(event) =>
                  updateField("stock", Number(event.target.value))
                }
                min="0"
              />
            </div>
          </div>

          <div className="field">
            <label>Descripción</label>
            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Descripción breve del producto"
            />
          </div>

          <div className="actions">
            <button type="submit">
              {editingId === null ? "Crear producto" : "Actualizar producto"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary"
                onClick={handleCancelEdit}
              >
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Productos registrados</h2>
          <button className="secondary" onClick={loadProducts}>
            Recargar
          </button>
        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : products.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>SKU</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.sku}</td>
                    <td>{product.name}</td>
                    <td>${Number(product.price).toLocaleString()}</td>
                    <td>{product.stock}</td>
                    <td className="row-actions">
                      <button
                        className="secondary"
                        onClick={() => handleEdit(product)}
                      >
                        Editar
                      </button>

                      <button
                        className="danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        Desactivar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;