import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CartItem = ({ item, updateQty, remove }) => {
  return (
    <div style={styles.cartItem}>
      <img src={item.image} alt={item.name} style={styles.image} />
      <div style={styles.details}>
        <h4 style={styles.name}>{item.name}</h4>
        <p style={styles.price}>${item.price.toFixed(2)}</p>
        <div style={styles.controls}>
          <div style={styles.qtyBox}>
            <button style={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>-</button>
            <span style={styles.qtyValue}>{item.qty}</span>
            <button style={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
          </div>
          <button style={styles.removeBtn} onClick={() => remove(item.id)}>Remove</button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'T-Shirt Basic Oversize White', price: 40.0, qty: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80' },
    { id: 2, name: 'Erigo Sock Giggas Maroon', price: 30.0, qty: 2, image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80' },
  ]);

  const updateQty = (id, delta) => {
    setItems(items.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item));
  };
  const remove = (id) => setItems(items.filter(item => item.id !== id));

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container section">
      <h1 style={{ fontSize: '32px', textTransform: 'none', marginBottom: '32px' }}>Shopping Cart</h1>
      
      <div className="grid grid-cols-[2fr_1fr]" style={{ gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
        <div style={styles.list}>
          {items.map(item => (
            <CartItem key={item.id} item={item} updateQty={updateQty} remove={remove} />
          ))}
          {items.length === 0 && <p>Your cart is empty.</p>}
        </div>

        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div className="flex-between" style={styles.row}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex-between" style={styles.row}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex-between" style={{ ...styles.row, ...styles.totalRow }}>
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>Proceed to Checkout</button>
        </div>
      </div>
    </motion.div>
  );
};

const styles = {
  cartItem: {
    display: 'flex',
    gap: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid #e2e2e2',
    marginBottom: '24px'
  },
  image: {
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '12px',
    backgroundColor: '#f5f5f5'
  },
  details: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '8px'
  },
  name: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '18px',
    margin: 0,
    textTransform: 'none'
  },
  price: {
    fontWeight: 600,
    fontSize: '16px',
    color: '#555'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginTop: '8px'
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '6px'
  },
  qtyBtn: {
    padding: '4px 12px',
    fontSize: '16px'
  },
  qtyValue: {
    padding: '0 12px',
    fontWeight: 500
  },
  removeBtn: {
    color: '#ff4d4f',
    fontSize: '14px',
    textDecoration: 'underline'
  },
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  summary: {
    backgroundColor: '#f9f9f9',
    padding: '32px',
    borderRadius: '16px',
    height: 'fit-content'
  },
  summaryTitle: {
    fontSize: '20px',
    textTransform: 'none',
    marginBottom: '24px'
  },
  row: {
    marginBottom: '16px',
    color: '#666'
  },
  totalRow: {
    borderTop: '1px solid #ddd',
    paddingTop: '16px',
    color: '#111',
    fontWeight: 700,
    fontSize: '20px'
  }
};

export default CartPage;
