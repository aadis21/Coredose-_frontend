'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { API_BASE_URL, ProductDTO } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type ProductFormProps = {
  productId?: string;
};

export default function ProductForm({ productId }: ProductFormProps) {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    image: '',
    brand: '',
    category: '',
    stock: 0,
    isFeatured: false,
    ingredients: '',
  });

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Failed to fetch categories:', err));

    if (productId && token) {
      setLoading(true);
      fetch(`${API_BASE_URL}/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name,
            price: data.price,
            description: data.description,
            image: data.image || '',
            brand: data.brand || '',
            category: data.category?._id || data.category || '',
            stock: data.stock || 0,
            isFeatured: data.isFeatured || false,
            ingredients: data.ingredients ? data.ingredients.join(', ') : '',
          });
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [productId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileFormData = new FormData();
    fileFormData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fileFormData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      ingredients: formData.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      const url = productId ? `${API_BASE_URL}/products/${productId}` : `${API_BASE_URL}/products`;
      const method = productId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && productId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#050507] border border-muted/20 p-8 max-w-4xl mx-auto shadow-2xl"
    >
      <h2 className="font-bebas text-3xl tracking-wider text-white mb-8">
        {productId ? 'Edit Product' : 'Create New Product'}
      </h2>

      {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{error}</div>}

      <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 text-white font-sans text-sm focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Price (INR)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 text-white font-sans text-sm focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 text-white font-sans text-sm focus:border-primary outline-none transition-colors resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="flex-1 bg-[#0a0a0e] border border-muted/30 px-4 py-3 text-white font-sans text-sm focus:border-primary outline-none transition-colors"
            />
            <label className="cursor-pointer bg-muted/20 hover:bg-muted/30 text-white px-4 py-3 text-xs uppercase tracking-widest font-bold transition-colors flex items-center">
              {uploading ? '...' : 'Upload'}
              <input type="file" className="hidden" onChange={uploadFileHandler} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 text-white font-sans text-sm focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Stock Quantity</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 text-white font-sans text-sm focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Featured</label>
          <div className="flex items-center h-full">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-5 h-5 bg-[#0a0a0e] border border-muted/30 rounded focus:ring-primary text-primary"
            />
            <span className="ml-3 font-sans text-sm text-secondary">Display on homepage</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 text-white font-sans text-sm focus:border-primary outline-none transition-colors"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-sans text-xs uppercase tracking-widest text-secondary font-bold">Ingredients (Comma separated)</label>
          <input
            type="text"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="Creatine, Caffeine, Beta-Alanine..."
            className="bg-[#0a0a0e] border border-muted/30 px-4 py-3 text-white font-sans text-sm focus:border-primary outline-none transition-colors"
          />
        </div>

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 bg-primary text-[#050507] py-4 font-sans font-bold uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(26,143,255,0.4)] disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-muted/30 text-white py-4 font-sans font-bold uppercase tracking-widest hover:bg-muted/10 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
