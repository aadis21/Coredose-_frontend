// API functions for wishlist operations
import { API_BASE_URL, ProductDTO } from './api';

export type WishlistItem = ProductDTO;

export type WishlistResponse = WishlistItem[];

export const fetchWishlist = async (token: string): Promise<WishlistResponse> => {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch wishlist');
  return res.json();
};

export const addToWishlist = async (token: string, productId: string): Promise<string[]> => {
  const res = await fetch(`${API_BASE_URL}/wishlist/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ productId }),
  });
  if (!res.ok) throw new Error('Failed to add to wishlist');
  const data = await res.json();
  return data.wishlist;
};

export const removeFromWishlist = async (token: string, productId: string): Promise<string[]> => {
  const res = await fetch(`${API_BASE_URL}/wishlist/item/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove from wishlist');
  const data = await res.json();
  return data.wishlist;
};

export const checkWishlist = async (token: string, productId: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/wishlist/check/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to check wishlist');
  const data = await res.json();
  return data.inWishlist;
};

export const clearWishlist = async (token: string): Promise<string[]> => {
  const res = await fetch(`${API_BASE_URL}/wishlist`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to clear wishlist');
  const data = await res.json();
  return data.wishlist;
};
