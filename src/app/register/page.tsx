'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (form.password !== form.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      });
      router.push('/profile');
    } catch {
      // error set in context
    }
  };

  const displayError = localError || error;

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#0a0a0e] border border-muted/20 p-10 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          <h1 className="text-4xl font-bebas tracking-wider text-white mb-2">CREATE ACCOUNT</h1>
          <p className="font-sans text-xs uppercase tracking-widest text-secondary">Join The Elite</p>
        </div>

        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mb-6 bg-red-500/10 border border-red-500/30 text-red-400 font-sans text-sm px-4 py-3 text-center"
          >
            {displayError}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary text-left">First Name</label>
              <input
                id="register-firstName"
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full bg-[#050507] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary text-left">Last Name</label>
              <input
                id="register-lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                required
                className="w-full bg-[#050507] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary text-left">Email Address</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full bg-[#050507] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary text-left">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full bg-[#050507] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary text-left">Confirm Password</label>
            <input
              id="register-confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full bg-[#050507] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            id="register-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest py-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.2)] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="relative z-10 mt-8 text-center border-t border-muted/20 pt-6">
          <p className="font-sans text-sm text-secondary">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:text-white transition-colors">
              SIGN IN
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
