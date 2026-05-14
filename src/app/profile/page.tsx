'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { getMyOrders } from '@/lib/api';

type Order = {
  _id: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  orderItems: { name: string; qty: number; price: number }[];
};

const STATUS_COLOR: Record<string, string> = {
  paid: 'text-green-400 bg-green-400/10',
  unpaid: 'text-yellow-400 bg-yellow-400/10',
  delivered: 'text-primary bg-primary/10',
};

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'notifications'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      // wait for hydration before redirecting
      const timeout = setTimeout(() => router.push('/login'), 300);
      return () => clearTimeout(timeout);
    }
  }, [user, router]);

  // Fetch real orders
  useEffect(() => {
    if (token && activeTab === 'orders') {
      setOrdersLoading(true);
      getMyOrders(token)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setOrdersLoading(false));
    }
  }, [token, activeTab]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background py-16 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

        {/* Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-[#0a0a0e] border border-muted/20 p-6 flex flex-col gap-4 sticky top-32">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-2 pb-4 border-b border-muted/20">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bebas text-xl text-[#050507]">
                {user.firstName.charAt(0)}
              </div>
              <div>
                <h2 className="font-bebas text-xl tracking-wide text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="font-sans text-xs uppercase tracking-widest text-secondary truncate max-w-[140px]">
                  {user.email}
                </p>
              </div>
            </div>

            <nav className="flex flex-col gap-1 font-sans text-sm uppercase tracking-widest">
              {(['orders', 'wishlist', 'notifications'] as const).map((tab) => (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3 text-left transition-all rounded-sm ${
                    activeTab === tab
                      ? 'text-primary bg-primary/10 border-l-2 border-primary'
                      : 'text-secondary hover:text-white hover:bg-muted/5'
                  }`}
                >
                  {tab === 'orders' ? 'Order History' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <Link
                  href="/admin"
                  className="py-3 px-3 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/5 transition-all rounded-sm"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="py-3 px-3 text-left text-red-500 hover:text-red-400 mt-4 transition-colors"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {/* ── ORDERS ── */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bebas tracking-wider mb-8 text-white border-b border-muted/20 pb-4">
                  ORDER HISTORY
                </h1>

                {ordersLoading ? (
                  <div className="flex items-center gap-3 py-12">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="font-sans text-sm text-secondary uppercase tracking-widest">Loading orders...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center py-16 text-center">
                    <p className="font-bebas text-2xl text-white mb-2">No orders yet</p>
                    <p className="font-sans text-sm text-secondary mb-6">Your order history will appear here.</p>
                    <Link href="/shop">
                      <button className="bg-primary text-[#050507] font-sans font-bold uppercase tracking-widest px-8 py-3 hover:bg-white transition-all">
                        Start Shopping
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {orders.map((order) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#0a0a0e] border border-muted/20 p-6 flex flex-col md:flex-row gap-4 justify-between hover:border-primary/40 transition-colors"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-sans font-bold text-white">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold ${order.isPaid ? STATUS_COLOR.paid : STATUS_COLOR.unpaid}`}>
                              {order.isPaid ? 'Paid' : 'Pending'}
                            </span>
                            {order.isDelivered && (
                              <span className={`px-3 py-1 rounded-full text-xs uppercase tracking-widest font-bold ${STATUS_COLOR.delivered}`}>
                                Delivered
                              </span>
                            )}
                          </div>
                          <span className="font-sans text-sm text-secondary">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {order.orderItems.slice(0, 3).map((item, idx) => (
                              <span key={idx} className="font-sans text-xs text-secondary bg-muted/10 px-2 py-0.5">
                                {item.name} ×{item.qty}
                              </span>
                            ))}
                            {order.orderItems.length > 3 && (
                              <span className="font-sans text-xs text-secondary bg-muted/10 px-2 py-0.5">
                                +{order.orderItems.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end justify-between gap-3">
                          <span className="font-bebas text-2xl text-white">₹{order.totalPrice.toFixed(2)}</span>
                          <div className="flex gap-4">
                            <button className="font-sans text-xs uppercase tracking-widest font-bold text-secondary hover:text-white transition-colors">
                              View Details
                            </button>
                            <button className="font-sans text-xs uppercase tracking-widest font-bold text-primary hover:text-white transition-colors">
                              Track Package
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── WISHLIST ── */}
            {activeTab === 'wishlist' && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bebas tracking-wider mb-8 text-white border-b border-muted/20 pb-4">
                  YOUR WISHLIST
                </h1>
                <div className="flex flex-col items-center py-16 text-center">
                  <p className="font-bebas text-2xl text-white mb-2">Wishlist is empty</p>
                  <p className="font-sans text-sm text-secondary mb-6">
                    Save products to your wishlist while browsing the store.
                  </p>
                  <Link href="/shop">
                    <button className="border border-muted/30 text-secondary font-sans font-bold uppercase tracking-widest px-8 py-3 hover:border-primary hover:text-primary transition-all">
                      Browse Products
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-4xl font-bebas tracking-wider mb-8 text-white border-b border-muted/20 pb-4">
                  NOTIFICATIONS
                </h1>
                <div className="flex flex-col gap-4">
                  <div className="bg-[#0a0a0e] border-l-4 border-primary p-6 hover:bg-[#050507] transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-sans font-bold text-white uppercase tracking-widest text-sm">Welcome to CoreDose!</h3>
                      <span className="font-sans text-xs text-secondary">Just now</span>
                    </div>
                    <p className="font-sans text-secondary text-sm">
                      Welcome to the elite tier. Use code <span className="text-primary font-bold">WELCOME10</span> for 10% off your first order.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
