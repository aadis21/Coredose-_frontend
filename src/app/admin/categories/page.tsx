'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { API_BASE_URL } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Delete category?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Delete failed');
        setCategories(categories.filter((c) => c._id !== id));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editId ? `${API_BASE_URL}/categories/${editId}` : `${API_BASE_URL}/categories`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Save failed');
      }
      fetchCategories();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', slug: '', description: '', image: '' });
    setEditId(null);
  };

  const openEditModal = (cat: Category) => {
    setFormData({ name: cat.name, slug: cat.slug, description: cat.description, image: cat.image });
    setEditId(cat._id);
    setShowModal(true);
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
          <h1 className="font-bebas text-4xl tracking-wider text-white mb-2">Categories</h1>
          <p className="font-sans text-sm text-secondary uppercase tracking-widest">Catalog Structure</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-primary text-[#050507] px-6 py-2 font-sans font-bold uppercase text-sm hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.3)]"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.div
              key={cat._id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-[#050507] border border-muted/20 p-6 flex flex-col gap-4 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="flex justify-between items-start z-10">
                <h3 className="font-bebas text-2xl tracking-wide text-white">{cat.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(cat)} className="text-secondary hover:text-primary text-[10px] uppercase font-bold tracking-widest transition-colors">Edit</button>
                  <button onClick={() => deleteHandler(cat._id)} className="text-secondary hover:text-red-500 text-[10px] uppercase font-bold tracking-widest transition-colors">Delete</button>
                </div>
              </div>
              <p className="text-xs text-secondary font-sans font-light line-clamp-2 z-10">{cat.description || 'No description provided.'}</p>
              <div className="text-[10px] text-primary uppercase font-bold tracking-[0.2em] z-10">Slug: {cat.slug}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#050507] border border-muted/20 p-8 w-full max-w-md shadow-2xl">
              <h2 className="font-bebas text-2xl tracking-wider text-white mb-6">{editId ? 'Edit Category' : 'Add New Category'}</h2>
              <form onSubmit={submitHandler} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold">Category Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[#0a0a0e] border border-muted/30 px-4 py-2 text-white font-sans text-sm focus:border-primary outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold">Slug</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="bg-[#0a0a0e] border border-muted/30 px-4 py-2 text-white font-sans text-sm focus:border-primary outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[10px] uppercase tracking-widest text-secondary font-bold">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0a0a0e] border border-muted/30 px-4 py-2 text-white font-sans text-sm focus:border-primary outline-none h-24 resize-none"
                  />
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="submit" className="flex-1 bg-primary text-[#050507] py-3 font-sans font-bold uppercase tracking-widest hover:bg-white transition-all">Save</button>
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-muted/30 text-white py-3 font-sans font-bold uppercase tracking-widest hover:bg-muted/10 transition-all">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
