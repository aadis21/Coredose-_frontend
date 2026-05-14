// API functions for cart operations
import { API_BASE_URL } from './api';

export type CartItem = {
  product: string;
  name: string;
  qty: number;
  price: number;
  image?: string;
  _id?: string;
};

export type CartResponse = {
  _id: string;
  user: string;
  cartItems: CartItem[];
  createdAt: string;
  updatedAt: string;
};

export const fetchCart = async (token: string): Promise<CartResponse> => {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
};

export const addToCart = async (token: string, productId: string, qty: number = 1): Promise<CartResponse> => {
  const res = await fetch(`${API_BASE_URL}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId, qty }),
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  return res.json();
};

export const updateCartItem = async (token: string, productId: string, qty: number): Promise<CartResponse> => {
  const res = await fetch(`${API_BASE_URL}/cart/item/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ qty }),
  });
  if (!res.ok) throw new Error('Failed to update cart');
  return res.json();
};

export const removeFromCart = async (token: string, productId: string): Promise<CartResponse> => {
  const res = await fetch(`${API_BASE_URL}/cart/item/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove from cart');
  return res.json();
};

export const clearCart = async (token: string): Promise<CartResponse> => {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to clear cart');
  return res.json();
};
