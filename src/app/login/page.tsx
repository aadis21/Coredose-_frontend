'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      router.push('/profile');
    } catch {
      // error is set in context
    }
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#0a0a0e] border border-muted/20 p-10 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl font-bebas tracking-wider text-white mb-2">ACCESS PROFILE</h1>
          <p className="font-sans text-xs uppercase tracking-widest text-secondary">Fuel The Machine</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mb-6 bg-red-500/10 border border-red-500/30 text-red-400 font-sans text-sm px-4 py-3 text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary text-left">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[#050507] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary text-left flex justify-between">
              <span>Password</span>
              <span className="text-primary hover:text-white cursor-pointer transition-colors">Forgot?</span>
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[#050507] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest py-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.2)] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="relative z-10 mt-8 text-center border-t border-muted/20 pt-6">
          <p className="font-sans text-sm text-secondary">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-bold hover:text-white transition-colors">
              CREATE ONE
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
