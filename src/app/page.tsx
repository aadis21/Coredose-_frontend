"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { fetchProducts, ProductDTO } from '@/lib/api';

const TRUST_STATS = [
  { value: '100%', label: 'Science Backed' },
  { value: 'GMP', label: 'Certified Lab' },
  { value: 'Zero', label: 'Proprietary Blends' },
  { value: 'Global', label: 'Shipping' },
];

const SCIENCE_PILLARS = [
  {
    icon: '⚗️',
    title: 'Clinical Dosing',
    desc: 'Every ingredient at the exact dose proven effective in peer-reviewed studies. No fairy dusting.',
  },
  {
    icon: '🔬',
    title: 'Third-Party Tested',
    desc: 'Every batch independently tested for purity, potency, and the absence of banned substances.',
  },
  {
    icon: '📊',
    title: 'Full Transparency',
    desc: 'We show every ingredient and dose on the label. Zero proprietary blends, zero hidden fillers.',
  },
];

export default function Home() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <div className="w-full">
      {/* ── HERO ── */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#07070d] to-[#050507] z-0" />

        {/* Animated glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/8 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/4 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#C8CDD8 1px, transparent 1px), linear-gradient(90deg, #C8CDD8 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0em' }}
            animate={{ opacity: 0.7, letterSpacing: '0.4em' }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-xs md:text-sm font-sans font-bold uppercase text-primary mb-6 tracking-[0.4em]"
          >
            Premium Fitness Supplements
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-7xl sm:text-8xl md:text-[10rem] font-bebas text-white tracking-wider mb-6 leading-none drop-shadow-2xl"
          >
            FUEL THE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
              MACHINE
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="text-base md:text-xl font-sans text-secondary max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            Science-backed formulas. Investor-level purity. We don&apos;t just build supplements —
            we engineer human performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/shop">
              <button className="px-10 py-4 bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(26,143,255,0.5)]">
                Shop The Lineup
              </button>
            </Link>
            <Link href="/science">
              <button className="px-10 py-4 bg-transparent border border-muted/40 text-white font-sans font-bold uppercase tracking-widest hover:border-white transition-all">
                The Science →
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-primary" />
          <span className="font-sans text-[10px] uppercase tracking-widest text-secondary">Scroll</span>
        </motion.div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="py-8 px-8 border-y border-muted/10 bg-[#0a0a0e]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {TRUST_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <h3 className="text-3xl font-bebas tracking-wide mb-1 text-white">{stat.value}</h3>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT LINEUP ── */}
      <section className="py-24 px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="font-sans text-xs uppercase tracking-[0.3em] text-primary mb-2"
              >
                The Lineup
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-bebas text-white tracking-wider"
              >
                ENGINEERED TO <span className="text-primary">WIN</span>
              </motion.h2>
            </div>
            <Link href="/shop">
              <button className="font-sans text-sm font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors flex-shrink-0">
                View All Products →
              </button>
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#0a0a0e] border border-muted/10 aspect-[3/4] animate-pulse rounded-sm" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-sans text-secondary mb-4">Products will appear here once the backend is running.</p>
              <Link href="/shop">
                <button className="border border-muted/30 text-secondary font-sans font-bold uppercase tracking-widest px-8 py-3 hover:border-primary hover:text-primary transition-all">
                  Browse Shop
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  image={product.images?.[0] ?? product.image ?? ''}
                  rating={product.ratings ?? 0}
                  reviews={product.numReviews ?? 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SCIENCE PILLARS ── */}
      <section className="py-24 px-8 bg-[#0a0a0e] border-y border-muted/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-bebas text-white tracking-wider mb-4"
            >
              THE <span className="text-primary">SCIENCE</span> BEHIND THE DOSE
            </motion.h2>
            <p className="font-sans text-secondary max-w-xl mx-auto font-light">
              We obsess over research so you can obsess over results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SCIENCE_PILLARS.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-[#050507] border border-muted/10 p-8 flex flex-col gap-4 hover:border-primary/40 transition-all duration-500 group"
              >
                <span className="text-4xl">{pillar.icon}</span>
                <h3 className="font-bebas text-2xl tracking-wide text-white group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="font-sans text-sm text-secondary leading-relaxed font-light">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/science">
              <button className="border border-muted/30 text-secondary font-sans font-bold uppercase tracking-widest px-10 py-3 hover:border-primary hover:text-primary transition-all">
                Explore The Research →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI COACH CTA ── */}
      <section className="py-24 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent z-0 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-primary mb-3">AI-Powered</p>
            <h2 className="text-5xl md:text-6xl font-bebas text-white tracking-wider mb-4">
              BUILD YOUR<br />PERFECT STACK
            </h2>
            <p className="font-sans text-secondary max-w-lg font-light leading-relaxed">
              Our AI Coach analyses your goals, training style, and body metrics to recommend the optimal supplement stack — personalized just for you.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/ai-coach">
              <button className="px-12 py-5 bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(26,143,255,0.4)] text-base">
                Try AI Coach
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
