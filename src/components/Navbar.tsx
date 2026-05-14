"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const cartCount = items.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="w-full py-6 px-8 border-b border-muted/20 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-3xl font-bebas tracking-wider text-primary hover:text-white transition-colors cursor-pointer drop-shadow-lg">
            COREDOSE<sup className="text-sm">®</sup>
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 font-sans font-medium uppercase tracking-wide text-sm text-secondary">
          <Link href="/shop" className="hover:text-primary transition-all duration-300 transform hover:-translate-y-0.5">Shop</Link>
          <Link href="/science" className="hover:text-primary transition-all duration-300 transform hover:-translate-y-0.5">Science</Link>
          <Link href="/about" className="hover:text-primary transition-all duration-300 transform hover:-translate-y-0.5">About</Link>
          <Link href="/ai-coach" className="text-primary hover:text-white transition-all duration-300 transform hover:-translate-y-0.5">AI Coach</Link>
          {user?.role === 'admin' || user?.role === 'superadmin' ? (
            <Link href="/admin" className="text-yellow-400 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5">Admin</Link>
          ) : null}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/cart" className="text-secondary hover:text-primary transition-colors flex items-center gap-2 relative">
            <span className="font-sans text-sm uppercase tracking-wider">Cart</span>
            {cartCount > 0 && (
              <span className="bg-primary text-[#050507] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
            {cartCount === 0 && <span className="font-sans text-sm text-secondary">(0)</span>}
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/profile">
                <button className="font-sans text-sm uppercase tracking-wider text-white hover:text-primary transition-colors">
                  {user.firstName}
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="border border-muted/40 text-secondary px-4 py-2 font-sans font-bold uppercase text-xs hover:border-red-500 hover:text-red-400 transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-primary text-background px-6 py-2 font-sans font-bold uppercase text-sm hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(26,143,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white font-sans text-sm uppercase tracking-widest"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-t border-muted/20 mt-6 absolute left-0 w-full"
          >
            <nav className="flex flex-col gap-4 p-8 font-sans font-medium uppercase tracking-wide text-sm text-secondary">
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
              <Link href="/science" onClick={() => setIsMobileMenuOpen(false)}>Science</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link href="/ai-coach" className="text-primary" onClick={() => setIsMobileMenuOpen(false)}>AI Coach</Link>
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                Cart {cartCount > 0 ? `(${cartCount})` : '(0)'}
              </Link>
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                    My Profile
                  </Link>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-yellow-400">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-left text-red-500 mt-2">Sign Out</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-white mt-4 border border-primary px-4 py-2 text-center w-32">
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
