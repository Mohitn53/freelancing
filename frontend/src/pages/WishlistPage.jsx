import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const WishlistPage = () => {
  const items = [
    { id: 1, name: 'T-Shirt Basic Oversize White', price: 40.0, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80' },
    { id: 4, name: 'Erigo Hoodie Kagoshima Dark', price: 29.12, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container section">
      <h1 style={{ fontSize: '32px', textTransform: 'none', marginBottom: '32px' }}>Your Wishlist</h1>
      {items.length === 0 ? (
        <p>No items in wishlist yet.</p>
      ) : (
        <div className="grid grid-cols-4">
          {items.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default WishlistPage;
