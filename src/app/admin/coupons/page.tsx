'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { API_BASE_URL } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

type Coupon = {
  _id: string;
  code: string;
  discountPercentage: number;
  expiryDate: string;
  isActive: boolean;
};

export default function AdminCouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 0,
    expiryDate: '',
    isActive: true,
  });

  useEffect(() => {
    if (token) {
      fetchCoupons();
    }
  }, [token]);

  const fetchCoupons = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch coupons');
      const data = await res.json();
      setCoupons(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Delete failed');
        setCoupons(coupons.filter((c) => c._id !== id));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to create coupon');
      const newCoupon = await res.json();
      setCoupons([...coupons, newCoupon]);
      setShowModal(false);
      setFormData({ code: '', discountPercentage: 0, expiryDate: '', isActive: true });
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end border-b border-muted/20 pb-4">
        <div>
          <h1 className="font-bebas text-4xl tracking-wider text-white mb-2">Coupons</h1>
          <p className="font-sans text-sm text-secondary uppercase tracking-widest">Discount Management</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-[#050507] px-6 py-2 font-sans font-bold uppercase text-sm hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.3)]"
        >
          + Create Coupon
        </button>
      </div>

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500">{error}</div>}

      <div className="bg-[#050507] border border-muted/20 overflow-x-auto p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="font-sans text-xs uppercase tracking-widest text-secondary border-b border-muted/20">
              <th className="pb-4 pr-4">Code</th>
              <th className="pb-4 px-4 text-center">Discount (%)</th>
              <th className="pb-4 px-4 text-center">Status</th>
              <th className="pb-4 px-4 text-right">Expiry Date</th>
              <th className="pb-4 pl-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-sans text-sm text-white">
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-b border-muted/10 last:border-0 hover:bg-muted/5 transition-colors">
                <td className="py-4 pr-4 font-bold text-primary tracking-widest">{coupon.code}</td>
                <td className="py-4 px-4 text-center">{coupon.discountPercentage}%</td>
                <td className="py-4 px-4 text-center">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${coupon.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-500 bg-red-500/10'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-4 text-right text-secondary">
                  {new Date(coupon.expiryDate).toLocaleDateString()}
                </td>
                <td className="py-4 pl-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => deleteHandler(coupon._id)}
                    className="text-red-500 hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-[#050507] border border-muted/20 p-8 w-full max-w-md shadow-2xl"
            >
              <h2 className="font-bebas text-2xl tracking-wider text-white mb-6">Create New Coupon</h2>
              <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="bg-[#0a0a0e] border border-muted/30 px-4 py-2 text-white font-sans text-sm focus:border-primary outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold">Discount (%)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                    className="bg-[#0a0a0e] border border-muted/30 px-4 py-2 text-white font-sans text-sm focus:border-primary outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="bg-[#0a0a0e] border border-muted/30 px-4 py-2 text-white font-sans text-sm focus:border-primary outline-none"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-[#050507] py-3 font-sans font-bold uppercase tracking-widest hover:bg-white transition-all"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-muted/30 text-white py-3 font-sans font-bold uppercase tracking-widest hover:bg-muted/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
