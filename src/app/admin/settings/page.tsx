'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { API_BASE_URL } from '@/lib/api';
import { motion } from 'framer-motion';

export default function AdminSettingsPage() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    storeName: '',
    contactEmail: '',
    currency: '',
    heroHeadline: '',
    heroSubHeadline: '',
    heroImage: '',
    razorpayKeyId: '',
    cloudinaryApiSecret: '',
  });

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/settings/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            storeName: data.storeName || '',
            contactEmail: data.contactEmail || '',
            currency: data.currency || '',
            heroHeadline: data.heroHeadline || '',
            heroSubHeadline: data.heroSubHeadline || '',
            heroImage: data.heroImage || '',
            razorpayKeyId: data.razorpayKeyId || '',
            cloudinaryApiSecret: data.cloudinaryApiSecret || '',
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== 'superadmin') {
      alert('Only Superadmins can update global settings.');
      return;
    }
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update settings');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
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
          <h1 className="font-bebas text-4xl tracking-wider text-white mb-2">Platform Settings</h1>
          <p className="font-sans text-sm text-secondary uppercase tracking-widest">Global Configurations & CMS</p>
        </div>
        <button
          onClick={submitHandler}
          disabled={saving || user?.role !== 'superadmin'}
          className="bg-primary text-[#050507] px-6 py-2 font-sans font-bold uppercase text-sm hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.3)] disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          Settings updated successfully!
        </motion.div>
      )}

      {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-[#050507] border border-muted/20 p-6 flex flex-col gap-6">
          <h2 className="font-bebas text-2xl tracking-wide text-white border-b border-muted/20 pb-2">Store Configuration</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary">Store Name</label>
              <input
                type="text"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
                className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* CMS / Hero Management */}
        <div className="bg-[#050507] border border-muted/20 p-6 flex flex-col gap-6">
          <h2 className="font-bebas text-2xl tracking-wide text-white border-b border-muted/20 pb-2">CMS / Hero Banner</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary">Hero Headline</label>
              <input
                type="text"
                name="heroHeadline"
                value={formData.heroHeadline}
                onChange={handleChange}
                className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary">Hero Sub-headline</label>
              <textarea
                name="heroSubHeadline"
                value={formData.heroSubHeadline}
                onChange={handleChange}
                className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors h-24 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-[#050507] border border-muted/20 p-6 flex flex-col gap-6 lg:col-span-2">
          <h2 className="font-bebas text-2xl tracking-wide text-white border-b border-muted/20 pb-2">API Keys & Integrations</h2>
          <p className="text-xs text-yellow-500 font-sans uppercase tracking-widest">Caution: These fields are only editable by Superadmins</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary">Razorpay Key ID</label>
              <input
                type="password"
                name="razorpayKeyId"
                value={formData.razorpayKeyId}
                onChange={handleChange}
                className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-sans text-xs font-bold uppercase tracking-widest text-secondary">Cloudinary API Secret</label>
              <input
                type="password"
                name="cloudinaryApiSecret"
                value={formData.cloudinaryApiSecret}
                onChange={handleChange}
                className="w-full bg-[#0a0a0e] border border-muted/30 px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
