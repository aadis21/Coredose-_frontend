"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cartContext';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  slug: string;
}

export default function ProductCard({ id, name, price, image, rating, reviews, slug }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(id, 1);
    } catch (err) {
      console.error('Failed to add item', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative bg-[#0a0a0e] border border-muted/10 overflow-hidden hover:border-primary/50 transition-all duration-500 rounded-sm"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Product Image Placeholder */}
      <Link href={`/shop/${slug}`}>
        <div className="relative w-full aspect-square bg-[#050507] overflow-hidden flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0e] to-transparent z-10" />
          <div className="w-full h-full bg-muted/10 rounded-lg group-hover:scale-105 transition-transform duration-700 ease-out shadow-2xl">
            {/* If we had real images: <img src={image} alt={name} className="object-contain w-full h-full drop-shadow-2xl" /> */}
            <div className="w-full h-full flex items-center justify-center text-muted font-bebas text-2xl tracking-widest opacity-20 group-hover:opacity-50 transition-opacity">
              PRODUCT VISUAL
            </div>
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="relative z-20 p-6 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <Link href={`/shop/${slug}`}>
            <h3 className="font-bebas text-2xl tracking-wider text-white group-hover:text-primary transition-colors cursor-pointer">
              {name}
            </h3>
          </Link>
          <span className="font-sans font-bold text-lg text-secondary">${price.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="flex text-primary text-xs">
            {'★'.repeat(Math.floor(rating))}
            {'☆'.repeat(5 - Math.floor(rating))}
          </div>
          <span className="text-xs text-secondary font-sans uppercase tracking-widest opacity-70">
            {reviews} Reviews
          </span>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-transparent border border-muted/30 text-white font-sans font-bold uppercase tracking-widest py-3 text-sm hover:bg-primary hover:border-primary hover:text-[#050507] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? 'Adding...' : 'Add To Cart'}
        </button>
      </div>
    </motion.div>
  );
}
