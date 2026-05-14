'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { API_BASE_URL, ProductDTO } from '@/lib/api';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete product');
        setProducts(products.filter((p) => p._id !== id));
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="font-bebas text-4xl tracking-wider text-white mb-2">Products</h1>
          <p className="font-sans text-sm text-secondary uppercase tracking-widest">Inventory Management</p>
        </div>
        <Link href="/admin/products/new">
          <button className="bg-primary text-[#050507] px-6 py-2 font-sans font-bold uppercase text-sm hover:bg-white transition-all shadow-[0_0_15px_rgba(26,143,255,0.3)]">
            + Add Product
          </button>
        </Link>
      </div>

      <div className="bg-[#050507] border border-muted/20 flex flex-col gap-6">
        <div className="p-4 border-b border-muted/20 flex gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-[#0a0a0e] border border-muted/30 px-4 py-2 font-sans text-sm text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        
        {error && <div className="px-6 py-4 text-red-500 bg-red-500/10 border-b border-red-500/20">{error}</div>}

        <div className="w-full overflow-x-auto p-6 pt-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="font-sans text-xs uppercase tracking-widest text-secondary border-b border-muted/20">
                <th className="pb-4 pr-4">ID</th>
                <th className="pb-4 px-4">Name</th>
                <th className="pb-4 px-4 text-right">Price</th>
                <th className="pb-4 px-4 text-right">Stock</th>
                <th className="pb-4 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-white">
              <AnimatePresence>
                {filteredProducts.map((prod) => (
                  <motion.tr
                    key={prod._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-muted/10 last:border-0 hover:bg-muted/5 transition-colors"
                  >
                    <td className="py-4 pr-4 text-secondary font-mono text-xs">#{prod._id.slice(-6).toUpperCase()}</td>
                    <td className="py-4 px-4 font-bold">{prod.name}</td>
                    <td className="py-4 px-4 text-right">₹{prod.price.toFixed(2)}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-2 py-1 rounded text-xs ${prod.stock < 10 ? 'bg-red-500/10 text-red-500 font-bold' : 'text-secondary'}`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right flex justify-end gap-4">
                      <Link href={`/admin/products/${prod._id}/edit`} className="text-primary hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteHandler(prod._id)}
                        className="text-red-500 hover:text-red-400 transition-colors text-xs uppercase tracking-widest font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-secondary font-sans text-sm">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
