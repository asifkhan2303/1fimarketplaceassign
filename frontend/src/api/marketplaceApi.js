/**
 * Thin wrapper around fetch for the Marketplace API.
 * Kept in one place so components never build URLs or parse
 * response envelopes themselves - they just call these functions
 * and get back plain data or a thrown Error.
 */

// Falls back to the relative "/api" path (proxied to the backend by
// vite.config.js in local dev). Set VITE_API_BASE_URL when the frontend
// and backend are deployed separately, e.g. https://api.example.com/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    throw new Error(body?.message || `Request failed (${res.status})`);
  }

  return body.data;
}

export const fetchProducts = ({ category, search } = {}) => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  const qs = params.toString();
  return request(`/products${qs ? `?${qs}` : ""}`);
};

export const fetchCategories = () => request("/products/categories");

export const fetchProductById = (id) => request(`/products/${id}`);

export const fetchEmiPlans = (id, selectedVariants = {}) => {
  const variantsQs = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}:${v}`)
    .join(",");
  const qs = variantsQs ? `?variants=${encodeURIComponent(variantsQs)}` : "";
  return request(`/products/${id}/emi-plans${qs}`);
};

export const createOrder = (payload) =>
  request("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
