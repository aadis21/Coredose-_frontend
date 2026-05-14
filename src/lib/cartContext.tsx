'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart } from '@/lib/cartApi';

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  addItem: (productId: string, qty: number) => Promise<void>;
  updateItem: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  syncCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Sync cart when token changes
  useEffect(() => {
    if (token) {
      syncCart();
    }
  }, [token]);

  const syncCart = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const data = await fetchCart(token);
      setItems(data.cartItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync cart');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (productId: string, qty: number) => {
    if (!token) {
      setError('Please login to add items to cart');
      return;
    }

    try {
      setLoading(true);
      const data = await addToCart(token, productId, qty);
      setItems(data.cartItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (productId: string, qty: number) => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await updateCartItem(token, productId, qty);
      setItems(data.cartItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      const data = await removeFromCart(token, productId);
      setItems(data.cartItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = async () => {
    if (!token) return;

    try {
      setLoading(true);
      await clearCart(token);
      setItems([]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ items, loading, error, addItem, updateItem, removeItem, clearAll, syncCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
