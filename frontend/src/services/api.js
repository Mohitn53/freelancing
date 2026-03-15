// src/services/api.js  – centralised fetch helper + type-safe service methods

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  const token = localStorage.getItem('dropcode_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Request failed');
  return json;
}

// ─── Products ──────────────────────────────────────────────────────────────────
export const productsApi = {
  list: (page = 1, category = '', sort = 'created_at') =>
    request(`/api/products?page=${page}&category=${category}&sort=${sort}`),
  get: (id) => request(`/api/products/${id}`),
  search: (q) => request(`/api/products/search?q=${encodeURIComponent(q)}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartApi = {
  get: () => request('/api/cart'),
  add: (product_id, quantity = 1, size = 'M') =>
    request('/api/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity, size }) }),
  update: (itemId, quantity) =>
    request(`/api/cart/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  remove: (itemId) => request(`/api/cart/${itemId}`, { method: 'DELETE' }),
  clear: () => request('/api/cart', { method: 'DELETE' }),
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const wishlistApi = {
  get: () => request('/api/wishlist'),
  add: (product_id) =>
    request('/api/wishlist', { method: 'POST', body: JSON.stringify({ product_id }) }),
  remove: (productId) => request(`/api/wishlist/${productId}`, { method: 'DELETE' }),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileApi = {
  get: () => request('/api/profile'),
  update: (body) => request('/api/profile', { method: 'PUT', body: JSON.stringify(body) }),
  orders: () => request('/api/profile/orders'),
  addresses: () => request('/api/profile/addresses'),
  addAddress: (body) =>
    request('/api/profile/addresses', { method: 'POST', body: JSON.stringify(body) }),
  updateAddress: (id, body) =>
    request(`/api/profile/addresses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAddress: (id) => request(`/api/profile/addresses/${id}`, { method: 'DELETE' }),
  paymentMethods: () => request('/api/profile/payment-methods'),
};
