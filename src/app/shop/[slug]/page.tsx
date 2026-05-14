'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchProductBySlug, ProductDTO } from '@/lib/api';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProductBySlug(slug)
      .then(setProduct)
      .catch(() => notFound())
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      await addItem(product._id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-secondary uppercase tracking-widest">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (!product) return notFound();

  const image = product.images?.[0] ?? product.image ?? null;
  const rating = product.ratings ?? 0;
  const reviews = product.numReviews ?? 0;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Breadcrumbs */}
      <div className="w-full border-b border-muted/10 bg-[#0a0a0e]/50 py-4 px-8">
        <div className="max-w-7xl mx-auto font-sans text-xs uppercase tracking-widest text-secondary flex gap-2">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-4"
        >
          <div className="relative w-full aspect-square bg-[#0a0a0e] flex items-center justify-center p-12 group overflow-hidden border border-muted/10">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-primary text-[#050507] font-sans font-bold text-xs uppercase tracking-widest px-3 py-1">
                In Stock
              </span>
            </div>
            {image ? (
              <img
                src={image}
                alt={product.name}
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="relative z-10 w-full h-full bg-muted/5 flex items-center justify-center border border-muted/20 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                <span className="font-bebas text-4xl text-muted opacity-20 tracking-widest">PRODUCT VISUAL</span>
              </div>
            )}
          </div>

          {/* Ingredient Highlights */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="bg-[#0a0a0e] border border-muted/10 p-6">
              <h4 className="font-bebas text-xl tracking-wide text-white mb-4 border-b border-muted/10 pb-2">
                Full Transparency Panel
              </h4>
              <ul className="grid grid-cols-2 gap-2">
                {product.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-2 font-sans text-xs text-secondary">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Product Information */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col"
        >
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-primary mb-3">CoreDose® Premium</p>
          <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wider mb-2">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-primary text-sm">
              {'★'.repeat(Math.floor(rating))}
              {'☆'.repeat(5 - Math.floor(rating))}
            </div>
            <span className="text-sm text-secondary font-sans uppercase tracking-widest underline cursor-pointer hover:text-primary transition-colors">
              {reviews} Reviews
            </span>
          </div>

          <p className="text-4xl font-sans font-bold text-white mb-4">
            ₹{product.price.toFixed(2)}
          </p>

          <p className="text-secondary font-sans leading-relaxed mb-8 font-light border-b border-muted/10 pb-8">
            {product.description}
          </p>

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-500'}`} />
            <span className="font-sans text-xs uppercase tracking-widest text-secondary">
              {product.stock > 0 ? `${product.stock} units available` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex border border-muted/30 w-36 flex-shrink-0">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex-1 py-4 text-white hover:text-primary transition-colors font-bold text-lg"
              >
                −
              </button>
              <div className="flex-1 flex items-center justify-center text-white font-sans font-bold text-lg">
                {qty}
              </div>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="flex-1 py-4 text-white hover:text-primary transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>

            <button
              id="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className={`flex-1 font-sans font-bold uppercase tracking-widest py-4 transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(26,143,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                added
                  ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                  : 'bg-primary text-[#050507] hover:bg-white'
              }`}
            >
              {isAdding ? 'Adding...' : added ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add To Cart'}
            </button>
          </div>

          {!user && (
            <p className="font-sans text-xs text-secondary mb-6">
              <Link href="/login" className="text-primary hover:text-white transition-colors underline">Sign in</Link>{' '}
              to sync your cart across devices.
            </p>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-muted/10 pt-6">
            {[
              { label: 'GMP Certified', icon: '🏆' },
              { label: 'Free Shipping ₹2k+', icon: '📦' },
              { label: '30-Day Returns', icon: '🔄' },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col items-center text-center gap-1">
                <span className="text-xl">{badge.icon}</span>
                <span className="font-sans text-[10px] text-secondary uppercase tracking-widest">{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related Products Placeholder */}
      <div className="border-t border-muted/10 py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bebas text-4xl tracking-wider text-white mb-8">
            You Might Also <span className="text-primary">Like</span>
          </h2>
          <div className="text-center py-12">
            <Link href="/shop">
              <button className="border border-muted/30 text-secondary font-sans font-bold uppercase tracking-widest px-10 py-3 hover:border-primary hover:text-primary transition-all">
                Browse Full Lineup →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
