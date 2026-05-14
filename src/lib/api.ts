// Centralized API utility for frontend to connect to backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export type ProductDTO = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string[];
  price: number;
  stock: number;
  images?: string[];
  image?: string;
  ratings?: number;
  numReviews?: number;
};

export const fetchProducts = async (): Promise<ProductDTO[]> => {
  const res = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductById = async (id: string): Promise<ProductDTO> => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export const fetchProductBySlug = async (slug: string): Promise<ProductDTO> => {
  const res = await fetch(`${API_BASE_URL}/products/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type OrderData = Record<string, unknown>;

export const loginUser = async (credentials: LoginCredentials) => {
  const res = await fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
};

export const registerUser = async (data: RegisterData) => {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  return res.json();
};

export const createRazorpayOrder = async (token: string, amount: number) => {
  const res = await fetch(`${API_BASE_URL}/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error('Payment initialization failed');
  return res.json();
};

export const createOrder = async (token: string, orderData: OrderData) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Order creation failed');
  return res.json();
};

export const getMyOrders = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/orders/myorders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const verifyRazorpayPayment = async (
  token: string,
  payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
) => {
  const res = await fetch(`${API_BASE_URL}/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Payment verification failed');
  return res.json();
};

export const getAdminStats = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
};

export const getAdminUsers = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const getAdminOrders = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const updateOrderStatus = async (token: string, orderId: string, status: string) => {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/${status}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to update order to ${status}`);
  return res.json();
};

export const deleteAdminUser = async (token: string, userId: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete user');
  return res.json();
};

export const updateAdminUserRole = async (token: string, userId: string, role: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to update user role');
  return res.json();
};


