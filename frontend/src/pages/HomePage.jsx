import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';

const DUMMY_PRODUCTS = [
  { id: 1, name: 'Core Hoodie', subtitle: 'Black / Grey', price: 7400, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', isWished: true },
  { id: 2, name: 'Essential Tank', subtitle: 'White / Black', price: 3200, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', isWished: false },
  { id: 3, name: 'Contrast Tee', subtitle: 'Black/White', price: 4900, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80', isWished: false },
  { id: 4, name: 'Base Crop', subtitle: 'White', price: 4900, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', isWished: false },
];

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('Women');
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="page" exit={{ opacity: 0 }}>
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. New Arrivals container */}
      <div className="w-full max-w-[1440px] mx-auto px-5 md:px-10 mt-24 pb-24">
        
        {/* Arrivals Header Row (Title, Pills, Show More) */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <h2 className="text-4xl font-black tracking-tighter m-0 font-sans text-primary uppercase">New Arrivals</h2>
          
          <div className="flex items-center bg-[#f5f5f5] rounded-full p-1 border border-gray-100 shadow-sm overflow-x-auto max-w-full">
            {['Men', 'Women', 'Bags', 'Shoes', 'Accessories'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2 text-sm font-medium transition-all outline-none border-none bg-none cursor-pointer rounded-full font-sans whitespace-nowrap
                  ${activeTab === cat ? 'bg-primary text-secondary shadow-md font-bold' : 'text-gray-400 hover:text-primary'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => navigate('/products')}
            className="text-sm font-bold flex items-center border-none bg-none cursor-pointer font-sans text-primary hover:opacity-60 transition-all uppercase tracking-widest group"
          >
            Show More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {DUMMY_PRODUCTS.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

      </div>
    </motion.div>
  );
};

export default HomePage;
