// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { cartApi } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState(null); // { name, image }

  const showNotification = (product) => {
    setNotification(product);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = useCallback(async (product, size = 'M', qty = 1, isLocal = true) => {
    // Optimistic local update
    setCartItems(prev => {
      const existing = prev.find(i => i.product_id === product.id && i.size === size);
      if (existing) {
        return prev.map(i =>
          i.product_id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { product_id: product.id, size, quantity: qty, product }];
    });
    showNotification(product);

    if (!isLocal) {
      try { await cartApi.add(product.id, qty, size); } catch {}
    }
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, cartCount, notification }}>
      {children}
      {/* Global cart notification */}
      {notification && (
        <div className="fixed bottom-8 right-8 z-[999] bg-primary text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-bounce-in"
          style={{ animation: 'slideInRight 0.4s ease' }}>
          <img
            src={notification.image || notification.image_url}
            alt=""
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Added to cart ✓</p>
            <p className="font-semibold text-sm leading-tight">{notification.name}</p>
          </div>
        </div>
      )}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
