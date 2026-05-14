'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';
import { getAdminOrders, updateOrderStatus } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

type Order = {
  _id: string;
  user: { firstName: string; lastName: string; email: string };
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paymentMethod: string;
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const data = await getAdminOrders(token!);
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deliverHandler = async (id: string) => {
    try {
      await updateOrderStatus(token!, id, 'deliver');
      setOrders(orders.map(o => o._id === id ? { ...o, isDelivered: true } : o));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredOrders = orders.filter((o) =>
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.user?.firstName + ' ' + o.user?.lastName).toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="font-bebas text-4xl tracking-wider text-white mb-2">Orders</h1>
          <p className="font-sans text-sm text-secondary uppercase tracking-widest">Fulfillment Management</p>
        </div>
      </div>

      <div className="bg-[#050507] border border-muted/20 flex flex-col gap-6">
        <div className="p-4 border-b border-muted/20 flex gap-4">
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
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
                <th className="pb-4 pr-4">Order ID</th>
                <th className="pb-4 px-4">Customer</th>
                <th className="pb-4 px-4">Date</th>
                <th className="pb-4 px-4 text-right">Total</th>
                <th className="pb-4 px-4 text-center">Paid</th>
                <th className="pb-4 pl-4 text-center">Delivered</th>
                <th className="pb-4 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-white">
              <AnimatePresence>
                {filteredOrders.map((order) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-muted/10 last:border-0 hover:bg-muted/5 transition-colors"
                  >
                    <td className="py-4 pr-4 text-primary font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold">{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}</span>
                        <span className="text-[10px] text-secondary lowercase">{order.user?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-secondary">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-primary">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${order.isPaid ? 'bg-green-400/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                        {order.isPaid ? 'Paid' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${order.isDelivered ? 'bg-green-400/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                        {order.isDelivered ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right">
                      {!order.isDelivered && order.isPaid && (
                        <button
                          onClick={() => deliverHandler(order._id)}
                          className="bg-primary/10 text-primary px-3 py-1 rounded text-[10px] uppercase tracking-widest font-bold hover:bg-primary/20 transition-colors"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-secondary font-sans text-sm">
                    No orders found.
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
